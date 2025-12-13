# 🚀 Craftweb Solutions - Backend Setup Guide

## Step-by-Step Instructions for Beginners

---

## 📋 STEP 1: Setup Supabase Database Table

### 1.1 Open Supabase Dashboard
1. Go to **https://supabase.com** and login
2. Click on your project: **xghstvviuekonacagfej**
3. In the left sidebar, click on **SQL Editor** (looks like a terminal icon)

### 1.2 Create the Database Table
1. In SQL Editor, click **"New query"**
2. Copy and paste this SQL code:

```sql
-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert data (from your website)
CREATE POLICY "Allow anonymous insert" ON contact_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow reading data (for testing)
CREATE POLICY "Allow anonymous select" ON contact_submissions
    FOR SELECT
    TO anon
    USING (true);
```

3. Click the green **"Run"** button (or press Ctrl + Enter)
4. You should see: **"Success. No rows returned"**

### 1.3 Verify Table Created
1. In the left sidebar, click on **Table Editor**
2. You should see **contact_submissions** in the list
3. Click on it - it will be empty for now

---

## 📋 STEP 2: Install Node.js (if not installed)

### 2.1 Check if Node.js is installed
Open Command Prompt (cmd) or PowerShell and type:
```bash
node --version
```
If you see a version number (like v18.x.x), Node.js is installed. Skip to Step 3.

### 2.2 Install Node.js
1. Go to **https://nodejs.org**
2. Download the **LTS version** (recommended)
3. Run the installer and follow the steps
4. Restart your computer
5. Verify installation by running `node --version` in terminal

---

## 📋 STEP 3: Install Backend Dependencies

### 3.1 Open Terminal in VS Code
1. In VS Code, press **Ctrl + `** (backtick) to open terminal
2. Or go to **View > Terminal**

### 3.2 Navigate to backend folder
```bash
cd backend
```

### 3.3 Install packages
```bash
npm install
```

This will install:
- **express** - Web server
- **@supabase/supabase-js** - Supabase database client
- **cors** - Allows frontend to connect
- **dotenv** - Environment variables

Wait for installation to complete (might take 1-2 minutes).

---

## 📋 STEP 4: Start the Backend Server

### 4.1 Run the server
Make sure you're in the `backend` folder, then run:
```bash
npm start
```

### 4.2 You should see:
```
==========================================
🚀 CRAFTWEB SOLUTIONS BACKEND SERVER
==========================================
✅ Server running on: http://localhost:3000
📝 Submit contact form: POST http://localhost:3000/api/contact
📋 View all contacts: GET http://localhost:3000/api/contacts
==========================================
```

**Keep this terminal window open!** The server needs to be running for the form to work.

---

## 📋 STEP 5: Test the Contact Form

### 5.1 Open your website
1. Open `index.html` in a browser (right-click > Open with Live Server, or just double-click)
2. Scroll down to the **Contact** section
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Service: Select any option
   - Message: This is a test message

### 5.2 Submit the form
Click **"Send Message"**

If successful, you'll see a green message:
**"✅ Thank you! Your message has been sent successfully..."**

---

## 📋 STEP 6: View Your Data in Supabase

### 6.1 Check in Supabase Dashboard
1. Go to **https://supabase.com** and login
2. Click on your project
3. Click **Table Editor** in the left sidebar
4. Click on **contact_submissions**
5. You'll see your submitted form data! 🎉

### 6.2 Or check via API
Open this URL in your browser while the server is running:
```
http://localhost:3000/api/contacts
```
This shows all submissions in JSON format.

---

## 🔧 Troubleshooting

### "Could not connect to server" error
- Make sure the backend server is running (`npm start` in backend folder)
- Check if terminal shows any errors

### "Failed to save your message" error
- Make sure you ran the SQL queries in Supabase
- Check if the table `contact_submissions` exists in Table Editor

### CORS errors
- Make sure you're running the frontend from a web server (like Live Server extension)
- Not directly opening the HTML file

### Port 3000 in use
Edit `.env` file and change `PORT=3000` to another port like `PORT=3001`
Then update the `API_URL` in index.html to match.

---

## 📁 Project Structure

```
CRAFTWEB_SOLUTIONS/
├── index.html          ← Main website (contact form)
├── styles.css          ← Website styles
├── script.js           ← Main website scripts
├── backend/            ← BACKEND FOLDER
│   ├── package.json    ← Dependencies list
│   ├── server.js       ← Express server code
│   ├── .env            ← Supabase credentials
│   ├── supabase-setup.sql ← SQL to create table
│   └── README.md       ← This guide
```

---

## 🎯 Quick Commands Reference

| Action | Command |
|--------|---------|
| Go to backend folder | `cd backend` |
| Install packages | `npm install` |
| Start server | `npm start` |
| Start with auto-reload | `npm run dev` |

---

## 📞 Need Help?

If you have any issues:
1. Make sure Node.js is installed
2. Make sure you're in the `backend` folder
3. Make sure Supabase SQL queries were run
4. Check the terminal for error messages

---

**Happy Coding! 🚀**
*Craftweb Solutions*
