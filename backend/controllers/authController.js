import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dataStore from '../storage/dataStore.js';
import { generateId, validateEmail, validatePassword } from '../utils/helpers.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-local-jwt-secret';

// Admin Registration
export const registerAdmin = async (req, res) => {
  try {
    console.log('📝 Admin registration request received');
    console.log('   Email:', req.body.email);
    console.log('   School:', req.body.schoolName);
    
    const { fullName, email, password, schoolName, schoolAddress, schoolCity, schoolState, schoolPhone } = req.body;

    // Validation
    if (!fullName || !email || !password || !schoolName || !schoolAddress || !schoolCity || !schoolState || !schoolPhone) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    if (!validateEmail(email)) {
      console.log('❌ Validation failed: Invalid email format');
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    if (!validatePassword(password)) {
      console.log('❌ Validation failed: Invalid password');
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Check for duplicate email
    console.log('🔍 Checking for existing user...');
    const existingUser = await dataStore.getUserByEmail(email);
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }
    console.log('✅ Email is available');

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create school
    const schoolId = generateId();
    console.log('🏫 Creating school with ID:', schoolId);
    const school = {
      id: schoolId,
      name: schoolName,
      address: schoolAddress,
      city: schoolCity,
      state: schoolState,
      phone: schoolPhone,
      adminId: null,
      createdAt: new Date().toISOString()
    };

    // Create admin user
    const userId = generateId();
    console.log('👤 Creating admin user with ID:', userId);
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      fullName,
      role: 'admin',
      schoolId,
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    // Update school with adminId
    school.adminId = userId;

    // Save to data store
    console.log('💾 Saving school to database...');
    await dataStore.addSchool(school);
    console.log('✅ School saved successfully');
    
    console.log('💾 Saving user to database...');
    await dataStore.addUser(user);
    console.log('✅ User saved successfully');

    // Generate JWT token
    console.log('🔑 Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Admin registration completed successfully');
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        schoolId: user.schoolId,
        status: user.status
      },
      school: {
        id: school.id,
        name: school.name,
        address: school.address,
        city: school.city,
        state: school.state,
        phone: school.phone
      }
    });
  } catch (error) {
    console.error('❌ Admin registration error:', error);
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Teacher Registration
export const registerTeacher = async (req, res) => {
  try {
    const { fullName, email, password, schoolId } = req.body;

    // Validation
    if (!fullName || !email || !password || !schoolId) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Check for duplicate email
    const existingUser = await dataStore.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Verify school exists
    const school = await dataStore.getSchoolById(schoolId);
    if (!school) {
      return res.status(400).json({ 
        success: false, 
        error: 'School not found' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher user
    const userId = generateId();
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      fullName,
      role: 'teacher',
      schoolId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Create approval request
    const requestId = generateId();
    const now = new Date().toISOString();
    const request = {
      id: requestId,
      teacherId: userId,
      schoolId,
      type: 'teacher_registration',
      status: 'pending',
      createdAt: now,
      requestedAt: now,
      processedAt: null
    };

    // Save to data store
    await dataStore.addUser(user);
    await dataStore.addRequest(request);

    res.status(201).json({
      success: true,
      message: 'Teacher registration submitted. Awaiting admin approval.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        schoolId: user.schoolId,
        status: user.status
      },
      school: {
        id: school.id,
        name: school.name
      }
    });
  } catch (error) {
    console.error('❌ TEACHER REGISTRATION ERROR:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt for:', req.body.email);
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Find user
    console.log('🔍 Looking up user in database...');
    const user = await dataStore.getUserByEmail(email);
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    console.log('✅ User found:', user.id, user.role);

    // Verify password
    console.log('🔐 Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    console.log('✅ Password valid');

    // Check approval status for teachers
    if (user.role === 'teacher' && user.status === 'pending') {
      console.log('⏳ Teacher account pending approval');
      return res.status(403).json({ 
        success: false, 
        error: 'Your account is pending approval from the school admin' 
      });
    }

    if (user.role === 'teacher' && user.status === 'rejected') {
      console.log('❌ Teacher account rejected');
      return res.status(403).json({ 
        success: false, 
        error: 'Your account request was rejected' 
      });
    }

    // Get school info
    console.log('🏫 Fetching school info...');
    const school = await dataStore.getSchoolById(user.schoolId);

    // Generate JWT token
    console.log('🔑 Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', email);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        schoolId: user.schoolId,
        status: user.status
      },
      school: school ? {
        id: school.id,
        name: school.name
      } : null
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('   Message:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await dataStore.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const school = await dataStore.getSchoolById(user.schoolId);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        schoolId: user.schoolId,
        status: user.status
      },
      school: school ? {
        id: school.id,
        name: school.name
      } : null
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get user' 
    });
  }
};
