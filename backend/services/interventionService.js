import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';
import { sendInterventionEmail } from './emailService.js';

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

  // Determine recipient(s)
  let recipients = [];
  
  console.log('\n📋 Determining recipients:');
  console.log('   recipientEmail:', recipientEmail || '(not provided)');
  console.log('   student.parentEmail:', student.parentEmail || '(not set)');
  console.log('   student.email:', student.email || '(not set)');
  
  if (recipientEmail) {
    // Explicit email provided
    console.log('   ✅ Using provided recipientEmail:', recipientEmail);
    recipients = [recipientEmail];
  } else if (sendToParentAndStudent) {
    // Send to both parent and student
    console.log('   ✅ Sending to both parent and student');
    if (student.parentEmail) recipients.push(student.parentEmail);
    if (student.email) recipients.push(student.email);
  } else {
    // Default: try parent first, then student, then guardian
    console.log('   ✅ Using default logic (parent or student)');
    const email = student.parentEmail || student.email;
    if (email) recipients.push(email);
  }

  console.log('   Final recipients:', recipients);

  if (recipients.length === 0) {
    const errorMsg = 'No recipient email found. Provide recipientEmail in request body or ensure student has parent/student email in database.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

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

  console.log('\n📧 Preparing to send emails:');
  console.log('   Subject:', emailSubject);
  console.log('   Recipients count:', recipients.length);

  // Send emails to all recipients
  const emailResults = [];
  
  for (const recipient of recipients) {
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

      console.log(`   ✅ Email sent with ID: ${emailResult.id}`);

      if (typeof dataStore.addInterventionMessage === 'function') {
        await dataStore.addInterventionMessage({
          ...messageLogBase,
          deliveryStatus: 'sent'
        });
        console.log(`   ✅ Email logged in database`);
      }

      emailResults.push({
        recipient,
        status: 'sent',
        emailProviderId: emailResult.id
      });
    } catch (error) {
      console.error(`   ❌ Failed to send to ${recipient}: ${error.message}`);
      
      if (typeof dataStore.addInterventionMessage === 'function') {
        await dataStore.addInterventionMessage({
          ...messageLogBase,
          deliveryStatus: 'failed'
        });
      }

      emailResults.push({
        recipient,
        status: 'failed',
        error: error.message
      });
    }
  }

  console.log('\n📊 Email results:', emailResults);

  // Update intervention status
  const allFailed = emailResults.every(r => r.status === 'failed');
  const anySent = emailResults.some(r => r.status === 'sent');

  await dataStore.updateIntervention(createdIntervention.id, {
    status: allFailed ? 'failed' : anySent ? 'sent' : 'pending',
    updatedAt: new Date().toISOString(),
    outcome: allFailed ? `All emails failed: ${emailResults.map(r => r.error).join(', ')}` : null
  });

  if (allFailed) {
    throw new Error(`Failed to send intervention emails to all recipients: ${emailResults.map(r => r.error).join(', ')}`);
  }

  return {
    interventionId: createdIntervention.id,
    studentId,
    recipients: emailResults,
    status: anySent ? 'sent' : 'partial'
  };
};
