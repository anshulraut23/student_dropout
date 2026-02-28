# Gemini API Setup Guide

## Get Your Free Gemini API Key

### Step 1: Go to Google AI Studio
Visit: https://makersuite.google.com/app/apikey

### Step 2: Sign in with Google Account
- Use your Google account to sign in
- Accept the terms of service

### Step 3: Create API Key
1. Click "Create API Key"
2. Select "Create API key in new project" (or use existing project)
3. Copy the generated API key

### Step 4: Add to Your Project
1. Open `backend/.env` file
2. Find the line: `GEMINI_API_KEY=your_gemini_api_key_here`
3. Replace `your_gemini_api_key_here` with your actual API key
4. Save the file

Example:
```env
GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz
```

### Step 5: Install Dependencies
```bash
cd backend
npm install
```

### Step 6: Restart Backend Server
```bash
npm start
```

## Free Tier Limits

Gemini API Free Tier includes:
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ No credit card required
- ✅ Perfect for development and testing

## Testing the AI Assistant

1. Login as a teacher
2. Go to Faculty Chat
3. Click "AI Assistant"
4. Try these queries:
   - "List students with low attendance"
   - "Show all students of N3"
   - "Report of Omkar Ganesh Jagtap N3"
   - "Who has attendance below 70%"
   - "Show high-risk students"

## Troubleshooting

### Error: "Gemini API not configured"
- Make sure you added the API key to `.env` file
- Restart the backend server after adding the key

### Error: "API key not valid"
- Check if you copied the complete API key
- Make sure there are no extra spaces
- Verify the key is active in Google AI Studio

### Error: "Quota exceeded"
- You've hit the free tier limit (60 requests/minute)
- Wait a minute and try again
- Consider upgrading to paid tier for production

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git
- Keep your API key secret
- Don't share your API key publicly
- Rotate keys if compromised

## Alternative: Use Without Gemini

If you don't want to use Gemini API, the system will fall back to basic pattern matching. However, it won't be as flexible with natural language queries.

## Upgrade to Paid Tier (Optional)

For production use with high traffic:
- Visit: https://console.cloud.google.com/
- Enable billing for your project
- Paid tier: $0.00025 per request (very affordable)

## Support

Need help?
- Google AI Studio: https://ai.google.dev/
- Documentation: https://ai.google.dev/docs
- Community: https://discuss.ai.google.dev/

---

**Ready to test?** Follow the steps above and enjoy the enhanced AI Assistant! 🚀
