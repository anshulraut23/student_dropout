import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBWrKeumJQtJhYILEdvMLt6xJvHu3rr7Ws';

console.log('🧪 Testing Gemini API Key...\n');
console.log('API Key:', API_KEY.substring(0, 20) + '...');

async function testGeminiAPI() {
  try {
    // Initialize Gemini - use gemini-2.5-flash (latest and fastest)
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    console.log('\n✅ Gemini AI initialized successfully');
    console.log('📝 Sending test query...\n');

    // Test query
    const prompt = 'Say "Hello! The API key is working!" in a friendly way.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('🤖 Gemini Response:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    console.log('\n✅ API Key Test: SUCCESS! 🎉');
    console.log('\nWorking model: gemini-2.5-flash');
    console.log('Your Gemini API key is working correctly.');
    console.log('You can now use the AI Assistant feature.\n');

  } catch (error) {
    console.error('\n❌ API Key Test: FAILED');
    console.error('\nError Details:');
    console.error('─'.repeat(50));
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('─'.repeat(50));
    
    if (error.status === 404) {
      console.error('\n💡 Suggestion: The model name might be incorrect.');
      console.error('   Try using: gemini-1.5-flash or gemini-1.5-pro');
    } else if (error.status === 403 || error.status === 401) {
      console.error('\n💡 Suggestion: API key might be invalid or expired.');
      console.error('   Get a new key from: https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('quota')) {
      console.error('\n💡 Suggestion: You may have exceeded the free tier quota.');
      console.error('   Wait a minute and try again.');
    }
    
    console.error('\n');
    process.exit(1);
  }
}

testGeminiAPI();
