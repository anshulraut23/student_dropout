import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';
import { sendInterventionEmail } from './emailService.js';
import { sendWhatsApp } from './whatsappService.js';

const mapRiskToPriority = (riskLevel = 'medium') => {
  const normalized = String(riskLevel).toLowerCase();
  if (normalized === 'critical') return 'urgent';
  if (normalized === 'high') return 'high';
  if (normalized === 'medium') return 'medium';
  return 'low';
};

export const buildInterventionEmailTemplate = ({
  studentName,
  interventionType,
  riskLevel,
  customMessage
}) => {
  const readableType = String(interventionType || 'student_support').replace(/_/g, ' ');
  const readableRisk = String(riskLevel || 'medium').toUpperCase();

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:640px;margin:0 auto;">
      <h2 style="margin-bottom:8px;">Student Intervention Alert</h2>
      <p style="margin:0 0 12px 0;">This is an automated intervention notification from the school system.</p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;margin-bottom:14px;">
        <p style="margin:0 0 6px 0;"><strong>Student:</strong> ${studentName}</p>
        <p style="margin:0 0 6px 0;"><strong>Intervention Type:</strong> ${readableType}</p>
        <p style="margin:0;"><strong>Risk Level:</strong> ${readableRisk}</p>
      </div>
      <p style="margin:0 0 12px 0;">${customMessage || 'Please review this student and take suitable follow-up action.'}</p>
      <p style="font-size:12px;color:#6b7280;margin-top:16px;">This message was generated automatically by the intervention engine.</p>
    </div>
  `;
};

export const triggerInterventionEmail = async ({
  studentId,
  initiatedBy,
  interventionType = 'dropout_risk',
  riskLevel = 'medium',
  recipientEmail,
  recipientPhone,
  messageChannel = 'email',
  subject,
  customMessage,
  sendToParentAndStudent = false
}) => {
  console.log('\n🎯 TRIGGER INTERVENTION EMAIL - Starting');
  console.log('   studentId:', studentId);
  console.log('   initiatedBy:', initiatedBy);
  console.log('   interventionType:', interventionType);
  console.log('   recipientEmail (from request):', recipientEmail);
  console.log('   sendToParentAndStudent:', sendToParentAndStudent);

  if (!studentId) {
    throw new Error('studentId is required');
  }

  if (!initiatedBy) {
    throw new Error('initiatedBy is required');
  }

  const student = await dataStore.getStudentById(studentId);
  console.log('   Student found:', student ? `✅ ${student.name}` : '❌ Not found');
  
  if (!student) {
    throw new Error('Student not found');
  }

  const normalizedChannel = String(messageChannel || 'email').toLowerCase();
  const shouldSendEmail = normalizedChannel === 'email';
  const shouldSendWhatsApp = normalizedChannel === 'whatsapp' || normalizedChannel === 'sms';

  if (!shouldSendEmail && !shouldSendWhatsApp) {
    throw new Error('Invalid messageChannel. Use "email", "whatsapp", or "sms"');
  }

  let emailRecipients = [];
  let whatsappRecipients = [];

  console.log('\n📋 Determining recipients:');
  console.log('   messageChannel:', normalizedChannel);
  console.log('   recipientEmail:', recipientEmail || '(not provided)');
  console.log('   recipientPhone:', recipientPhone || '(not provided)');
  console.log('   student.parentEmail:', student.parentEmail || '(not set)');
  console.log('   student.email:', student.email || '(not set)');
  console.log('   student.parentPhone:', student.parentPhone || '(not set)');

  if (shouldSendEmail) {
    if (recipientEmail) {
      emailRecipients = [recipientEmail];
    } else if (sendToParentAndStudent) {
      if (student.parentEmail) emailRecipients.push(student.parentEmail);
      if (student.email) emailRecipients.push(student.email);
    } else {
      const email = student.parentEmail || student.email;
      if (email) emailRecipients.push(email);
    }

    if (emailRecipients.length === 0) {
      throw new Error('No recipient email found. Provide recipientEmail in request body or ensure student has parent/student email in database.');
    }
  }

  if (shouldSendWhatsApp) {
    if (recipientPhone) {
      whatsappRecipients = [recipientPhone];
    } else {
      const phone = student.parentPhone;
      if (phone) whatsappRecipients.push(phone);
    }

    if (whatsappRecipients.length === 0) {
      throw new Error('No recipient phone found. Provide recipientPhone in request body or ensure student has parent phone in database.');
    }
  }

  console.log('   Final email recipients:', emailRecipients);
  console.log('   Final WhatsApp recipients:', whatsappRecipients);

  const nowIso = new Date().toISOString();
  const currentDate = nowIso.split('T')[0];
  const interventionId = generateId();

  console.log('\n💾 Creating intervention record:');
  console.log('   interventionId:', interventionId);
  console.log('   studentId:', studentId);
  console.log('   currentDate:', currentDate);

  const interventionRecord = {
    id: interventionId,
    studentId,
    initiatedBy,
    interventionType,
    priority: mapRiskToPriority(riskLevel),
    title: subject || `Intervention: ${String(interventionType).replace(/_/g, ' ')}`,
    description: customMessage || 'Automated intervention triggered by risk system',
    actionPlan: null,
    expectedOutcome: null,
    startDate: currentDate,
    targetDate: null,
    endDate: null,
    status: 'in_progress',
    outcome: null,
    riskLevel,
    triggerDate: nowIso,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const createdIntervention = await dataStore.addIntervention(interventionRecord);
  console.log('   ✅ Intervention created:', createdIntervention.id);

  const emailSubject = subject || `Intervention Alert for ${student.name}`;
  const html = buildInterventionEmailTemplate({
    studentName: student.name,
    interventionType,
    riskLevel,
    customMessage
  });

  const messageText = customMessage || 'Please review this student and take suitable follow-up action.';

  const emailResults = [];
  const whatsappResults = [];

  if (shouldSendEmail) {
    console.log('\n📧 Preparing to send emails:');
    console.log('   Subject:', emailSubject);
    console.log('   Recipients count:', emailRecipients.length);

    for (const recipient of emailRecipients) {
      console.log(`\n📨 Sending email to: ${recipient}`);

      const messageLogBase = {
        id: generateId(),
        interventionId: createdIntervention.id,
        type: 'email',
        recipient,
        subject: emailSubject,
        body: html,
        sentDate: new Date().toISOString()
      };

      try {
        const emailResult = await sendInterventionEmail(recipient, emailSubject, html);

        if (typeof dataStore.addInterventionMessage === 'function') {
          await dataStore.addInterventionMessage({
            ...messageLogBase,
            deliveryStatus: 'sent'
          });
        }

        emailResults.push({
          channel: 'email',
          recipient,
          status: 'sent',
          providerId: emailResult.id
        });
      } catch (error) {
        if (typeof dataStore.addInterventionMessage === 'function') {
          await dataStore.addInterventionMessage({
            ...messageLogBase,
            deliveryStatus: 'failed'
          });
        }

        emailResults.push({
          channel: 'email',
          recipient,
          status: 'failed',
          error: error.message
        });
      }
    }
  }

  if (shouldSendWhatsApp) {
    console.log('\n💬 Preparing to send WhatsApp messages:');
    console.log('   Recipients count:', whatsappRecipients.length);

    for (const recipient of whatsappRecipients) {
      console.log(`\n📲 Sending WhatsApp to: ${recipient}`);

      const messageLogBase = {
        id: generateId(),
        interventionId: createdIntervention.id,
        type: 'sms',
        recipient,
        subject: `WhatsApp: ${subject || `Intervention Alert for ${student.name}`}`,
        body: messageText,
        sentDate: new Date().toISOString()
      };

      try {
        const whatsappResult = await sendWhatsApp(recipient, messageText);

        if (typeof dataStore.addInterventionMessage === 'function') {
          await dataStore.addInterventionMessage({
            ...messageLogBase,
            deliveryStatus: 'sent'
          });
        }

        whatsappResults.push({
          channel: 'whatsapp',
          recipient,
          status: 'sent',
          providerId: whatsappResult.sid
        });
      } catch (error) {
        if (typeof dataStore.addInterventionMessage === 'function') {
          await dataStore.addInterventionMessage({
            ...messageLogBase,
            deliveryStatus: 'failed'
          });
        }

        whatsappResults.push({
          channel: 'whatsapp',
          recipient,
          status: 'failed',
          error: error.message
        });
      }
    }
  }

  const allResults = [...emailResults, ...whatsappResults];

  console.log('\n📊 Message results:', allResults);

  const allFailed = allResults.every(r => r.status === 'failed');
  const anySent = allResults.some(r => r.status === 'sent');

  await dataStore.updateIntervention(createdIntervention.id, {
    status: allFailed ? 'failed' : anySent ? 'sent' : 'pending',
    updatedAt: new Date().toISOString(),
    outcome: allFailed ? `All messages failed: ${allResults.map(r => r.error).filter(Boolean).join(', ')}` : null
  });

  if (allFailed) {
    throw new Error(`Failed to send intervention messages to all recipients: ${allResults.map(r => r.error).filter(Boolean).join(', ')}`);
  }

  return {
    interventionId: createdIntervention.id,
    studentId,
    recipients: allResults,
    status: anySent ? 'sent' : 'partial'
  };
};
