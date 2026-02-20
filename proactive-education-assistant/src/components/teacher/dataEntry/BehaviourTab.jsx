import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import apiService from "../../../services/apiService";

export default function BehaviourTab() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    tags: [],
    severity: "medium",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const behaviourTags = [
    "Low participation",
    "Frequent absence",
    "Disruptive",
    "Silent withdrawal",
    "Good improvement",
    "Excellent behaviour",
    "Needs attention",
    "Aggressive",
    "Helpful",
    "Leadership",
    "Cooperative",
    "Distracted",
    "Motivated",
    "Struggling"
  ];

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (formData.classId) {
      loadStudents();
    }
  }, [formData.classId]);

  const loadClasses = async () => {
    try {
      const result = await apiService.getMyClasses();
      if (result.success) {
        setClasses(result.classes || []);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const result = await apiService.getStudents(formData.classId);
      if (result.success) {
        setStudents(result.students || []);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.classId) {
      setMessage({ type: "error", text: "Please select class and student" });
      return;
    }

    if (formData.tags.length === 0 && !formData.notes) {
      setMessage({ type: "error", text: "Please add at least one tag or note" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const behaviourData = {
        studentId: formData.studentId,
        classId: formData.classId,
        tags: formData.tags,
        severity: formData.severity,
        notes: formData.notes,
        date: formData.date
      };

      const result = await apiService.createBehaviourRecord(behaviourData);
      
      if (result.success) {
        setMessage({ type: "success", text: "Behaviour observation saved successfully!" });
        
        setTimeout(() => {
          setFormData({
            studentId: "",
            classId: formData.classId,
            tags: [],
            severity: "medium",
            notes: "",
            date: new Date().toISOString().split('T')[0]
          });
          setMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save observation" });
      }
    } catch (error) {
      console.error('Behaviour submission error:', error);
      setMessage({ type: "error", text: error.message || "Failed to save observation" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Message */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Class Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Student Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student <span className="text-red-500">*</span>
          </label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!formData.classId}
          >
            <option value="">Select student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.enrollmentNo})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Behaviour Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behaviour Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {behaviourTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  formData.tags.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {formData.tags.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {formData.tags.join(", ")}
            </p>
          )}
        </div>

        {/* Severity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low - Minor observation</option>
            <option value="medium">Medium - Needs monitoring</option>
            <option value="high">High - Requires immediate attention</option>
          </select>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            placeholder="Describe the observation in detail..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.studentId}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Observation"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
