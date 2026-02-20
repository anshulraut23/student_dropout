import { useState, useEffect } from "react";
import { FaPlus, FaSpinner, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import apiService from "../../services/apiService";

export default function AddExamPage() {
  const [activeTab, setActiveTab] = useState("create");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingExam, setEditingExam] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    classId: "",
    subjectId: "",
    examType: "",
    examDate: "",
    totalMarks: "",
    passingMarks: "",
    duration: "",
    description: ""
  });

  const examTypes = [
    "Unit Test",
    "Mid Term",
    "Final Exam",
    "Assignment",
    "Quiz",
    "Project",
    "Practical",
    "Oral Test"
  ];

  useEffect(() => {
    loadClasses();
    loadExams();
  }, []);

  useEffect(() => {
    if (formData.classId) {
      loadSubjects();
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

  const loadSubjects = async () => {
    try {
      const result = await apiService.getSubjectsByClass(formData.classId);
      if (result.success) {
        setSubjects(result.subjects || []);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
      // Fallback to default subjects
      setSubjects([
        { id: "math", name: "Mathematics" },
        { id: "science", name: "Science" },
        { id: "english", name: "English" },
        { id: "social", name: "Social Studies" },
        { id: "hindi", name: "Hindi" }
      ]);
    }
  };

  const loadExams = async () => {
    setLoading(true);
    try {
      const result = await apiService.getExams();
      if (result.success) {
        setExams(result.exams || []);
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.classId || !formData.subjectId || !formData.examType || !formData.totalMarks) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    if (formData.passingMarks && parseFloat(formData.passingMarks) > parseFloat(formData.totalMarks)) {
      setMessage({ type: "error", text: "Passing marks cannot exceed total marks" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const examData = {
        ...formData,
        totalMarks: parseFloat(formData.totalMarks),
        passingMarks: formData.passingMarks ? parseFloat(formData.passingMarks) : null,
        duration: formData.duration ? parseInt(formData.duration) : null
      };

      const result = editingExam 
        ? await apiService.updateExam(editingExam.id, examData)
        : await apiService.createExam(examData);
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: editingExam ? "Exam updated successfully!" : "Exam created successfully!" 
        });
        
        loadExams();
        
        setTimeout(() => {
          setFormData({
            name: "",
            classId: "",
            subjectId: "",
            examType: "",
            examDate: "",
            totalMarks: "",
            passingMarks: "",
            duration: "",
            description: ""
          });
          setEditingExam(null);
          setMessage({ type: "", text: "" });
          setActiveTab("list");
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save exam" });
      }
    } catch (error) {
      console.error('Exam submission error:', error);
      setMessage({ type: "error", text: error.message || "Failed to save exam" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      classId: exam.classId,
      subjectId: exam.subjectId,
      examType: exam.examType,
      examDate: exam.examDate || "",
      totalMarks: exam.totalMarks.toString(),
      passingMarks: exam.passingMarks ? exam.passingMarks.toString() : "",
      duration: exam.duration ? exam.duration.toString() : "",
      description: exam.description || ""
    });
    setActiveTab("create");
  };

  const handleDelete = async (examId) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    setLoading(true);
    try {
      const result = await apiService.deleteExam(examId);
      if (result.success) {
        setMessage({ type: "success", text: "Exam deleted successfully!" });
        loadExams();
        setTimeout(() => setMessage({ type: "", text: "" }), 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete exam" });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: "error", text: error.message || "Failed to delete exam" });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingExam(null);
    setFormData({
      name: "",
      classId: "",
      subjectId: "",
      examType: "",
      examDate: "",
      totalMarks: "",
      passingMarks: "",
      duration: "",
      description: ""
    });
  };

  return (
    <div className="p-4 md:p-6 pt-20 md:pt-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Exam Management</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Create and manage exams for your classes</p>
        </div>

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

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-4 md:mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("create");
                if (!editingExam) cancelEdit();
              }}
              className={`flex-1 px-4 md:px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "create"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaPlus />
              {editingExam ? "Edit Exam" : "Create Exam"}
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 px-4 md:px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "list"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaEye />
              View Exams
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">
            {activeTab === "create" ? (
              <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Exam Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Mathematics Mid Term 2024"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Class */}
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

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subjectId"
                      value={formData.subjectId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!formData.classId}
                    >
                      <option value="">Choose a subject</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Exam Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="examType"
                      value={formData.examType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose exam type</option>
                      {examTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Exam Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Date
                    </label>
                    <input
                      type="date"
                      name="examDate"
                      value={formData.examDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Total Marks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Marks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={formData.totalMarks}
                      onChange={handleInputChange}
                      placeholder="e.g., 100"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Passing Marks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Marks
                    </label>
                    <input
                      type="number"
                      name="passingMarks"
                      value={formData.passingMarks}
                      onChange={handleInputChange}
                      placeholder="e.g., 40"
                      min="0"
                      step="0.01"
                      max={formData.totalMarks || undefined}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 180"
                      min="0"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Optional description or instructions..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="mt-6 flex justify-end gap-2">
                  {editingExam && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {editingExam ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {editingExam ? "Update Exam" : "Create Exam"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* Exams List */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading exams...</p>
                  </div>
                ) : exams.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-500">No exams created yet</p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <FaPlus />
                      Create First Exam
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Exam Name</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Class</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Subject</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                          <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {exams.map((exam) => (
                          <tr key={exam.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{exam.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{exam.className}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{exam.subjectName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{exam.examType}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">{exam.totalMarks}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-600">
                              {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(exam)}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                                >
                                  <FaEdit />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(exam.id)}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                                >
                                  <FaTrash />
                                  Delete
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
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
