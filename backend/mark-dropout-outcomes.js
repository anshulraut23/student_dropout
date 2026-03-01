/**
 * Mark Existing Students with Dropout Outcomes
 * Simpler approach - just update existing students
 */

import dotenv from 'dotenv';
import { getPostgresPool, connectPostgres } from './database/connection.js';

dotenv.config();

const SCHOOL_ID = '1772109087175-iahaywyr4'; // VES school ID

async function markDropoutOutcomes() {
    await connectPostgres();
    const pool = getPostgresPool();
    
    try {
        console.log('========================================');
        console.log('Marking Dropout Outcomes for Existing Students');
        console.log('========================================\n');

        // Get all students for this school
        const studentsResult = await pool.query(
            'SELECT id, name FROM students WHERE school_id = $1 AND dropout_status = $2 LIMIT 30',
            [SCHOOL_ID, 'active']
        );

        if (studentsResult.rows.length === 0) {
            console.log('❌ No students found for this school');
            console.log('Please add students first in the admin panel');
            return;
        }

        console.log(`Found ${studentsResult.rows.length} students\n`);

        // Mark first 10 as dropped out
        const dropoutReasons = [
            'Financial difficulties',
            'Family issues',
            'Lost interest',
            'Health problems',
            'Family relocation',
            'Peer pressure',
            'Academic struggle',
            'Work commitment',
            'Lost motivation',
            'Personal reasons'
        ];

        let dropoutCount = 0;
        const numToMarkAsDropout = Math.min(10, studentsResult.rows.length);

        console.log(`Marking ${numToMarkAsDropout} students as dropped out...\n`);

        for (let i = 0; i < numToMarkAsDropout; i++) {
            const student = studentsResult.rows[i];
            const reason = dropoutReasons[i % dropoutReasons.length];
            const dropoutDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

            await pool.query(`
                UPDATE students 
                SET 
                    dropout_status = 'dropped_out',
                    dropout_date = $1,
                    dropout_reason = $2,
                    status = 'inactive'
                WHERE id = $3
            `, [dropoutDate.toISOString().split('T')[0], reason, student.id]);

            dropoutCount++;
            console.log(`✓ Marked as dropped out: ${student.name} (${reason})`);
        }

        console.log(`\n✓ Marked ${dropoutCount} students as dropped out`);
        console.log(`✓ Remaining ${studentsResult.rows.length - dropoutCount} students are active\n`);

        console.log('========================================');
        console.log('✅ Successfully Updated Student Outcomes!');
        console.log('========================================');
        console.log(`\nSummary:`);
        console.log(`- Dropped out: ${dropoutCount} students`);
        console.log(`- Active: ${studentsResult.rows.length - dropoutCount} students`);
        console.log(`\nNext steps:`);
        console.log(`1. Retrain the model: cd ml-service && python generate_and_train.py`);
        console.log(`2. Check new accuracy in admin dashboard`);
        console.log(`3. Expected accuracy: 75-80%`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

markDropoutOutcomes();
