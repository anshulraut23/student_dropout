import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM_NUMBER;

const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

const normalizeWhatsAppAddress = (value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.startsWith('whatsapp:') ? trimmed : `whatsapp:${trimmed}`;
};

export const sendWhatsApp = async (to, message) => {
  if (!twilioClient) {
    throw new Error('Twilio is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
  }

  const fromAddress = normalizeWhatsAppAddress(whatsappFrom);
  if (!fromAddress) {
    throw new Error('TWILIO_WHATSAPP_FROM_NUMBER is required in .env (example: whatsapp:+14155238886)');
  }

  const toAddress = normalizeWhatsAppAddress(to);
  if (!toAddress) {
    throw new Error('Valid WhatsApp recipient number is required (example: whatsapp:+91XXXXXXXXXX)');
  }

  if (!message || !String(message).trim()) {
    throw new Error('WhatsApp message text is required');
  }

  try {
    const response = await twilioClient.messages.create({
      from: fromAddress,
      to: toAddress,
      body: String(message).trim()
    });

    return {
      sid: response.sid,
      status: response.status,
      raw: response
    };
  } catch (error) {
    const reason = error?.message || 'Unknown Twilio error';
    throw new Error(`Twilio WhatsApp send failed: ${reason}`);
  }
};
