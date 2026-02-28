import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import dataStore from '../storage/dataStore.js';

// Initialize Gemini AI (for database queries)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Initialize Groq AI (for general chat)
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

/**
 * Enhanced AI Assistant Controller with Gemini Integration
 * Handles natural language queries about student data with full flexibility
 */

// Helper function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Helper function to calculate attendance percentage
const calculateAttendancePercentage = (attendanceRecords) => {
  if (!attendanceRecords || attendanceRecords.length === 0) return 0;
  const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
  return Math.round((presentCount / attendanceRecords.length) * 100);
};

// Helper function to calculate average marks
const calculateAverageMarks = (marksRecords) => {
  if (!marksRecords || marksRecords.length === 0) return null;
  const validMarks = marksRecords.filter(m => m.marksObtained !== null && m.marksObtained !== undefined);
  if (validMarks.length === 0) return null;
  const sum = validMarks.reduce((acc, m) => acc + parseFloat(m.marksObtained), 0);
  return Math.round((sum / validMarks.length) * 100) / 100;
};

// Get teacher's context (classes and students)
async function getTeacherContext(userId, schoolId) {
  const classes = await dataStore.getClasses();
  const teacherClasses = classes.filter(c => 
    c.schoolId === schoolId && c.teacherId === userId
  );
  
  const students = await dataStore.getStudents();
  const teacherStudents = students.filter(s => 
    teacherClasses.some(c => c.id === s.classId)
  );
  
  return { teacherClasses, teacherStudents };
}

// Parse date range from natural language using Gemini
async function parseDateRangeWithAI(query) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Default fallback
  const defaultRange = {
    startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    endDate: today
  };
  
  // Simple pattern matching for common cases (fast path)
  if (query.includes('today')) {
    return { startDate: today, endDate: today };
  }
  if (query.includes('this week')) {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - today.getDay());
    return { startDate, endDate: today };
  }
  if (query.includes('last week')) {
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7);
    return { startDate, endDate };
  }
  if (query.includes('this month')) {
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate, endDate: today };
  }
  if (query.includes('last month')) {
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 1);
    return { startDate, endDate };
  }
  
  return defaultRange;
}

// Use Gemini to understand the query intent
async function analyzeQueryWithGemini(query, teacherContext) {
  if (!genAI) {
    return { error: 'Gemini API not configured. Please add GEMINI_API_KEY to .env file.' };
  }
  
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const { teacherClasses, teacherStudents } = teacherContext;
  
  const prompt = `You are an AI assistant for a teacher. Analyze this query and extract the intent and parameters.

Teacher's Classes: ${teacherClasses.map(c => c.name).join(', ')}
Available Students: ${teacherStudents.map(s => `${s.name} (${teacherClasses.find(c => c.id === s.classId)?.name})`).join(', ')}

Query: "${query}"

Analyze the query and respond with a JSON object containing:
{
  "intent": "single_student_report" | "list_students" | "class_summary" | "attendance_query" | "attendance_input" | "performance_query" | "behavior_query" | "risk_query" | "mark_attendance" | "view_attendance",
  "studentName": "exact student name if mentioned, or null",
  "className": "class name if mentioned, or null",
  "action": "view" | "mark" | "update" | null,
  "outputFormat": "full" | "table_only" | "summary_only",
  "filters": {
    "lowAttendance": boolean,
    "highRisk": boolean,
    "poorPerformance": boolean,
    "behaviorIssues": boolean,
    "attendanceThreshold": number (percentage),
    "riskLevel": "low" | "medium" | "high" | "critical" | null
  },
  "timePeriod": "today" | "this week" | "last week" | "this month" | "last month" | null,
  "specificClass": "class name if query is about a specific class, or null",
  "needsConfirmation": boolean (true if this is a data input/modification action),
  "confirmationMessage": "A friendly confirmation question to ask the user" | null
}

Intent Detection Rules:
- "show attendance", "view attendance", "today's attendance", "attendance of today" → intent: "view_attendance"
- "mark attendance", "take attendance", "record attendance" → intent: "mark_attendance", needsConfirmation: true
- "report of [name]", "show data for [name]" → intent: "single_student_report"
- "list students", "show students", "who has" → intent: "list_students"
- "all students of [class]", "students in [class]" → intent: "list_students", specificClass: [class]

Output Format Detection:
- If query contains "only table", "just table", "table only", "show table" → outputFormat: "table_only"
- If query contains "summary only", "just summary" → outputFormat: "summary_only"
- Otherwise → outputFormat: "full"

Examples:
- "show attendance of today" → {"intent": "view_attendance", "timePeriod": "today", "outputFormat": "full"}
- "show attendance table only" → {"intent": "view_attendance", "timePeriod": "today", "outputFormat": "table_only"}
- "list students with low attendance only table" → {"intent": "list_students", "filters": {"lowAttendance": true}, "outputFormat": "table_only"}
- "today's attendance" → {"intent": "view_attendance", "timePeriod": "today", "outputFormat": "full"}
- "mark attendance for N3" → {"intent": "mark_attendance", "specificClass": "N3", "needsConfirmation": true, "confirmationMessage": "Would you like to mark attendance for class N3 today?"}
- "take attendance" → {"intent": "mark_attendance", "needsConfirmation": true, "confirmationMessage": "Which class would you like to mark attendance for?"}
- "Report of John Doe N3" → {"intent": "single_student_report", "studentName": "John Doe", "className": "N3", "outputFormat": "full"}
- "List students with low attendance" → {"intent": "list_students", "filters": {"lowAttendance": true, "attendanceThreshold": 75}, "outputFormat": "full"}
- "Show high-risk students in my classes" → {"intent": "list_students", "filters": {"highRisk": true}, "outputFormat": "full"}
- "Show all students of N3" → {"intent": "list_students", "specificClass": "N3", "outputFormat": "full"}

Respond ONLY with valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const analysis = JSON.parse(jsonText);
    return analysis;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return { error: 'Failed to analyze query', details: error.message };
  }
}

// Generate response for single student report with AI-enhanced insights
async function generateStudentReport(student, teacherClass, startDate, endDate, outputFormat = 'full') {
  const [attendance, marks, behavior, interventions, riskPrediction] = await Promise.all([
    dataStore.getStudentAttendance(student.id, startDate, endDate),
    dataStore.getMarksByStudent(student.id),
    dataStore.getBehaviorsByStudent(student.id),
    dataStore.getInterventionsByStudent(student.id),
    dataStore.getRiskPrediction(student.id)
  ]);

  const filteredAttendance = attendance.filter(a => {
    const date = new Date(a.date);
    return date >= startDate && date <= endDate;
  });

  const filteredBehavior = behavior.filter(b => {
    const date = new Date(b.date);
    return date >= startDate && date <= endDate;
  });

  const attendancePercentage = calculateAttendancePercentage(filteredAttendance);
  const averageMarks = calculateAverageMarks(marks);
  const presentDays = filteredAttendance.filter(a => a.status === 'present').length;
  const absentDays = filteredAttendance.filter(a => a.status === 'absent').length;
  const lateDays = filteredAttendance.filter(a => a.status === 'late').length;
  const positiveBehavior = filteredBehavior.filter(b => b.behaviorType === 'positive').length;
  const negativeBehavior = filteredBehavior.filter(b => b.behaviorType === 'negative').length;

  // Use Gemini AI to generate intelligent insights
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const formatInstruction = outputFormat === 'table_only'
        ? 'Generate ONLY the tables without any headers, analysis, or recommendations. Just the raw tables with section labels.'
        : 'Generate a comprehensive report with all sections.';

      const prompt = `You are an educational AI assistant helping a teacher understand a student's performance. ${formatInstruction}

Student Data:
- Name: ${student.name}
- Class: ${teacherClass.name}
- Roll Number: ${student.rollNumber || 'Not Assigned'}
- Period: ${formatDate(startDate)} to ${formatDate(endDate)}

Attendance:
- Percentage: ${attendancePercentage}%
- Present: ${presentDays} days
- Absent: ${absentDays} days
- Late: ${lateDays} days
- Total tracked: ${filteredAttendance.length} days

Academic Performance:
- Average marks: ${averageMarks !== null ? averageMarks + '%' : 'No data'}
- Exams completed: ${marks?.length || 0}
- Recent scores: ${marks?.slice(-3).map(m => `${m.marksObtained}/${m.totalMarks || 100}`).join(', ') || 'None'}

Behavior:
- Positive incidents: ${positiveBehavior}
- Negative incidents: ${negativeBehavior}

Risk Assessment:
- Risk Level: ${riskPrediction?.riskLevel?.toUpperCase() || 'UNKNOWN'}
- Risk Score: ${riskPrediction ? (riskPrediction.riskScore * 100).toFixed(1) + '%' : 'N/A'}
- Confidence: ${riskPrediction?.confidence || 'N/A'}

${outputFormat === 'table_only' ? `
Generate ONLY these tables with minimal headers:

**BASIC INFORMATION**
| Field | Value |
|-------|-------|
| Class | ${teacherClass.name} |
| Roll Number | ${student.rollNumber || 'Not Assigned'} |
| Report Period | ${formatDate(startDate)} to ${formatDate(endDate)} |

**ATTENDANCE SUMMARY**
| Metric | Value | Status |
|--------|-------|--------|
| Overall Attendance | ${attendancePercentage}% | ${attendancePercentage >= 90 ? 'Good ✅' : attendancePercentage >= 75 ? 'Needs Attention ⚠️' : 'Critical 🚨'} |
| Present Days | ${presentDays} | ✅ |
| Absent Days | ${absentDays} | ${absentDays > 3 ? '⚠️' : '✅'} |
| Late Days | ${lateDays} | ${lateDays > 2 ? '⚠️' : '✅'} |
| Total Days Tracked | ${filteredAttendance.length} | - |

**ACADEMIC PERFORMANCE**
| Metric | Value | Grade |
|--------|-------|-------|
| Average Marks | ${averageMarks !== null ? averageMarks + '%' : 'No data'} | ${averageMarks >= 90 ? 'A' : averageMarks >= 75 ? 'B' : averageMarks >= 60 ? 'C' : averageMarks >= 50 ? 'D' : 'F'} |
| Exams Completed | ${marks?.length || 0} | - |

${riskPrediction ? `**RISK ASSESSMENT**
| Factor | Value | Status |
|--------|-------|--------|
| Risk Level | ${riskPrediction.riskLevel.toUpperCase()} | ${riskPrediction.riskLevel === 'critical' ? '🚨' : riskPrediction.riskLevel === 'high' ? '⚠️' : riskPrediction.riskLevel === 'medium' ? '⚡' : '✅'} |
| Risk Score | ${(riskPrediction.riskScore * 100).toFixed(1)}% | - |
| Confidence | ${riskPrediction.confidence} | - |` : ''}

Return ONLY these tables with their section labels, nothing else.
` : `
Generate a detailed report with PROFESSIONAL FORMATTING:

1. **📊 STUDENT REPORT: ${student.name.toUpperCase()}**

2. **BASIC INFORMATION**
   | Field | Value |
   |-------|-------|
   | Class | ${teacherClass.name} |
   | Roll Number | ${student.rollNumber || 'Not Assigned'} |
   | Report Period | ${formatDate(startDate)} to ${formatDate(endDate)} |

3. **📅 ATTENDANCE SUMMARY**
   | Metric | Value | Status |
   |--------|-------|--------|
   | Overall Attendance | ${attendancePercentage}% | [Good/Needs Attention/Critical] |
   | Present Days | ${presentDays} | ✅ |
   | Absent Days | ${absentDays} | ${absentDays > 3 ? '⚠️' : '✅'} |
   | Late Days | ${lateDays} | ${lateDays > 2 ? '⚠️' : '✅'} |
   | Total Days Tracked | ${filteredAttendance.length} | - |

   **Analysis:** [Provide 1-2 sentences analyzing attendance pattern]

4. **📚 ACADEMIC PERFORMANCE**
   | Metric | Value | Grade |
   |--------|-------|-------|
   | Average Marks | ${averageMarks !== null ? averageMarks + '%' : 'No data'} | [A/B/C/D/F] |
   | Exams Completed | ${marks?.length || 0} | - |
   | Recent Scores | ${marks?.slice(-3).map(m => `${m.marksObtained}/${m.totalMarks || 100}`).join(', ') || 'None'} | - |

   **Analysis:** [Provide 1-2 sentences analyzing academic performance]

${filteredBehavior.length > 0 ? `5. **🎭 BEHAVIOR RECORDS**
   | Type | Count | Trend |
   |------|-------|-------|
   | Positive Incidents | ${positiveBehavior} | ${positiveBehavior > negativeBehavior ? '📈 Good' : '📊 Neutral'} |
   | Negative Incidents | ${negativeBehavior} | ${negativeBehavior > positiveBehavior ? '⚠️ Concerning' : '✅ Good'} |

   **Analysis:** [Provide 1-2 sentences analyzing behavior pattern]` : ''}

${riskPrediction ? `6. **⚠️ RISK ASSESSMENT**
   | Factor | Value | Status |
   |--------|-------|--------|
   | Risk Level | ${riskPrediction.riskLevel.toUpperCase()} | ${riskPrediction.riskLevel === 'critical' ? '🚨' : riskPrediction.riskLevel === 'high' ? '⚠️' : riskPrediction.riskLevel === 'medium' ? '⚡' : '✅'} |
   | Risk Score | ${(riskPrediction.riskScore * 100).toFixed(1)}% | - |
   | Confidence | ${riskPrediction.confidence} | - |

   **Analysis:** [Provide 1-2 sentences explaining risk factors]` : ''}

7. **💡 SMART RECOMMENDATIONS**
   Provide 3-5 specific, actionable recommendations in this format:

   **Priority 1: [Title]**
   • Action: [Specific action to take]
   • Timeline: [When to do it]
   • Expected Outcome: [What will improve]

   **Priority 2: [Title]**
   • Action: [Specific action to take]
   • Timeline: [When to do it]
   • Expected Outcome: [What will improve]

   [Continue for 3-5 priorities]

8. **📈 POSITIVE HIGHLIGHTS**
   • [List 2-3 positive aspects to encourage the student]

FORMATTING RULES:
- Use tables with | separators for structured data
- Use **BOLD** for all section headers
- Use emojis for visual appeal (📊 📅 📚 🎭 ⚠️ 💡 ✅ ⚠️ 🚨)
- Use bullet points (•) for lists
- Keep tables aligned and clean
- Add blank lines between sections
- Make recommendations specific and actionable
- Be empathetic and solution-focused
`}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiResponse = response.text();

      return {
        response: aiResponse,
        data: {
          student: {
            id: student.id,
            name: student.name,
            rollNumber: student.rollNumber,
            class: teacherClass.name
          },
          statistics: {
            attendancePercentage,
            presentDays,
            absentDays,
            lateDays,
            averageMarks,
            examsCompleted: marks?.length || 0,
            positiveBehavior,
            negativeBehavior
          },
          riskLevel: riskPrediction?.riskLevel || 'unknown'
        }
      };
    } catch (error) {
      console.error('Gemini AI error:', error);
      // Fall back to template-based response
    }
  }

  // Fallback template-based response
  let response = `📊 **Student Report: ${student.name}**\n\n`;
  response += `**Class:** ${teacherClass.name}\n`;
  response += `**Roll Number:** ${student.rollNumber || 'Not Assigned'}\n`;
  response += `**Period:** ${formatDate(startDate)} to ${formatDate(endDate)}\n\n`;

  response += `**📅 Attendance Summary:**\n`;
  response += `• Overall: ${attendancePercentage}% (${presentDays} present, ${absentDays} absent, ${lateDays} late)\n`;
  response += `• Total days tracked: ${filteredAttendance.length}\n\n`;

  if (marks && marks.length > 0) {
    response += `**📚 Academic Performance:**\n`;
    response += `• Average marks: ${averageMarks !== null ? averageMarks + '%' : 'N/A'}\n`;
    response += `• Exams completed: ${marks.length}\n`;
    const recentMarks = marks.slice(-3);
    if (recentMarks.length > 0) {
      response += `• Recent scores: ${recentMarks.map(m => `${m.marksObtained}/${m.totalMarks || 100}`).join(', ')}\n`;
    }
    response += `\n`;
  }

  if (filteredBehavior.length > 0) {
    response += `**🎭 Behavior Records:**\n`;
    response += `• Positive incidents: ${positiveBehavior}\n`;
    response += `• Negative incidents: ${negativeBehavior}\n\n`;
  }

  if (riskPrediction) {
    response += `**⚠️ Risk Assessment:**\n`;
    response += `• Risk Level: ${riskPrediction.riskLevel.toUpperCase()}\n`;
    response += `• Risk Score: ${(riskPrediction.riskScore * 100).toFixed(1)}%\n`;
    response += `• Confidence: ${riskPrediction.confidence}\n\n`;
  }

  if (interventions && interventions.length > 0) {
    const activeInterventions = interventions.filter(i => i.status === 'in_progress' || i.status === 'planned');
    if (activeInterventions.length > 0) {
      response += `**🎯 Active Interventions:**\n`;
      activeInterventions.forEach(i => {
        response += `• ${i.title || i.interventionType} (${i.status})\n`;
      });
      response += `\n`;
    }
  }

  response += `**💡 Recommendations:**\n`;
  if (attendancePercentage < 75) {
    response += `• ⚠️ Attendance is below 75% - consider parent meeting\n`;
  }
  if (negativeBehavior > positiveBehavior && negativeBehavior > 0) {
    response += `• 🎭 More negative than positive behavior - behavioral intervention recommended\n`;
  }
  if (averageMarks !== null && averageMarks < 50) {
    response += `• 📚 Academic performance needs attention - consider tutoring\n`;
  }
  if (attendancePercentage >= 90 && (averageMarks === null || averageMarks >= 75)) {
    response += `• ✅ Student is performing well - continue monitoring\n`;
  }

  return {
    response,
    data: {
      student: {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        class: teacherClass.name
      },
      statistics: {
        attendancePercentage,
        presentDays,
        absentDays,
        lateDays,
        averageMarks,
        examsCompleted: marks?.length || 0,
        positiveBehavior,
        negativeBehavior
      },
      riskLevel: riskPrediction?.riskLevel || 'unknown'
    }
  };
}


// Generate response for list of students with AI-enhanced insights
async function generateStudentList(students, teacherClasses, filters) {
  const studentDataPromises = students.map(async (student) => {
    const studentClass = teacherClasses.find(c => c.id === student.classId);
    const [attendance, marks, riskPrediction] = await Promise.all([
      dataStore.getStudentAttendance(student.id),
      dataStore.getMarksByStudent(student.id),
      dataStore.getRiskPrediction(student.id)
    ]);
    
    const attendancePercentage = calculateAttendancePercentage(attendance);
    const averageMarks = calculateAverageMarks(marks);
    
    return {
      student,
      studentClass,
      attendancePercentage,
      averageMarks,
      riskLevel: riskPrediction?.riskLevel || 'unknown',
      riskScore: riskPrediction?.riskScore || 0
    };
  });
  
  const studentData = await Promise.all(studentDataPromises);
  
  // Apply filters
  let filteredStudents = studentData;
  let filterDescription = '';
  
  if (filters.lowAttendance) {
    const threshold = filters.attendanceThreshold || 75;
    filteredStudents = filteredStudents.filter(s => s.attendancePercentage < threshold);
    filterDescription = `Attendance below ${threshold}%`;
  }
  
  if (filters.highRisk) {
    filteredStudents = filteredStudents.filter(s => 
      s.riskLevel === 'high' || s.riskLevel === 'critical'
    );
    filterDescription = filterDescription ? `${filterDescription} and High-risk students` : 'High-risk students';
  }
  
  if (filters.poorPerformance) {
    filteredStudents = filteredStudents.filter(s => 
      s.averageMarks !== null && s.averageMarks < 50
    );
    filterDescription = filterDescription ? `${filterDescription} and Poor performance` : 'Poor academic performance';
  }
  
  if (filters.specificClass) {
    filterDescription = filterDescription ? `${filterDescription} in ${filters.specificClass}` : `Class: ${filters.specificClass}`;
  }
  
  if (filteredStudents.length === 0) {
    return {
      response: `📋 **Student List**\n\n${filterDescription ? `**Filter:** ${filterDescription}\n\n` : ''}No students found matching the criteria.`,
      data: { students: [] }
    };
  }
  
  // Sort by risk score (highest first) for better prioritization
  filteredStudents.sort((a, b) => b.riskScore - a.riskScore);
  
  // Use Gemini AI to generate intelligent summary and insights
  if (genAI && filteredStudents.length > 0) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const studentsummary = filteredStudents.slice(0, 10).map((d, i) => 
        `${i + 1}. ${d.student.name} - Attendance: ${d.attendancePercentage}%, Marks: ${d.averageMarks || 'N/A'}%, Risk: ${d.riskLevel.toUpperCase()}`
      ).join('\n');
      
      const prompt = `You are an educational AI assistant helping a teacher understand their class. Generate an insightful summary for a list of students.

Filter Applied: ${filterDescription || 'All students'}
Total Students: ${filteredStudents.length}

Top Students (by risk/need):
${studentsummary}

Generate a response with PROFESSIONAL FORMATTING:

1. **📋 STUDENT LIST**

2. **FILTER INFORMATION**
   | Field | Value |
   |-------|-------|
   | Filter Applied | ${filterDescription || 'All students'} |
   | Total Students | ${filteredStudents.length} |
   | Sort Order | By Risk Score (Highest First) |

3. **📊 KEY INSIGHTS**
   Analyze the overall patterns (2-3 bullet points):
   • [Insight 1: e.g., "15 students have both low attendance and low marks"]
   • [Insight 2: e.g., "Most students show consistent attendance issues"]
   • [Insight 3: e.g., "Academic performance varies widely across the group"]

4. **🎯 PRIORITY ACTIONS**
   Suggest 2-3 group interventions:
   
   **Action 1: [Title]**
   • Target: [Which students or how many]
   • Intervention: [Specific action]
   • Timeline: [When to implement]
   
   **Action 2: [Title]**
   • Target: [Which students or how many]
   • Intervention: [Specific action]
   • Timeline: [When to implement]

5. **👥 DETAILED STUDENT LIST**
   Create a comprehensive table for ALL ${filteredStudents.length} students:
   
   | # | Student Name | Class | Roll | Attendance | Avg Marks | Risk Level | Priority |
   |---|--------------|-------|------|------------|-----------|------------|----------|
   | 1 | [Name] | [Class] | [Roll] | [%]% | [%]% | [LEVEL] | [🚨/⚠️/⚡/✅] |
   | 2 | [Name] | [Class] | [Roll] | [%]% | [%]% | [LEVEL] | [Icon] |
   [Continue for all students]

6. **💡 INDIVIDUAL RECOMMENDATIONS**
   For top 3-5 priority students, provide specific recommendations:
   
   **[Student Name 1]** (Risk: [LEVEL])
   • Issue: [Primary concern]
   • Action: [Specific recommendation]
   • Timeline: [When to act]
   
   **[Student Name 2]** (Risk: [LEVEL])
   • Issue: [Primary concern]
   • Action: [Specific recommendation]
   • Timeline: [When to act]

FORMATTING RULES:
- Use tables with | separators for ALL structured data
- Use **BOLD** for all section headers and student names
- Use emojis for visual appeal (📋 📊 🎯 👥 💡 🚨 ⚠️ ⚡ ✅)
- Keep tables aligned and clean
- Students already sorted by risk score (highest first)
- Add blank lines between sections
- Make recommendations specific and actionable
- Include ALL students in the detailed table
- Use priority icons: 🚨 Critical, ⚠️ High, ⚡ Medium, ✅ Low`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      return {
        response: aiResponse,
        data: {
          students: filteredStudents.map(d => ({
            id: d.student.id,
            name: d.student.name,
            class: d.studentClass?.name,
            attendancePercentage: d.attendancePercentage,
            averageMarks: d.averageMarks,
            riskLevel: d.riskLevel
          }))
        }
      };
    } catch (error) {
      console.error('Gemini AI error:', error);
      // Fall back to template-based response
    }
  }
  
  // Fallback template-based response
  let response = `📋 **Student List**\n\n`;
  
  if (filterDescription) {
    response += `**Filter:** ${filterDescription}\n\n`;
  }
  
  response += `**Total Students:** ${filteredStudents.length}\n\n`;
  
  filteredStudents.forEach((data, index) => {
    response += `${index + 1}. **${data.student.name}** (${data.studentClass?.name || 'N/A'})\n`;
    response += `   • Roll: ${data.student.rollNumber || 'N/A'}\n`;
    response += `   • Attendance: ${data.attendancePercentage}%\n`;
    if (data.averageMarks !== null) {
      response += `   • Average Marks: ${data.averageMarks}%\n`;
    }
    response += `   • Risk Level: ${data.riskLevel.toUpperCase()}\n\n`;
  });
  
  return {
    response,
    data: {
      students: filteredStudents.map(d => ({
        id: d.student.id,
        name: d.student.name,
        class: d.studentClass?.name,
        attendancePercentage: d.attendancePercentage,
        averageMarks: d.averageMarks,
        riskLevel: d.riskLevel
      }))
    }
  };
}

// Generate attendance view response
async function generateAttendanceView(teacherClasses, teacherStudents, timePeriod, specificClass) {
  const { startDate, endDate } = await parseDateRangeWithAI(timePeriod || 'today');
  
  // Filter classes if specific class requested
  let classesToShow = teacherClasses;
  if (specificClass) {
    const targetClass = teacherClasses.find(c => 
      c.name.toLowerCase() === specificClass.toLowerCase()
    );
    if (targetClass) {
      classesToShow = [targetClass];
    }
  }
  
  // Get attendance data for all students in the classes
  const attendanceDataPromises = teacherStudents
    .filter(s => classesToShow.some(c => c.id === s.classId))
    .map(async (student) => {
      const attendance = await dataStore.getStudentAttendance(student.id, startDate, endDate);
      const studentClass = teacherClasses.find(c => c.id === student.classId);
      
      return {
        student,
        className: studentClass?.name || 'N/A',
        attendance: attendance.filter(a => {
          const date = new Date(a.date);
          return date >= startDate && date <= endDate;
        })
      };
    });
  
  const attendanceData = await Promise.all(attendanceDataPromises);
  
  // Use Gemini to generate intelligent attendance summary
  if (genAI && attendanceData.length > 0) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const summary = attendanceData.slice(0, 15).map(d => {
        const present = d.attendance.filter(a => a.status === 'present').length;
        const absent = d.attendance.filter(a => a.status === 'absent').length;
        const late = d.attendance.filter(a => a.status === 'late').length;
        const total = d.attendance.length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        return `${d.student.name} (${d.className}): ${percentage}% - ${present}P/${absent}A/${late}L`;
      }).join('\n');
      
      const prompt = `You are an educational AI assistant helping a teacher view attendance data.

Period: ${formatDate(startDate)} to ${formatDate(endDate)}
Classes: ${classesToShow.map(c => c.name).join(', ')}
Total Students: ${attendanceData.length}

Sample Attendance Data:
${summary}

Generate a comprehensive attendance report with PROFESSIONAL FORMATTING:

1. **📅 ATTENDANCE REPORT**

2. **REPORT DETAILS**
   | Field | Value |
   |-------|-------|
   | Period | ${formatDate(startDate)} to ${formatDate(endDate)} |
   | Classes | ${classesToShow.map(c => c.name).join(', ')} |
   | Total Students | ${attendanceData.length} |

3. **📊 SUMMARY STATISTICS**
   Create a summary table:
   | Metric | Value | Status |
   |--------|-------|--------|
   | Overall Attendance Rate | [Calculate]% | [Good/Needs Attention/Critical] |
   | Students with Perfect Attendance | [Count] | ✅ |
   | Students with Good Attendance (≥90%) | [Count] | ✅ |
   | Students Needing Attention (75-89%) | [Count] | ⚠️ |
   | Students with Critical Attendance (<75%) | [Count] | 🚨 |

4. **🎯 KEY INSIGHTS**
   Provide 2-3 bullet points analyzing patterns:
   • [Insight 1 about overall attendance trends]
   • [Insight 2 about specific concerns or highlights]
   • [Insight 3 about recommendations]

5. **👥 STUDENT ATTENDANCE DETAILS**
   Create a detailed table for ALL ${attendanceData.length} students:
   
   | # | Student Name | Class | Attendance | Present | Absent | Late | Status |
   |---|--------------|-------|------------|---------|--------|------|--------|
   | 1 | [Name] | [Class] | [%]% | [#]P | [#]A | [#]L | [Good ✅/Attention ⚠️/Critical 🚨] |
   | 2 | [Name] | [Class] | [%]% | [#]P | [#]A | [#]L | [Status] |
   [Continue for all students]

6. **⚠️ PRIORITY ACTIONS**
   List 2-3 specific actions the teacher should take:
   
   **Action 1: [Title]**
   • Students affected: [Names or count]
   • Recommended action: [Specific action]
   • Timeline: [When to do it]
   
   **Action 2: [Title]**
   • Students affected: [Names or count]
   • Recommended action: [Specific action]
   • Timeline: [When to do it]

7. **📈 POSITIVE HIGHLIGHTS**
   • [Highlight 1-2 positive aspects or students with excellent attendance]

FORMATTING RULES:
- Use tables with | separators for ALL structured data
- Use **BOLD** for all section headers
- Use emojis for visual appeal (📅 📊 🎯 👥 ⚠️ ✅ 🚨)
- Keep tables aligned and clean
- Sort students by attendance percentage (lowest first for priority)
- Add blank lines between sections
- Make recommendations specific and actionable
- Include ALL students in the detailed table`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiResponse = response.text();
      
      return {
        response: aiResponse,
        data: {
          period: { startDate, endDate },
          classes: classesToShow.map(c => c.name),
          students: attendanceData.map(d => ({
            id: d.student.id,
            name: d.student.name,
            class: d.className,
            attendance: d.attendance
          }))
        }
      };
    } catch (error) {
      console.error('Gemini AI error:', error);
      // Fall back to template-based response
    }
  }
  
  // Fallback template-based response
  let response = `📅 **Attendance Report**\n\n`;
  response += `**Period:** ${formatDate(startDate)} to ${formatDate(endDate)}\n`;
  response += `**Classes:** ${classesToShow.map(c => c.name).join(', ')}\n\n`;
  
  response += `**📊 Summary:**\n`;
  response += `• Total students: ${attendanceData.length}\n`;
  
  const totalPresent = attendanceData.reduce((sum, d) => 
    sum + d.attendance.filter(a => a.status === 'present').length, 0
  );
  const totalRecords = attendanceData.reduce((sum, d) => sum + d.attendance.length, 0);
  const overallRate = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
  response += `• Overall attendance: ${overallRate}%\n\n`;
  
  response += `**Student Details:**\n\n`;
  attendanceData.forEach((d, index) => {
    const present = d.attendance.filter(a => a.status === 'present').length;
    const absent = d.attendance.filter(a => a.status === 'absent').length;
    const late = d.attendance.filter(a => a.status === 'late').length;
    const total = d.attendance.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    response += `${index + 1}. **${d.student.name}** (${d.className})\n`;
    response += `   • Attendance: ${percentage}% (${present}P / ${absent}A / ${late}L)\n`;
    response += `   • Status: ${percentage >= 90 ? 'Good ✅' : percentage >= 75 ? 'Needs Attention ⚠️' : 'Critical 🚨'}\n\n`;
  });
  
  return {
    response,
    data: {
      period: { startDate, endDate },
      classes: classesToShow.map(c => c.name),
      students: attendanceData.map(d => ({
        id: d.student.id,
        name: d.student.name,
        class: d.className,
        attendance: d.attendance
      }))
    }
  };
}

// Main AI query handler with Gemini
export const handleAIQuery = async (req, res) => {
  try {
    const { userId, schoolId } = req.user;
    const { query, confirmAction, confirmData } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }
    
    // Get teacher context
    const teacherContext = await getTeacherContext(userId, schoolId);
    const { teacherClasses, teacherStudents } = teacherContext;
    
    if (teacherClasses.length === 0) {
      return res.json({
        success: true,
        response: "You don't have any classes assigned yet. Please contact your administrator.",
        type: 'error'
      });
    }
    
    // Handle confirmation responses (yes/no)
    if (confirmAction && confirmData) {
      const lowerQuery = query.toLowerCase().trim();
      
      // Check if user confirmed (yes, ok, sure, confirm, proceed, etc.)
      const isConfirmed = ['yes', 'y', 'ok', 'sure', 'confirm', 'proceed', 'go ahead', 'do it'].some(word => 
        lowerQuery === word || lowerQuery.startsWith(word + ' ') || lowerQuery.endsWith(' ' + word)
      );
      
      // Check if user declined (no, cancel, stop, etc.)
      const isDeclined = ['no', 'n', 'cancel', 'stop', 'abort', 'nevermind', 'never mind'].some(word => 
        lowerQuery === word || lowerQuery.startsWith(word + ' ') || lowerQuery.endsWith(' ' + word)
      );
      
      if (isDeclined) {
        return res.json({
          success: true,
          response: "Okay, action cancelled. How else can I help you?",
          type: 'info'
        });
      }
      
      if (isConfirmed) {
        // Execute the confirmed action
        if (confirmAction === 'mark_attendance') {
          const { className } = confirmData;
          
          return res.json({
            success: true,
            response: `Great! To mark attendance for class ${className}, please use the Attendance page in the app.\n\n**Quick Steps:**\n1. Go to Data Entry → Attendance\n2. Select class: ${className}\n3. Select today's date\n4. Mark each student as Present/Absent/Late\n5. Save the attendance\n\nWould you like me to show you today's attendance for ${className} instead?`,
            type: 'action',
            action: {
              type: 'redirect',
              page: 'attendance',
              params: { className }
            }
          });
        }
      }
      
      // If not clearly yes or no, ask for clarification
      return res.json({
        success: true,
        response: "I didn't quite understand. Please reply with 'yes' to proceed or 'no' to cancel.",
        type: 'confirmation',
        needsConfirmation: true,
        confirmAction,
        confirmData
      });
    }
    
    // Analyze query with Gemini
    const analysis = await analyzeQueryWithGemini(query, teacherContext);
    
    if (analysis.error) {
      return res.json({
        success: true,
        response: `I'm having trouble understanding your query. ${analysis.error}\n\nTry asking:\n• "Report of [Student Name] [Class]"\n• "List students with low attendance"\n• "Show today's attendance"\n• "Show all students of [Class]"`,
        type: 'error'
      });
    }
    
    // Parse date range
    const { startDate, endDate } = await parseDateRangeWithAI(query);
    
    // Handle view_attendance intent
    if (analysis.intent === 'view_attendance') {
      const result = await generateAttendanceView(
        teacherClasses, 
        teacherStudents, 
        analysis.timePeriod || 'today',
        analysis.specificClass
      );
      
      return res.json({
        success: true,
        response: result.response,
        type: 'attendance',
        data: result.data
      });
    }
    
    // Handle mark_attendance intent (needs confirmation)
    if (analysis.intent === 'mark_attendance') {
      if (analysis.needsConfirmation) {
        const className = analysis.specificClass || (teacherClasses.length === 1 ? teacherClasses[0].name : null);
        
        if (!className) {
          return res.json({
            success: true,
            response: `Which class would you like to mark attendance for?\n\nYour classes: ${teacherClasses.map(c => c.name).join(', ')}\n\nPlease specify the class name.`,
            type: 'question'
          });
        }
        
        return res.json({
          success: true,
          response: analysis.confirmationMessage || `Would you like to mark attendance for class ${className} today?`,
          type: 'confirmation',
          needsConfirmation: true,
          confirmAction: 'mark_attendance',
          confirmData: { className }
        });
      }
    }
    
    // Handle single_student_report intent
    if (analysis.intent === 'single_student_report') {
      // Find the student
      let student = null;
      
      if (analysis.studentName && analysis.className) {
        student = teacherStudents.find(s => {
          const studentClass = teacherClasses.find(c => c.id === s.classId);
          return s.name.toLowerCase().includes(analysis.studentName.toLowerCase()) &&
                 studentClass?.name.toLowerCase() === analysis.className.toLowerCase();
        });
      } else if (analysis.studentName) {
        student = teacherStudents.find(s => 
          s.name.toLowerCase().includes(analysis.studentName.toLowerCase())
        );
      }
      
      if (!student) {
        return res.json({
          success: true,
          response: `Student "${analysis.studentName}" not found in your classes. Please check the name and try again.\n\nYour students: ${teacherStudents.slice(0, 5).map(s => s.name).join(', ')}${teacherStudents.length > 5 ? '...' : ''}`,
          type: 'error'
        });
      }
      
      const studentClass = teacherClasses.find(c => c.id === student.classId);
      const result = await generateStudentReport(student, studentClass, startDate, endDate, analysis.outputFormat || 'full');
      
      return res.json({
        success: true,
        response: result.response,
        type: 'report',
        data: result.data
      });
    }
    
    // Handle list_students intent
    if (analysis.intent === 'list_students') {
      let studentsToList = teacherStudents;
      
      // Filter by specific class if requested
      if (analysis.specificClass) {
        const targetClass = teacherClasses.find(c => 
          c.name.toLowerCase() === analysis.specificClass.toLowerCase()
        );
        if (targetClass) {
          studentsToList = teacherStudents.filter(s => s.classId === targetClass.id);
          analysis.filters = analysis.filters || {};
          analysis.filters.specificClass = targetClass.name;
        }
      }
      
      const result = await generateStudentList(studentsToList, teacherClasses, analysis.filters || {});
      
      return res.json({
        success: true,
        response: result.response,
        type: 'list',
        data: result.data
      });
    }
    
    // Default response for other intents
    return res.json({
      success: true,
      response: `I understand you want to ${analysis.intent.replace(/_/g, ' ')}. This feature is coming soon!\n\nFor now, try:\n• "Report of [Student Name] [Class]"\n• "List students with low attendance"\n• "Show today's attendance"\n• "Show all students of [Class]"`,
      type: 'info'
    });
    
  } catch (error) {
    console.error('AI query error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process AI query',
      details: error.message
    });
  }
};

// Get AI assistant suggestions
export const getAISuggestions = async (req, res) => {
  try {
    const { userId, schoolId } = req.user;
    
    const { teacherClasses, teacherStudents } = await getTeacherContext(userId, schoolId);
    
    const suggestions = [
      'Show today\'s attendance',
      'Show attendance summary for this week',
      'List students with low attendance',
      'Show high-risk students in my classes',
      ...teacherStudents.slice(0, 2).map(s => {
        const studentClass = teacherClasses.find(c => c.id === s.classId);
        return `Report of ${s.name} ${studentClass?.name || ''}`;
      })
    ];
    
    if (teacherClasses.length > 0) {
      suggestions.push(`Show all students of ${teacherClasses[0].name}`);
    }
    
    return res.json({
      success: true,
      suggestions: suggestions.slice(0, 6)
    });
    
  } catch (error) {
    console.error('Get AI suggestions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
};

// General Assistant Handler - Answers questions about the system using Groq


// General Assistant Handler - Answers questions about the system using Groq
export const handleGeneralQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }
    
    if (!groq) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured. Please add GROQ_API_KEY to .env file.'
      });
    }
    
    const systemMessage = `You are an AI assistant for the Proactive Education Assistant system, developed by Team GPPians. Help teachers understand and use the system.

SYSTEM INFO:
- Comprehensive education management platform
- AI-powered dropout risk prediction
- Features: Student Management, Attendance, Marks, Behavior Tracking, Interventions, Gamification, Faculty Connect, Analytics
- Pricing: ₹499/month (50% off)
- Support: support@proactiveeducation.com

ANSWER ONLY questions about this system. For off-topic questions, politely redirect to system-related topics.

Use professional formatting with bold text, bullets, tables, and emojis.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: query
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: false
    });
    
    const aiResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    return res.json({
      success: true,
      response: aiResponse
    });
    
  } catch (error) {
    console.error('General assistant error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process your query',
      details: error.message
    });
  }
};
