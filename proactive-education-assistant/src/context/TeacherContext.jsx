import { createContext, useContext, useState, useEffect } from 'react';

const TeacherContext = createContext();

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within TeacherProvider');
  }
  return context;
};

export const TeacherProvider = ({ children }) => {
  // Mock teacher data (in real app, this comes from backend after login)
  const [teacher, setTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Initialize teacher data from localStorage (mock login persistence)
  useEffect(() => {
    const storedTeacher = localStorage.getItem('teacherData');
    if (storedTeacher) {
      const teacherData = JSON.parse(storedTeacher);
      setTeacher(teacherData);
      
      // Auto-select class if only one assigned
      if (teacherData.assignedClasses?.length === 1) {
        setSelectedClass(teacherData.assignedClasses[0]);
      }
    }
  }, []);

  const loginTeacher = (teacherData) => {
    setTeacher(teacherData);
    localStorage.setItem('teacherData', JSON.stringify(teacherData));
    
    // Auto-select class if only one
    if (teacherData.assignedClasses?.length === 1) {
      setSelectedClass(teacherData.assignedClasses[0]);
    }
  };

  const logoutTeacher = () => {
    setTeacher(null);
    setSelectedClass(null);
    localStorage.removeItem('teacherData');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminData');
    localStorage.removeItem('school_id');
    localStorage.removeItem('school_name');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('school_id');
    sessionStorage.removeItem('school_name');
    // Trigger custom event for route update
    window.dispatchEvent(new Event("localStorageUpdate"));
  };

  const value = {
    teacher,
    selectedClass,
    setSelectedClass,
    loginTeacher,
    logoutTeacher,
    hasMultipleClasses: teacher?.assignedClasses?.length > 1,
    hasSingleClass: teacher?.assignedClasses?.length === 1,
  };

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>;
};
