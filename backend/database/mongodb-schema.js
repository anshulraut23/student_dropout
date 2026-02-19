// MongoDB Schema Definitions using Mongoose
// This file defines all collections and their schemas

const mongoose = require('mongoose');
const { Schema } = mongoose;

// School Schema
const schoolSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  adminId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

schoolSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// User Schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'teacher'] },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  assignedClasses: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });
userSchema.index({ schoolId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Teacher Request Schema
const teacherRequestSchema = new Schema({
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

teacherRequestSchema.index({ status: 1 });
teacherRequestSchema.index({ schoolId: 1 });

teacherRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Class Schema
const classSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  grade: { type: String, required: true },
  section: { type: String },
  academicYear: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
  attendanceMode: { 
    type: String, 
    required: true,
    enum: ['daily', 'subject_wise'],
    default: 'daily'
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

classSchema.index({ schoolId: 1 });
classSchema.index({ teacherId: 1 });

classSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Student Schema
const studentSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  enrollmentNumber: { type: String, unique: true },
  parentName: { type: String },
  parentPhone: { type: String },
  parentEmail: { type: String },
  address: { type: String },
  riskLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'dropped', 'graduated'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

studentSchema.index({ schoolId: 1 });
studentSchema.index({ classId: 1 });
studentSchema.index({ riskLevel: 1 });
studentSchema.index({ enrollmentNumber: 1 });

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Attendance Schema
const attendanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['present', 'absent', 'late', 'excused']
  },
  markedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

attendanceSchema.index({ studentId: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// Performance Record Schema
const performanceRecordSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  subject: { type: String, required: true },
  assessmentType: { type: String, required: true },
  marksObtained: { type: Number },
  totalMarks: { type: Number },
  grade: { type: String },
  assessmentDate: { type: Date, required: true },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

performanceRecordSchema.index({ studentId: 1 });
performanceRecordSchema.index({ assessmentDate: 1 });

performanceRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Intervention Schema
const interventionSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  interventionType: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['planned', 'in_progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  startDate: { type: Date },
  endDate: { type: Date },
  outcome: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

interventionSchema.index({ studentId: 1 });
interventionSchema.index({ status: 1 });

interventionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Alert Schema
const alertSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  alertType: { type: String, required: true },
  severity: { 
    type: String, 
    required: true, 
    enum: ['low', 'medium', 'high', 'critical']
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readBy: { type: Schema.Types.ObjectId, ref: 'User' },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

alertSchema.index({ studentId: 1 });
alertSchema.index({ isRead: 1 });
alertSchema.index({ severity: 1 });

// Export models
const School = mongoose.model('School', schoolSchema);
const User = mongoose.model('User', userSchema);
const TeacherRequest = mongoose.model('TeacherRequest', teacherRequestSchema);
const Class = mongoose.model('Class', classSchema);
const Student = mongoose.model('Student', studentSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const PerformanceRecord = mongoose.model('PerformanceRecord', performanceRecordSchema);
const Intervention = mongoose.model('Intervention', interventionSchema);
const Alert = mongoose.model('Alert', alertSchema);

module.exports = {
  School,
  User,
  TeacherRequest,
  Class,
  Student,
  Attendance,
  PerformanceRecord,
  Intervention,
  Alert
};
