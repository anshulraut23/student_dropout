// Exam Template Service - Business logic for exam templates

import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';

/**
 * Create a new exam template and auto-generate exams
 */
export async function createTemplate(templateData, userId) {
  // Validation
  if (!templateData.name || !templateData.type || !templateData.totalMarks || 
      !templateData.passingMarks || templateData.weightage === undefined) {
    throw new Error('Name, type, total marks, passing marks, and weightage are required');
  }

  if (templateData.passingMarks >= templateData.totalMarks) {
    throw new Error('Passing marks must be less than total marks');
  }

  if (templateData.weightage < 0 || templateData.weightage > 1) {
    throw new Error('Weightage must be between 0 and 1');
  }

  if (templateData.totalMarks <= 0) {
    throw new Error('Total marks must be greater than 0');
  }

  const template = {
    id: generateId(),
    schoolId: templateData.schoolId,
    name: templateData.name,
    type: templateData.type,
    description: templateData.description || null,
    subjects: templateData.subjects || [], // Default to empty array if not provided
    totalMarks: parseInt(templateData.totalMarks),
    passingMarks: parseInt(templateData.passingMarks),
    weightage: parseFloat(templateData.weightage),
    orderSequence: parseInt(templateData.orderSequence) || 1,
    isActive: templateData.isActive !== undefined ? templateData.isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await dataStore.addExamTemplate(template);

  // Note: Exams are not auto-generated anymore to avoid confusion
  // Admins should create exam periods or exams manually for specific subjects
  console.log('✅ Template created. Use Exam Periods to generate exams for this template.');

  return {
    template,
    generatedExamsCount: 0,
    generatedExams: []
  };
}

/**
 * Auto-generate exams for all subjects when template is created
 */
async function autoGenerateExamsForTemplate(template, userId) {
  const classes = await dataStore.getClassesBySchool(template.schoolId);
  if (classes.length === 0) {
    console.log('⚠️  No classes found in school');
    return [];
  }

  const generatedExams = [];

  for (const classData of classes) {
    const subjects = await dataStore.getSubjectsByClass(classData.id);
    
    if (subjects.length === 0) {
      console.log(`⚠️  No subjects found for class: ${classData.name}`);
      continue;
    }

    for (const subject of subjects) {
      // Create exam
      const exam = {
        id: generateId(),
        schoolId: template.schoolId,
        classId: classData.id,
        subjectId: subject.id,
        name: `${subject.name} - ${template.name}`,
        type: template.type,
        totalMarks: template.totalMarks,
        passingMarks: template.passingMarks,
        examDate: new Date().toISOString().split('T')[0], // Today's date
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      await dataStore.addExam(exam);
      generatedExams.push({
        examId: exam.id,
        className: classData.name,
        subjectName: subject.name,
        examName: exam.name
      });
    }
  }

  console.log(`✅ Generated ${generatedExams.length} exams for template: ${template.name}`);
  return generatedExams;
}

/**
 * Get all templates for a school
 */
export async function getTemplates(schoolId, filters = {}) {
  return await dataStore.getExamTemplates(schoolId, filters);
}

/**
 * Get template by ID
 */
export async function getTemplateById(templateId) {
  const template = await dataStore.getExamTemplateById(templateId);
  if (!template) {
    throw new Error('Template not found');
  }
  return template;
}

/**
 * Update exam template
 */
export async function updateTemplate(templateId, updates, userId) {
  console.log('🔧 Service updateTemplate called:', { templateId, updates, userId });
  
  const existingTemplate = await dataStore.getExamTemplateById(templateId);
  if (!existingTemplate) {
    console.log('❌ Template not found:', templateId);
    throw new Error('Template not found');
  }

  console.log('📋 Existing template before update:', existingTemplate);

  // Validation
  if (updates.passingMarks && updates.totalMarks) {
    if (updates.passingMarks >= updates.totalMarks) {
      throw new Error('Passing marks must be less than total marks');
    }
  } else if (updates.passingMarks) {
    if (updates.passingMarks >= existingTemplate.totalMarks) {
      throw new Error('Passing marks must be less than total marks');
    }
  } else if (updates.totalMarks) {
    if (existingTemplate.passingMarks >= updates.totalMarks) {
      throw new Error('Passing marks must be less than total marks');
    }
  }

  if (updates.weightage !== undefined && (updates.weightage < 0 || updates.weightage > 1)) {
    throw new Error('Weightage must be between 0 and 1');
  }

  if (updates.totalMarks !== undefined && updates.totalMarks <= 0) {
    throw new Error('Total marks must be greater than 0');
  }

  if (updates.orderSequence !== undefined && updates.orderSequence < 1) {
    throw new Error('Order sequence must be at least 1');
  }

  // Convert numeric fields
  if (updates.totalMarks) updates.totalMarks = parseInt(updates.totalMarks);
  if (updates.passingMarks) updates.passingMarks = parseInt(updates.passingMarks);
  if (updates.weightage !== undefined) updates.weightage = parseFloat(updates.weightage);
  if (updates.orderSequence) updates.orderSequence = parseInt(updates.orderSequence);

  console.log('📝 Updates after conversion:', updates);

  const updatedTemplate = await dataStore.updateExamTemplate(templateId, updates);
  console.log('✅ Template updated in dataStore:', updatedTemplate);
  
  return updatedTemplate;
}

/**
 * Delete exam template
 */
export async function deleteTemplate(templateId, userId) {
  const template = await dataStore.getExamTemplateById(templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  // Check if template is used in any periods
  const isUsed = await dataStore.isTemplateUsed(templateId);
  if (isUsed) {
    throw new Error('Cannot delete template that is used in exam periods');
  }

  const deleted = await dataStore.deleteExamTemplate(templateId);
  if (!deleted) {
    throw new Error('Failed to delete template');
  }

  return { success: true, message: 'Template deleted successfully' };
}

/**
 * Toggle template active status
 */
export async function toggleTemplateStatus(templateId, userId) {
  const template = await dataStore.getExamTemplateById(templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  const updatedTemplate = await dataStore.toggleExamTemplateStatus(templateId);
  return updatedTemplate;
}

/**
 * Get template usage statistics
 */
export async function getTemplateUsage(templateId) {
  const template = await dataStore.getExamTemplateById(templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  const periods = await dataStore.getExamPeriods(template.schoolId, { templateId });
  const totalExams = await Promise.all(
    periods.map(async (period) => await dataStore.getExamsCountByPeriod(period.id))
  ).then(counts => counts.reduce((sum, count) => sum + count, 0));

  return {
    templateId,
    periodsCount: periods.length,
    examsCount: totalExams,
    isUsed: periods.length > 0
  };
}

/**
 * Validate template data
 */
export function validateTemplateData(data) {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Template name is required');
  }

  if (!data.type) {
    errors.push('Template type is required');
  }

  if (!data.totalMarks || data.totalMarks <= 0) {
    errors.push('Total marks must be greater than 0');
  }

  if (!data.passingMarks || data.passingMarks < 0) {
    errors.push('Passing marks must be 0 or greater');
  }

  if (data.passingMarks >= data.totalMarks) {
    errors.push('Passing marks must be less than total marks');
  }

  if (data.weightage === undefined || data.weightage < 0 || data.weightage > 1) {
    errors.push('Weightage must be between 0 and 1');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
