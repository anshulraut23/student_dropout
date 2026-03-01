/**
 * BulkUploadValidationService
 * Comprehensive validation for all bulk upload operations
 * Ensures data consistency and provides clear error reporting
 */

class BulkUploadValidationService {
  /**
   * Validate bulk attendance data with detailed reporting
   */
  static validateAttendanceData(parsedData, students, selectedClass) {
    const results = {
      valid: [],
      errors: [],
      warnings: [],
      summary: {
        totalRows: parsedData.length,
        totalStudents: students.length,
        validRecords: 0,
        missingStudents: 0,
        invalidData: 0,
        duplicateRecords: 0,
        explanation: '' // Will be populated at the end
      },
      details: {
        missingEnrollmentNumbers: [],
        invalidStatusValues: [],
        duplicateStudentDates: new Map()
      }
    };

    const processedStudentDates = new Map();
    const studentsByEnrollment = new Map();

    // Index students by enrollment number
    students.forEach(s => {
      if (s.enrollmentNo) {
        studentsByEnrollment.set(String(s.enrollmentNo).toLowerCase().trim(), s);
      }
    });

    parsedData.forEach((row, rowIndex) => {
      const rowNum = rowIndex + 2; // +2 because of 0-index and header row
      const rowErrors = [];

      // 1. Validate Enrollment Number
      const enrollmentNo = row['Enrollment No'] || row['Enrollment Number'] || row.enrollmentNo || row['enrollment_no'];
      if (!enrollmentNo) {
        rowErrors.push('❌ Missing enrollment number');
        results.details.missingEnrollmentNumbers.push({ row: rowNum, value: null });
        results.summary.missingStudents++;
      }

      const student = enrollmentNo 
        ? studentsByEnrollment.get(String(enrollmentNo).toLowerCase().trim())
        : null;

      if (!student && enrollmentNo) {
        rowErrors.push(`❌ Student with enrollment "${enrollmentNo}" not found in class`);
        results.details.missingEnrollmentNumbers.push({ row: rowNum, value: enrollmentNo });
        results.summary.missingStudents++;
      }

      // 2. Validate Status
      const status = (row.Status || row.status || 'present').toLowerCase().trim();
      const validStatuses = ['present', 'absent', 'late', 'excused', 'leave'];
      if (!validStatuses.includes(status)) {
        rowErrors.push(`❌ Invalid status "${status}". Use: ${validStatuses.join(', ')}`);
        results.summary.invalidData++;
      }

      // 3. Check for Duplicates
      if (student) {
        const key = student.id;
        if (processedStudentDates.has(key)) {
          rowErrors.push(`❌ Duplicate: Student already in this upload`);
          results.summary.duplicateRecords++;
        }
        processedStudentDates.set(key, true);
      }

      // Add to results
      if (rowErrors.length === 0 && student) {
        results.valid.push({
          rowNum,
          studentId: student.id,
          enrollmentNo: student.enrollmentNo,
          studentName: student.name,
          status,
          remarks: row.Remarks || row.remarks || ''
        });
        results.summary.validRecords++;
      } else if (rowErrors.length > 0) {
        results.errors.push({
          rowNum,
          enrollmentNo: enrollmentNo || 'N/A',
          studentName: row['Student Name'] || row.studentName || 'N/A',
          errors: rowErrors
        });
      }
    });

    // Check for students NOT in uploaded file
    const uploadedEnrollments = new Set(
      results.valid.map(v => v.enrollmentNo.toLowerCase().trim())
    );
    const missingFromUpload = students.filter(
      s => !uploadedEnrollments.has(String(s.enrollmentNo).toLowerCase().trim())
    );

    if (missingFromUpload.length > 0) {
      results.warnings.push({
        type: 'MISSING_STUDENTS',
        message: `⚠️ ${missingFromUpload.length} student(s) not in uploaded file (Class has ${students.length} total)`,
        students: missingFromUpload.slice(0, 20).map(s => ({ 
          id: s.id, 
          enrollmentNo: s.enrollmentNo, 
          name: s.name 
        })),
        moreCount: missingFromUpload.length > 20 ? missingFromUpload.length - 20 : 0
      });
    }

    // Generate a comprehensive, conversational explanation for ATTENDANCE
    let explanation = '';
    if (results.errors.length === 0 && results.warnings.length === 0) {
      explanation = `✅ Perfect! Your attendance file looks great. All ${results.valid.length} student records are valid and ready to be uploaded. The file contains correct enrollment numbers that match students in the selected class, and all attendance statuses are properly formatted.`;
    } else if (results.errors.length > 0) {
      explanation = `❌ Your attendance file has some issues that need to be fixed before uploading. `;
      
      if (results.summary.missingStudents > 0) {
        explanation += `${results.summary.missingStudents} enrollment number(s) in the file don't match any students in the selected class. Please check that you're uploading the correct file for this class, and verify the enrollment numbers are typed correctly. `;
      }
      
      if (results.summary.invalidData > 0) {
        explanation += `${results.summary.invalidData} record(s) have invalid attendance status values. Please use only: present, absent, late, excused, or leave. `;
      }
      
      if (results.summary.duplicateRecords > 0) {
        explanation += `${results.summary.duplicateRecords} enrollment number(s) appear multiple times in your file. Each student should only appear once. `;
      }
      
      explanation += `\n\nPlease download the file, fix these issues, and upload again. Check the error details below to see exactly which rows need correction.`;
    } else if (results.warnings.length > 0) {
      explanation = `⚠️ Your file is valid, but we noticed that ${missingFromUpload.length} student(s) from the class are not included in your upload. `;
      explanation += `The class has ${students.length} total students, but your file only contains ${results.valid.length}. `;
      explanation += `This is okay if you intentionally want to mark attendance only for these students, but if you meant to upload attendance for all students, please add the missing students to your file. You can proceed with the upload if this is intentional.`;
    }
    
    results.summary.explanation = explanation;

    return results;
  }

  /**
   * Validate bulk marks data
   */
  static validateMarksData(parsedData, students, exam) {
    const results = {
      valid: [],
      errors: [],
      warnings: [],
      summary: {
        totalRows: parsedData.length,
        totalStudents: students.length,
        examTotalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        validRecords: 0,
        missingStudents: 0,
        invalidMarks: 0,
        duplicateRecords: 0,
        passCount: 0,
        failCount: 0,
        explanation: '' // Will be populated at the end
      },
      details: {
        missingEnrollmentNumbers: [],
        marksExceedTotal: [],
        invalidMarkFormat: [],
        duplicateStudents: new Set()
      }
    };

    const processedStudents = new Set();
    const studentsByEnrollment = new Map();

    students.forEach(s => {
      if (s.enrollmentNo) {
        studentsByEnrollment.set(String(s.enrollmentNo).toLowerCase().trim(), s);
      }
    });

    parsedData.forEach((row, rowIndex) => {
      const rowNum = rowIndex + 2;
      const rowErrors = [];

      // 1. Validate Enrollment Number
      const enrollmentNo = row['Enrollment No'] || row['Enrollment Number'] || row.enrollmentNo || row['enrollment_no'];
      if (!enrollmentNo) {
        rowErrors.push('❌ Missing enrollment number');
        results.details.missingEnrollmentNumbers.push({ row: rowNum, value: null });
        results.summary.missingStudents++;
      }

      const student = enrollmentNo 
        ? studentsByEnrollment.get(String(enrollmentNo).toLowerCase().trim())
        : null;

      if (!student && enrollmentNo) {
        rowErrors.push(`❌ Student with enrollment "${enrollmentNo}" not found`);
        results.details.missingEnrollmentNumbers.push({ row: rowNum, value: enrollmentNo });
        results.summary.missingStudents++;
      }

      // 2. Check for Duplicates
      if (student && processedStudents.has(student.id)) {
        rowErrors.push('❌ Duplicate: Student already in upload');
        results.summary.duplicateRecords++;
      }
      if (student) {
        processedStudents.add(student.id);
      }

      // 3. Validate Status
      const status = (row.Status || row.status || 'present').toLowerCase().trim();
      const validStatuses = ['present', 'absent', 'exempted', 'submitted'];
      if (!validStatuses.includes(status)) {
        rowErrors.push(`❌ Invalid status "${status}". Use: ${validStatuses.join(', ')}`);
      }

      // 4. Validate Marks
      let marks = null;
      const marksStr = row['Marks Obtained'] || row['Marks'] || row.marksObtained || row.marks;
      
      if (status === 'present' || status === 'submitted') {
        if (!marksStr && marksStr !== 0 && marksStr !== '0') {
          rowErrors.push('❌ Missing marks for present student');
        } else if (marksStr === '') {
          rowErrors.push('❌ Marks field is empty for present student');
        } else {
          marks = parseFloat(marksStr);
          if (isNaN(marks)) {
            rowErrors.push(`❌ Invalid marks format: "${marksStr}" (must be numeric)`);
            results.details.invalidMarkFormat.push({ row: rowNum, value: marksStr });
            results.summary.invalidMarks++;
          } else if (marks < 0 || marks > exam.totalMarks) {
            rowErrors.push(`❌ Marks ${marks} exceed limit (0-${exam.totalMarks})`);
            results.details.marksExceedTotal.push({ 
              row: rowNum, 
              marks, 
              limit: exam.totalMarks 
            });
            results.summary.invalidMarks++;
          }
        }
      } else {
        marks = 0; // Absent/Exempted students get 0
      }

      // Add to results
      if (rowErrors.length === 0 && student && marks !== null) {
        const willPass = marks >= exam.passingMarks;
        
        results.valid.push({
          rowNum,
          studentId: student.id,
          enrollmentNo: student.enrollmentNo,
          studentName: student.name,
          marksObtained: marks,
          status,
          remarks: row.Remarks || row.remarks || '',
          percentage: (marks / exam.totalMarks * 100).toFixed(2),
          willPass
        });
        results.summary.validRecords++;
        if (willPass) results.summary.passCount++;
        else results.summary.failCount++;
      } else if (rowErrors.length > 0) {
        results.errors.push({
          rowNum,
          enrollmentNo: enrollmentNo || 'N/A',
          studentName: row['Student Name'] || row.studentName || row.name || 'N/A',
          errors: rowErrors
        });
      }
    });

    // Check for missing students
    const uploadedEnrollments = new Set(
      results.valid.map(v => v.enrollmentNo.toLowerCase().trim())
    );
    const missingFromUpload = students.filter(
      s => !uploadedEnrollments.has(String(s.enrollmentNo).toLowerCase().trim())
    );

    if (missingFromUpload.length > 0) {
      results.warnings.push({
        type: 'MISSING_STUDENTS',
        message: `⚠️ ${missingFromUpload.length} student(s) not in uploaded file (Class has ${students.length} total)`,
        students: missingFromUpload.slice(0, 20).map(s => ({ 
          id: s.id, 
          enrollmentNo: s.enrollmentNo, 
          name: s.name 
        })),
        moreCount: missingFromUpload.length > 20 ? missingFromUpload.length - 20 : 0
      });
    }

    // Generate a comprehensive, conversational explanation for MARKS
    let explanation = '';
    if (results.errors.length === 0 && results.warnings.length === 0) {
      explanation = `✅ Excellent! Your marks file is perfect and ready to upload. All ${results.valid.length} student records have valid data. Out of ${exam.totalMarks} total marks, ${results.summary.passCount} students will pass (scored ${exam.passingMarks}+ marks) and ${results.summary.failCount} will not pass the exam. All enrollment numbers match students in the class, and marks are within the valid range.`;
    } else if (results.errors.length > 0) {
      explanation = `❌ Your marks file has some problems that must be corrected before uploading. `;
      
      if (results.summary.missingStudents > 0) {
        explanation += `${results.summary.missingStudents} enrollment number(s) in your file don't match any students in this class. Make sure you're uploading marks for the correct class and that enrollment numbers are spelled exactly as they appear in the system. `;
      }
      
      if (results.summary.invalidMarks > 0) {
        explanation += `${results.summary.invalidMarks} record(s) have invalid marks - either the marks are not numbers, or they exceed the exam's total marks of ${exam.totalMarks}. All marks must be between 0 and ${exam.totalMarks}. `;
      }
      
      if (results.summary.duplicateRecords > 0) {
        explanation += `${results.summary.duplicateRecords} student(s) appear more than once in your file. Each student should have only one marks entry in the file. `;
      }
      
      explanation += `\n\nPlease fix these errors in your Excel/CSV file and upload again. See the detailed error list below to identify which specific rows need correction.`;
    } else if (results.warnings.length > 0) {
      explanation = `⚠️ Your marks data is valid, but ${missingFromUpload.length} student(s) from the class are missing from your file. `;
      explanation += `The class has ${students.length} total students, but you're only uploading marks for ${results.valid.length} students. `;
      explanation += `If this is a makeup exam or you're only entering marks for specific students, you can proceed. Otherwise, please add the missing students to ensure everyone's marks are recorded. Note: ${results.summary.passCount} students will pass, ${results.summary.failCount} will not pass.`;
    }
    
    results.summary.explanation = explanation;

    return results;
  }

  /**
   * Validate bulk student data
   */
  static validateStudentData(parsedData, existingEnrollments = []) {
    const results = {
      valid: [],
      errors: [],
      warnings: [],
      summary: {
        totalRows: parsedData.length,
        validRecords: 0,
        missingRequired: 0,
        duplicateEnrollments: 0,
        alreadyExists: 0,
        explanation: '' // Will be populated at the end
      },
      details: {
        duplicateInFile: new Set(),
        duplicateInSystem: [],
        missingFields: []
      }
    };

    const processedEnrollments = new Set(existingEnrollments.map(e => String(e).toLowerCase().trim()));
    const enrollmentsInFile = new Set();

    parsedData.forEach((row, rowIndex) => {
      const rowNum = rowIndex + 2;
      const rowErrors = [];

      // Required fields
      const name = row.Name || row.name;
      const enrollmentNo = row['Enrollment No'] || row.enrollmentNo || row['enrollment_no'];

      if (!name) {
        rowErrors.push('❌ Missing student name');
        results.details.missingFields.push({ row: rowNum, field: 'Name' });
        results.summary.missingRequired++;
      }

      if (!enrollmentNo) {
        rowErrors.push('❌ Missing enrollment number');
        results.details.missingFields.push({ row: rowNum, field: 'Enrollment No' });
        results.summary.missingRequired++;
      }

      // Check duplicates in file
      if (enrollmentNo) {
        const enrollLower = String(enrollmentNo).toLowerCase().trim();
        if (enrollmentsInFile.has(enrollLower)) {
          rowErrors.push('❌ Enrollment number already in this file');
          results.details.duplicateInFile.add(enrollmentNo);
          results.summary.duplicateEnrollments++;
        }
        enrollmentsInFile.add(enrollLower);

        // Check if already exists in system
        if (processedEnrollments.has(enrollLower)) {
          rowErrors.push('❌ Student with this enrollment already exists in system');
          results.details.duplicateInSystem.push(enrollmentNo);
          results.summary.alreadyExists++;
        }
      }

      if (rowErrors.length === 0 && name && enrollmentNo) {
        results.valid.push({
          rowNum,
          name,
          enrollmentNo,
          dateOfBirth: row.DOB || row.dateOfBirth || row.dob || null,
          gender: row.Gender || row.gender || null,
          contact: row.Contact || row.contact || row['Contact Number'] || null,
          email: row.Email || row.email || null,
          address: row.Address || row.address || null,
          parentName: row['Parent Name'] || row.parentName || row['parent_name'] || null,
          parentContact: row['Parent Contact'] || row.parentContact || row['parent_contact'] || null,
          parentEmail: row['Parent Email'] || row.parentEmail || row['parent_email'] || null
        });
        results.summary.validRecords++;
      } else if (rowErrors.length > 0) {
        results.errors.push({
          rowNum,
          name: name || 'N/A',
          enrollmentNo: enrollmentNo || 'N/A',
          errors: rowErrors
        });
      }
    });

    // Generate a comprehensive, conversational explanation for STUDENT DATA
    let explanation = '';
    if (results.errors.length === 0) {
      explanation = `✅ Perfect! Your student data file is ready to upload. All ${results.valid.length} student records are properly formatted with required information (name and enrollment number). These students will be added to the system successfully.`;
    } else {
      explanation = `❌ Your student data file has issues that need to be fixed before you can add these students. `;
      
      if (results.summary.missingRequired > 0) {
        explanation += `${results.summary.missingRequired} record(s) are missing required information (student name or enrollment number). Every student must have both a name and a unique enrollment number. `;
      }
      
      if (results.summary.duplicateEnrollments > 0) {
        explanation += `${results.summary.duplicateEnrollments} enrollment number(s) appear multiple times in your file. Each student needs a unique enrollment number - please check for duplicate entries. `;
      }
      
      if (results.summary.alreadyExists > 0) {
        explanation += `${results.summary.alreadyExists} enrollment number(s) already exist in the system. These students are already registered, so they cannot be added again. Please remove them from your file or update their enrollment numbers. `;
      }
      
      explanation += `\n\nPlease correct these issues in your Excel file and try uploading again. Check the detailed errors below to see exactly which rows need fixing.`;
    }
    
    results.summary.explanation = explanation;

    return results;
  }

  /**
   * Format validation results for display
   */
  static getSimpleSummary(validationResults, type = 'attendance') {
    const { summary, errors, warnings, valid } = validationResults;
    
    const lines = [];
    lines.push(`Total: ${summary.totalRows} | Valid: ${valid.length} | Errors: ${errors.length}`);
    
    if (type === 'marks' && valid.length > 0) {
      lines.push(`Pass: ${summary.passCount} | Fail: ${summary.failCount}`);
    }
    
    if (errors.length > 0) {
      lines.push(`Error: Check details below`);
    }
    
    if (warnings.length > 0) {
      lines.push(`Warning: ${warnings[0].message}`);
    }
    
    return lines.join(' | ');
  }
}

export default BulkUploadValidationService;
