// ==========================================
// CRAFTWEB SOLUTIONS - BACKEND SERVER
// Contact Form with Supabase Database
// ==========================================

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Initialize Express app
const app = express();

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================

// Enable CORS (allows frontend to communicate with backend)
app.use(cors({
    origin: '*', // In production, replace with your actual frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Parse JSON request bodies
app.use(express.json());

// ==========================================
// SUPABASE CLIENT INITIALIZATION
// ==========================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');

// ==========================================
// ROUTES
// ==========================================

// Root route - Server status
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 Craftweb Solutions Backend Server is Running!',
        version: '1.0.0',
        endpoints: {
            'POST /api/contact': 'Submit contact form',
            'GET /api/contacts': 'Get all contact submissions (for testing)',
            'GET /api/health': 'Check server health'
        }
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy!',
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// CONTACT FORM SUBMISSION ENDPOINT
// ==========================================

app.post('/api/contact', async (req, res) => {
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

        console.log('📧 New contact form submission:', { name, email, service });

        // Insert data into Supabase 'contact_submissions' table
        // Create timestamp in IST (Indian Standard Time - UTC+5:30)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
        const istTime = new Date(now.getTime() + istOffset);
        
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

        // Handle Supabase errors
        if (error) {
            console.error('❌ Supabase Error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to save your message. Please try again.',
                details: error.message
            });
        }

        // Success response
        console.log('✅ Contact saved successfully:', data);
        res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully. We will get back to you soon!',
            data: data[0]
        });

    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error. Please try again later.'
        });
    }
});

// ==========================================
// GET ALL CONTACTS (FOR TESTING/ADMIN)
// ==========================================

app.get('/api/contacts', async (req, res) => {
    try {
        // Fetch all contact submissions from Supabase
        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('❌ Error fetching contacts:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch contacts',
                details: error.message
            });
        }

        res.json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('');
    console.log('==========================================');
    console.log('🚀 CRAFTWEB SOLUTIONS BACKEND SERVER');
    console.log('==========================================');
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`📝 Submit contact form: POST http://localhost:${PORT}/api/contact`);
    console.log(`📋 View all contacts: GET http://localhost:${PORT}/api/contacts`);
    console.log('==========================================');
    console.log('');
});
