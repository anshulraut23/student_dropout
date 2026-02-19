import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dataStore from '../storage/dataStore.js';
import { generateId, validateEmail, validatePassword } from '../utils/helpers.js';

// Admin Registration
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, schoolName, schoolAddress, schoolCity, schoolState, schoolPhone } = req.body;

    // Validation
    if (!fullName || !email || !password || !schoolName || !schoolAddress || !schoolCity || !schoolState || !schoolPhone) {
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
    const existingUser = dataStore.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create school
    const schoolId = generateId();
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
    dataStore.addSchool(school);
    dataStore.addUser(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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
    console.error('Admin registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed' 
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
    const existingUser = dataStore.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Verify school exists
    const school = dataStore.getSchoolById(schoolId);
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
    const request = {
      teacherId: userId,
      schoolId,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      processedAt: null
    };

    // Save to data store
    dataStore.addUser(user);
    dataStore.addRequest(request);

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
    console.error('Teacher registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed' 
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = dataStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Check approval status for teachers
    if (user.role === 'teacher' && user.status === 'pending') {
      return res.status(403).json({ 
        success: false, 
        error: 'Your account is pending approval from the school admin' 
      });
    }

    if (user.role === 'teacher' && user.status === 'rejected') {
      return res.status(403).json({ 
        success: false, 
        error: 'Your account request was rejected' 
      });
    }

    // Get school info
    const school = dataStore.getSchoolById(user.schoolId);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
};

// Get current user
export const getCurrentUser = (req, res) => {
  try {
    const user = dataStore.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const school = dataStore.getSchoolById(user.schoolId);

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
