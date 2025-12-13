# 🚀 Deploy to Vercel with Custom Domain from Hostinger

## Simple Step-by-Step Guide

---

## 📋 PART 1: Deploy Your Website on Vercel

### Step 1: Login to Vercel
1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. It will ask permission - click **"Authorize Vercel"**

### Step 2: Import Your Project
1. After login, you'll see Vercel Dashboard
2. Click **"Add New..."** button (top right)
3. Click **"Project"**
4. You'll see list of your GitHub repositories
5. Find **"craftweb-solutions"**
6. Click **"Import"** button next to it

### Step 3: Configure Your Project
1. **Project Name:** Leave as `craftweb-solutions` (or change if you want)
2. **Framework Preset:** Select **"Other"** from dropdown
3. **Root Directory:** Leave as `./` (don't change)
4. **Build Command:** Leave empty
5. **Output Directory:** Leave empty

### Step 4: Add Environment Variables (IMPORTANT!)
Scroll down to **"Environment Variables"** section:

**Add Variable 1:**
1. **Name:** `SUPABASE_URL`
2. **Value:** `https://xghstvviuekonacagfej.supabase.co`
3. Click **"Add"**

**Add Variable 2:**
1. **Name:** `SUPABASE_ANON_KEY`
2. **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaHN0dnZpdWVrb25hY2FnZmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjQxODMsImV4cCI6MjA4MTIwMDE4M30.DxOUjdspH_bfP9X9CcmwkiNmY28hmTubTTflK7MchFg`
3. Click **"Add"**

### Step 5: Deploy!
1. Click the big blue **"Deploy"** button at the bottom
2. Wait 1-2 minutes (Vercel will build your website)
3. You'll see a progress screen with logs
4. When done, you'll see **"Congratulations! 🎉"**

### Step 6: Check Your Website
1. Vercel gives you a URL like: `https://craftweb-solutions.vercel.app`
2. Click on it
3. Your website is now LIVE! ✅

---

## 📋 PART 2: Add Your Custom Domain from Hostinger

### Step 1: Open Domain Settings in Vercel
1. On Vercel, go to your project **"craftweb-solutions"**
2. Click on **"Settings"** tab (top menu)
3. In left sidebar, click **"Domains"**

### Step 2: Add Your Domain
1. You'll see a box saying "Add Domain"
2. Type your domain name (example: `yourwebsite.com`)
3. Click **"Add"** button
4. Vercel will show you DNS records you need to add

### Step 3: Copy the DNS Records
Vercel will show you something like this:

**For Main Domain (yourwebsite.com):**
- **Type:** A
- **Name:** @ (or leave empty)
- **Value:** `76.76.21.21`

**For WWW (www.yourwebsite.com):**
- **Type:** CNAME
- **Name:** www
- **Value:** `cname.vercel-dns.com`

**Keep this Vercel page open!** You need these values.

---

## 📋 PART 3: Update DNS Settings on Hostinger

### Step 1: Login to Hostinger
1. Go to **https://hostinger.com**
2. Click **"Login"**
3. Enter your email and password

### Step 2: Go to Domain Settings
1. After login, click **"Domains"** in top menu
2. Find your domain (example: yourwebsite.com)
3. Click **"Manage"** button next to it

### Step 3: Open DNS Settings
1. Look for **"DNS / Name Servers"** section
2. Click on it
3. You'll see a list of DNS records

### Step 4: Delete Old Records (Important!)
1. Find any **A records** pointing to old IP
2. Click the **trash/delete icon** next to them
3. Find any **CNAME records** for "www"
4. Delete those too

### Step 5: Add New Vercel A Record
1. Click **"Add Record"** or **"Add New Record"** button
2. Fill in:
   - **Type:** Select **"A"**
   - **Name:** Type `@` (or leave empty if no name field)
   - **Value/Points to:** Type `76.76.21.21` (from Vercel)
   - **TTL:** Leave as default (3600 or Auto)
3. Click **"Save"** or **"Add Record"**

### Step 6: Add New Vercel CNAME Record
1. Click **"Add Record"** again
2. Fill in:
   - **Type:** Select **"CNAME"**
   - **Name:** Type `www`
   - **Value/Points to:** Type `cname.vercel-dns.com` (from Vercel)
   - **TTL:** Leave as default
3. Click **"Save"** or **"Add Record"**

### Step 7: Save Changes
1. Look for a **"Save Changes"** or **"Update"** button at the bottom
2. Click it
3. Hostinger will confirm "DNS records updated"

---

## 📋 PART 4: Wait for DNS Propagation

### What happens now?
- DNS changes take time to spread across the internet
- **Minimum wait time:** 10-30 minutes
- **Maximum wait time:** 24-48 hours (but usually much faster)

### How to check if it's working:
1. Go back to Vercel → Settings → Domains
2. You'll see your domain with a status
3. When it shows **"Valid Configuration" ✅**, it's done!

### Test your website:
1. Open a new browser tab
2. Type your domain: `https://yourwebsite.com`
3. Your Craftweb Solutions website should appear!

---

## 🎯 Quick Summary

| Step | What to Do | Where |
|------|-----------|-------|
| 1 | Deploy on Vercel | Vercel.com |
| 2 | Add domain in Vercel | Vercel → Settings → Domains |
| 3 | Copy DNS records | Keep Vercel page open |
| 4 | Login to Hostinger | Hostinger.com |
| 5 | Go to DNS settings | Domains → Manage → DNS |
| 6 | Delete old A and CNAME records | Hostinger DNS |
| 7 | Add new A record (@ → 76.76.21.21) | Hostinger DNS |
| 8 | Add new CNAME (www → cname.vercel-dns.com) | Hostinger DNS |
| 9 | Save and wait 10-30 minutes | - |
| 10 | Test your domain! | Your browser |

---

## 🔧 Troubleshooting

### "Domain not verified" on Vercel
- Wait 10-30 minutes for DNS to update
- Check DNS records are correct on Hostinger
- Try clicking "Refresh" button on Vercel

### Website not loading on custom domain
- Check DNS propagation: https://dnschecker.org
- Enter your domain and check if A record shows 76.76.21.21
- Wait a bit longer (can take up to 24 hours)

### SSL Certificate not working (Not Secure warning)
- Vercel automatically adds SSL (HTTPS)
- This can take 5-10 minutes after DNS verification
- Refresh the page after some time

### Still seeing old website
- Clear browser cache: Press **Ctrl + Shift + Delete**
- Try opening in **Incognito/Private mode**
- Try from different device or phone

---

## ✅ Final Checklist

- [ ] Deployed on Vercel successfully
- [ ] Added SUPABASE_URL environment variable
- [ ] Added SUPABASE_ANON_KEY environment variable  
- [ ] Added custom domain in Vercel
- [ ] Copied A record value (76.76.21.21)
- [ ] Copied CNAME value (cname.vercel-dns.com)
- [ ] Logged into Hostinger
- [ ] Deleted old A records
- [ ] Deleted old CNAME records for www
- [ ] Added new A record pointing to Vercel
- [ ] Added new CNAME record for www
- [ ] Saved DNS changes
- [ ] Waited 10-30 minutes
- [ ] Tested domain - website loads! 🎉

---

## 📞 Important Notes

1. **Don't delete your domain from Hostinger** - You only update DNS settings
2. **Keep your Hostinger account active** - You need it for domain management
3. **Vercel hosting is FREE** - You don't pay anything for hosting
4. **SSL is automatic** - Vercel adds HTTPS for free
5. **Changes are instant** - After DNS propagation, updates push automatically from GitHub

---

**Your website will be live on your custom domain! 🚀**

*Craftweb Solutions*
