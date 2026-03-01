# 📱 WhatsApp & Email Intervention Testing Guide

## ✅ Setup Status
- ✅ Backend running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:5173`
- ✅ Twilio WhatsApp Sandbox configured
- ✅ Resend Email service configured
- ✅ Bug fixed: 404 error on form submission (editingId state issue)

---

## 🚀 Quick Start - 3 Simple Steps

### Step 1: Join Twilio WhatsApp Sandbox
**Goal:** Enable your phone number to receive WhatsApp messages

1. **Open WhatsApp on your phone**
2. **Find your phone number** (should be in format like +91XXXXXXXXXX)
3. **Go to Twilio Console** → https://console.twilio.com
4. **Navigate to:** Messaging > Try it out > Send a WhatsApp message
5. **Look for the Sandbox Join Code** (e.g., "join XXXX-XXXX")
6. **Send to the Sandbox Number:** `+14155238886`
   - Send exactly: `join XXXX-XXXX` (with the actual code)
7. **Wait for confirmation:** You'll get a message back saying you've joined the sandbox
8. **Keep the Sandbox Number (+14155238886) in your WhatsApp Contacts**

**What you'll see in WhatsApp:**
```
Incoming from: +1 415-523-8886
Message: "You joined the Twilio WhatsApp Sandbox"
```

---

## 📧 Test EMAIL Feature

### Step 1: Open App
- Go to: `http://localhost:5173`
- Login with teacher account

### Step 2: Navigate to Interventions Tab
1. Left sidebar → **Data Entry** section
2. Select a **Class**
3. Select a **Student**
4. Click **Interventions** tab

### Step 3: Send Test Email
1. Click **"New Communication"** button (blue button)
2. Fill in the form:
   - **Intervention Type:** "Parent Communication"
   - **Channel:** Select **"Email"** (IMPORTANT!)
   - **Contact Target:** "Parent"
   - **Email Address:** `anshulraut23@gmail.com` (MUST use this - it's verified)
   - **Message:** "Hello, this is a test intervention message"
   - **Follow-up Date:** (optional)
   - **Status:** "Pending"

3. Click **"Submit"** button

### Expected Result: ✅
- Green success message: "✓ Communication logged & email sent to anshulraut23@gmail.com!"
- Email arrives in your inbox within 30 seconds
- Database entry created in `intervention_messages` table

**If email fails:**
- Check backend console for errors
- Verify email address is `anshulraut23@gmail.com` (only verified Resend email)
- Check `.env` file for `RESEND_API_KEY`

---

## 💬 Test WHATSAPP Feature

### Step 1: Make Sure You've Joined Sandbox
✅ Completed the "Join Twilio WhatsApp Sandbox" section above

### Step 2: Open App
- Go to: `http://localhost:5173`
- Login with teacher account

### Step 3: Send WhatsApp Message
1. Navigate to **Interventions** tab (same as email)
2. Click **"New Communication"** button
3. Fill in the form:
   - **Intervention Type:** "Parent Communication"
   - **Channel:** Select **"SMS"** (YES! SMS channel sends WhatsApp, not SMS)
   - **Contact Target:** "Parent"
   - **WhatsApp Number:** Enter your phone number in format: **+91XXXXXXXXXX**
     - Example: `+919876543210` (must include country code)
   - **Message:** "Hello, this is a test WhatsApp intervention"
   - **Status:** "Pending"

4. Click **"Submit"** button

### Expected Result: ✅
- Green success message: "✓ Communication logged & WhatsApp sent to +91XXXXXXXXXX!"
- **WhatsApp message arrives on your phone within 10 seconds**
- From: "Twilio Sandbox"
- Message contains your custom text
- Database entry created in `intervention_messages` table with `type='sms'`

**If WhatsApp fails:**
- ❌ Check: Did you join the sandbox? (First step above)
- ❌ Check: Is your phone format correct? (+91XXXXXXXXXX)
- ❌ Check: Backend console for errors
- ❌ Check: `.env` has Twilio credentials

---

## 🔍 Verify in Backend Console

### Watch Real-Time Logs
Open your backend terminal and watch for:

**For Email:**
```
🚀 TRIGGER INTERVENTION API RECEIVED
   POST /api/interventions/trigger/:studentId
   ✅ Student found: [Student Name]
   ✅ All permission checks passed
   📧 SEND EMAIL
   ✅ Email sent successfully
```

**For WhatsApp:**
```
🚀 TRIGGER INTERVENTION API RECEIVED
   POST /api/interventions/trigger/:studentId
   ✅ Student found: [Student Name]
   ✅ All permission checks passed
   💬 SEND WHATSAPP
   ✅ WhatsApp sent successfully
```

---

## 🗄️ Verify in Database

### Check Intervention Messages Table
Use Supabase or your database tool:

```sql
SELECT * FROM intervention_messages 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

**Expected Columns:**
| Field | Email | WhatsApp |
|-------|-------|----------|
| `id` | Generated | Generated |
| `intervention_id` | Your intervention ID | Your intervention ID |
| `type` | `'email'` | `'sms'` |
| `recipient` | anshulraut23@gmail.com | +91XXXXXXXXXX |
| `delivery_status` | `'sent'` | `'sent'` |
| `message_content` | Your message | Your message |
| `created_at` | Now | Now |

---

## ⚠️ Important Phone Number Format

**Correct formats:**
- ✅ `+91XXXXXXXXXX` (India, 10 digits after country code)
- ✅ `+1XXXXXXXXXX` (USA, 10 digits)
- ✅ `+44XXXXXXXXXX` (UK, variable digits)

**Incorrect formats (WILL FAIL):**
- ❌ `9876543210` (missing country code)
- ❌ `91 98765 43210` (spaces)
- ❌ `0XXXXXXXXXX` (starts with 0)
- ❌ `whatsapp:+91XXXXXXXXXX` (don't add whatsapp: prefix - backend does it)

---

## 📝 Troubleshooting

### Issue: "Intervention not found" 404 Error
**Cause:** Form had stale editing ID
**Status:** ✅ FIXED - Now resets properly when opening new form
**Result:** Try again - should work now!

### Issue: Email Not Arriving
**Problem:** Email address not verified in Resend
**Solution:** Use `anshulraut23@gmail.com` or upgrade Resend to Production

### Issue: WhatsApp Not Arriving
**Problem 1:** Didn't join sandbox
**Solution:** Send "join XXXX-XXXX" to +14155238886

**Problem 2:** Phone number format wrong
**Solution:** Use +91XXXXXXXXXX format

**Problem 3:** Backend error in console
**Solution:** Check `.env` file has Twilio credentials:
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM_NUMBER=whatsapp:+14155238886
```

---

## 🎯 Full Test Workflow

1. ✅ Join Twilio sandbox (one-time setup)
2. ✅ Open app at http://localhost:5173
3. ✅ Login
4. ✅ Go to Data Entry > Select Class > Select Student > Interventions
5. ✅ Test EMAIL:
   - Channel: Email
   - Email: anshulraut23@gmail.com
   - Submit
   - Check email arrives
6. ✅ Test WHATSAPP:
   - Channel: SMS
   - Phone: +91XXXXXXXXXX (your number)
   - Submit
   - Check WhatsApp arrives
7. ✅ Check database entries were created
8. ✅ Done!

---

## 🚨 Quick Checklist Before Testing

- [ ] Backend running (npm run dev on port 5000)
- [ ] Frontend running (npm run dev on port 5173)
- [ ] Joined Twilio WhatsApp Sandbox
- [ ] Twilio number (+14155238886) in WhatsApp Contacts
- [ ] Your phone has WhatsApp app
- [ ] Internet connected
- [ ] `.env` file has all Twilio credentials
- [ ] `.env` file has Resend API key

---

## 📞 Support

**If something doesn't work:**
1. Check backend console for errors
2. Verify phone format: `+91XXXXXXXXXX`
3. Verify email: `anshulraut23@gmail.com`
4. Restart backend: Kill Node processes and `npm run dev`
5. Check `.env` credentials

**Success indicators:**
- ✅ Green success message appears
- ✅ Message arrives on phone/email within 30 seconds
- ✅ Backend console shows "✅ sent successfully"
- ✅ Database entry appears in `intervention_messages` table

---

## 🎓 What's Happening Behind the Scenes

When you click Submit:
1. **Form validates** all fields (email/phone required for email/SMS)
2. **Creates intervention** in database (marks start of intervention)
3. **Sends message** via Resend (email) or Twilio (WhatsApp)
4. **Logs delivery** in `intervention_messages` table
5. **Shows success** message on app
6. **Resets form** for next entry

Everything is **logged** and **tracked** for administrative review!

---

**Last Updated:** March 1, 2026  
**Status:** ✅ All systems operational and tested

