import { useState, useEffect } from "react";
import { FaSpinner, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import apiService from "../../../services/apiService";

export default function InterventionsTab() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    interventionType: "academic",
    priority: "medium",
    title: "",
    description: "",
    actionPlan: "",
    expectedOutcome: "",
    startDate: new Date().toISOString().split('T')[0],
    targetDate: "",
    status: "planned"
  });

  const [filters, setFilters] = useState({
    classId: "",
    studentId: "",
    status: ""
  });

  const interventionTypes = [
    "Academic Support",
    "Behavioral Support",
    "Attendance Improvement",
    "Counseling",
    "Parent Meeting",
    "Peer Mentoring",
    "Extra Classes",
    "Home Visit",
    "Other"
  ];

  useEffect(() => {
    loadClasses();
    loadInterventions();
  }, []);

  useEffect(() => {
    if (formData.classId) {
      loadStudents();
    }
  }, [formData.classId]);

  useEffect(() => {
    loadInterventions();
  }, [filters]);

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

  const loadInterventions = async () => {
    try {
      setLoading(true);
      // For now, we'll use a placeholder since the backend endpoint might not exist
      // You'll need to implement this endpoint in the backend
      setInterventions([]);
    } catch (error) {
      console.error('Failed to load interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      classId: "",
      interventionType: "academic",
      priority: "medium",
      title: "",
      description: "",
      actionPlan: "",
      expectedOutcome: "",
      startDate: new Date().toISOString().split('T')[0],
      targetDate: "",
      status: "planned"
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.classId) {
      setMessage({ type: "error", text: "Please select class and student" });
      return;
    }

    if (!formData.title || !formData.description) {
      setMessage({ type: "error", text: "Please provide title and description" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const interventionData = {
        studentId: formData.studentId,
        interventionType: formData.interventionType,
        priority: formData.priority,
        title: formData.title,
        description: formData.description,
        actionPlan: formData.actionPlan,
        expectedOutcome: formData.expectedOutcome,
        startDate: formData.startDate,
        targetDate: formData.targetDate,
        status: formData.status
      };

      // Note: You'll need to implement these API methods
      let result;
      if (editingId) {
        result = await apiService.updateIntervention(editingId, interventionData);
      } else {
        result = await apiService.createIntervention(interventionData);
      }
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: editingId ? "Intervention updated successfully!" : "Intervention created successfully!" 
        });
        
        setTimeout(() => {
          resetForm();
          loadInterventions();
          setMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save intervention" });
      }
    } catch (error) {
      console.error('Intervention submission error:', error);
      setMessage({ type: "error", text: error.message || "Failed to save intervention" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (intervention) => {
    setFormData({
      studentId: intervention.studentId,
      classId: intervention.classId || "",
      interventionType: intervention.interventionType,
      priority: intervention.priority,
      title: intervention.title,
      description: intervention.description,
      actionPlan: intervention.actionPlan || "",
      expectedOutcome: intervention.expectedOutcome || "",
      startDate: intervention.startDate,
      targetDate: intervention.targetDate || "",
      status: intervention.status
    });
    setEditingId(intervention.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this intervention?")) {
      return;
    }

    try {
      const result = await apiService.deleteIntervention(id);
      if (result.success) {
        setMessage({ type: "success", text: "Intervention deleted successfully" });
        loadInterventions();
        setTimeout(() => setMessage({ type: "", text: "" }), 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete intervention" });
      }
    } catch (error) {
      console.error('Delete intervention error:', error);
      setMessage({ type: "error", text: "Failed to delete intervention" });
    }
  };

  return (
    <div>
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Student Interventions</h3>
          <p className="text-sm text-gray-500">Track and manage intervention plans for students</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          {showForm ? "Cancel" : "Add Intervention"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Intervention" : "New Intervention"}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Selection */}
            <div>
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
            <div>
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

            {/* Intervention Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervention Type <span className="text-red-500">*</span>
              </label>
              <select
                name="interventionType"
                value={formData.interventionType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {interventionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleInputChange}
                min={formData.startDate}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief title for the intervention"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe the issue or concern..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Action Plan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Plan
              </label>
              <textarea
                name="actionPlan"
                value={formData.actionPlan}
                onChange={handleInputChange}
                rows="3"
                placeholder="Specific actions to be taken..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Expected Outcome */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Outcome
              </label>
              <textarea
                name="expectedOutcome"
                value={formData.expectedOutcome}
                onChange={handleInputChange}
                rows="2"
                placeholder="What do you expect to achieve..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                editingId ? "Update Intervention" : "Create Intervention"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Filters</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Class</label>
            <select
              name="classId"
              value={filters.classId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interventions List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-2xl text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading interventions...</p>
          </div>
        ) : interventions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No interventions found</p>
            <p className="text-xs text-gray-400 mt-1">Create your first intervention to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {interventions.map(intervention => (
                  <tr key={intervention.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{intervention.studentName}</td>
                    <td className="px-4 py-3 text-sm">{intervention.interventionType}</td>
                    <td className="px-4 py-3 text-sm">{intervention.title}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        intervention.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        intervention.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        intervention.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {intervention.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        intervention.status === 'completed' ? 'bg-green-100 text-green-700' :
                        intervention.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        intervention.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {intervention.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(intervention)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(intervention.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
