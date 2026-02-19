import { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { FaTimes } from 'react-icons/fa';

function AssignClassModal({ teacher, onClose, onSuccess }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [currentClassId, setCurrentClassId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Fetch classes and find teacher's current class
  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const result = await apiService.getClasses();
        if (result.success) {
          const allClasses = result.classes || [];
          
          // Find the class where this teacher is currently the incharge
          const teacherClass = allClasses.find(cls => cls.teacherId === teacher.id);
          
          if (teacherClass) {
            setCurrentClassId(teacherClass.id);
            setSelectedClassId(teacherClass.id);
          }
          
          // Show only active classes that either:
          // 1. Don't have an incharge (teacherId is null)
          // 2. OR are currently assigned to this teacher
          const availableClasses = allClasses.filter(
            cls => cls.status === 'active' && (!cls.teacherId || cls.teacherId === teacher.id)
          );
          
          setClasses(availableClasses);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [teacher.id]);

  const handleAssign = async () => {
    if (!selectedClassId) {
      alert('Please select a class');
      return;
    }

    setAssigning(true);
    try {
      // If changing from one class to another, we need to:
      // 1. Remove teacher from old class (if exists)
      // 2. Assign teacher to new class
      
      // Remove from old class if exists and different from new selection
      if (currentClassId && currentClassId !== selectedClassId) {
        await apiService.updateClass(currentClassId, {
          teacherId: null
        });
      }
      
      // Assign to new class
      const result = await apiService.updateClass(selectedClassId, {
        teacherId: teacher.id
      });
      
      if (result.success) {
        alert(currentClassId ? 'Class assignment updated successfully!' : 'Class assigned successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      alert('Failed to assign class: ' + error.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async () => {
    if (!currentClassId) return;
    
    if (!window.confirm('Are you sure you want to remove this teacher as class incharge?')) {
      return;
    }

    setAssigning(true);
    try {
      const result = await apiService.updateClass(currentClassId, {
        teacherId: null
      });
      
      if (result.success) {
        alert('Teacher removed from class successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      alert('Failed to remove teacher: ' + error.message);
    } finally {
      setAssigning(false);
    }
  };

  const isEditing = !!currentClassId;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit' : 'Assign'} Class Incharge
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Teacher Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Teacher:</span> {teacher.name}
            </p>
            <p className="text-sm text-blue-800">
              <span className="font-medium">Email:</span> {teacher.email}
            </p>
          </div>

          {/* Available Classes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              {isEditing ? 'Change Class Assignment' : 'Select Class'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              A teacher can be incharge of only ONE class. {isEditing && 'Select a different class to change the assignment.'}
            </p>
            
            {loadingClasses ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : classes.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">
                  No available classes. All classes already have an incharge assigned.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {classes.map((cls) => (
                  <label
                    key={cls.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedClassId === cls.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="classSelection"
                      checked={selectedClassId === cls.id}
                      onChange={() => setSelectedClassId(cls.id)}
                      className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        {cls.id === currentClassId && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Grade {cls.grade}{cls.section ? ` - Section ${cls.section}` : ''} • {cls.academicYear}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Attendance Mode: {cls.attendanceMode === 'daily' ? 'Daily' : 'Subject-wise'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            {isEditing && (
              <button
                onClick={handleRemove}
                disabled={assigning}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Remove from Class
              </button>
            )}
          </div>

          <button
            onClick={handleAssign}
            disabled={assigning || !selectedClassId || selectedClassId === currentClassId}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {assigning ? 'Saving...' : isEditing ? 'Update Assignment' : 'Assign as Incharge'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignClassModal;
