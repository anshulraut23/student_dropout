import { useState } from 'react';
import { FaUser, FaSchool, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Admin Personal Info
    fullName: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@sunriseschool.edu',
    phone: '+91 9876543210',
    designation: 'Principal',
    
    // School Details
    schoolName: 'Sunrise Public School',
    schoolId: 'SCH-001',
    schoolType: 'School',
    address: '123 Main Street, Sector 15',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: