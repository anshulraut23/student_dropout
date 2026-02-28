# Groq API Setup for General Assistant ✅

## Summary
Switched the General Chat Assistant from Gemini to Groq API to avoid quota limitations and provide faster, more reliable responses.

## Why Groq?

### Advantages:
- **Higher Rate Limits**: More generous free tier
- **Faster Responses**: Optimized for speed
- **Reliable**: Better uptime and availability
- **Cost-Effective**: Free tier suitable for development
- **Powerful Models**: Access to Llama 3.3 70B

### Model Used:
- **llama-3.3-70b-versatile**: Fast, capable, and versatile model
- Max tokens: 2048
- Temperature: 0.7 (balanced creativity)

## Setup Instructions

### Step 1: Get Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create API Key"
5. Copy your API key (starts with `gsk_`)

### Step 2: Add to Environment Variables

**Backend `.env` file:**
```env
# Groq API Configuration (for General Chat Assistant)
GROQ_API_KEY=gsk_your_actual_api_key_here
```

**Example:**
```env
GROQ_API_KEY=gsk_1234567890abcdefghijklmnopqrstuvwxyz
```

### Step 3: Restart Backend Server

```bash
cd backend
npm start
```

Or if using nodemon:
```bash
npm run dev
```

## What Changed

### Files Modified:

1. **backend/package.json**
   - Added `groq-sdk` dependency

2. **backend/.env**
   - Added `GROQ_API_KEY` variable

3. **backend/.env.example**
   - Added `GROQ_API_KEY` placeholder

4. **backend/controllers/aiAssistantController.js**
   - Imported Groq SDK
   - Initialized Groq client
   - Updated `handleGeneralQuery` to use Groq instead of Gemini

### API Separation:

- **Gemini API**: Used for Database Mode (student data queries)
- **Groq API**: Used for General Chat Mode (system information)

## Testing

### Test the General Assistant:

1. Open the AI Assistant page
2. Make sure you're in **General Chat Mode** (not Database Mode)
3. Ask questions like:
   - "What is this system?"
   - "Who developed this?"
   - "What features are available?"
   - "How do I mark attendance?"
   - "What is the pricing?"

### Expected Behavior:

✅ Fast responses (< 2 seconds)
✅ Professional formatting
✅ Accurate system information
✅ Polite redirection for off-topic questions

## Rate Limits

### Groq Free Tier:
- **Requests per minute**: 30
- **Requests per day**: 14,400
- **Tokens per minute**: 6,000

This is much more generous than Gemini's free tier!

## Error Handling

If Groq API is not configured:
```json
{
  "success": false,
  "error": "AI service not configured. Please add GROQ_API_KEY to .env file."
}
```

If rate limit exceeded:
```json
{
  "success": false,
  "error": "Failed to process your query",
  "details": "Rate limit exceeded"
}
```

## System Knowledge

The Groq assistant knows about:
- ✅ All system features
- ✅ How to use each function
- ✅ Pricing and support
- ✅ Technical details
- ✅ User roles and permissions
- ✅ Team GPPians (developers)

## Monitoring Usage

Visit [https://console.groq.com/usage](https://console.groq.com/usage) to monitor:
- API calls made
- Tokens used
- Rate limit status
- Cost (if on paid plan)

## Upgrading to Paid Plan

If you need higher limits:
1. Go to [https://console.groq.com/billing](https://console.groq.com/billing)
2. Choose a plan
3. Add payment method
4. Enjoy higher rate limits

## Troubleshooting

### Issue: "AI service not configured"
**Solution**: Add GROQ_API_KEY to backend/.env file

### Issue: "Rate limit exceeded"
**Solution**: Wait a minute or upgrade to paid plan

### Issue: Slow responses
**Solution**: Check internet connection, Groq is usually very fast

### Issue: Incorrect information
**Solution**: Update the system message in handleGeneralQuery function

## Benefits of Groq

1. **Speed**: Responses in 1-2 seconds
2. **Reliability**: Better uptime than free Gemini
3. **Cost**: Free tier is generous
4. **Quality**: Llama 3.3 70B is very capable
5. **Scalability**: Easy to upgrade when needed

## Next Steps

1. Get your Groq API key
2. Add it to backend/.env
3. Restart the backend server
4. Test the general assistant
5. Monitor usage in Groq console

## Support

- Groq Documentation: [https://console.groq.com/docs](https://console.groq.com/docs)
- Groq Discord: [https://discord.gg/groq](https://discord.gg/groq)
- API Status: [https://status.groq.com](https://status.groq.com)

## Credits

**Developed by**: Team GPPians
**AI Model**: Llama 3.3 70B (via Groq)
**Purpose**: Provide fast, reliable system assistance
