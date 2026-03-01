/**
 * Add 30 Realistic Students with Dropout Outcomes
 * For VES College (ves@gmail.com)
 * 
 * This creates:
 * - 10 students who dropped out (with realistic risk patterns)
 * - 20 students who stayed (with good/mixed patterns)
 * - Complete attendance, marks, and behavior data for each
 */

import dotenv from 'dotenv';
import { getPostgresPool, connectPostgres } from './database/connection.js';

dotenv.config();

const SCHOOL_ID = '1772109087175-iahaywyr4'; // VES school ID
const CLASS_ID = '1772109087206-class1'; // You'll need to get actual class ID

// Realistic student names
const DROPOUT_STUDENTS = [
    { name: 'Rahul Sharma', reason: 'Financial difficulties', pattern: 'poor_attendance' },
    { name: 'Priya Patel', reason: 'Family issues', pattern: 'declining_marks' },
    { name: 'Amit Kumar', reason: 'Lost interest', pattern: 'behavior_issues' },
    { name: 'Sneha Reddy', reason: 'Health problems', pattern: 'poor_attendance' },
    { name: 'Vikram Singh', reason: 'Financial difficulties', pattern: 'poor_all' },
    { name: 'Anjali Desai', reason: 'Family relocation', pattern: 'sudden_drop' },
    { name: 'Rohan Mehta', reason: 'Peer pressure', pattern: 'behavior_issues' },
    { name: 'Kavita Joshi', reason: 'Academic struggle', pattern: 'declining_marks' },
    { name: 'Sanjay Verma', reason: 'Work commitment', pattern: 'poor_attendance' },
    { name: 'Neha Gupta', reason: 'Lost motivation', pattern: 'poor_all' }
];

const ACTIVE_STUDENTS = [
    { name: 'Arjun Nair', pattern: 'excellent' },
    { name: 'Divya Iyer', pattern: 'excellent' },
    { name: 'Karthik Rao', pattern: 'good' },
    { name: 'Meera Pillai', pattern: 'good' },
    { name: 'Aditya Menon', pattern: 'good' },
    { name: 'Pooja Krishnan', pattern: 'average' },
    { name: 'Ravi Bhat', pattern: 'average' },
    { name: 'Shreya Hegde', pattern: 'average' },
    { name: 'Nikhil Shetty', pattern: 'average' },
    { name: 'Ananya Kamath', pattern: 'good' },
    { name: 'Varun Pai', pattern: 'excellent' },
    { name: 'Lakshmi Acharya', pattern: 'good' },
    { name: 'Suresh Kulkarni', pattern: 'average' },
    { name: 'Deepa Naik', pattern: 'good' },
    { name: 'Ganesh Prabhu', pattern: 'average' },
    { name: 'Radha Shenoy', pattern: 'excellent' },
    { name: 'Prakash Amin', pattern: 'good' },
    { name: 'Sunita Bhandary', pattern: 'average' },
    { name: 'Mahesh Kini', pattern: 'good' },
    { name: 'Vidya Nayak', pattern: 'excellent' }
];

function generateAttendancePattern(pattern, totalDays = 60) {
    const patterns = {
        excellent: { presentRate: 0.95, trend: 'stable' },
        good: { presentRate: 0.85, trend: 'stable' },
        average: { presentRate: 0.75, trend: 'stable' },
        poor_attendance: { presentRate: 0.55, trend: 'declining' },
        declining_marks: { presentRate: 0.80, trend: 'stable' },
        behavior_issues: { presentRate: 0.75, trend: 'stable' },
        poor_all: { presentRate: 0.50, trend: 'declining' },
        sudden_drop: { presentRate: 0.85, trend: 'sudden_decline' }
    };

    const config = patterns[pattern] || patterns.average;
    const attendance = [];
    
    for (let i = 0; i < totalDays; i++) {
        let presentProb = config.presentRate;
        
        // Apply trend
        if (config.trend === 'declining') {
            presentProb -= (i / totalDays) * 0.3;
        } else if (config.trend === 'sudden_decline' && i > totalDays * 0.7) {
            presentProb -= 0.4;
        }
        
        attendance.push(Math.random() < presentProb ? 'present' : 'absent');
    }
    
    return attendance;
}

function generateMarksPattern(pattern, numExams = 4) {
    const patterns = {
        excellent: { base: 85, variance: 5, trend: 0 },
        good: { base: 70, variance: 8, trend: 0 },
        average: { base: 55, variance: 10, trend: 0 },
        poor_attendance: { base: 60, variance: 12, trend: -2 },
        declining_marks: { base: 70, variance: 8, trend: -5 },
        behavior_issues: { base: 65, variance: 10, trend: -1 },
        poor_all: { base: 45, variance: 10, trend: -3 },
        sudden_drop: { base: 75, variance: 8, trend: -8 }
    };

    const config = patterns[pattern] || patterns.average;
    const marks = [];
    
    for (let i = 0; i < numExams; i++) {
        const trendEffect = config.trend * i;
        const mark = Math.max(0, Math.min(100, 
            config.base + trendEffect + (Math.random() - 0.5) * config.variance * 2
        ));
        marks.push(Math.round(mark));
    }
    
    return marks;
}

function generateBehaviorPattern(pattern, numIncidents = 8) {
    const patterns = {
        excellent: { positive: 0.9, negative: 0.1 },
        good: { positive: 0.7, negative: 0.3 },
        average: { positive: 0.5, negative: 0.5 },
        poor_attendance: { positive: 0.4, negative: 0.6 },
        declining_marks: { positive: 0.5, negative: 0.5 },
        behavior_issues: { positive: 0.2, negative: 0.8 },
        poor_all: { positive: 0.2, negative: 0.8 },
        sudden_drop: { positive: 0.6, negative: 0.4 }
    };

    const config = patterns[pattern] || patterns.average;
    const incidents = [];
    
    for (let i = 0; i < numIncidents; i++) {
        const isPositive = Math.random() < config.positive;
        incidents.push({
            type: isPositive ? 'positive' : 'negative',
            category: isPositive ? 
                ['participation', 'helpfulness', 'leadership'][Math.floor(Math.random() * 3)] :
                ['disruption', 'absence', 'incomplete_work'][Math.floor(Math.random() * 3)],
            severity: isPositive ? 'low' : ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        });
    }
    
    return incidents;
}

async function addRealisticData() {
    // Initialize database connection
    await connectPostgres();
    const pool = getPostgresPool();
    
    try {
        console.log('========================================');
        console.log('Adding 30 Realistic Students with Dropout Data');
        console.log('========================================\n');

        // Get actual class ID
        const classResult = await pool.query(
            'SELECT id FROM classes WHERE school_id = $1 LIMIT 1',
            [SCHOOL_ID]
        );
        
        if (classResult.rows.length === 0) {
            console.error('❌ No class found for this school');
            console.log('Please create a class first in the admin panel');
            return;
        }
        
        const classId = classResult.rows[0].id;
        console.log(`✓ Using class ID: ${classId}\n`);

        // Create 4 exams for the class
        console.log('Creating exams...');
        const examIds = [];
        const examNames = ['Unit Test 1', 'Mid-Term', 'Unit Test 2', 'Final Exam'];
        
        for (let i = 0; i < 4; i++) {
            const examId = `${Date.now()}-exam-${i + 1}`;
            await pool.query(`
                INSERT INTO exams (
                    id, name, type, class_id, school_id, total_marks, passing_marks, status
                ) VALUES ($1, $2, 'unit_test', $3, $4, 100, 40, 'completed')
            `, [examId, examNames[i], classId, SCHOOL_ID]);
            examIds.push(examId);
        }
        console.log(`✓ Created ${examIds.length} exams\n`);

        let dropoutCount = 0;
        let activeCount = 0;

        // Add dropout students
        console.log('Adding 10 students who dropped out...\n');
        const timestamp = Date.now();
        for (const student of DROPOUT_STUDENTS) {
            const studentId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Create student
            await pool.query(`
                INSERT INTO students (
                    id, school_id, class_id, name, roll_number, 
                    enrollment_no, status, dropout_status, dropout_date, dropout_reason
                ) VALUES ($1, $2, $3, $4, $5, $6, 'inactive', 'dropped_out', $7, $8)
            `, [
                studentId,
                SCHOOL_ID,
                classId,
                student.name,
                `ROLL${timestamp}-${1000 + dropoutCount}`,
                `ENR${timestamp}-${1000 + dropoutCount}`,
                new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Dropped out in last 90 days
                student.reason
            ]);

            // Add attendance data
            const attendance = generateAttendancePattern(student.pattern);
            const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            
            for (let i = 0; i < attendance.length; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                
                await pool.query(`
                    INSERT INTO attendance (
                        id, student_id, class_id, date, status
                    ) VALUES ($1, $2, $3, $4, $5)
                `, [
                    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    studentId,
                    classId,
                    date.toISOString().split('T')[0],
                    attendance[i]
                ]);
            }

            // Add marks data
            const marks = generateMarksPattern(student.pattern);
            for (let i = 0; i < marks.length; i++) {
                await pool.query(`
                    INSERT INTO marks (
                        id, exam_id, student_id, class_id, marks_obtained, percentage, status
                    ) VALUES ($1, $2, $3, $4, $5, $6, 'submitted')
                `, [
                    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    examIds[i],
                    studentId,
                    classId,
                    marks[i],
                    marks[i]
                ]);
            }

            // Add behavior data
            const behaviors = generateBehaviorPattern(student.pattern);
            for (const behavior of behaviors) {
                await pool.query(`
                    INSERT INTO behavior (
                        id, student_id, teacher_id, date, behavior_type, 
                        category, severity, description
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [
                    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    studentId,
                    '1772109087206-zuznqsm7s', // Admin user ID
                    new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    behavior.type,
                    behavior.category,
                    behavior.severity,
                    `${behavior.type} behavior: ${behavior.category}`
                ]);
            }

            dropoutCount++;
            console.log(`✓ Added dropout student: ${student.name} (${student.reason})`);
        }

        console.log(`\n✓ Added ${dropoutCount} dropout students\n`);

        // Add active students
        console.log('Adding 20 active students...\n');
        for (const student of ACTIVE_STUDENTS) {
            const studentId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Create student
            await pool.query(`
                INSERT INTO students (
                    id, school_id, class_id, name, roll_number, 
                    enrollment_no, status, dropout_status
                ) VALUES ($1, $2, $3, $4, $5, $6, 'active', 'active')
            `, [
                studentId,
                SCHOOL_ID,
                classId,
                student.name,
                `ROLL${timestamp}-${2000 + activeCount}`,
                `ENR${timestamp}-${2000 + activeCount}`
            ]);

            // Add attendance, marks, and behavior (similar to above)
            const attendance = generateAttendancePattern(student.pattern);
            const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            
            for (let i = 0; i < attendance.length; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                
                await pool.query(`
                    INSERT INTO attendance (
                        id, student_id, class_id, date, status
                    ) VALUES ($1, $2, $3, $4, $5)
                `, [
                    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    studentId,
                    classId,
                    date.toISOString().split('T')[0],
                    attendance[i]
                ]);
            }

            const marks = generateMarksPattern(student.pattern);
            for (let i = 0; i < marks.length; i++) {
                await pool.query(`
                    INSERT INTO marks (
                        id, exam_id, student_id, class_id, marks_obtained, percentage, status
                    ) VALUES ($1, $2, $3, $4, $5, $6, 'submitted')
                `, [
                    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    examIds[i],
                    studentId,
                    classId,
                    marks[i],
                    marks[i]
                ]);
            }

            const behaviors = generateBehaviorPattern(student.pattern);
            for (const behavior of behaviors) {
                await pool.query(`
                    INSERT INTO behavior (
                        id, student_id, teacher_id, date, behavior_type, 
                        category, severity, description
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [
                    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    studentId,
                    '1772109087206-zuznqsm7s',
                    new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    behavior.type,
                    behavior.category,
                    behavior.severity,
                    `${behavior.type} behavior: ${behavior.category}`
                ]);
            }

            activeCount++;
            console.log(`✓ Added active student: ${student.name} (${student.pattern})`);
        }

        console.log(`\n✓ Added ${activeCount} active students\n`);

        console.log('========================================');
        console.log('✅ Successfully Added 30 Students!');
        console.log('========================================');
        console.log(`\nSummary:`);
        console.log(`- Dropped out: ${dropoutCount} students`);
        console.log(`- Active: ${activeCount} students`);
        console.log(`- Total: ${dropoutCount + activeCount} students`);
        console.log(`\nEach student has:`);
        console.log(`- 60 days of attendance data`);
        console.log(`- 4 exam results`);
        console.log(`- 8 behavior incidents`);
        console.log(`\nNext steps:`);
        console.log(`1. Retrain the model: cd ml-service && python generate_and_train.py`);
        console.log(`2. Check new accuracy in admin dashboard`);
        console.log(`3. Expected accuracy: 75-80%`);

    } catch (error) {
        console.error('❌ Error adding data:', error);
        console.error(error.stack);
    } finally {
        await pool.end();
    }
}

addRealisticData();
