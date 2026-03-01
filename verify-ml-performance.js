/**
 * Verify ML Performance Data in Database
 * Quick script to check if performance metrics were saved
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzcyMTA5MDg3MjA2LXp1em5xc203cyIsImVtYWlsIjoidmVzQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInNjaG9vbElkIjoiMTc3MjEwOTA4NzE3NS1pYWhheXd5cjQiLCJpYXQiOjE3NzIzMzE0NzUsImV4cCI6MTc3MjkzNjI3NX0.Flcger1QOyfuNZnBZ_usuiTRTJX6UlPtRLKpi6SqVoM';

async function verifyPerformanceData() {
    try {
        console.log('========================================');
        console.log('Verifying ML Performance Data');
        console.log('========================================\n');

        console.log('Fetching performance history from database...');
        
        const response = await axios.get(
            `${BACKEND_URL}/api/dropout/model-performance`,
            {
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`
                }
            }
        );

        if (response.data.success) {
            const history = response.data.performance_history;
            
            console.log(`✅ Success! Found ${history.length} performance record(s)\n`);
            
            if (history.length > 0) {
                console.log('Latest Model Performance:');
                console.log('========================================');
                const latest = history[0];
                console.log(`Model Version:    ${latest.model_version}`);
                console.log(`Training Date:    ${new Date(latest.training_date).toLocaleString()}`);
                console.log(`Training Samples: ${latest.training_samples}`);
                console.log(`Test Samples:     ${latest.test_samples}`);
                console.log('');
                console.log('Metrics:');
                console.log(`  Accuracy:       ${(latest.accuracy * 100).toFixed(2)}%`);
                console.log(`  Precision:      ${(latest.precision_score * 100).toFixed(2)}%`);
                console.log(`  Recall:         ${(latest.recall_score * 100).toFixed(2)}%`);
                console.log(`  F1-Score:       ${(latest.f1_score * 100).toFixed(2)}%`);
                console.log('');
                console.log('Confusion Matrix:');
                const cm = latest.confusion_matrix;
                console.log(`  True Negatives:  ${cm.true_negatives}`);
                console.log(`  False Positives: ${cm.false_positives}`);
                console.log(`  False Negatives: ${cm.false_negatives}`);
                console.log(`  True Positives:  ${cm.true_positives}`);
                console.log('========================================\n');
                
                console.log('✅ Data is ready to view in admin dashboard!');
                console.log('   Navigate to: http://localhost:3000/admin/model-performance\n');
            } else {
                console.log('⚠️  No performance records found in database');
            }
        } else {
            console.log('❌ Failed to fetch performance data');
            console.log(`   Error: ${response.data.error || 'Unknown error'}`);
        }

    } catch (error) {
        console.log('❌ Error verifying performance data');
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Message: ${error.response.data.error || error.response.statusText}`);
        } else if (error.request) {
            console.log('   Backend server is not responding');
            console.log('   Make sure backend is running: cd backend && npm start');
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }
}

verifyPerformanceData();
