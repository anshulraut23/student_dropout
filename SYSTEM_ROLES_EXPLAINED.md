# 🎭 System Roles Explained - Simple Guide

## Overview
The Student Dropout Prediction System has 3 main user roles, each with different responsibilities and access levels.

---

## 1. 👨‍🏫 TEACHER Role

**Who:** Regular teachers/faculty members at a school

**Main Job:** Daily student tracking and data entry

### What Teachers Can Do:

#### 📊 Dashboard
- View their students' overview
- See at-risk students with dropout predictions
- Check recent attendance and behavior trends

#### 👥 Student Management
- View list of all their students
- See detailed student profiles
- Check individual student risk scores
- View AI-generated insights about each student

#### ✍️ Data Entry
- **Attendance**: Mark students present/absent daily
- **Behavior**: Record positive/negative incidents
- **Interventions**: Document actions taken for at-risk students

#### 📝 Marks Entry
- Enter exam marks for students
- View marks history

#### 📈 History & Reports
- View attendance history
- Check intervention history
- Track student progress over time

#### 💬 Communication
- Faculty Chat: Message other teachers
- AI Assistant: Get help and suggestions

#### 👤 Profile
- Update their own profile information

### What Teachers CANNOT Do:
- ❌ Add/remove other teachers
- ❌ Create/delete classes
- ❌ Manage exams
- ❌ View ML model performance
- ❌ Access other schools' data
- ❌ Mark students as dropped out

---

## 2. 🎓 ADMIN Role

**Who:** School principal or administrator

**Main Job:** Manage the entire school and monitor ML predictions

### What Admins Can Do:

#### 🏫 School Management
- **Teachers**: Add, edit, remove teachers
- **Classes**: Create and manage classes (7A, 8B, etc.)
- **Subjects**: Add subjects for each class
- **Exams**: Create exam templates and schedule exams

#### 📊 Dashboard & Analytics
- View school-wide statistics
- See all at-risk students across classes
- Monitor overall attendance and performance
- View dropout trends

#### 🤖 ML Model Management
- **Dropout Management**: Mark students as dropped out/active
- **Model Performance**: View ML accuracy and metrics
- **Manual Retrain**: Trigger model retraining with new data
- **Training History**: See how model accuracy improves over time

#### 📈 Advanced Analytics
- School-wide reports
- Class-wise comparisons
- Dropout rate analysis
- Confusion matrix and model metrics

#### 👤 Profile
- Update school and admin profile

### What Admins CANNOT Do:
- ❌ Access other schools' data
- ❌ Create new schools
- ❌ Manage super admin settings

---

## 3. 🌟 SUPER ADMIN Role

**Who:** System owner/platform administrator

**Main Job:** Manage multiple schools on the platform

### What Super Admins Can Do:

#### 🏢 Multi-School Management
- **View All Schools**: See list of all schools on platform
- **School Details**: Access any school's information
- **Add Schools**: Onboard new schools to the system
- **Edit Schools**: Update school information
- **Deactivate Schools**: Suspend school access if needed

#### 📊 Platform Analytics
- View platform-wide statistics
- Monitor total users across all schools
- Track system usage
- See overall dropout trends

#### 🔍 School Monitoring
- Access any school's dashboard
- View school-specific data
- Monitor ML model performance per school
- Check school activity

#### 👤 Profile
- Update super admin profile

### What Super Admins CANNOT Do:
- ❌ Directly manage teachers (done by school admin)
- ❌ Enter student data (done by teachers)
- ❌ Cannot see individual student details (privacy)

---

## 🔐 Access Hierarchy

```
Super Admin (Platform Level)
    ↓
Admin (School Level)
    ↓
Teacher (Class Level)
```

### Data Access Rules:
- **Teachers**: Only their school's students
- **Admins**: All data within their school
- **Super Admins**: All schools, but limited student details

---

## 🎯 Quick Comparison Table

| Feature | Teacher | Admin | Super Admin |
|---------|---------|-------|-------------|
| View Students | ✅ Own students | ✅ All school students | ❌ No direct access |
| Enter Attendance | ✅ Yes | ❌ No | ❌ No |
| Enter Marks | ✅ Yes | ❌ No | ❌ No |
| Record Behavior | ✅ Yes | ❌ No | ❌ No |
| Manage Teachers | ❌ No | ✅ Yes | ❌ No |
| Manage Classes | ❌ No | ✅ Yes | ❌ No |
| Create Exams | ❌ No | ✅ Yes | ❌ No |
| Mark Dropouts | ❌ No | ✅ Yes | ❌ No |
| Retrain ML Model | ❌ No | ✅ Yes | ❌ No |
| View ML Performance | ❌ No | ✅ Yes | ✅ Yes |
| Manage Schools | ❌ No | ❌ No | ✅ Yes |
| Platform Analytics | ❌ No | ❌ No | ✅ Yes |

---

## 📱 Login Process

### All Roles Login at: `/` (Landing Page)

1. User visits homepage
2. Selects their role (Teacher/Admin/Super Admin)
3. Enters email and password
4. System redirects to appropriate dashboard:
   - Teacher → `/teacher/dashboard`
   - Admin → `/admin/dashboard`
   - Super Admin → `/super-admin/dashboard`

---

## 🔄 Typical Workflow

### Daily Operations:

**Morning (Teacher):**
1. Login to system
2. Mark attendance for all students
3. Check at-risk student alerts

**During Day (Teacher):**
1. Record any behavior incidents
2. Document interventions taken
3. Chat with other teachers if needed

**After Exams (Teacher):**
1. Enter exam marks
2. Review updated risk predictions

**Weekly (Admin):**
1. Review school-wide analytics
2. Check ML model predictions
3. Plan interventions for high-risk students
4. Update dropout status if students leave

**Monthly (Admin):**
1. Retrain ML model with new data
2. Compare model accuracy improvements
3. Generate reports for management

**Quarterly (Super Admin):**
1. Review all schools' performance
2. Identify schools needing support
3. Monitor platform health

---

## 🎓 Example Scenario

### VES College Setup:

**Super Admin:**
- Created "VES College" in system
- Set admin email: ves@gmail.com

**Admin (ves@gmail.com):**
- Added 5 teachers
- Created 4 classes (7A, 8A, 9A, 10)
- Created exam templates
- Scheduled exams

**Teachers:**
- Teacher 1: Handles 7A and 8A
- Teacher 2: Handles 9A and 10
- All teachers mark daily attendance
- Enter marks after exams
- Record behavior incidents

**ML Model:**
- Trained on 98 students
- 24 dropout cases
- 70% accuracy
- Predicts which students are at risk

---

## 🚀 Key Benefits by Role

### For Teachers:
- Early warning system for at-risk students
- AI-powered intervention suggestions
- Easy data entry interface
- Historical tracking

### For Admins:
- School-wide visibility
- Data-driven decision making
- ML model insights
- Performance tracking

### For Super Admins:
- Multi-school management
- Platform-wide analytics
- Scalable system
- Centralized control

---

## 📞 Support & Help

Each role has access to:
- AI Assistant for questions
- Profile page for settings
- Help documentation
- In-app guidance

---

## 🔒 Security Features

- Role-based access control
- JWT token authentication
- School data isolation
- Secure password storage
- Session management
