// ==========================================
// CRAFTWEB SOLUTIONS - BACKEND SERVER
// Contact Form with Supabase Database
// ==========================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || 'infocraftwebsolutions@gmail.com';
const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@craftwebsolutions.co.in';

const rateStore = new Map();

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded && typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

function cleanInput(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function rateLimitByIp(key, windowMs, max) {
    const now = Date.now();
    const entry = rateStore.get(key);
    if (!entry || now > entry.resetAt) {
        const next = { count: 1, resetAt: now + windowMs };
        rateStore.set(key, next);
        return { allowed: true, remaining: Math.max(max - 1, 0), resetAt: next.resetAt };
    }
    if (entry.count >= max) return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    entry.count += 1;
    rateStore.set(key, entry);
    return { allowed: true, remaining: Math.max(max - entry.count, 0), resetAt: entry.resetAt };
}

function createMailer() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
    const port = Number(SMTP_PORT || 587);
    return nodemailer.createTransport({
        host: SMTP_HOST, port,
        secure: SMTP_SECURE === 'true' || port === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
}

function logEvent(level, event, metadata) {
    const fn = level === 'error' ? console.error : console.log;
    fn(`[${new Date().toISOString()}][${event}]`, JSON.stringify(metadata));
}

// ── Middleware ────────────────────────────────────────────────────────────
const LOCAL_ORIGINS = [
    'http://localhost:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        // Allow configured production origin
        const allowed = process.env.ALLOWED_ORIGIN;
        if (allowed && origin === allowed) return callback(null, true);
        // Allow all local dev origins
        if (LOCAL_ORIGINS.includes(origin)) return callback(null, true);
        // Allow file:// opened pages (origin is null)
        return callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https')
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    return next();
});

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use('/api', (req, res, next) => {
    const ip = getClientIp(req);
    const limit = rateLimitByIp(`api:${ip}`, 15 * 60 * 1000, 120);
    res.setHeader('X-RateLimit-Limit', '120');
    res.setHeader('X-RateLimit-Remaining', String(limit.remaining));
    res.setHeader('X-RateLimit-Reset', String(limit.resetAt));
    if (!limit.allowed) {
        logEvent('warn', 'rate_limited_api', { ip, path: req.path });
        return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
    }
    return next();
});

// ── Supabase ──────────────────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_ANON_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client initialized');

// ── Routes ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 CraftWeb Solutions Backend Server is Running!',
        version: '1.0.0',
        endpoints: {
            'POST /api/contact': 'Submit contact form',
            'GET  /api/contacts': 'Get all submissions (requires x-admin-token)',
            'GET  /api/health':   'Server health check'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is healthy!', timestamp: new Date().toISOString() });
});

// ── POST /api/contact ─────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
    try {
        const ip = getClientIp(req);
        const userAgent = req.headers['user-agent'] || 'unknown';

        // Per-IP contact rate limit: 10 submissions per 15 min
        const contactLimit = rateLimitByIp(`contact:${ip}`, 15 * 60 * 1000, 10);
        if (!contactLimit.allowed) {
            logEvent('warn', 'rate_limited_contact', { ip, userAgent });
            return res.status(429).json({ success: false, error: 'Too many submissions. Please try again later.' });
        }

        const { name, email, service, message, website } = req.body || {};

        // Honeypot — bots fill the hidden "website" field
        if (website) {
            logEvent('warn', 'bot_honeypot', { ip, userAgent });
            return res.status(400).json({ success: false, error: 'Invalid request.' });
        }

        const safeName    = cleanInput(name);
        const safeEmail   = cleanInput(email).toLowerCase();
        const safeService = cleanInput(service);
        const safeMessage = cleanInput(message);

        if (!safeName || !safeEmail || !safeService || !safeMessage) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required.',
                missing: { name: !safeName, email: !safeEmail, service: !safeService, message: !safeMessage }
            });
        }

        if (safeName.length > 120 || safeService.length > 120 || safeMessage.length > 4000) {
            return res.status(400).json({ success: false, error: 'Input is too long.' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
            return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
        }

        logEvent('info', 'contact_started', { ip, email: safeEmail, service: safeService });

        // IST timestamp
        const now = new Date();
        const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
        const submittedAtDisplay = istTime.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'
        });

        // ── Send emails ────────────────────────────────────────────────────
        const transporter = createMailer();
        if (!transporter) {
            logEvent('error', 'smtp_not_configured', { ip });
            return res.status(500).json({ success: false, error: 'Email service not configured.' });
        }

        const en = escapeHtml;
        // Gmail SMTP requires From = the authenticated Gmail address
        const FROM_ADDR = `"CraftWeb Solutions" <${process.env.SMTP_USER}>`;

        // 1️⃣  Admin notification → infocraftwebsolutions@gmail.com
        await transporter.sendMail({
            from: FROM_ADDR,
            to: CONTACT_RECEIVER,
            replyTo: safeEmail,
            subject: `✉️ New Enquiry — ${safeService} | CraftWeb`,
            text: [
                'New enquiry from craftwebsolutions.co.in',
                `Name:    ${safeName}`,
                `Email:   ${safeEmail}`,
                `Service: ${safeService}`,
                `Time:    ${submittedAtDisplay} IST`,
                '',
                'Message:',
                safeMessage
            ].join('\n'),
            html: `
<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;max-width:620px;">
        <tr><td style="background:#1C1410;padding:20px 28px;">
          <p style="margin:0;font-size:12px;color:#E8A87C;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">CraftWeb Solutions</p>
          <h1 style="margin:6px 0 0;font-size:22px;color:#fff;font-weight:800;">New Contact Form Submission</h1>
        </td></tr>
        <tr><td style="padding:24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="width:140px;padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;color:#374151;">Name</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1f2937;">${en(safeName)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;color:#374151;">Email</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;">
                <a href="mailto:${en(safeEmail)}" style="color:#B85C38;text-decoration:none;font-weight:600;">${en(safeEmail)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;color:#374151;">Service</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1f2937;">${en(safeService)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;color:#374151;">Time</td>
              <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1f2937;">${en(submittedAtDisplay)} (IST)</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f8f9fa;font-weight:700;font-size:13px;color:#374151;vertical-align:top;">Message</td>
              <td style="padding:12px 16px;font-size:14px;color:#1f2937;white-space:pre-wrap;line-height:1.6;">${en(safeMessage)}</td>
            </tr>
          </table>
          <div style="margin-top:20px;text-align:center;">
            <a href="mailto:${en(safeEmail)}?subject=Re: Your enquiry about ${en(safeService)}"
               style="display:inline-block;padding:12px 28px;background:#B85C38;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
              Reply to ${en(safeName)} ↗
            </a>
          </div>
        </td></tr>
        <tr><td style="padding:14px 28px;background:#f8f9fa;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#9ca3af;">
          Auto-generated · <a href="https://craftwebsolutions.co.in" style="color:#B85C38;text-decoration:none;">craftwebsolutions.co.in</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
        });

        // 2️⃣  Client auto-reply → person who filled the form
        await transporter.sendMail({
            from: FROM_ADDR,
            to: safeEmail,
            subject: `Thank you for contacting CraftWeb Solutions, ${safeName.split(' ')[0]}! 🙏`,
            text: [
                `Hi ${safeName},`,
                '',
                'Thank you for reaching out to CraftWeb Solutions!',
                'We have received your enquiry and our team will review it shortly.',
                '',
                `Service Requested: ${safeService}`,
                `Submitted: ${submittedAtDisplay} IST`,
                '',
                'We typically respond within 24 hours (Mon–Sat, 9 AM – 8 PM IST).',
                '',
                'Your message:',
                '─────────────────────────────',
                safeMessage,
                '─────────────────────────────',
                '',
                'If you have any urgent queries, feel free to reply to this email.',
                '',
                'Warm regards,',
                'CraftWeb Solutions Team',
                'infocraftwebsolutions@gmail.com',
                'craftwebsolutions.co.in'
            ].join('\n'),
            html: `
<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;">
        <!-- Header -->
        <tr><td style="background:#1C1410;padding:24px 28px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#E8A87C;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">CraftWeb Solutions</p>
          <h1 style="margin:8px 0 0;font-size:24px;color:#fff;font-weight:800;">Thank You, ${en(safeName.split(' ')[0])}! 🙏</h1>
          <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.7);">We've received your message and will be in touch soon.</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:28px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1f2937;line-height:1.6;">
            Hi <strong>${en(safeName.split(' ')[0])}</strong>,
          </p>
          <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7;">
            Thank you for contacting <strong>CraftWeb Solutions</strong>! We've received your enquiry
            regarding <strong>${en(safeService)}</strong> and our team will review it shortly.
          </p>
          <!-- Summary box -->
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="background:#FFF8F5;border:1px solid #F0D5C8;border-radius:8px;margin:20px 0;overflow:hidden;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#B85C38;text-transform:uppercase;letter-spacing:.08em;">Your Enquiry Summary</p>
              <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Service:</strong> ${en(safeService)}</p>
              <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Submitted:</strong> ${en(submittedAtDisplay)} IST</p>
              <hr style="border:none;border-top:1px solid #F0D5C8;margin:12px 0;"/>
              <p style="margin:0;font-size:13px;color:#374151;font-style:italic;line-height:1.6;">"${en(safeMessage.length > 200 ? safeMessage.substring(0,200) + '…' : safeMessage)}"</p>
            </td></tr>
          </table>
          <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7;">
            ⏱️ We typically respond within <strong>24 hours</strong> (Monday–Saturday, 9:00 AM – 8:00 PM IST).
          </p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">
            If you have any urgent queries, simply reply to this email and we'll get back to you.
          </p>
        </td></tr>
        <!-- CTA -->
        <tr><td style="padding:0 28px 28px;text-align:center;">
          <a href="https://craftwebsolutions.co.in/projects.html"
             style="display:inline-block;padding:12px 28px;background:#B85C38;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
            View Our Projects ↗
          </a>
        </td></tr>
        <!-- Sign-off -->
        <tr><td style="padding:20px 28px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:13px;color:#374151;">Warm regards,</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#1C1410;">CraftWeb Solutions Team</p>
          <p style="margin:2px 0 0;font-size:12px;color:#B85C38;">
            <a href="https://craftwebsolutions.co.in" style="color:#B85C38;text-decoration:none;">craftwebsolutions.co.in</a>
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:12px 28px;background:#f8f9fa;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#9ca3af;">
          You received this email because you submitted an enquiry on craftwebsolutions.co.in
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
        });

        // ── Save to Supabase (best-effort, non-blocking) ──────────────────
        supabase
            .from('contact_submissions')
            .insert([{ name: safeName, email: safeEmail, service: safeService, message: safeMessage, submitted_at: istTime.toISOString() }])
            .select()
            .then(({ data, error }) => {
                if (error) logEvent('error', 'supabase_save_failed', { email: safeEmail, error: error.message });
                else logEvent('info', 'supabase_save_ok', { email: safeEmail, id: data?.[0]?.id });
            })
            .catch(err => logEvent('error', 'supabase_exception', { email: safeEmail, error: err.message }));

        logEvent('info', 'contact_success', { ip, email: safeEmail, service: safeService });
        return res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been sent. We will get back to you soon! 🚀'
        });

    } catch (err) {
        console.error('❌ Server Error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error. Please try again later.' });
    }
});

// ── GET /api/contacts (admin) ─────────────────────────────────────────────
app.get('/api/contacts', async (req, res) => {
    try {
        const adminToken = process.env.ADMIN_READ_TOKEN;
        if (!adminToken || req.headers['x-admin-token'] !== adminToken)
            return res.status(403).json({ success: false, error: 'Forbidden' });

        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('❌ Fetch error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch contacts.' });
        }

        return res.json({ success: true, count: data.length, data });
    } catch (err) {
        console.error('❌ Server Error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('==========================================');
    console.log('  🚀 CRAFTWEB SOLUTIONS BACKEND SERVER');
    console.log('==========================================');
    console.log(`  ✅ Running  → http://localhost:${PORT}`);
    console.log(`  📝 Contact  → POST /api/contact`);
    console.log(`  📋 Admin    → GET  /api/contacts`);
    console.log(`  💌 Mail to  → ${CONTACT_RECEIVER}`);
    console.log('==========================================');
    console.log('');
});
