// ==========================================
// CRAFTWEB SOLUTIONS - VERCEL SERVERLESS API
// Contact Form Handler with Supabase
// ==========================================

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_ANON_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || 'infocraftwebsolutions@gmail.com';
const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@craftwebsolutions.co.in';

// In-memory rate limiter for Vercel function instances.
const rateStore = new Map();

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded && typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.socket?.remoteAddress || 'unknown';
}

function cleanInput(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function rateLimitByIp(ip, windowMs, max) {
    const now = Date.now();
    const current = rateStore.get(ip);

    if (!current || now > current.resetAt) {
        const next = { count: 1, resetAt: now + windowMs };
        rateStore.set(ip, next);
        return { allowed: true, remaining: Math.max(max - 1, 0), resetAt: next.resetAt };
    }

    if (current.count >= max) {
        return { allowed: false, remaining: 0, resetAt: current.resetAt };
    }

    current.count += 1;
    rateStore.set(ip, current);
    return { allowed: true, remaining: Math.max(max - current.count, 0), resetAt: current.resetAt };
}

function createMailer() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
        return null;
    }

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: process.env.SMTP_SECURE === 'true' || smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
}

function logEvent(level, event, metadata) {
    const logger = level === 'error' ? console.error : console.log;
    logger(`[${event}]`, JSON.stringify(metadata));
}

module.exports = async (req, res) => {
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        logEvent('warn', 'method_not_allowed', { ip, method: req.method, userAgent });
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.'
        });
    }

    try {
        const limit = rateLimitByIp(ip, 15 * 60 * 1000, 10);
        res.setHeader('X-RateLimit-Limit', '10');
        res.setHeader('X-RateLimit-Remaining', String(limit.remaining));
        res.setHeader('X-RateLimit-Reset', String(limit.resetAt));

        if (!limit.allowed) {
            logEvent('warn', 'rate_limited_contact', { ip, userAgent });
            return res.status(429).json({
                success: false,
                error: 'Too many requests. Please try again later.'
            });
        }

        if (!supabase) {
            logEvent('error', 'supabase_not_configured', { ip });
            return res.status(500).json({
                success: false,
                error: 'Server is not configured correctly.'
            });
        }

        // Extract form data from request body
        const { name, email, service, message, website } = req.body || {};

        // Honeypot field for basic bot protection.
        if (website) {
            logEvent('warn', 'bot_honeypot_triggered', { ip, userAgent });
            return res.status(400).json({
                success: false,
                error: 'Invalid request.'
            });
        }

        const safeName = cleanInput(name);
        const safeEmail = cleanInput(email).toLowerCase();
        const safeService = cleanInput(service);
        const safeMessage = cleanInput(message);

        // Validate required fields
        if (!safeName || !safeEmail || !safeService || !safeMessage) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required',
                missing: {
                    name: !safeName,
                    email: !safeEmail,
                    service: !safeService,
                    message: !safeMessage
                }
            });
        }

        if (safeName.length > 120 || safeService.length > 120 || safeMessage.length > 4000) {
            return res.status(400).json({
                success: false,
                error: 'Input is too long'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(safeEmail)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address'
            });
        }

        // Create timestamp in IST (Indian Standard Time - UTC+5:30)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffset);
        const submittedAtDisplay = istTime.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const transporter = createMailer();
        if (!transporter) {
            logEvent('error', 'smtp_not_configured', { ip });
            return res.status(500).json({
                success: false,
                error: 'Email service is not configured. Please contact support.'
            });
        }

        const escapedName = escapeHtml(safeName);
        const escapedEmail = escapeHtml(safeEmail);
        const escapedService = escapeHtml(safeService);
        const escapedMessage = escapeHtml(safeMessage);

        await transporter.sendMail({
            from: MAIL_FROM,
            to: CONTACT_RECEIVER,
            replyTo: safeEmail,
            subject: `New Contact Form Submission - ${safeService}`,
            text: [
                'New enquiry from craftwebsolutions.co.in',
                `Name: ${safeName}`,
                `Email: ${safeEmail}`,
                `Service: ${safeService}`,
                '',
                'Message:',
                safeMessage
            ].join('\n'),
            html: `
                <div style="background:#f6f8fb;padding:24px;font-family:Arial,sans-serif;color:#1f2937;">
                    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                        <div style="background:#0f172a;color:#ffffff;padding:16px 20px;">
                            <h2 style="margin:0;font-size:20px;">New Contact Form Submission</h2>
                            <p style="margin:6px 0 0 0;font-size:13px;opacity:0.9;">craftwebsolutions.co.in</p>
                        </div>
                        <div style="padding:20px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                                <tr>
                                    <td style="width:180px;padding:12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Name</td>
                                    <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${escapedName}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Email</td>
                                    <td style="padding:12px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${escapedEmail}" style="color:#2563eb;text-decoration:none;">${escapedEmail}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding:12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Service</td>
                                    <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${escapedService}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;font-weight:600;">Submitted At</td>
                                    <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(submittedAtDisplay)} (IST)</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px;background:#f9fafb;font-weight:600;vertical-align:top;">Message</td>
                                    <td style="padding:12px;white-space:pre-wrap;">${escapedMessage}</td>
                                </tr>
                            </table>
                            <p style="margin:16px 0 0 0;color:#6b7280;font-size:12px;">This email was generated automatically by the website contact form.</p>
                        </div>
                    </div>
                </div>
            `
        });

        // Insert data into Supabase
        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([
                {
                    name: safeName,
                    email: safeEmail,
                    service: safeService,
                    message: safeMessage,
                    submitted_at: istTime.toISOString()
                }
            ])
            .select();

        if (error) {
            logEvent('error', 'supabase_insert_error', { ip, message: error.message });
            return res.status(500).json({
                success: false,
                error: 'Failed to save your message. Please try again.'
            });
        }

        logEvent('info', 'contact_submission_success', {
            ip,
            email: safeEmail,
            service: safeService,
            userAgent
        });

        // Success response
        return res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully. We will get back to you soon!',
            data: data[0]
        });

    } catch (error) {
        logEvent('error', 'contact_submission_failed', { ip, message: error.message });
        return res.status(500).json({
            success: false,
            error: 'Internal server error. Please try again later.'
        });
    }
};
