# 🚀 VERCEL DEPLOYMENT GUIDE - Craftweb Solutions

## Complete Step-by-Step Guide for Beginners

---

## 📁 Current Project Structure

```
CRAFTWEB_SOLUTIONS/
├── api/                    ← Serverless API (for Vercel)
│   └── contact.js          ← Contact form handler
├── backend/                ← Local development server
│   ├── server.js
│   ├── package.json
│   └── .env
├── index.html              ← Main homepage
├── about.html              ← About co-founders page
├── projects.html           ← Projects showcase page
├── styles.css              ← Main styles
├── about.css               ← About page styles
├── projects.css            ← Projects page styles
├── script.js               ← Main JavaScript
├── about.js                ← About page scripts
├── projects.js             ← Projects page scripts
├── 1.png, 2.png, 3.jpg     ← Co-founder images
├── logo.png                ← Website logo
├── final_craftweb.mp4      ← Intro video
├── package.json            ← Project dependencies
├── vercel.json             ← Vercel configuration
└── .gitignore              ← Files to ignore
```

---

## 📋 STEP 1: Create GitHub Account (if you don't have one)

1. Go to **https://github.com**
2. Click **"Sign up"**
3. Enter your email, create password, and username
4. Verify your email

---

## 📋 STEP 2: Create a New GitHub Repository

### 2.1 Create Repository
1. Go to **https://github.com**
2. Click the **"+"** icon in top right corner
3. Click **"New repository"**
4. Fill in:
   - **Repository name:** `craftweb-solutions`
   - **Description:** `Craftweb Solutions - Digital Agency Website`
   - **Public** (select this)
   - ❌ Do NOT check "Add a README file"
5. Click **"Create repository"**

### 2.2 You'll see a page with commands - keep this open!

---

## 📋 STEP 3: Upload Your Code to GitHub

### 3.1 Open Terminal in VS Code
Press **Ctrl + `** (backtick) or go to **View > Terminal**

### 3.2 Make sure you're in the correct folder
```bash
cd "c:\Users\Asus\OneDrive\Pictures\craftwebbbb_new_anima-main (3)\craftwebbbb_new_anima-main\CRAFTWEB_SOLUTIONS"
```

### 3.3 Initialize Git and Push to GitHub
Run these commands ONE BY ONE:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit - Craftweb Solutions website"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/YOUR_USERNAME/craftweb-solutions.git
```
⚠️ **Replace `YOUR_USERNAME` with your actual GitHub username!**

```bash
git push -u origin main
```

### 3.4 Enter GitHub credentials if asked
- It may open a browser window to authenticate
- Or ask for username/password in terminal

### 3.5 Verify Upload
1. Go to your GitHub repository
2. Refresh the page
3. You should see all your files there!

---

## 📋 STEP 4: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest option!)
4. Authorize Vercel to access your GitHub

---

## 📋 STEP 5: Deploy to Vercel

### 5.1 Import Your Project
1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"craftweb-solutions"** and click **"Import"**

### 5.2 Configure Project Settings
On the configuration page:

1. **Project Name:** `craftweb-solutions` (or any name you want)
2. **Framework Preset:** Select **"Other"**
3. **Root Directory:** Leave as `.` (dot)

### 5.3 Add Environment Variables ⚠️ IMPORTANT!
Click on **"Environment Variables"** section and add these:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://xghstvviuekonacagfej.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaHN0dnZpdWVrb25hY2FnZmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjQxODMsImV4cCI6MjA4MTIwMDE4M30.DxOUjdspH_bfP9X9CcmwkiNmY28hmTubTTflK7MchFg` |

For each variable:
1. Enter the **Name** (like `SUPABASE_URL`)
2. Enter the **Value** (the URL or key)
3. Click **"Add"**

### 5.4 Deploy!
Click **"Deploy"** button

### 5.5 Wait for Deployment
- Vercel will build your project (takes 1-2 minutes)
- You'll see a progress screen
- When done, you'll see **"Congratulations!"** 🎉

---

## 📋 STEP 6: Access Your Live Website!

After deployment completes:

1. Vercel gives you a URL like: `https://craftweb-solutions.vercel.app`
2. Click on it to open your website!
3. Your website is now LIVE on the internet! 🎉

---

## 📋 STEP 7: Test the Contact Form

1. Go to your deployed website
2. Scroll to the Contact section
3. Fill in the form and submit
4. Check Supabase dashboard → Table Editor → `contact_submissions`
5. Your data should appear there!

---

## 🔧 Troubleshooting

### "Build Failed" error
- Check if `vercel.json` exists in your project
- Make sure all files are uploaded to GitHub

### "Environment variables" error
- Go to Vercel Project → Settings → Environment Variables
- Make sure both `SUPABASE_URL` and `SUPABASE_ANON_KEY` are added correctly

### Contact form not working after deployment
- Check browser console (F12) for errors
- Verify environment variables are set in Vercel

### Need to update your website?
After making changes locally:
```bash
git add .
git commit -m "Updated website"
git push
```
Vercel will automatically redeploy!

---

## 🔗 Quick Links

| Service | URL |
|---------|-----|
| GitHub | https://github.com |
| Vercel | https://vercel.com |
| Supabase | https://supabase.com |

---

## 📞 Your Deployed URLs

After deployment, your URLs will be:
- **Website:** `https://YOUR-PROJECT-NAME.vercel.app`
- **API Endpoint:** `https://YOUR-PROJECT-NAME.vercel.app/api/contact`

---

## ✅ Deployment Checklist

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Deployment successful
- [ ] Contact form tested

---

**Congratulations! Your website is now live! 🚀**

*Craftweb Solutions*
