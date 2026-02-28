import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Checking available Gemini models for your API key...\n');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Try to list models
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models?key=' + API_KEY
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Available models for your API key:\n');
    
    if (data.models && data.models.length > 0) {
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(`   Description: ${model.description}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('');
      });
      
      console.log('\n💡 Recommendation:');
      const generateContentModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (generateContentModels.length > 0) {
        console.log('Use one of these models in your code:');
        generateContentModels.forEach(m => {
          const modelName = m.name.replace('models/', '');
          console.log(`  - ${modelName}`);
        });
      }
    } else {
      console.log('❌ No models available for this API key.');
      console.log('\n💡 This means:');
      console.log('   1. The API key might not have Gemini API enabled');
      console.log('   2. You need to create a new API key from Google AI Studio');
      console.log('   3. Visit: https://aistudio.google.com/app/apikey');
    }
    
  } catch (error) {
    console.error('❌ Error listing models:');
    console.error(error.message);
    console.log('\n💡 Solution:');
    console.log('   Get a new API key from: https://aistudio.google.com/app/apikey');
  }
}

listModels();
