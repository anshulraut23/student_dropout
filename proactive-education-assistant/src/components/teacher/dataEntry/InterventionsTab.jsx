// // // import { useState, useEffect } from "react";
// // // import { FaSpinner, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
// // // import apiService from "../../../services/apiService";

// // // export default function InterventionsTab() {
// // //   const [classes, setClasses] = useState([]);
// // //   const [students, setStudents] = useState([]);
// // //   const [interventions, setInterventions] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [message, setMessage] = useState({ type: "", text: "" });
// // //   const [showForm, setShowForm] = useState(false);
// // //   const [editingId, setEditingId] = useState(null);
  
// // //   const [formData, setFormData] = useState({
// // //     studentId: "",
// // //     classId: "",
// // //     interventionType: "academic",
// // //     priority: "medium",
// // //     title: "",
// // //     description: "",
// // //     actionPlan: "",
// // //     expectedOutcome: "",
// // //     startDate: new Date().toISOString().split('T')[0],
// // //     targetDate: "",
// // //     status: "planned"
// // //   });

// // //   const [filters, setFilters] = useState({
// // //     classId: "",
// // //     studentId: "",
// // //     status: ""
// // //   });

// // //   const interventionTypes = [
// // //     "Academic Support",
// // //     "Behavioral Support",
// // //     "Attendance Improvement",
// // //     "Counseling",
// // //     "Parent Meeting",
// // //     "Peer Mentoring",
// // //     "Extra Classes",
// // //     "Home Visit",
// // //     "Other"
// // //   ];

// // //   useEffect(() => {
// // //     loadClasses();
// // //     loadInterventions();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (formData.classId) {
// // //       loadStudents();
// // //     }
// // //   }, [formData.classId]);

// // //   useEffect(() => {
// // //     loadInterventions();
// // //   }, [filters]);

// // //   const loadClasses = async () => {
// // //     try {
// // //       const result = await apiService.getMyClasses();
// // //       if (result.success) {
// // //         setClasses(result.classes || []);
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load classes:', error);
// // //     }
// // //   };

// // //   const loadStudents = async () => {
// // //     try {
// // //       const result = await apiService.getStudents(formData.classId);
// // //       if (result.success) {
// // //         setStudents(result.students || []);
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load students:', error);
// // //     }
// // //   };

// // //   const loadInterventions = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const filterParams = {};
// // //       if (filters.classId) filterParams.classId = filters.classId;
// // //       if (filters.status) filterParams.status = filters.status;
      
// // //       const result = await apiService.getInterventions(filterParams);
// // //       if (result.success) {
// // //         setInterventions(result.interventions || []);
// // //       } else {
// // //         setInterventions([]);
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load interventions:', error);
// // //       setInterventions([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleFilterChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFilters(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const resetForm = () => {
// // //     setFormData({
// // //       studentId: "",
// // //       classId: "",
// // //       interventionType: "academic",
// // //       priority: "medium",
// // //       title: "",
// // //       description: "",
// // //       actionPlan: "",
// // //       expectedOutcome: "",
// // //       startDate: new Date().toISOString().split('T')[0],
// // //       targetDate: "",
// // //       status: "planned"
// // //     });
// // //     setEditingId(null);
// // //     setShowForm(false);
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
    
// // //     if (!formData.studentId || !formData.classId) {
// // //       setMessage({ type: "error", text: "Please select class and student" });
// // //       return;
// // //     }

// // //     if (!formData.title || !formData.description) {
// // //       setMessage({ type: "error", text: "Please provide title and description" });
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setMessage({ type: "", text: "" });

// // //     try {
// // //       const interventionData = {
// // //         studentId: formData.studentId,
// // //         interventionType: formData.interventionType,
// // //         priority: formData.priority,
// // //         title: formData.title,
// // //         description: formData.description,
// // //         actionPlan: formData.actionPlan,
// // //         expectedOutcome: formData.expectedOutcome,
// // //         startDate: formData.startDate,
// // //         targetDate: formData.targetDate,
// // //         status: formData.status
// // //       };

// // //       // Note: You'll need to implement these API methods
// // //       let result;
// // //       if (editingId) {
// // //         result = await apiService.updateIntervention(editingId, interventionData);
// // //       } else {
// // //         result = await apiService.createIntervention(interventionData);
// // //       }
      
// // //       if (result.success) {
// // //         setMessage({ 
// // //           type: "success", 
// // //           text: editingId ? "Intervention updated successfully!" : "Intervention created successfully!" 
// // //         });
        
// // //         setTimeout(() => {
// // //           resetForm();
// // //           loadInterventions();
// // //           setMessage({ type: "", text: "" });
// // //         }, 2000);
// // //       } else {
// // //         setMessage({ type: "error", text: result.error || "Failed to save intervention" });
// // //       }
// // //     } catch (error) {
// // //       console.error('Intervention submission error:', error);
// // //       setMessage({ type: "error", text: error.message || "Failed to save intervention" });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleEdit = (intervention) => {
// // //     setFormData({
// // //       studentId: intervention.studentId,
// // //       classId: intervention.classId || "",
// // //       interventionType: intervention.interventionType,
// // //       priority: intervention.priority,
// // //       title: intervention.title,
// // //       description: intervention.description,
// // //       actionPlan: intervention.actionPlan || "",
// // //       expectedOutcome: intervention.expectedOutcome || "",
// // //       startDate: intervention.startDate,
// // //       targetDate: intervention.targetDate || "",
// // //       status: intervention.status
// // //     });
// // //     setEditingId(intervention.id);
// // //     setShowForm(true);
// // //   };

// // //   const handleDelete = async (id) => {
// // //     if (!confirm("Are you sure you want to delete this intervention?")) {
// // //       return;
// // //     }

// // //     try {
// // //       const result = await apiService.deleteIntervention(id);
// // //       if (result.success) {
// // //         setMessage({ type: "success", text: "Intervention deleted successfully" });
// // //         loadInterventions();
// // //         setTimeout(() => setMessage({ type: "", text: "" }), 2000);
// // //       } else {
// // //         setMessage({ type: "error", text: result.error || "Failed to delete intervention" });
// // //       }
// // //     } catch (error) {
// // //       console.error('Delete intervention error:', error);
// // //       setMessage({ type: "error", text: "Failed to delete intervention" });
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       {/* Message */}
// // //       {message.text && (
// // //         <div className={`mb-4 p-3 rounded-lg text-sm ${
// // //           message.type === "success" 
// // //             ? "bg-green-50 text-green-700 border border-green-200" 
// // //             : "bg-red-50 text-red-700 border border-red-200"
// // //         }`}>
// // //           {message.text}
// // //         </div>
// // //       )}

// // //       {/* Header */}
// // //       <div className="flex justify-between items-center mb-6">
// // //         <div>
// // //           <h3 className="text-lg font-semibold text-gray-900">Student Interventions</h3>
// // //           <p className="text-sm text-gray-500">Track and manage intervention plans for students</p>
// // //         </div>
// // //         <button
// // //           onClick={() => setShowForm(!showForm)}
// // //           className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
// // //         >
// // //           <FaPlus />
// // //           {showForm ? "Cancel" : "Add Intervention"}
// // //         </button>
// // //       </div>

// // //       {/* Form */}
// // //       {showForm && (
// // //         <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
// // //           <h4 className="text-md font-semibold text-gray-900 mb-4">
// // //             {editingId ? "Edit Intervention" : "New Intervention"}
// // //           </h4>

// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //             {/* Class Selection */}
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Class <span className="text-red-500">*</span>
// // //               </label>
// // //               <select
// // //                 name="classId"
// // //                 value={formData.classId}
// // //                 onChange={handleInputChange}
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 required
// // //               >
// // //                 <option value="">Choose a class</option>
// // //                 {classes.map(cls => (
// // //                   <option key={cls.id} value={cls.id}>
// // //                     {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             {/* Student Selection */}
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Student <span className="text-red-500">*</span>
// // //               </label>
// // //               <select
// // //                 name="studentId"
// // //                 value={formData.studentId}
// // //                 onChange={handleInputChange}
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 required
// // //                 disabled={!formData.classId}
// // //               >
// // //                 <option value="">Select student</option>
// // //                 {students.map(student => (
// // //                   <option key={student.id} value={student.id}>
// // //                     {student.name} ({student.enrollmentNo})
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             {/* Intervention Type */}
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Intervention Type <span className="text-red-500">*</span>
// // //               </label>
// // //               <select
// // //                 name="interventionType"
// // //                 value={formData.interventionType}
// // //                 onChange={handleInputChange}
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 required
// // //               >
// // //                 {interventionTypes.map(type => (
// // //                   <option key={type} value={type}>{type}</option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             {/* Priority */}
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Priority <span className="text-red-500">*</span>
// // //               </label>
// // //               <select
// // //                 name="priority"
// // //                 value={formData.priority}
// // //                 onChange={handleInputChange}
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               >
// // //                 <option value="low">Low</option>
// // //                 <option value="medium">Medium</option>
// // //                 <option value="high">High</option>
// // //                 <option value="urgent">Urgent</option>
// // //               </select>
// // //             </div>

// // //             {/* Start Date */}
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Start Date <span className="text-red-500">*</span>
// // //               </label>
// // //               <input
// // //                 type="date"
// // //                 name="startDate"
// // //                 value={formData.startDate}
// // //                 onChange={handleInputChange}
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 required
// // //               />
// // //             </div>

// // //             {/* Target Date */}
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Target Date
// // //               </label>
// // //               <input
// // //                 type="date"
// // //                 name="targetDate"
// // //                 value={formData.targetDate}
// // //                 onChange={handleInputChange}
// // //                 min={formData.startDate}
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               />
// // //             </div>

// // //             {/* Status */}
// // //             <div className="md:col-span-2">
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Status
// // //               </label>
// // //               <select
// // //                 name="status"
// // //                 value={formData.status}
// // //                 onChange={handleInputChange}
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               >
// // //                 <option value="planned">Planned</option>
// // //                 <option value="in-progress">In Progress</option>
// // //                 <option value="completed">Completed</option>
// // //                 <option value="cancelled">Cancelled</option>
// // //               </select>
// // //             </div>

// // //             {/* Title */}
// // //             <div className="md:col-span-2">
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Title <span className="text-red-500">*</span>
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 name="title"
// // //                 value={formData.title}
// // //                 onChange={handleInputChange}
// // //                 placeholder="Brief title for the intervention"
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 required
// // //               />
// // //             </div>

// // //             {/* Description */}
// // //             <div className="md:col-span-2">
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Description <span className="text-red-500">*</span>
// // //               </label>
// // //               <textarea
// // //                 name="description"
// // //                 value={formData.description}
// // //                 onChange={handleInputChange}
// // //                 rows="3"
// // //                 placeholder="Describe the issue or concern..."
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 required
// // //               />
// // //             </div>

// // //             {/* Action Plan */}
// // //             <div className="md:col-span-2">
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Action Plan
// // //               </label>
// // //               <textarea
// // //                 name="actionPlan"
// // //                 value={formData.actionPlan}
// // //                 onChange={handleInputChange}
// // //                 rows="3"
// // //                 placeholder="Specific actions to be taken..."
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               />
// // //             </div>

// // //             {/* Expected Outcome */}
// // //             <div className="md:col-span-2">
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Expected Outcome
// // //               </label>
// // //               <textarea
// // //                 name="expectedOutcome"
// // //                 value={formData.expectedOutcome}
// // //                 onChange={handleInputChange}
// // //                 rows="2"
// // //                 placeholder="What do you expect to achieve..."
// // //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* Submit */}
// // //           <div className="flex justify-end gap-3 mt-6">
// // //             <button
// // //               type="button"
// // //               onClick={resetForm}
// // //               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
// // //             >
// // //               Cancel
// // //             </button>
// // //             <button
// // //               type="submit"
// // //               disabled={loading}
// // //               className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
// // //             >
// // //               {loading ? (
// // //                 <>
// // //                   <FaSpinner className="animate-spin" />
// // //                   Saving...
// // //                 </>
// // //               ) : (
// // //                 editingId ? "Update Intervention" : "Create Intervention"
// // //               )}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       )}

// // //       {/* Filters */}
// // //       <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
// // //         <h4 className="text-sm font-semibold text-gray-900 mb-3">Filters</h4>
// // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //           <div>
// // //             <label className="block text-xs font-medium text-gray-700 mb-1">Class</label>
// // //             <select
// // //               name="classId"
// // //               value={filters.classId}
// // //               onChange={handleFilterChange}
// // //               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
// // //             >
// // //               <option value="">All Classes</option>
// // //               {classes.map(cls => (
// // //                 <option key={cls.id} value={cls.id}>{cls.name}</option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //           <div>
// // //             <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
// // //             <select
// // //               name="status"
// // //               value={filters.status}
// // //               onChange={handleFilterChange}
// // //               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
// // //             >
// // //               <option value="">All Status</option>
// // //               <option value="planned">Planned</option>
// // //               <option value="in-progress">In Progress</option>
// // //               <option value="completed">Completed</option>
// // //               <option value="cancelled">Cancelled</option>
// // //             </select>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Interventions List */}
// // //       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
// // //         {loading ? (
// // //           <div className="text-center py-12">
// // //             <FaSpinner className="animate-spin text-2xl text-blue-600 mx-auto mb-2" />
// // //             <p className="text-sm text-gray-500">Loading interventions...</p>
// // //           </div>
// // //         ) : interventions.length === 0 ? (
// // //           <div className="text-center py-12">
// // //             <p className="text-sm text-gray-500">No interventions found</p>
// // //             <p className="text-xs text-gray-400 mt-1">Create your first intervention to get started</p>
// // //           </div>
// // //         ) : (
// // //           <div className="overflow-x-auto">
// // //             <table className="w-full">
// // //               <thead className="bg-gray-50 border-b">
// // //                 <tr>
// // //                   <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
// // //                   <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
// // //                   <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
// // //                   <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
// // //                   <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
// // //                   <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y">
// // //                 {interventions.map(intervention => (
// // //                   <tr key={intervention.id} className="hover:bg-gray-50">
// // //                     <td className="px-4 py-3 text-sm">{intervention.studentName}</td>
// // //                     <td className="px-4 py-3 text-sm">{intervention.interventionType}</td>
// // //                     <td className="px-4 py-3 text-sm">{intervention.title}</td>
// // //                     <td className="px-4 py-3 text-center">
// // //                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
// // //                         intervention.priority === 'urgent' ? 'bg-red-100 text-red-700' :
// // //                         intervention.priority === 'high' ? 'bg-orange-100 text-orange-700' :
// // //                         intervention.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
// // //                         'bg-green-100 text-green-700'
// // //                       }`}>
// // //                         {intervention.priority}
// // //                       </span>
// // //                     </td>
// // //                     <td className="px-4 py-3 text-center">
// // //                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
// // //                         intervention.status === 'completed' ? 'bg-green-100 text-green-700' :
// // //                         intervention.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
// // //                         intervention.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
// // //                         'bg-yellow-100 text-yellow-700'
// // //                       }`}>
// // //                         {intervention.status}
// // //                       </span>
// // //                     </td>
// // //                     <td className="px-4 py-3 text-center">
// // //                       <div className="flex justify-center gap-2">
// // //                         <button
// // //                           onClick={() => handleEdit(intervention)}
// // //                           className="p-1 text-blue-600 hover:bg-blue-50 rounded"
// // //                         >
// // //                           <FaEdit />
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleDelete(intervention.id)}
// // //                           className="p-1 text-red-600 hover:bg-red-50 rounded"
// // //                         >
// // //                           <FaTrash />
// // //                         </button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

















// import { useState, useEffect } from "react";
// import { FaSpinner, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
// import apiService from "../../../services/apiService";

// const HORIZON_STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

//   :root {
//     --primary-blue: #1a6fb5;
//     --blue-light: #2d8fd4;
//     --blue-deep: #0e4a80;
//     --accent-gold: #f0a500;
//     --slate: #3c4a5a;
//     --gray: #6b7a8d;
//     --light-bg: #f5f8fb;
//     --white: #ffffff;
//     --text-dark: #1e2c3a;
//     --font-heading: 'DM Serif Display', serif;
//     --font-body: 'DM Sans', sans-serif;
//   }

//   * { box-sizing: border-box; }

//   .horizon-input {
//     border: 1.5px solid rgba(26, 111, 181, 0.2);
//     border-radius: 8px;
//     background: var(--white);
//     color: var(--text-dark);
//     transition: all 0.2s ease;
//   }
//   .horizon-input:focus {
//     border-color: var(--primary-blue);
//     box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.08);
//     outline: none;
//   }

//   .horizon-btn-primary {
//     background: var(--primary-blue);
//     color: var(--white);
//     border: none;
//     border-radius: 8px;
//     font-weight: 600;
//     transition: all 0.25s ease;
//     box-shadow: 0 2px 8px rgba(26, 111, 181, 0.15);
//   }
//   .horizon-btn-primary:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 16px rgba(26, 111, 181, 0.25);
//   }

//   .horizon-btn-secondary {
//     background: transparent;
//     color: var(--primary-blue);
//     border: 1.5px solid var(--primary-blue);
//     border-radius: 8px;
//     font-weight: 600;
//     transition: all 0.25s ease;
//   }
//   .horizon-btn-secondary:hover {
//     background: rgba(26, 111, 181, 0.06);
//     transform: translateY(-2px);
//   }

//   .alert-success {
//     background: rgba(34, 197, 94, 0.08);
//     border: 1px solid rgba(34, 197, 94, 0.3);
//     color: #166534;
//   }
//   .alert-error {
//     background: rgba(220, 38, 38, 0.08);
//     border: 1px solid rgba(220, 38, 38, 0.3);
//     color: #991b1b;
//   }
// `;

// export default function InterventionsTab() {
//   const [classes, setClasses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [interventions, setInterventions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
  
//   const [formData, setFormData] = useState({
//     studentId: "",
//     classId: "",
//     interventionType: "Academic Support",
//     priority: "medium",
//     title: "",
//     description: "",
//     actionPlan: "",
//     expectedOutcome: "",
//     startDate: new Date().toISOString().split('T')[0],
//     targetDate: "",
//     status: "planned"
//   });

//   const [filters, setFilters] = useState({
//     classId: "",
//     status: ""
//   });

//   const interventionTypes = [
//     "Academic Support", "Behavioral Support", "Attendance Improvement",
//     "Counseling", "Parent Meeting", "Peer Mentoring", "Extra Classes",
//     "Home Visit", "Other"
//   ];

//   useEffect(() => {
//     loadClasses();
//     loadInterventions();
//   }, []);

//   useEffect(() => {
//     if (formData.classId) {
//       loadStudents();
//     }
//   }, [formData.classId]);

//   useEffect(() => {
//     loadInterventions();
//   }, [filters]);

//   const loadClasses = async () => {
//     try {
//       const result = await apiService.getMyClasses();
//       if (result.success) {
//         setClasses(result.classes || []);
//       }
//     } catch (error) {
//       console.error('Failed to load classes:', error);
//     }
//   };

//   const loadStudents = async () => {
//     try {
//       const result = await apiService.getStudents(formData.classId);
//       if (result.success) {
//         setStudents(result.students || []);
//       }
//     } catch (error) {
//       console.error('Failed to load students:', error);
//     }
//   };

//   const loadInterventions = async () => {
//     try {
//       setLoading(true);
//       const filterParams = {};
//       if (filters.classId) filterParams.classId = filters.classId;
//       if (filters.status) filterParams.status = filters.status;
      
//       const result = await apiService.getInterventions(filterParams);
//       if (result.success) {
//         setInterventions(result.interventions || []);
//       } else {
//         setInterventions([]);
//       }
//     } catch (error) {
//       console.error('Failed to load interventions:', error);
//       setInterventions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const resetForm = () => {
//     setFormData({
//       studentId: "",
//       classId: "",
//       interventionType: "Academic Support",
//       priority: "medium",
//       title: "",
//       description: "",
//       actionPlan: "",
//       expectedOutcome: "",
//       startDate: new Date().toISOString().split('T')[0],
//       targetDate: "",
//       status: "planned"
//     });
//     setEditingId(null);
//     setShowForm(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.studentId || !formData.classId) {
//       setMessage({ type: "error", text: "Please select class and student" });
//       return;
//     }

//     if (!formData.title || !formData.description) {
//       setMessage({ type: "error", text: "Please provide title and description" });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const interventionData = {
//         studentId: formData.studentId,
//         interventionType: formData.interventionType,
//         priority: formData.priority,
//         title: formData.title,
//         description: formData.description,
//         actionPlan: formData.actionPlan,
//         expectedOutcome: formData.expectedOutcome,
//         startDate: formData.startDate,
//         targetDate: formData.targetDate,
//         status: formData.status
//       };

//       let result;
//       if (editingId) {
//         result = await apiService.updateIntervention(editingId, interventionData);
//       } else {
//         result = await apiService.createIntervention(interventionData);
//       }
      
//       if (result.success) {
//         setMessage({ 
//           type: "success", 
//           text: editingId ? "✓ Intervention updated successfully!" : "✓ Intervention created successfully!" 
//         });
        
//         setTimeout(() => {
//           resetForm();
//           loadInterventions();
//           setMessage({ type: "", text: "" });
//         }, 2000);
//       } else {
//         setMessage({ type: "error", text: result.error || "Failed to save intervention" });
//       }
//     } catch (error) {
//       console.error('Intervention submission error:', error);
//       setMessage({ type: "error", text: error.message || "Failed to save intervention" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (intervention) => {
//     setFormData({
//       studentId: intervention.studentId,
//       classId: intervention.classId || "",
//       interventionType: intervention.interventionType,
//       priority: intervention.priority,
//       title: intervention.title,
//       description: intervention.description,
//       actionPlan: intervention.actionPlan || "",
//       expectedOutcome: intervention.expectedOutcome || "",
//       startDate: intervention.startDate,
//       targetDate: intervention.targetDate || "",
//       status: intervention.status
//     });
//     setEditingId(intervention.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this intervention?")) {
//       return;
//     }

//     try {
//       const result = await apiService.deleteIntervention(id);
//       if (result.success) {
//         setMessage({ type: "success", text: "✓ Intervention deleted successfully" });
//         loadInterventions();
//         setTimeout(() => setMessage({ type: "", text: "" }), 2000);
//       } else {
//         setMessage({ type: "error", text: result.error || "Failed to delete intervention" });
//       }
//     } catch (error) {
//       console.error('Delete intervention error:', error);
//       setMessage({ type: "error", text: "Failed to delete intervention" });
//     }
//   };

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: HORIZON_STYLES }} />

//       {/* Message Alert */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 ${
//           message.type === "success" ? "alert-success" : "alert-error"
//         }`}>
//           {message.type === "success" ? (
//             <FaCheckCircle className="mt-0.5 flex-shrink-0" />
//           ) : (
//             <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
//           )}
//           <span>{message.text}</span>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>
//             Student Interventions
//           </h3>
//           <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>Track and manage intervention plans</p>
//         </div>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="horizon-btn-primary px-4 py-2.5 text-sm inline-flex items-center gap-2"
//         >
//           <FaPlus className="text-xs" />
//           {showForm ? "Cancel" : "Add Intervention"}
//         </button>
//       </div>

//       {/* Form */}
//       {showForm && (
//         <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-lg" style={{ background: 'var(--light-bg)', border: '1px solid rgba(26, 111, 181, 0.12)' }}>
//           <h4 className="text-md font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>
//             {editingId ? "Edit Intervention" : "New Intervention"}
//           </h4>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Class */}
//             <div>
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Class <span style={{ color: 'var(--accent-gold)' }}>*</span>
//               </label>
//               <select
//                 name="classId"
//                 value={formData.classId}
//                 onChange={handleInputChange}
//                 className="w-full horizon-input px-4 py-2.5 text-sm"
//                 required
//               >
//                 <option value="">Choose a class</option>
//                 {classes.map(cls => (
//                   <option key={cls.id} value={cls.id}>
//                     {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Student */}
//             <div>
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Student <span style={{ color: 'var(--accent-gold)' }}>*</span>
//               </label>
//               <select
//                 name="studentId"
//                 value={formData.studentId}
//                 onChange={handleInputChange}
//                 className="w-full horizon-input px-4 py-2.5 text-sm"
//                 required
//                 disabled={!formData.classId}
//               >
//                 <option value="">Select student</option>
//                 {students.map(student => (
//                   <option key={student.id} value={student.id}>
//                     {student.name} ({student.enrollmentNo})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Type */}
//             <div>
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Type <span style={{ color: 'var(--accent-gold)' }}>*</span>
//               </label>
//               <select
//                 name="interventionType"
//                 value={formData.interventionType}
//                 onChange={handleInputChange}
//                 className="w-full horizon-input px-4 py-2.5 text-sm"
//                 required
//               >
//                 {interventionTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Priority */}
//             <div>
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Priority <span style={{ color: 'var(--accent-gold)' }}>*</span>
//               </label>
//               <select
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleInputChange}
//                 className="w-full horizon-input px-4 py-2.5 text-sm"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//                 <option value="urgent">Urgent</option>
//               </select>
//             </div>

//             {/* Start Date */}
//             <div>
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Start Date <span style={{ color: 'var(--accent-gold)' }}>*</span>
//               </label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleInputChange}
//                 className="w-full horizon-input px-4 py-2.5 text-sm"
//                 required
//               />
//             </div>

//             {/* Target Date */}
//             <div>
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Target Date
//               </label>
//               <input
//                 type="date"
//                 name="targetDate"
//                 value={formData.targetDate}
//                 onChange={handleInputChange}
//                 min={formData.startDate}
//                 className="w-full horizon-input px-4 py-2.5 text-sm"
//               />
//             </div>

//             {/* Status */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 className="w-full horizon-input px-4 py-2.5 text-sm"
//               >
//                 <option value="planned">Planned</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>

//             {/* Title */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Title <span style={{ color: 'var(--accent-gold)' }}>*</span>
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="Brief title for the intervention"
//                 className="w-full horizon-input px-4 py-2.5 text-sm"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Description <span style={{ color: 'var(--accent-gold)' }}>*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="3"
//                 placeholder="Describe the issue or concern..."
//                 className="w-full horizon-input px-4 py-3 text-sm resize-none"
//                 required
//               />
//             </div>

//             {/* Action Plan */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Action Plan
//               </label>
//               <textarea
//                 name="actionPlan"
//                 value={formData.actionPlan}
//                 onChange={handleInputChange}
//                 rows="3"
//                 placeholder="Specific actions to be taken..."
//                 className="w-full horizon-input px-4 py-3 text-sm resize-none"
//               />
//             </div>

//             {/* Expected Outcome */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
//                 Expected Outcome
//               </label>
//               <textarea
//                 name="expectedOutcome"
//                 value={formData.expectedOutcome}
//                 onChange={handleInputChange}
//                 rows="2"
//                 placeholder="What do you expect to achieve..."
//                 className="w-full horizon-input px-4 py-3 text-sm resize-none"
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="flex justify-end gap-3 mt-6">
//             <button
//               type="button"
//               onClick={resetForm}
//               className="horizon-btn-secondary px-4 py-2.5 text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 editingId ? "Update Intervention" : "Create Intervention"
//               )}
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Filters */}
//       <div className="mb-6 p-4 rounded-lg" style={{ background: 'var(--white)', border: '1px solid rgba(26, 111, 181, 0.12)' }}>
//         <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-dark)' }}>Filters</h4>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--gray)' }}>Class</label>
//             <select
//               name="classId"
//               value={filters.classId}
//               onChange={handleFilterChange}
//               className="w-full horizon-input px-4 py-2.5 text-sm"
//             >
//               <option value="">All Classes</option>
//               {classes.map(cls => (
//                 <option key={cls.id} value={cls.id}>{cls.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--gray)' }}>Status</label>
//             <select
//               name="status"
//               value={filters.status}
//               onChange={handleFilterChange}
//               className="w-full horizon-input px-4 py-2.5 text-sm"
//             >
//               <option value="">All Status</option>
//               <option value="planned">Planned</option>
//               <option value="in-progress">In Progress</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Interventions List */}
//       <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
//         {loading ? (
//           <div className="text-center py-12">
//             <FaSpinner className="animate-spin text-2xl mx-auto mb-2" style={{ color: 'var(--primary-blue)' }} />
//             <p className="text-sm" style={{ color: 'var(--gray)' }}>Loading interventions...</p>
//           </div>
//         ) : interventions.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-sm" style={{ color: 'var(--gray)' }}>No interventions found</p>
//             <p className="text-xs mt-1" style={{ color: 'var(--gray)', opacity: 0.7 }}>Create your first intervention to get started</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
//                 <tr>
//                   <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Student</th>
//                   <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Type</th>
//                   <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Title</th>
//                   <th className="text-center px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>Priority</th>
//                   <th className="text-center px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>Status</th>
//                   <th className="text-center px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {interventions.map((intervention, idx) => (
//                   <tr key={intervention.id} style={{ borderBottom: '1px solid rgba(26, 111, 181, 0.06)' }}>
//                     <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-dark)' }}>{intervention.studentName}</td>
//                     <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-dark)' }}>{intervention.interventionType}</td>
//                     <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-dark)' }}>{intervention.title}</td>
//                     <td className="px-4 py-3 text-center">
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
//                         intervention.priority === 'urgent' ? 'bg-red-100 text-red-700' :
//                         intervention.priority === 'high' ? 'bg-orange-100 text-orange-700' :
//                         intervention.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
//                         'bg-green-100 text-green-700'
//                       }`}>
//                         {intervention.priority}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
//                         intervention.status === 'completed' ? 'bg-green-100 text-green-700' :
//                         intervention.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
//                         intervention.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
//                         'bg-yellow-100 text-yellow-700'
//                       }`}>
//                         {intervention.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => handleEdit(intervention)}
//                           className="p-2 rounded-lg transition-all hover:bg-blue-50"
//                           style={{ color: 'var(--primary-blue)' }}
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(intervention.id)}
//                           className="p-2 rounded-lg transition-all hover:bg-red-50 text-red-600"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }



















import { useState, useEffect } from "react";
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle, FaTimes, FaPhone, FaSms, FaEnvelope, FaUser } from "react-icons/fa";
import apiService from "../../../services/apiService";

const HORIZON_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --primary-blue: #1a6fb5;
    --blue-light: #2d8fd4;
    --blue-deep: #0e4a80;
    --accent-gold: #f0a500;
    --slate: #3c4a5a;
    --gray: #6b7a8d;
    --light-bg: #f5f8fb;
    --white: #ffffff;
    --text-dark: #1e2c3a;
    --font-heading: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
    --success-green: #10b981;
    --warning-orange: #f59e0b;
    --error-red: #ef4444;
  }

  * { box-sizing: border-box; }

  body { font-family: var(--font-body); }

  .horizon-input {
    border: 1.5px solid rgba(26, 111, 181, 0.2);
    border-radius: 8px;
    background: var(--white);
    color: var(--text-dark);
    transition: all 0.2s ease;
    font-family: var(--font-body);
  }
  .horizon-input:focus {
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.08);
    outline: none;
  }

  .horizon-btn-primary {
    background: var(--primary-blue);
    color: var(--white);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.25s ease;
    box-shadow: 0 2px 8px rgba(26, 111, 181, 0.15);
    cursor: pointer;
    font-family: var(--font-body);
  }
  .horizon-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(26, 111, 181, 0.25);
  }
  .horizon-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .horizon-btn-secondary {
    background: transparent;
    color: var(--primary-blue);
    border: 1.5px solid var(--primary-blue);
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.25s ease;
    cursor: pointer;
    font-family: var(--font-body);
  }
  .horizon-btn-secondary:hover {
    background: rgba(26, 111, 181, 0.06);
    transform: translateY(-2px);
  }

  .horizon-btn-small {
    background: transparent;
    color: var(--primary-blue);
    border: none;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    font-family: var(--font-body);
  }
  .horizon-btn-small:hover {
    background: rgba(26, 111, 181, 0.08);
  }

  .alert-success {
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #065f46;
  }
  .alert-error {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #7f1d1d;
  }

  .section-card {
    background: var(--white);
    border: 1px solid rgba(26, 111, 181, 0.12);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.4rem;
  }

  .form-required {
    color: var(--accent-gold);
  }

  .channel-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .channel-btn {
    padding: 0.75rem 1rem;
    border: 1.5px solid rgba(26, 111, 181, 0.2);
    border-radius: 8px;
    background: var(--white);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    font-family: var(--font-body);
  }

  .channel-btn:hover {
    border-color: var(--primary-blue);
    background: rgba(26, 111, 181, 0.05);
  }

  .channel-btn.active {
    background: var(--primary-blue);
    color: var(--white);
    border-color: var(--primary-blue);
  }

  .message-preview {
    background: rgba(26, 111, 181, 0.04);
    border-left: 3px solid var(--primary-blue);
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--text-dark);
    line-height: 1.5;
    margin-top: 0.5rem;
  }

  .history-table {
    width: 100%;
    border-collapse: collapse;
  }

  .history-table thead {
    background: var(--light-bg);
    border-bottom: 1px solid rgba(26, 111, 181, 0.08);
  }

  .history-table th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .history-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(26, 111, 181, 0.06);
    color: var(--text-dark);
    font-size: 0.875rem;
  }

  .history-table tbody tr:hover {
    background: rgba(26, 111, 181, 0.03);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .badge-pending {
    background: rgba(245, 158, 11, 0.1);
    color: #b45309;
  }

  .badge-completed {
    background: rgba(16, 185, 129, 0.1);
    color: #065f46;
  }

  .badge-counseling {
    background: rgba(139, 92, 246, 0.1);
    color: #5b21b6;
  }

  .badge-communication {
    background: rgba(59, 130, 246, 0.1);
    color: #1e40af;
  }

  .badge-action {
    background: rgba(34, 197, 94, 0.1);
    color: #166534;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn.edit {
    color: var(--primary-blue);
  }

  .action-btn.edit:hover {
    background: rgba(26, 111, 181, 0.1);
  }

  .action-btn.delete {
    color: var(--error-red);
  }

  .action-btn.delete:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
  }

  .empty-state-icon {
    font-size: 2rem;
    color: var(--gray);
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }

  .empty-state-text {
    color: var(--gray);
    font-size: 0.875rem;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid rgba(26, 111, 181, 0.08);
  }

  .tab-btn {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--gray);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);
    font-size: 0.95rem;
  }

  .tab-btn:hover {
    color: var(--primary-blue);
  }

  .tab-btn.active {
    color: var(--primary-blue);
    border-bottom-color: var(--primary-blue);
  }

  .divider {
    height: 1px;
    background: rgba(26, 111, 181, 0.08);
    margin: 1.5rem 0;
  }
`;

export default function InterventionsTab() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [activeSection, setActiveSection] = useState("communication"); // "communication" or "actions"
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);
  const [showActionsForm, setShowActionsForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Communication Form
  const [communicationForm, setCommunicationForm] = useState({
    classId: "",
    studentId: "",
    interventionType: "Parent Communication",
    channel: "Phone Call",
    contactTarget: "Parent",
    message: "",
    followUpDate: "",
    status: "Pending"
  });

  // Actions Form
  const [actionsForm, setActionsForm] = useState({
    classId: "",
    studentId: "",
    actionType: "Counseling Done",
    description: "",
    outcome: "",
    actionDate: new Date().toISOString().split('T')[0],
    nextStep: ""
  });

  // Filters
  const [filters, setFilters] = useState({
    classId: "",
    type: ""
  });

  const communicationTypes = ["Parent Communication", "Attendance Warning", "Counseling", "Academic Support", "Home Visit", "Other"];
  const actionTypes = ["Counseling Done", "Parent Meeting Held", "Extra Class Conducted", "Home Visit Completed", "Other"];

  // Load data on mount
  useEffect(() => {
    loadClasses();
    loadInterventions();
  }, []);

  // Load students when class changes
  useEffect(() => {
    if (communicationForm.classId) {
      loadStudents(communicationForm.classId);
    }
  }, [communicationForm.classId]);

  useEffect(() => {
    if (actionsForm.classId) {
      loadStudents(actionsForm.classId);
    }
  }, [actionsForm.classId]);

  // Load interventions when filters change
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

  const loadStudents = async (classId) => {
    try {
      const result = await apiService.getStudents(classId);
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
      const filterParams = {};
      if (filters.classId) filterParams.classId = filters.classId;
      if (filters.type) filterParams.type = filters.type;
      
      const result = await apiService.getInterventions(filterParams);
      if (result.success) {
        setInterventions(result.interventions || []);
      } else {
        setInterventions([]);
      }
    } catch (error) {
      console.error('Failed to load interventions:', error);
      setInterventions([]);
    } finally {
      setLoading(false);
    }
  };

  // Communication Form Handlers
  const handleCommunicationChange = (e) => {
    const { name, value } = e.target;
    setCommunicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChannelChange = (channel) => {
    setCommunicationForm(prev => ({ ...prev, channel }));
  };

  const handleContactTargetChange = (target) => {
    setCommunicationForm(prev => ({ ...prev, contactTarget: target }));
  };

  const generateAutoMessage = () => {
    const studentName = students.find(s => s.id === communicationForm.studentId)?.name || "Student";
    
    const templates = {
      "Parent Communication": `Dear Parent/Guardian,\n\nWe are reaching out regarding ${studentName}'s progress at school. We would like to discuss this matter with you at your earliest convenience.\n\nBest regards,\nSchool Administration`,
      "Attendance Warning": `Dear Parent/Guardian,\n\nWe have noticed that ${studentName} has had several absences recently. Regular attendance is crucial for academic success. Please ensure ${studentName} attends school regularly.\n\nBest regards,\nSchool Administration`,
      "Academic Support": `Dear Parent/Guardian,\n\nWe wanted to inform you that ${studentName} may benefit from additional academic support. We are happy to discuss ways to help improve performance.\n\nBest regards,\nSchool Administration`,
      "Counseling": `Dear Parent/Guardian,\n\nWe would like to schedule a counseling session for ${studentName} to support their overall well-being. Please let us know your availability.\n\nBest regards,\nSchool Administration`,
      "Home Visit": `Dear Parent/Guardian,\n\nAs part of our engagement program, we would like to schedule a home visit to discuss ${studentName}'s progress. Please let us know a convenient time.\n\nBest regards,\nSchool Administration`
    };

    const template = templates[communicationForm.interventionType] || templates["Parent Communication"];
    setCommunicationForm(prev => ({ ...prev, message: template }));
  };

  const resetCommunicationForm = () => {
    setCommunicationForm({
      classId: "",
      studentId: "",
      interventionType: "Parent Communication",
      channel: "Phone Call",
      contactTarget: "Parent",
      message: "",
      followUpDate: "",
      status: "Pending"
    });
    setEditingId(null);
    setShowCommunicationForm(false);
  };

  const resetActionsForm = () => {
    setActionsForm({
      classId: "",
      studentId: "",
      actionType: "Counseling Done",
      description: "",
      outcome: "",
      actionDate: new Date().toISOString().split('T')[0],
      nextStep: ""
    });
    setEditingId(null);
    setShowActionsForm(false);
  };

  const handleCommunicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!communicationForm.classId || !communicationForm.studentId) {
      setMessage({ type: "error", text: "Please select class and student" });
      return;
    }

    if ((communicationForm.channel === "SMS" || communicationForm.channel === "Email") && !communicationForm.message) {
      setMessage({ type: "error", text: "Please provide a message" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = {
        studentId: communicationForm.studentId,
        interventionType: communicationForm.interventionType,
        title: `${communicationForm.channel} - ${communicationForm.contactTarget}`,
        description: communicationForm.message || `${communicationForm.channel} communication with ${communicationForm.contactTarget}`,
        actionPlan: communicationForm.followUpDate ? `Follow up on ${communicationForm.followUpDate}` : null,
        startDate: new Date().toISOString().split('T')[0],
        targetDate: communicationForm.followUpDate || null,
        status: communicationForm.status.toLowerCase(),
        priority: "medium"
      };

      let result;
      if (editingId) {
        result = await apiService.updateIntervention(editingId, data);
      } else {
        result = await apiService.createIntervention(data);
      }
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: editingId ? "✓ Communication updated successfully!" : "✓ Communication logged successfully!" 
        });
        
        setTimeout(() => {
          resetCommunicationForm();
          loadInterventions();
          setMessage({ type: "", text: "" });
        }, 1500);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save" });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: "error", text: error.message || "Failed to save" });
    } finally {
      setLoading(false);
    }
  };

  const handleActionsSubmit = async (e) => {
    e.preventDefault();
    
    if (!actionsForm.classId || !actionsForm.studentId) {
      setMessage({ type: "error", text: "Please select class and student" });
      return;
    }

    if (!actionsForm.description) {
      setMessage({ type: "error", text: "Please describe the action taken" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = {
        studentId: actionsForm.studentId,
        interventionType: actionsForm.actionType, // Map actionType to interventionType
        title: actionsForm.actionType, // Use actionType as title
        description: actionsForm.description,
        actionPlan: actionsForm.nextStep || null,
        expectedOutcome: actionsForm.outcome || null,
        startDate: actionsForm.actionDate,
        status: "completed", // Actions are completed by default
        priority: "medium"
      };

      let result;
      if (editingId) {
        result = await apiService.updateIntervention(editingId, data);
      } else {
        result = await apiService.createIntervention(data);
      }
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: editingId ? "✓ Action updated successfully!" : "✓ Action logged successfully!" 
        });
        
        setTimeout(() => {
          resetActionsForm();
          loadInterventions();
          setMessage({ type: "", text: "" });
        }, 1500);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save" });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: "error", text: error.message || "Failed to save" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (intervention) => {
    if (intervention.type === "communication") {
      setCommunicationForm({
        classId: intervention.classId || "",
        studentId: intervention.studentId,
        interventionType: intervention.interventionType,
        channel: intervention.channel || "Phone Call",
        contactTarget: intervention.contactTarget || "Parent",
        message: intervention.message || "",
        followUpDate: intervention.followUpDate || "",
        status: intervention.status
      });
      setEditingId(intervention.id);
      setShowCommunicationForm(true);
      setActiveSection("communication");
    } else {
      setActionsForm({
        classId: intervention.classId || "",
        studentId: intervention.studentId,
        actionType: intervention.actionType,
        description: intervention.description || "",
        outcome: intervention.outcome || "",
        actionDate: intervention.actionDate,
        nextStep: intervention.nextStep || ""
      });
      setEditingId(intervention.id);
      setShowActionsForm(true);
      setActiveSection("actions");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      const result = await apiService.deleteIntervention(id);
      if (result.success) {
        setMessage({ type: "success", text: "✓ Entry deleted successfully" });
        loadInterventions();
        setTimeout(() => setMessage({ type: "", text: "" }), 1500);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete" });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  const getChannelIcon = (channel) => {
    switch(channel) {
      case "Phone Call": return <FaPhone />;
      case "SMS": return <FaSms />;
      case "Email": return <FaEnvelope />;
      case "In-person Meeting": return <FaUser />;
      default: return null;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HORIZON_STYLES }} />

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 ${
          message.type === "success" ? "alert-success" : "alert-error"
        }`}>
          {message.type === "success" ? (
            <FaCheckCircle className="mt-0.5 flex-shrink-0" />
          ) : (
            <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>
            Intervention Actions
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>Fast tracking for student support interventions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeSection === "communication" ? "active" : ""}`}
          onClick={() => setActiveSection("communication")}
        >
          💬 Quick Communication
        </button>
        <button
          className={`tab-btn ${activeSection === "actions" ? "active" : ""}`}
          onClick={() => setActiveSection("actions")}
        >
          📋 Action & Notes Log
        </button>
      </div>

      {/* SECTION 1: QUICK COMMUNICATION */}
      {activeSection === "communication" && (
        <>
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h4 className="section-title">
                ⚡ Quick Communication Intervention
              </h4>
              <button
                onClick={() => setShowCommunicationForm(!showCommunicationForm)}
                className="horizon-btn-primary px-4 py-2.5 text-sm inline-flex items-center gap-2"
              >
                <FaPlus className="text-xs" />
                {showCommunicationForm ? "Cancel" : "New Communication"}
              </button>
            </div>

            {showCommunicationForm && (
              <form onSubmit={handleCommunicationSubmit} className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(26, 111, 181, 0.1)' }}>
                
                {/* Class & Student */}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Class <span className="form-required">*</span>
                    </label>
                    <select
                      name="classId"
                      value={communicationForm.classId}
                      onChange={handleCommunicationChange}
                      className="horizon-input px-4 py-2.5 text-sm"
                      required
                    >
                      <option value="">Select class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Student <span className="form-required">*</span>
                    </label>
                    <select
                      name="studentId"
                      value={communicationForm.studentId}
                      onChange={handleCommunicationChange}
                      className="horizon-input px-4 py-2.5 text-sm"
                      disabled={!communicationForm.classId}
                      required
                    >
                      <option value="">Select student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.enrollmentNo})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type & Intervention */}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Communication Type <span className="form-required">*</span>
                    </label>
                    <select
                      name="interventionType"
                      value={communicationForm.interventionType}
                      onChange={handleCommunicationChange}
                      className="horizon-input px-4 py-2.5 text-sm"
                      required
                    >
                      {communicationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Contact Target <span className="form-required">*</span>
                    </label>
                    <div className="channel-selector">
                      {["Parent", "Student"].map(target => (
                        <button
                          key={target}
                          type="button"
                          className={`channel-btn ${communicationForm.contactTarget === target ? "active" : ""}`}
                          onClick={() => handleContactTargetChange(target)}
                        >
                          {target}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Channel Selection */}
                <div className="form-group mb-4">
                  <label className="form-label">
                    Channel <span className="form-required">*</span>
                  </label>
                  <div className="channel-selector">
                    {["Phone Call", "SMS", "Email", "In-person Meeting"].map(ch => (
                      <button
                        key={ch}
                        type="button"
                        className={`channel-btn ${communicationForm.channel === ch ? "active" : ""}`}
                        onClick={() => handleChannelChange(ch)}
                      >
                        {getChannelIcon(ch)}
                        <span>{ch}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea - Only for SMS/Email */}
                {(communicationForm.channel === "SMS" || communicationForm.channel === "Email") && (
                  <div className="form-group mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="form-label">
                        Message <span className="form-required">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={generateAutoMessage}
                        className="horizon-btn-small inline-flex items-center gap-1"
                      >
                        <FaWand2 /> Auto Generate
                      </button>
                    </div>
                    <textarea
                      name="message"
                      value={communicationForm.message}
                      onChange={handleCommunicationChange}
                      rows="4"
                      placeholder="Type your message here or click 'Auto Generate' for a template..."
                      className="horizon-input px-4 py-3 text-sm resize-none"
                    />
                    {communicationForm.message && (
                      <div className="message-preview">
                        <strong>Preview:</strong><br/>{communicationForm.message}
                      </div>
                    )}
                  </div>
                )}

                {/* Follow-up Date */}
                <div className="form-grid mb-4">
                  <div className="form-group">
                    <label className="form-label">Follow-up Date</label>
                    <input
                      type="date"
                      name="followUpDate"
                      value={communicationForm.followUpDate}
                      onChange={handleCommunicationChange}
                      className="horizon-input px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={communicationForm.status}
                      onChange={handleCommunicationChange}
                      className="horizon-input px-4 py-2.5 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(26, 111, 181, 0.1)' }}>
                  <button
                    type="button"
                    onClick={resetCommunicationForm}
                    className="horizon-btn-secondary px-4 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingId ? "Update Communication" : "Log Communication"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}

      {/* SECTION 2: ACTION & NOTES LOG */}
      {activeSection === "actions" && (
        <>
          <div className="section-card">
            <div className="flex justify-between items-center mb-4">
              <h4 className="section-title">
                📝 Action & Follow-up Notes
              </h4>
              <button
                onClick={() => setShowActionsForm(!showActionsForm)}
                className="horizon-btn-primary px-4 py-2.5 text-sm inline-flex items-center gap-2"
              >
                <FaPlus className="text-xs" />
                {showActionsForm ? "Cancel" : "New Action"}
              </button>
            </div>

            {showActionsForm && (
              <form onSubmit={handleActionsSubmit} className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(26, 111, 181, 0.1)' }}>
                
                {/* Class & Student */}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Class <span className="form-required">*</span>
                    </label>
                    <select
                      name="classId"
                      value={actionsForm.classId}
                      onChange={(e) => setActionsForm(prev => ({ ...prev, classId: e.target.value }))}
                      className="horizon-input px-4 py-2.5 text-sm"
                      required
                    >
                      <option value="">Select class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Student <span className="form-required">*</span>
                    </label>
                    <select
                      name="studentId"
                      value={actionsForm.studentId}
                      onChange={(e) => setActionsForm(prev => ({ ...prev, studentId: e.target.value }))}
                      className="horizon-input px-4 py-2.5 text-sm"
                      disabled={!actionsForm.classId}
                      required
                    >
                      <option value="">Select student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.enrollmentNo})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Type & Date */}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Action Type <span className="form-required">*</span>
                    </label>
                    <select
                      name="actionType"
                      value={actionsForm.actionType}
                      onChange={(e) => setActionsForm(prev => ({ ...prev, actionType: e.target.value }))}
                      className="horizon-input px-4 py-2.5 text-sm"
                      required
                    >
                      {actionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Date <span className="form-required">*</span>
                    </label>
                    <input
                      type="date"
                      name="actionDate"
                      value={actionsForm.actionDate}
                      onChange={(e) => setActionsForm(prev => ({ ...prev, actionDate: e.target.value }))}
                      className="horizon-input px-4 py-2.5 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group mb-4">
                  <label className="form-label">
                    What did you do? <span className="form-required">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={actionsForm.description}
                    onChange={(e) => setActionsForm(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    placeholder="Describe the action taken..."
                    className="horizon-input px-4 py-3 text-sm resize-none"
                    required
                  />
                </div>

                {/* Outcome */}
                <div className="form-group mb-4">
                  <label className="form-label">Outcome (What changed?)</label>
                  <textarea
                    name="outcome"
                    value={actionsForm.outcome}
                    onChange={(e) => setActionsForm(prev => ({ ...prev, outcome: e.target.value }))}
                    rows="3"
                    placeholder="Describe any changes observed..."
                    className="horizon-input px-4 py-3 text-sm resize-none"
                  />
                </div>

                {/* Next Step */}
                <div className="form-group mb-4">
                  <label className="form-label">Next Step</label>
                  <input
                    type="text"
                    name="nextStep"
                    value={actionsForm.nextStep}
                    onChange={(e) => setActionsForm(prev => ({ ...prev, nextStep: e.target.value }))}
                    placeholder="What's the next action needed?"
                    className="horizon-input px-4 py-2.5 text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(26, 111, 181, 0.1)' }}>
                  <button
                    type="button"
                    onClick={resetActionsForm}
                    className="horizon-btn-secondary px-4 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingId ? "Update Action" : "Log Action"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}

      <div className="divider"></div>

      {/* FILTERS */}
      <div className="section-card">
        <h4 className="section-title">🔍 History Filters</h4>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Class</label>
            <select
              name="classId"
              value={filters.classId}
              onChange={(e) => setFilters(prev => ({ ...prev, classId: e.target.value }))}
              className="horizon-input px-4 py-2.5 text-sm"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="horizon-input px-4 py-2.5 text-sm"
            >
              <option value="">All Types</option>
              <option value="communication">Communication</option>
              <option value="action">Action</option>
            </select>
          </div>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="section-card">
        <h4 className="section-title">📊 Intervention History</h4>
        
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaSpinner className="animate-spin" style={{ fontSize: '2rem' }} />
            </div>
            <p className="empty-state-text">Loading interventions...</p>
          </div>
        ) : interventions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">No interventions logged yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Channel/Action</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interventions.map((intervention) => (
                  <tr key={intervention.id}>
                    <td><strong>{intervention.studentName}</strong></td>
                    <td>
                      <span className={`badge ${intervention.type === 'communication' ? 'badge-communication' : 'badge-action'}`}>
                        {intervention.type === 'communication' ? '💬 Communication' : '📋 Action'}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div><strong>{intervention.interventionType || intervention.actionType}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '0.25rem' }}>
                          {intervention.type === 'communication' 
                            ? `${intervention.contactTarget} - ${intervention.message?.substring(0, 40)}...`
                            : intervention.description?.substring(0, 40) + '...'
                          }
                        </div>
                      </div>
                    </td>
                    <td>
                      {intervention.channel ? (
                        <div className="flex items-center gap-1">
                          {getChannelIcon(intervention.channel)}
                          <span>{intervention.channel}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--gray)' }}>—</span>
                      )}
                    </td>
                    <td>
                      {intervention.followUpDate || intervention.actionDate 
                        ? new Date(intervention.followUpDate || intervention.actionDate).toLocaleDateString()
                        : '—'
                      }
                    </td>
                    <td>
                      <span className={`badge ${intervention.status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>
                        {intervention.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(intervention)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(intervention.id)}
                          className="action-btn delete"
                          title="Delete"
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
    </>
  );
}