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
    behaviorType: "positive",
    category: "",
    severity: "medium",
    description: "",
    actionTaken: "",
    followUpRequired: false,
    followUpDate: "",
    date: new Date().toISOString().split('T')[0]
  });

  const behaviourCategories = [
    "Attendance",
    "Participation",
    "Discipline",
    "Academic Performance",
    "Social Behavior",
    "Emotional Well-being",
    "Leadership",
    "Cooperation",
    "Motivation",
    "Other"
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.classId) {
      setMessage({ type: "error", text: "Please select class and student" });
      return;
    }

    if (!formData.category || !formData.description) {
      setMessage({ type: "error", text: "Please select category and add description" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const behaviourData = {
        studentId: formData.studentId,
        date: formData.date,
        behaviorType: formData.behaviorType,
        category: formData.category,
        severity: formData.severity,
        description: formData.description,
        actionTaken: formData.actionTaken || null,
        followUpRequired: formData.followUpRequired,
        followUpDate: formData.followUpDate || null
      };

      const result = await apiService.createBehaviourRecord(behaviourData);
      
      if (result.success) {
        setMessage({ type: "success", text: "Behaviour observation saved successfully!" });
        
        setTimeout(() => {
          setFormData({
            studentId: "",
            classId: formData.classId,
            behaviorType: "positive",
            category: "",
            severity: "medium",
            description: "",
            actionTaken: "",
            followUpRequired: false,
            followUpDate: "",
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

        {/* Behavior Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behavior Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="behaviorType"
                value="positive"
                checked={formData.behaviorType === "positive"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Positive</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="behaviorType"
                value="negative"
                checked={formData.behaviorType === "negative"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Negative</span>
            </label>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select category</option>
            {behaviourCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Describe the behavior observation in detail..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Action Taken */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Action Taken
          </label>
          <textarea
            name="actionTaken"
            value={formData.actionTaken}
            onChange={handleInputChange}
            rows="3"
            placeholder="What action was taken regarding this behavior..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Follow-up Required */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="followUpRequired"
              checked={formData.followUpRequired}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Follow-up Required</span>
          </label>
        </div>

        {/* Follow-up Date */}
        {formData.followUpRequired && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

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
