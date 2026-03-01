import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const defaultFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

console.log('📧 Email Service Initialized:');
console.log('   API Key:', resendApiKey ? `✅ Configured (${resendApiKey.substring(0, 10)}...)` : '❌ NOT SET');
console.log('   From Email:', defaultFromEmail);
console.log('   Resend Client:', resend ? '✅ Ready' : '❌ Not initialized');

export const sendInterventionEmail = async (to, subject, html) => {
  console.log('\n📤 Starting email send process...');
  console.log('   To:', to);
  console.log('   Subject:', subject);
  console.log('   From:', defaultFromEmail);

  if (!resendApiKey || !resend) {
    const errorMsg = 'RESEND_API_KEY is not configured in environment';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  if (!to || !subject || !html) {
    const missingFields = [];
    if (!to) missingFields.push('to');
    if (!subject) missingFields.push('subject');
    if (!html) missingFields.push('html');
    const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  try {
    console.log('📨 Calling Resend API...');
    const response = await resend.emails.send({
      from: defaultFromEmail,
      to,
      subject,
      html
    });

    console.log('✅ Resend API Response:', JSON.stringify(response, null, 2));

    if (response?.error) {
      const errorMsg = `Resend API Error: ${response.error.message}`;
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    const messageId = response?.data?.id || response?.id || null;
    console.log('✅ Email sent successfully! Message ID:', messageId);

    return {
      id: messageId,
      raw: response
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('   Error details:', error);
    throw error;
  }
};
