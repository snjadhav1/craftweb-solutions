// ============================================================
// CraftWeb Solutions — Vercel Serverless Function
// POST /api/contact  →  sends email + saves to Supabase
// ============================================================

const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

// ── Helpers ───────────────────────────────────────────────────────────────
function clean(v) { return typeof v === 'string' ? v.trim() : ''; }

function esc(v) {
    return String(v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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

// ── Handler ───────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
    // CORS headers
    const origin = req.headers.origin || '';
    const allowed = process.env.ALLOWED_ORIGIN || '';
    const localOrigins = [
        'http://localhost:5500','http://127.0.0.1:5500',
        'http://localhost:5501','http://127.0.0.1:5501'
    ];
    const isAllowed = !origin
        || origin === allowed
        || localOrigins.includes(origin)
        || origin.endsWith('.vercel.app')
        || origin === 'https://craftwebsolutions.co.in';

    if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed.' });
    }

    try {
        const { name, email, service, message, website } = req.body || {};

        // Honeypot
        if (website) return res.status(400).json({ success: false, error: 'Invalid request.' });

        const safeName    = clean(name);
        const safeEmail   = clean(email).toLowerCase();
        const safeService = clean(service);
        const safeMessage = clean(message);

        // Validate
        if (!safeName || !safeEmail || !safeService || !safeMessage) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }
        if (safeName.length > 120 || safeService.length > 120 || safeMessage.length > 4000) {
            return res.status(400).json({ success: false, error: 'Input is too long.' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(safeEmail)) {
            return res.status(400).json({ success: false, error: 'Invalid email address.' });
        }

        // IST timestamp
        const now    = new Date();
        const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
        const istDisplay = istTime.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'
        });

        const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || 'infocraftwebsolutions@gmail.com';
        const FROM_ADDR        = `"CraftWeb Solutions" <${process.env.SMTP_USER}>`;
        const firstName        = esc(safeName.split(' ')[0]);

        // ── Send Emails ───────────────────────────────────────────────────
        const transporter = createMailer();
        if (!transporter) {
            return res.status(500).json({ success: false, error: 'Email service not configured.' });
        }

        // 1️⃣ Admin notification
        await transporter.sendMail({
            from: FROM_ADDR,
            to: CONTACT_RECEIVER,
            replyTo: safeEmail,
            subject: `✉️ New Enquiry — ${safeService} | CraftWeb`,
            text: `New enquiry from craftwebsolutions.co.in\nName: ${safeName}\nEmail: ${safeEmail}\nService: ${safeService}\nTime: ${istDisplay} IST\n\nMessage:\n${safeMessage}`,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;"><tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;max-width:620px;">
  <tr><td style="background:#1C1410;padding:20px 28px;">
    <p style="margin:0;font-size:12px;color:#E8A87C;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">CraftWeb Solutions</p>
    <h1 style="margin:6px 0 0;font-size:22px;color:#fff;font-weight:800;">New Contact Form Submission</h1>
  </td></tr>
  <tr><td style="padding:24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <tr><td style="width:130px;padding:11px 16px;background:#f8f9fa;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;color:#374151;">Name</td>
          <td style="padding:11px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1f2937;">${esc(safeName)}</td></tr>
      <tr><td style="padding:11px 16px;background:#f8f9fa;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;color:#374151;">Email</td>
          <td style="padding:11px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;">
            <a href="mailto:${esc(safeEmail)}" style="color:#B85C38;text-decoration:none;font-weight:600;">${esc(safeEmail)}</a></td></tr>
      <tr><td style="padding:11px 16px;background:#f8f9fa;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;color:#374151;">Service</td>
          <td style="padding:11px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1f2937;">${esc(safeService)}</td></tr>
      <tr><td style="padding:11px 16px;background:#f8f9fa;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;color:#374151;">Time</td>
          <td style="padding:11px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1f2937;">${esc(istDisplay)} (IST)</td></tr>
      <tr><td style="padding:11px 16px;background:#f8f9fa;font-weight:700;font-size:13px;color:#374151;vertical-align:top;">Message</td>
          <td style="padding:11px 16px;font-size:14px;color:#1f2937;white-space:pre-wrap;line-height:1.6;">${esc(safeMessage)}</td></tr>
    </table>
    <div style="margin-top:20px;text-align:center;">
      <a href="mailto:${esc(safeEmail)}?subject=Re: Your enquiry about ${esc(safeService)}"
         style="display:inline-block;padding:12px 28px;background:#B85C38;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
        Reply to ${firstName} ↗
      </a>
    </div>
  </td></tr>
  <tr><td style="padding:14px 28px;background:#f8f9fa;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#9ca3af;">
    Auto-generated · <a href="https://craftwebsolutions.co.in" style="color:#B85C38;text-decoration:none;">craftwebsolutions.co.in</a>
  </td></tr>
</table></td></tr></table></body></html>`
        });

        // 2️⃣ Client auto-reply
        await transporter.sendMail({
            from: FROM_ADDR,
            to: safeEmail,
            subject: `Thank you for contacting CraftWeb Solutions, ${safeName.split(' ')[0]}! 🙏`,
            text: `Hi ${safeName},\n\nThank you for reaching out to CraftWeb Solutions!\n\nService: ${safeService}\nSubmitted: ${istDisplay} IST\n\nWe typically respond within 24 hours (Mon–Sat, 9 AM – 8 PM IST).\n\nYour message:\n${safeMessage}\n\nWarm regards,\nCraftWeb Solutions Team\ncraftwebsolutions.co.in`,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;">
  <tr><td style="background:#1C1410;padding:24px 28px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#E8A87C;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">CraftWeb Solutions</p>
    <h1 style="margin:8px 0 0;font-size:24px;color:#fff;font-weight:800;">Thank You, ${firstName}! 🙏</h1>
    <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.7);">We've received your message and will be in touch soon.</p>
  </td></tr>
  <tr><td style="padding:28px;">
    <p style="margin:0 0 16px;font-size:15px;color:#1f2937;line-height:1.6;">Hi <strong>${firstName}</strong>,</p>
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7;">
      Thank you for contacting <strong>CraftWeb Solutions</strong>! We've received your enquiry
      regarding <strong>${esc(safeService)}</strong> and our team will review it shortly.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F5;border:1px solid #F0D5C8;border-radius:8px;margin:20px 0;overflow:hidden;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#B85C38;text-transform:uppercase;letter-spacing:.08em;">Your Enquiry Summary</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Service:</strong> ${esc(safeService)}</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;"><strong>Submitted:</strong> ${esc(istDisplay)} IST</p>
        <hr style="border:none;border-top:1px solid #F0D5C8;margin:12px 0;"/>
        <p style="margin:0;font-size:13px;color:#374151;font-style:italic;line-height:1.6;">"${esc(safeMessage.length > 200 ? safeMessage.substring(0, 200) + '…' : safeMessage)}"</p>
      </td></tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7;">
      ⏱️ We typically respond within <strong>24 hours</strong> (Monday–Saturday, 9:00 AM – 8:00 PM IST).
    </p>
    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">
      If you have any urgent queries, simply reply to this email.
    </p>
  </td></tr>
  <tr><td style="padding:0 28px 28px;text-align:center;">
    <a href="https://craftwebsolutions.co.in/projects.html"
       style="display:inline-block;padding:12px 28px;background:#B85C38;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
      View Our Projects ↗
    </a>
  </td></tr>
  <tr><td style="padding:20px 28px;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:13px;color:#374151;">Warm regards,</p>
    <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#1C1410;">CraftWeb Solutions Team</p>
    <p style="margin:2px 0 0;font-size:12px;">
      <a href="https://craftwebsolutions.co.in" style="color:#B85C38;text-decoration:none;">craftwebsolutions.co.in</a>
    </p>
  </td></tr>
  <tr><td style="padding:12px 28px;background:#f8f9fa;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#9ca3af;">
    You received this because you submitted an enquiry on craftwebsolutions.co.in
  </td></tr>
</table></td></tr></table></body></html>`
        });

        // ── Save to Supabase (best-effort) ────────────────────────────────
        try {
            const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
            if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey);
                await supabase.from('contact_submissions').insert([{
                    name: safeName, email: safeEmail,
                    service: safeService, message: safeMessage,
                    submitted_at: istTime.toISOString()
                }]);
            }
        } catch (dbErr) {
            console.error('Supabase save failed (non-blocking):', dbErr.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been sent. We will get back to you soon! 🚀'
        });

    } catch (err) {
        console.error('❌ Contact handler error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
    }
};
