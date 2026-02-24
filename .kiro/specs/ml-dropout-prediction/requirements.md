# Requirements Document: Smart Automated Dropout Prediction System

## Introduction

The Smart Automated Dropout Prediction System is an ML-powered early warning system that automatically predicts student dropout risk using a microservices architecture. The system combines a Node.js backend for data engineering and orchestration with a Python ML microservice for AI-powered predictions and explainable recommendations. It operates autonomously through scheduled batch processing while also responding to critical real-time events, providing educators with actionable insights to intervene before students drop out.

## Glossary

- **Dropout_Prediction_System**: The complete ML-powered early warning system including both Node.js and Python microservices
- **Node_Backend**: The Node.js service responsible for feature extraction, data validation, and API orchestration
- **ML_Microservice**: The Python FastAPI service responsible for risk prediction, SHAP explanations, and LLM recommendations
- **Risk_Score**: A numerical value from 0-100 representing the probability of student dropout
- **Data_Tier**: A classification (0-3) indicating the sufficiency and confidence level of available student data
- **Feature_Vector**: A structured set of numerical values extracted from student data for ML model input
- **SHAP_Value**: SHapley Additive exPlanations value indicating feature contribution to prediction
- **Batch_Processing**: Scheduled automated analysis of all students at predetermined times
- **Real_Time_Trigger**: Immediate prediction triggered by critical events (high-severity behavior, consecutive absences)
- **Marked_Day**: A day where attendance was explicitly recorded (present, late, or absent)
- **Finalized_Exam**: An exam with status 'submitted' or 'verified' in the database
- **Risk_Level**: Categorical classification: Low (0-25%), Medium (25-50%), High (50-75%), Critical (75-100%)
- **Intervention_History**: Record of past interventions and their outcomes for a student
- **Trend_Analysis**: Calculation of improving or declining patterns in student metrics over time
- **Model_Retraining**: Process of updating the ML model with new historical data
- **Confidence_Indicator**: Visual UI element showing data completeness and prediction reliability

## Requirements

### Requirement 1: Microservices Architecture

**User Story:** As a system architect, I want a microservices architecture separating data engineering from ML processing, so that each service can scale and evolve independently.

#### Acceptance Criteria

1. THE Node_Backend SHALL expose RESTful APIs for feature extraction, data validation, and prediction orchestration
2. THE ML_Microservice SHALL expose FastAPI endpoints for risk prediction, SHAP explanations, and model retraining
3. WHEN the Node_Backend receives a prediction request, THE Node_Backend SHALL extract features, validate data tier, and forward to ML_Microservice
4. WHEN the ML_Microservice receives a feature vector, THE ML_Microservice SHALL return risk score, SHAP values, and confidence level within 2 seconds
5. THE Node_Backend SHALL handle all database interactions with PostgreSQL/Supabase
6. THE ML_Microservice SHALL maintain no direct database connections

### Requirement 2: Automated Batch Processing

**User Story:** As a school administrator, I want automated nightly analysis of all students, so that risk assessments stay current without manual intervention.

#### Acceptance Criteria

1. THE Node_Backend SHALL execute batch processing for all active students at 2:00 AM daily
2. THE Node_Backend SHALL execute deep analysis batch processing at 11:00 PM every Sunday
3. WHEN batch processing starts, THE Node_Backend SHALL extract features for all students with Data_Tier >= 1
4. WHEN batch processing completes, THE Node_Backend SHALL store Risk_Score and timestamp in the database
5. IF batch processing fails for any student, THEN THE Node_Backend SHALL log the error and continue processing remaining students
6. THE Node_Backend SHALL send summary notification to administrators after batch completion showing total students analyzed and high-risk count

### Requirement 3: Real-Time Event Triggers

**User Story:** As a teacher, I want immediate risk assessment when critical events occur, so that I can intervene quickly for at-risk students.

#### Acceptance Criteria

1. WHEN a behavior incident with severity 'high' or 'critical' is recorded, THE Dropout_Prediction_System SHALL trigger immediate risk prediction for that student
2. WHEN a student has 3 consecutive absences, THE Dropout_Prediction_System SHALL trigger immediate risk prediction for that student
3. WHEN a real-time trigger occurs, THE Node_Backend SHALL check Data_Tier before prediction
4. IF Data_Tier is 0 during real-time trigger, THEN THE Node_Backend SHALL skip prediction and log insufficient data
5. WHEN real-time prediction completes, THE Node_Backend SHALL send notification to assigned teachers with updated Risk_Score

### Requirement 4: Data Sufficiency Tier System

**User Story:** As a data scientist, I want a tier system that prevents predictions on insufficient data, so that educators receive reliable risk assessments.

#### Acceptance Criteria

1. THE Node_Backend SHALL calculate Data_Tier as 0 when attendance_marked_days < 14 OR finalized_exam_count < 1
2. THE Node_Backend SHALL calculate Data_Tier as 1 when attendance_marked_days >= 14 AND attendance_marked_days < 30 AND finalized_exam_count >= 1 AND finalized_exam_count < 3
3. THE Node_Backend SHALL calculate Data_Tier as 2 when attendance_marked_days >= 30 AND attendance_marked_days < 60 AND finalized_exam_count >= 3 AND finalized_exam_count < 5
4. THE Node_Backend SHALL calculate Data_Tier as 3 when attendance_marked_days >= 60 AND finalized_exam_count >= 5
5. WHEN Data_Tier is 0, THE Node_Backend SHALL not request prediction from ML_Microservice
6. WHEN Data_Tier is 1, THE Node_Backend SHALL include low_confidence flag in prediction response
7. THE Node_Backend SHALL store Data_Tier value with each prediction record

### Requirement 5: Attendance Feature Extraction

**User Story:** As a data engineer, I want accurate attendance rate calculation that handles missing data correctly, so that predictions are not biased by unmarked days.

#### Acceptance Criteria

1. THE Node_Backend SHALL calculate attendance_rate as (present_count + late_count) / marked_days_count
2. THE Node_Backend SHALL exclude days with no attendance record from marked_days_count
3. THE Node_Backend SHALL never treat unmarked days as absences
4. WHEN marked_days_count is 0, THE Node_Backend SHALL set attendance_rate to NULL
5. THE Node_Backend SHALL calculate attendance_trend as (recent_30_day_rate - previous_30_day_rate)
6. THE Node_Backend SHALL extract consecutive_absences as the maximum streak of consecutive absent days
7. THE Node_Backend SHALL extract late_arrival_frequency as late_count / marked_days_count

### Requirement 6: Academic Performance Feature Extraction

**User Story:** As a data engineer, I want accurate academic metrics that only use finalized exam data, so that predictions reflect verified performance.

#### Acceptance Criteria

1. THE Node_Backend SHALL calculate average_score using only exams with status 'submitted' OR status 'verified'
2. THE Node_Backend SHALL exclude exams with NULL marks from average_score calculation
3. THE Node_Backend SHALL never treat missing exam marks as zero
4. WHEN finalized_exam_count is 0, THE Node_Backend SHALL set average_score to NULL
5. THE Node_Backend SHALL calculate academic_trend as (recent_3_exam_average - previous_3_exam_average)
6. THE Node_Backend SHALL extract failing_subject_count as count of subjects where average < passing_threshold
7. THE Node_Backend SHALL calculate score_variance as standard deviation of finalized exam scores

### Requirement 7: Behavior Feature Extraction

**User Story:** As a data engineer, I want behavior metrics that treat no incidents as positive signals, so that well-behaved students are not penalized.

#### Acceptance Criteria

1. WHEN behavior_incident_count is 0, THE Node_Backend SHALL set behavior_score to 100
2. THE Node_Backend SHALL calculate behavior_score as 100 - (minor_incidents * 5 + moderate_incidents * 15 + high_incidents * 30 + critical_incidents * 50)
3. THE Node_Backend SHALL ensure behavior_score minimum value is 0
4. THE Node_Backend SHALL extract days_since_last_incident as current_date - most_recent_incident_date
5. WHEN no incidents exist, THE Node_Backend SHALL set days_since_last_incident to enrollment_duration_days
6. THE Node_Backend SHALL calculate behavior_trend as (recent_30_day_incident_count - previous_30_day_incident_count)

### Requirement 8: Intervention History Feature Extraction

**User Story:** As a data engineer, I want intervention effectiveness metrics, so that the model learns which interventions work.

#### Acceptance Criteria

1. THE Node_Backend SHALL extract total_intervention_count for each student
2. THE Node_Backend SHALL calculate intervention_success_rate as successful_interventions / total_interventions
3. WHEN total_intervention_count is 0, THE Node_Backend SHALL set intervention_success_rate to NULL
4. THE Node_Backend SHALL extract days_since_last_intervention as current_date - most_recent_intervention_date
5. THE Node_Backend SHALL calculate intervention_response_score based on metric improvements within 30 days post-intervention
6. THE Node_Backend SHALL extract active_intervention_count as count of interventions with status 'in_progress'

### Requirement 9: ML Model Risk Prediction

**User Story:** As a data scientist, I want a Random Forest or XGBoost model that produces calibrated risk scores, so that predictions are accurate and interpretable.

#### Acceptance Criteria

1. THE ML_Microservice SHALL accept Feature_Vector with minimum 15 features including attendance, academic, behavior, and intervention metrics
2. WHEN the ML_Microservice receives a Feature_Vector, THE ML_Microservice SHALL return Risk_Score between 0 and 100
3. THE ML_Microservice SHALL apply weighted scoring: 35% attendance features, 40% academic features, 15% behavior features, 10% intervention features
4. THE ML_Microservice SHALL return Risk_Level classification: 'low' (0-25), 'medium' (25-50), 'high' (50-75), 'critical' (75-100)
5. THE ML_Microservice SHALL include model_version in prediction response
6. THE ML_Microservice SHALL handle NULL feature values by using feature-specific imputation strategies

### Requirement 10: Explainable AI with SHAP

**User Story:** As a teacher, I want to understand why a student received a specific risk score, so that I can target interventions effectively.

#### Acceptance Criteria

1. THE ML_Microservice SHALL calculate SHAP_Value for each feature in the Feature_Vector
2. THE ML_Microservice SHALL return top 5 features with highest absolute SHAP_Value
3. THE ML_Microservice SHALL include feature_name, shap_value, and feature_actual_value for each top feature
4. THE ML_Microservice SHALL indicate whether each SHAP_Value increases or decreases risk
5. THE ML_Microservice SHALL format SHAP explanations as human-readable text (e.g., "Low attendance rate (65%) increases risk by 18 points")

### Requirement 11: LLM-Powered Recommendations

**User Story:** As a teacher, I want AI-generated intervention recommendations, so that I have actionable next steps for at-risk students.

#### Acceptance Criteria

1. WHEN Risk_Score >= 50, THE ML_Microservice SHALL generate personalized recommendations using Google Gemini LLM
2. THE ML_Microservice SHALL provide SHAP explanations and student context to the LLM
3. THE ML_Microservice SHALL return 3-5 specific, actionable recommendations
4. THE ML_Microservice SHALL prioritize recommendations based on highest SHAP_Value features
5. THE ML_Microservice SHALL include estimated intervention effort (low, medium, high) for each recommendation
6. IF LLM API fails, THEN THE ML_Microservice SHALL return rule-based recommendations as fallback

### Requirement 12: Model Retraining Pipeline

**User Story:** As a data scientist, I want to retrain the model with updated historical data, so that predictions improve over time.

#### Acceptance Criteria

1. THE ML_Microservice SHALL expose an admin-only endpoint for triggering model retraining
2. WHEN retraining is triggered, THE Node_Backend SHALL extract historical features for all students with known outcomes
3. THE ML_Microservice SHALL train on students who either dropped out OR completed at least one full academic year
4. THE ML_Microservice SHALL perform 5-fold cross-validation during training
5. THE ML_Microservice SHALL calculate and store model metrics: accuracy, precision, recall, F1-score, AUC-ROC
6. WHEN new model performance exceeds current model by 2% in F1-score, THE ML_Microservice SHALL replace the active model
7. THE ML_Microservice SHALL version all trained models with timestamp and performance metrics
8. IF retraining fails, THEN THE ML_Microservice SHALL retain the current model and log error details

### Requirement 13: Risk Badge UI Component

**User Story:** As a teacher, I want visual risk indicators on student lists, so that I can quickly identify at-risk students.

#### Acceptance Criteria

1. THE Risk_Badge component SHALL display color-coded badges: green (low), yellow (medium), orange (high), red (critical)
2. THE Risk_Badge component SHALL show Risk_Score percentage on hover
3. WHEN Data_Tier is 0, THE Risk_Badge component SHALL display "⏳ Gathering Data" with gray styling
4. WHEN Data_Tier is 1, THE Risk_Badge component SHALL display "⚠️" warning icon alongside risk badge
5. THE Risk_Badge component SHALL display last_updated timestamp on hover
6. THE Risk_Badge component SHALL be clickable to open detailed risk breakdown modal

### Requirement 14: Detailed Risk Breakdown View

**User Story:** As a teacher, I want a detailed breakdown of risk factors, so that I understand the complete picture for each student.

#### Acceptance Criteria

1. WHEN a Risk_Badge is clicked, THE Dropout_Prediction_System SHALL display a modal with complete risk analysis
2. THE modal SHALL display Risk_Score, Risk_Level, and Data_Tier with Confidence_Indicator
3. THE modal SHALL show top 5 SHAP explanations with visual bars indicating contribution magnitude
4. THE modal SHALL display trend indicators (↑ improving, ↓ declining, → stable) for attendance, academic, and behavior metrics
5. THE modal SHALL list LLM-generated recommendations with effort estimates
6. THE modal SHALL show historical Risk_Score chart for past 90 days
7. THE modal SHALL display data completeness metrics: marked_days_count, finalized_exam_count, behavior_incident_count

### Requirement 15: Teacher Notification System

**User Story:** As a teacher, I want notifications when students need attention, so that I can intervene proactively.

#### Acceptance Criteria

1. WHEN batch processing identifies Risk_Score >= 75, THE Node_Backend SHALL send notification to assigned teachers
2. WHEN real-time trigger produces Risk_Score increase >= 15 points, THE Node_Backend SHALL send immediate notification
3. WHEN Data_Tier is 0 for a student enrolled > 30 days, THE Node_Backend SHALL send data completeness reminder to teachers
4. THE notification SHALL include student_name, Risk_Score, Risk_Level, and top 3 risk factors
5. THE notification SHALL include deep link to detailed risk breakdown view
6. THE Node_Backend SHALL batch notifications to avoid overwhelming teachers (maximum 1 notification per student per day)

### Requirement 16: Admin Dashboard

**User Story:** As a school administrator, I want an overview dashboard of at-risk students, so that I can monitor school-wide trends.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display total student count by Risk_Level (low, medium, high, critical)
2. THE Admin_Dashboard SHALL show trend chart of at-risk student count over past 6 months
3. THE Admin_Dashboard SHALL list top 10 highest-risk students with Risk_Score and assigned teacher
4. THE Admin_Dashboard SHALL display average Risk_Score by grade level
5. THE Admin_Dashboard SHALL show model performance metrics: last_training_date, accuracy, F1_score
6. THE Admin_Dashboard SHALL provide "Trigger Retraining" button for authorized administrators
7. THE Admin_Dashboard SHALL display batch processing status: last_run_time, next_scheduled_run, students_analyzed

### Requirement 17: Data Privacy and Security

**User Story:** As a compliance officer, I want student risk data protected with appropriate access controls, so that privacy regulations are met.

#### Acceptance Criteria

1. THE Dropout_Prediction_System SHALL restrict risk data access to authenticated users with role 'teacher' OR role 'admin'
2. THE Node_Backend SHALL enforce that teachers can only view risk data for students in their assigned classes
3. THE Node_Backend SHALL log all risk data access with user_id, student_id, and timestamp
4. THE ML_Microservice SHALL require API key authentication for all prediction endpoints
5. THE Node_Backend SHALL encrypt Risk_Score and SHAP_Value data at rest in the database
6. THE Dropout_Prediction_System SHALL anonymize student data in model training datasets (remove names, IDs)

### Requirement 18: API Rate Limiting and Performance

**User Story:** As a system administrator, I want performance safeguards, so that the system remains responsive under load.

#### Acceptance Criteria

1. THE Node_Backend SHALL limit real-time prediction requests to 100 per minute per user
2. THE ML_Microservice SHALL process prediction requests within 2 seconds for 95th percentile
3. THE ML_Microservice SHALL queue requests when concurrent load exceeds 50 predictions
4. THE Node_Backend SHALL cache prediction results for 6 hours to reduce redundant ML calls
5. WHEN cache contains recent prediction (< 6 hours old) AND no new data exists, THE Node_Backend SHALL return cached result
6. THE ML_Microservice SHALL implement health check endpoint returning model status and response time

### Requirement 19: Error Handling and Resilience

**User Story:** As a system administrator, I want graceful error handling, so that temporary failures don't break the user experience.

#### Acceptance Criteria

1. IF the ML_Microservice is unavailable, THEN THE Node_Backend SHALL return cached prediction with stale_data flag
2. IF feature extraction fails for a student, THEN THE Node_Backend SHALL log error details and skip that student in batch processing
3. IF LLM API fails, THEN THE ML_Microservice SHALL return rule-based recommendations
4. WHEN the ML_Microservice returns error, THE Node_Backend SHALL retry up to 3 times with exponential backoff
5. THE Node_Backend SHALL send alert to administrators when ML_Microservice is unreachable for > 5 minutes
6. THE Dropout_Prediction_System SHALL display user-friendly error messages in UI without exposing technical details

### Requirement 20: Configuration and Monitoring

**User Story:** As a system administrator, I want configurable thresholds and monitoring, so that I can tune the system for our school's needs.

#### Acceptance Criteria

1. THE Node_Backend SHALL load configuration from environment variables: batch_schedule_time, risk_thresholds, feature_weights
2. THE Node_Backend SHALL expose metrics endpoint with: total_predictions_today, average_response_time, error_rate, cache_hit_rate
3. THE ML_Microservice SHALL expose metrics endpoint with: model_version, predictions_served, average_inference_time
4. THE Admin_Dashboard SHALL allow administrators to adjust Risk_Level thresholds (low/medium/high/critical boundaries)
5. THE Admin_Dashboard SHALL allow administrators to modify batch processing schedule
6. THE Node_Backend SHALL log all configuration changes with admin_user_id and timestamp

