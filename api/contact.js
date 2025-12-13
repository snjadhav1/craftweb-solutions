// ==========================================
// CRAFTWEB SOLUTIONS - VERCEL SERVERLESS API
// Contact Form Handler with Supabase
// ==========================================

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.'
        });
    }

    try {
        // Extract form data from request body
        const { name, email, service, message } = req.body;

        // Validate required fields
        if (!name || !email || !service || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required',
                missing: {
                    name: !name,
                    email: !email,
                    service: !service,
                    message: !message
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address'
            });
        }

        // Create timestamp in IST (Indian Standard Time - UTC+5:30)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffset);

        // Insert data into Supabase
        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([
                {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    service: service,
                    message: message.trim(),
                    submitted_at: istTime.toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to save your message. Please try again.',
                details: error.message
            });
        }

        // Success response
        return res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully. We will get back to you soon!',
            data: data[0]
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error. Please try again later.'
        });
    }
};
