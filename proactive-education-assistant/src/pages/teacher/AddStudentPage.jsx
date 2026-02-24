// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { FaPlus, FaSpinner, FaUpload, FaDownload, FaUser, FaFileExcel } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import apiService from "../../services/apiService";

// export default function AddStudentPage() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const classIdFromUrl = searchParams.get('class');

//   const [activeTab, setActiveTab] = useState("single");
//   const [loading, setLoading] = useState(false);
//   const [classes, setClasses] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     enrollmentNo: "",
//     classId: classIdFromUrl || "",
//     dateOfBirth: "",
//     gender: "",
//     contact: "",
//     email: "",
//     address: "",
//     parentName: "",
//     parentContact: "",
//     parentEmail: "",
//   });
//   const [bulkFile, setBulkFile] = useState(null);
//   const [bulkClassId, setBulkClassId] = useState(classIdFromUrl || "");
//   const [parsedData, setParsedData] = useState([]);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   useEffect(() => {
//     loadClasses();
//   }, []);

//   const loadClasses = async () => {
//     try {
//       const result = await apiService.getMyClasses();
      
//       if (result.success) {
//         const inchargeClasses = (result.classes || []).filter(
//           c => c.role === 'incharge' || c.role === 'both'
//         );
//         setClasses(inchargeClasses);
        
//         if (inchargeClasses.length === 0) {
//           setMessage({ 
//             type: "error", 
//             text: "You are not assigned as class incharge to any classes. Please contact your administrator." 
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Failed to load classes:', error);
//       setMessage({ type: "error", text: "Failed to load classes: " + error.message });
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.name || !formData.enrollmentNo || !formData.classId) {
//       setMessage({ type: "error", text: "Please fill in all required fields" });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const result = await apiService.createStudent(formData);
      
//       if (result.success) {
//         setMessage({ type: "success", text: "Student added successfully!" });
        
//         setTimeout(() => {
//           setFormData({
//             name: "",
//             enrollmentNo: "",
//             classId: classIdFromUrl || "",
//             dateOfBirth: "",
//             gender: "",
//             contact: "",
//             email: "",
//             address: "",
//             parentName: "",
//             parentContact: "",
//             parentEmail: "",
//           });
//           setMessage({ type: "", text: "" });
//         }, 2000);
//       } else {
//         setMessage({ type: "error", text: result.error || "Failed to add student" });
//       }
//     } catch (error) {
//       console.error('Add student error:', error);
//       setMessage({ type: "error", text: error.message || "Failed to add student" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     const fileExtension = file.name.split('.').pop().toLowerCase();
//     if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
//       setMessage({ type: "error", text: "Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)" });
//       return;
//     }

//     setBulkFile(file);
//     setMessage({ type: "", text: "" });
//     setParsedData([]);

//     try {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         try {
//           const data = new Uint8Array(event.target.result);
//           const workbook = XLSX.read(data, { type: 'array', cellDates: true });
//           const sheetName = workbook.SheetNames[0];
//           const worksheet = workbook.Sheets[sheetName];
          
//           // Convert to JSON with header row
//           const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
//             raw: false,
//             dateNF: 'mm/dd/yyyy'
//           });
          
//           if (jsonData.length === 0) {
//             setMessage({ type: "error", text: "No data found in file. Please check the file format." });
//             setBulkFile(null);
//             return;
//           }

//           // Validate required columns
//           const firstRow = jsonData[0];
//           const requiredColumns = ['Name', 'Enrollment No'];
//           const missingColumns = requiredColumns.filter(col => !(col in firstRow));
          
//           if (missingColumns.length > 0) {
//             setMessage({ 
//               type: "error", 
//               text: `Missing required columns: ${missingColumns.join(', ')}. Please use the template format.` 
//             });
//             setBulkFile(null);
//             return;
//           }

//           // Validate data
//           const validData = [];
//           const errors = [];
          
//           jsonData.forEach((row, index) => {
//             const rowNum = index + 2; // +2 because Excel rows start at 1 and we have header
            
//             if (!row.Name || !row['Enrollment No']) {
//               errors.push(`Row ${rowNum}: Name and Enrollment No are required`);
//             } else {
//               validData.push(row);
//             }
//           });

//           if (errors.length > 0 && validData.length === 0) {
//             setMessage({ 
//               type: "error", 
//               text: `Validation failed: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}` 
//             });
//             setBulkFile(null);
//             return;
//           }

//           setParsedData(validData);
          
//           let successMsg = `File parsed successfully! Found ${validData.length} valid student(s).`;
//           if (errors.length > 0) {
//             successMsg += ` ${errors.length} row(s) skipped due to missing required fields.`;
//           }
          
//           setMessage({ type: "success", text: successMsg });
          
//         } catch (error) {
//           console.error('Parse error:', error);
//           setMessage({ 
//             type: "error", 
//             text: "Failed to parse file. Please ensure it matches the template format." 
//           });
//           setBulkFile(null);
//           setParsedData([]);
//         }
//       };
      
//       reader.onerror = () => {
//         setMessage({ type: "error", text: "Failed to read file. Please try again." });
//         setBulkFile(null);
//       };
      
//       reader.readAsArrayBuffer(file);
      
//     } catch (error) {
//       console.error('Import error:', error);
//       setMessage({ 
//         type: "error", 
//         text: "Failed to read file: " + error.message 
//       });
//       setBulkFile(null);
//     }
//   };

//   const handleBulkUpload = async () => {
//     if (!bulkClassId) {
//       setMessage({ type: "error", text: "Please select a class first" });
//       return;
//     }

//     if (parsedData.length === 0) {
//       setMessage({ type: "error", text: "Please upload a file with student data" });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       // Helper function to parse date
//       const parseDate = (dateStr) => {
//         if (!dateStr) return null;
        
//         // Handle various date formats
//         try {
//           // If it's already a date object
//           if (dateStr instanceof Date) {
//             return dateStr.toISOString().split('T')[0];
//           }
          
//           // Try parsing common formats: M/D/YYYY, MM/DD/YYYY, YYYY-MM-DD
//           const date = new Date(dateStr);
//           if (!isNaN(date.getTime())) {
//             return date.toISOString().split('T')[0];
//           }
//         } catch (e) {
//           console.warn('Date parse error:', e);
//         }
        
//         return null;
//       };

//       // Map the parsed data to the expected format
//       const students = parsedData.map((row, index) => {
//         const student = {
//           name: String(row.Name || row.name || "").trim(),
//           enrollmentNo: String(row['Enrollment No'] || row.enrollmentNo || row['Enrollment Number'] || "").trim(),
//           dateOfBirth: parseDate(row.DOB || row.dateOfBirth || row['Date of Birth']),
//           gender: row.Gender || row.gender || null,
//           contact: row.Contact || row.contact || row['Contact Number'] || null,
//           email: row.Email || row.email || null,
//           address: row.Address || row.address || null,
//           parentName: row['Parent Name'] || row.parentName || null,
//           parentContact: row['Parent Contact'] || row.parentContact || null,
//           parentEmail: row['Parent Email'] || row.parentEmail || null,
//         };

//         // Clean up contact numbers (remove spaces, dashes)
//         if (student.contact) {
//           student.contact = String(student.contact).replace(/[\s-]/g, '');
//         }
//         if (student.parentContact) {
//           student.parentContact = String(student.parentContact).replace(/[\s-]/g, '');
//         }

//         return student;
//       });

//       console.log('Uploading students:', students);

//       const result = await apiService.createStudentsBulk(bulkClassId, students);
      
//       if (result.success) {
//         const successCount = result.created || students.length;
//         const failCount = result.failed || 0;
        
//         let message = `Successfully added ${successCount} student(s)`;
//         if (failCount > 0) {
//           message += `. ${failCount} failed (possibly duplicate enrollment numbers)`;
//         }
        
//         setMessage({ type: "success", text: message });
        
//         // Reset form after 3 seconds
//         setTimeout(() => {
//           setBulkFile(null);
//           setParsedData([]);
//           setBulkClassId(classIdFromUrl || "");
          
//           // Clear file input
//           const fileInput = document.getElementById('bulk-file-input');
//           if (fileInput) fileInput.value = '';
          
//           setMessage({ type: "", text: "" });
//         }, 3000);
//       } else {
//         setMessage({ 
//           type: "error", 
//           text: result.error || result.message || "Failed to upload students. Please check the data and try again." 
//         });
//       }
//     } catch (error) {
//       console.error('Bulk upload error:', error);
//       setMessage({ 
//         type: "error", 
//         text: error.message || "Failed to upload students. Please check your connection and try again." 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadTemplate = () => {
//     try {
//       // Create sample data matching the exact format from your screenshot
//       const templateData = [
//         {
//           "Name": "John Doe",
//           "Enrollment No": "2024001",
//           "DOB": "5/15/2010",
//           "Gender": "Male",
//           "Contact": "9876543210",
//           "Email": "john@example.com",
//           "Address": "123 Main Street",
//           "Parent Name": "Jane Doe",
//           "Parent Contact": "9876543211",
//           "Parent Email": "parent@example.com"
//         },
//         {
//           "Name": "Aarav Sharma",
//           "Enrollment No": "2024002",
//           "DOB": "7/12/2011",
//           "Gender": "Male",
//           "Contact": "9876543212",
//           "Email": "aarav.sharma@example.com",
//           "Address": "45 Green Park, Mumbai",
//           "Parent Name": "Rohit Sharma",
//           "Parent Contact": "9876543213",
//           "Parent Email": "rohit.sharma@example.com"
//         },
//         {
//           "Name": "Priya Patel",
//           "Enrollment No": "2024003",
//           "DOB": "9/22/2010",
//           "Gender": "Female",
//           "Contact": "9876543214",
//           "Email": "priya.patel@example.com",
//           "Address": "12 Lake View, Pune",
//           "Parent Name": "Meena Patel",
//           "Parent Contact": "9876543215",
//           "Parent Email": "meena.patel@example.com"
//         }
//       ];

//       // Create workbook and worksheet
//       const worksheet = XLSX.utils.json_to_sheet(templateData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

//       // Set column widths for better readability
//       worksheet['!cols'] = [
//         { wch: 20 }, // Name
//         { wch: 15 }, // Enrollment No
//         { wch: 12 }, // DOB
//         { wch: 10 }, // Gender
//         { wch: 15 }, // Contact
//         { wch: 25 }, // Email
//         { wch: 30 }, // Address
//         { wch: 20 }, // Parent Name
//         { wch: 15 }, // Parent Contact
//         { wch: 25 }  // Parent Email
//       ];

//       // Generate Excel file
//       XLSX.writeFile(workbook, "student_template.xlsx");
      
//       setMessage({ 
//         type: "success", 
//         text: "Template downloaded successfully! Fill in the details and upload." 
//       });
      
//       setTimeout(() => {
//         setMessage({ type: "", text: "" });
//       }, 3000);
//     } catch (error) {
//       console.error('Template download error:', error);
//       setMessage({ 
//         type: "error", 
//         text: "Failed to download template: " + error.message 
//       });
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 pt-20 md:pt-6 min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-4 md:mb-6">
//           <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Add Student</h1>
//           <p className="text-xs md:text-sm text-gray-500 mt-1">Add students individually or upload in bulk</p>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white border border-gray-200 rounded-lg mb-4 md:mb-6">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab("single")}
//               className={`flex-1 px-4 md:px-6 py-3 text-sm font-medium transition-colors ${
//                 activeTab === "single"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <FaUser className="inline mr-2" />
//               Single Student
//             </button>
//             <button
//               onClick={() => setActiveTab("bulk")}
//               className={`flex-1 px-4 md:px-6 py-3 text-sm font-medium transition-colors ${
//                 activeTab === "bulk"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <FaFileExcel className="inline mr-2" />
//               Bulk Upload
//             </button>
//           </div>

//           {/* Message */}
//           {message.text && (
//             <div className={`mx-4 md:mx-6 mt-4 p-3 rounded-lg text-sm ${
//               message.type === "success" 
//                 ? "bg-green-50 text-green-700 border border-green-200" 
//                 : "bg-red-50 text-red-700 border border-red-200"
//             }`}>
//               {message.text}
//             </div>
//           )}

//           {/* Single Student Form */}
//           {activeTab === "single" && (
//             <form onSubmit={handleSubmit} className="p-4 md:p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
//                 {/* Class */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Class <span className="text-red-500">*</span>
//                   </label>
//                   {classes.length === 0 ? (
//                     <div className="w-full px-3 py-2 text-sm border border-yellow-300 bg-yellow-50 rounded-lg">
//                       <p className="text-yellow-800 font-medium">No classes available</p>
//                       <p className="text-yellow-700 text-xs mt-1">
//                         You need to be assigned as a class incharge. Please contact your administrator.
//                       </p>
//                     </div>
//                   ) : (
//                     <select
//                       name="classId"
//                       value={formData.classId}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">Select Class</option>
//                       {classes.map(cls => (
//                         <option key={cls.id} value={cls.id}>
//                           {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </div>

//                 {/* Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., John Doe"
//                     required
//                   />
//                 </div>

//                 {/* Enrollment No */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Enrollment No <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="enrollmentNo"
//                     value={formData.enrollmentNo}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., 2024001"
//                     required
//                   />
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date of Birth
//                   </label>
//                   <input
//                     type="date"
//                     name="dateOfBirth"
//                     value={formData.dateOfBirth}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Gender
//                   </label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 {/* Contact */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Contact Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="contact"
//                     value={formData.contact}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., 9876543210"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., student@example.com"
//                   />
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Address
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows="2"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter full address"
//                   />
//                 </div>

//                 {/* Parent Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Parent/Guardian Name
//                   </label>
//                   <input
//                     type="text"
//                     name="parentName"
//                     value={formData.parentName}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., Jane Doe"
//                   />
//                 </div>

//                 {/* Parent Contact */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Parent Contact
//                   </label>
//                   <input
//                     type="tel"
//                     name="parentContact"
//                     value={formData.parentContact}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., 9876543211"
//                   />
//                 </div>

//                 {/* Parent Email */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Parent Email
//                   </label>
//                   <input
//                     type="email"
//                     name="parentEmail"
//                     value={formData.parentEmail}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., parent@example.com"
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="mt-6 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                 {loading ? (
//                   <>
//                     <FaSpinner className="animate-spin" />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     <FaPlus className="text-xs" />
//                     Add Student
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Bulk Upload Form */}
//         {activeTab === "bulk" && (
//           <div className="p-4 md:p-6">
            
//             {/* Download Template */}
//             <div className="mb-6">
//               <button
//                 onClick={downloadTemplate}
//                 className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//               >
//                 <FaDownload />
//                 Download Excel Template
//               </button>
//               <p className="text-xs text-gray-500 mt-2">
//                 Download the template with sample data, fill in your student details, and upload it below
//               </p>
//             </div>

//             {/* Class Selection */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Class <span className="text-red-500">*</span>
//               </label>
//               {classes.length === 0 ? (
//                 <div className="w-full px-3 py-2 text-sm border border-yellow-300 bg-yellow-50 rounded-lg">
//                   <p className="text-yellow-800 font-medium">No classes available</p>
//                   <p className="text-yellow-700 text-xs mt-1">
//                     You need to be assigned as a class incharge. Please contact your administrator.
//                   </p>
//                 </div>
//               ) : (
//                 <select
//                   value={bulkClassId}
//                   onChange={(e) => setBulkClassId(e.target.value)}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select Class</option>
//                   {classes.map(cls => (
//                     <option key={cls.id} value={cls.id}>
//                       {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>

//             {/* File Upload */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Upload File <span className="text-red-500">*</span>
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
//                 <input
//                   type="file"
//                   accept=".csv,.xlsx,.xls"
//                   onChange={handleFileChange}
//                   className="hidden"
//                   id="bulk-file-input"
//                 />
//                 <label
//                   htmlFor="bulk-file-input"
//                   className="cursor-pointer inline-flex flex-col items-center"
//                 >
//                   <FaUpload className="text-3xl text-gray-400 mb-2" />
//                   <span className="text-sm font-medium text-gray-700">
//                     {bulkFile ? bulkFile.name : "Click to upload CSV or Excel file"}
//                   </span>
//                   <span className="text-xs text-gray-500 mt-1">
//                     Supports .csv, .xlsx, .xls files
//                   </span>
//                 </label>
//               </div>
//             </div>

//             {/* Parsed Data Preview */}
//             {parsedData.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">
//                   Preview ({parsedData.length} student{parsedData.length !== 1 ? 's' : ''})
//                 </h3>
//                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                   <div className="overflow-x-auto max-h-80 overflow-y-auto">
//                     <table className="min-w-full divide-y divide-gray-200 text-xs">
//                       <thead className="bg-gray-50 sticky top-0 z-10">
//                         <tr>
//                           <th className="px-2 py-2 text-left font-medium text-gray-700 whitespace-nowrap">#</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Name</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Enrollment No</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">DOB</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Gender</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Contact</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Email</th>
//                           <th className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">Parent Name</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {parsedData.map((student, idx) => (
//                           <tr key={idx} className="hover:bg-gray-50">
//                             <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
//                             <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
//                               {student.Name || student.name || '-'}
//                             </td>
//                             <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
//                               {student['Enrollment No'] || student.enrollmentNo || '-'}
//                             </td>
//                             <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
//                               {student.DOB || student.dateOfBirth || '-'}
//                             </td>
//                             <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
//                               {student.Gender || student.gender || '-'}
//                             </td>
//                             <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
//                               {student.Contact || student.contact || '-'}
//                             </td>
//                             <td className="px-3 py-2 text-gray-600 text-xs max-w-xs truncate">
//                               {student.Email || student.email || '-'}
//                             </td>
//                             <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
//                               {student['Parent Name'] || student.parentName || '-'}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                   {parsedData.length > 5 && (
//                     <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 border-t border-gray-200 flex items-center justify-between">
//                       <span>Total: {parsedData.length} student{parsedData.length !== 1 ? 's' : ''}</span>
//                       <span className="text-green-600">✓ Ready to upload</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Upload Button */}
//             <div className="flex justify-end">
//               <button
//                 onClick={handleBulkUpload}
//                 disabled={loading || !bulkClassId || parsedData.length === 0}
//                 className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <FaSpinner className="animate-spin" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <FaUpload />
//                     Upload Students
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//         </div>

//       </div>
//     </div>
//   );
// }
















import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaPlus, FaSpinner, FaUpload, FaDownload, FaUser, FaFileExcel, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import * as XLSX from "xlsx";
import apiService from "../../services/apiService";

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
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); color: var(--text-dark); }

  .horizon-card {
    background: var(--white);
    border: 1px solid rgba(26, 111, 181, 0.12);
    border-radius: 16px;
    transition: all 0.25s ease;
  }

  .horizon-input {
    border: 1.5px solid rgba(26, 111, 181, 0.2);
    border-radius: 8px;
    background: var(--white);
    color: var(--text-dark);
    transition: all 0.2s ease;
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
  }
  .horizon-btn-secondary:hover {
    background: rgba(26, 111, 181, 0.06);
    transform: translateY(-2px);
  }

  .fade-in {
    animation: fadeIn 0.4s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .tab-button {
    transition: all 0.2s ease;
  }
  .tab-button.active {
    border-bottom-color: var(--primary-blue);
    color: var(--primary-blue);
  }

  .alert-success {
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #166534;
  }
  .alert-error {
    background: rgba(220, 38, 38, 0.08);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #991b1b;
  }
`;

export default function AddStudentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classIdFromUrl = searchParams.get('class');

  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNo: "",
    classId: classIdFromUrl || "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    parentName: "",
    parentContact: "",
    parentEmail: "",
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkClassId, setBulkClassId] = useState(classIdFromUrl || "");
  const [parsedData, setParsedData] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const result = await apiService.getMyClasses();
      
      if (result.success) {
        const inchargeClasses = (result.classes || []).filter(
          c => c.role === 'incharge' || c.role === 'both'
        );
        setClasses(inchargeClasses);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
      setMessage({ type: "error", text: "Failed to load classes: " + error.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.enrollmentNo || !formData.classId) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await apiService.createStudent(formData);
      
      if (result.success) {
        setMessage({ type: "success", text: "✓ Student added successfully!" });
        
        setTimeout(() => {
          setFormData({
            name: "",
            enrollmentNo: "",
            classId: classIdFromUrl || "",
            dateOfBirth: "",
            gender: "",
            contact: "",
            email: "",
            address: "",
            parentName: "",
            parentContact: "",
            parentEmail: "",
          });
          setMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to add student" });
      }
    } catch (error) {
      console.error('Add student error:', error);
      setMessage({ type: "error", text: error.message || "Failed to add student" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setMessage({ type: "error", text: "Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)" });
      return;
    }

    setBulkFile(file);
    setMessage({ type: "", text: "" });
    setParsedData([]);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            raw: false,
            dateNF: 'mm/dd/yyyy'
          });
          
          if (jsonData.length === 0) {
            setMessage({ type: "error", text: "No data found in file. Please check the file format." });
            setBulkFile(null);
            return;
          }

          const firstRow = jsonData[0];
          const requiredColumns = ['Name', 'Enrollment No'];
          const missingColumns = requiredColumns.filter(col => !(col in firstRow));
          
          if (missingColumns.length > 0) {
            setMessage({ 
              type: "error", 
              text: `Missing required columns: ${missingColumns.join(', ')}. Please use the template format.` 
            });
            setBulkFile(null);
            return;
          }

          const validData = [];
          const errors = [];
          
          jsonData.forEach((row, index) => {
            const rowNum = index + 2;
            
            if (!row.Name || !row['Enrollment No']) {
              errors.push(`Row ${rowNum}: Name and Enrollment No are required`);
            } else {
              validData.push(row);
            }
          });

          if (errors.length > 0 && validData.length === 0) {
            setMessage({ 
              type: "error", 
              text: `Validation failed: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}` 
            });
            setBulkFile(null);
            return;
          }

          setParsedData(validData);
          
          let successMsg = `✓ File parsed successfully! Found ${validData.length} valid student(s).`;
          if (errors.length > 0) {
            successMsg += ` ${errors.length} row(s) skipped.`;
          }
          
          setMessage({ type: "success", text: successMsg });
          
        } catch (error) {
          console.error('Parse error:', error);
          setMessage({ 
            type: "error", 
            text: "Failed to parse file. Please ensure it matches the template format." 
          });
          setBulkFile(null);
          setParsedData([]);
        }
      };
      
      reader.onerror = () => {
        setMessage({ type: "error", text: "Failed to read file. Please try again." });
        setBulkFile(null);
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Import error:', error);
      setMessage({ 
        type: "error", 
        text: "Failed to read file: " + error.message 
      });
      setBulkFile(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkClassId) {
      setMessage({ type: "error", text: "Please select a class first" });
      return;
    }

    if (parsedData.length === 0) {
      setMessage({ type: "error", text: "Please upload a file with student data" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        
        try {
          if (dateStr instanceof Date) {
            return dateStr.toISOString().split('T')[0];
          }
          
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.warn('Date parse error:', e);
        }
        
        return null;
      };

      const students = parsedData.map((row) => {
        const student = {
          name: String(row.Name || row.name || "").trim(),
          enrollmentNo: String(row['Enrollment No'] || row.enrollmentNo || row['Enrollment Number'] || "").trim(),
          dateOfBirth: parseDate(row.DOB || row.dateOfBirth || row['Date of Birth']),
          gender: row.Gender || row.gender || null,
          contact: row.Contact || row.contact || row['Contact Number'] || null,
          email: row.Email || row.email || null,
          address: row.Address || row.address || null,
          parentName: row['Parent Name'] || row.parentName || null,
          parentContact: row['Parent Contact'] || row.parentContact || null,
          parentEmail: row['Parent Email'] || row.parentEmail || null,
        };

        if (student.contact) {
          student.contact = String(student.contact).replace(/[\s-]/g, '');
        }
        if (student.parentContact) {
          student.parentContact = String(student.parentContact).replace(/[\s-]/g, '');
        }

        return student;
      });

      const result = await apiService.createStudentsBulk(bulkClassId, students);
      
      if (result.success) {
        const successCount = result.created || students.length;
        const failCount = result.failed || 0;
        
        let msg = `✓ Successfully added ${successCount} student(s)`;
        if (failCount > 0) {
          msg += `. ${failCount} failed (possibly duplicate enrollment numbers)`;
        }
        
        setMessage({ type: "success", text: msg });
        
        setTimeout(() => {
          setBulkFile(null);
          setParsedData([]);
          setBulkClassId(classIdFromUrl || "");
          
          const fileInput = document.getElementById('bulk-file-input');
          if (fileInput) fileInput.value = '';
          
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({ 
          type: "error", 
          text: result.error || result.message || "Failed to upload students. Please check the data and try again." 
        });
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to upload students. Please check your connection and try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    try {
      const templateData = [
        {
          "Name": "John Doe",
          "Enrollment No": "2024001",
          "DOB": "5/15/2010",
          "Gender": "Male",
          "Contact": "9876543210",
          "Email": "john@example.com",
          "Address": "123 Main Street",
          "Parent Name": "Jane Doe",
          "Parent Contact": "9876543211",
          "Parent Email": "parent@example.com"
        },
        {
          "Name": "Aarav Sharma",
          "Enrollment No": "2024002",
          "DOB": "7/12/2011",
          "Gender": "Male",
          "Contact": "9876543212",
          "Email": "aarav.sharma@example.com",
          "Address": "45 Green Park, Mumbai",
          "Parent Name": "Rohit Sharma",
          "Parent Contact": "9876543213",
          "Parent Email": "rohit.sharma@example.com"
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

      worksheet['!cols'] = [
        { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 10 },
        { wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
        { wch: 15 }, { wch: 25 }
      ];

      XLSX.writeFile(workbook, "student_template.xlsx");
      
      setMessage({ 
        type: "success", 
        text: "✓ Template downloaded! Fill in details and upload." 
      });
      
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error('Template download error:', error);
      setMessage({ 
        type: "error", 
        text: "Failed to download template: " + error.message 
      });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HORIZON_STYLES }} />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f8fb]">
        
        {/* Header */}
        <div className="border-b" style={{ borderColor: 'rgba(26, 111, 181, 0.08)', background: 'var(--white)' }}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button
              onClick={() => navigate('/students')}
              className="inline-flex items-center gap-2 text-sm font-medium mb-4 transition-all hover:gap-3"
              style={{ color: 'var(--primary-blue)' }}
            >
              <FaArrowLeft className="text-xs" />
              Back to Students
            </button>
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>
                Add Student
              </h1>
              <p className="text-sm" style={{ color: 'var(--gray)' }}>
                Add students individually or import multiple students using bulk upload
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          
          {/* Tabs */}
          <div className="horizon-card mb-6 overflow-hidden">
            <div className="flex border-b" style={{ borderColor: 'rgba(26, 111, 181, 0.08)' }}>
              <button
                onClick={() => setActiveTab("single")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all border-b-2 tab-button ${
                  activeTab === "single"
                    ? "active"
                    : ""
                }`}
                style={{
                  color: activeTab === "single" ? 'var(--primary-blue)' : 'var(--gray)',
                  borderBottomColor: activeTab === "single" ? 'var(--primary-blue)' : 'transparent'
                }}
              >
                <FaUser className="inline mr-2" />
                Single Student
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all border-b-2 tab-button ${
                  activeTab === "bulk"
                    ? "active"
                    : ""
                }`}
                style={{
                  color: activeTab === "bulk" ? 'var(--primary-blue)' : 'var(--gray)',
                  borderBottomColor: activeTab === "bulk" ? 'var(--primary-blue)' : 'transparent'
                }}
              >
                <FaFileExcel className="inline mr-2" />
                Bulk Upload
              </button>
            </div>

            {/* Message Alert */}
            {message.text && (
              <div className={`mx-6 mt-4 p-4 rounded-lg text-sm flex items-start gap-3 fade-in ${
                message.type === "success" 
                  ? "alert-success" 
                  : "alert-error"
              }`}>
                {message.type === "success" ? (
                  <FaCheckCircle className="mt-0.5 flex-shrink-0" />
                ) : (
                  <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Single Student Form */}
            {activeTab === "single" && (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Class - Full Width */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Class <span style={{ color: 'var(--accent-gold)' }}>*</span>
                    </label>
                    {classes.length === 0 ? (
                      <div className="p-4 rounded-lg border-l-4" style={{ background: 'rgba(251, 146, 60, 0.08)', borderLeftColor: 'var(--accent-gold)', borderColor: 'rgba(251, 146, 60, 0.2)' }}>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>No classes available</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--gray)' }}>
                          You need to be assigned as a class incharge. Please contact your administrator.
                        </p>
                      </div>
                    ) : (
                      <select
                        name="classId"
                        value={formData.classId}
                        onChange={handleInputChange}
                        className="w-full horizon-input px-4 py-2.5 text-sm"
                        required
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Full Name <span style={{ color: 'var(--accent-gold)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>

                  {/* Enrollment No */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Enrollment No <span style={{ color: 'var(--accent-gold)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="enrollmentNo"
                      value={formData.enrollmentNo}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                      placeholder="e.g., 2024001"
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                      placeholder="e.g., 9876543210"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                      placeholder="e.g., student@example.com"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full horizon-input px-4 py-2.5 text-sm resize-none"
                      placeholder="Enter full address"
                    />
                  </div>

                  {/* Parent Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Parent/Guardian Name
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                      placeholder="e.g., Jane Doe"
                    />
                  </div>

                  {/* Parent Contact */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Parent Contact
                    </label>
                    <input
                      type="tel"
                      name="parentContact"
                      value={formData.parentContact}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                      placeholder="e.g., 9876543211"
                    />
                  </div>

                  {/* Parent Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                      Parent Email
                    </label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                      placeholder="e.g., parent@example.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/students')}
                    className="horizon-btn-secondary px-6 py-2.5 text-sm"
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
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaPlus className="text-xs" />
                        Add Student
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Bulk Upload Form */}
            {activeTab === "bulk" && (
              <div className="p-6">
                
                {/* Download Template */}
                <div className="mb-8 p-4 rounded-lg" style={{ background: 'rgba(26, 111, 181, 0.04)', border: '1px solid rgba(26, 111, 181, 0.12)' }}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📋</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                        Download Template
                      </p>
                      <p className="text-xs mb-3" style={{ color: 'var(--gray)' }}>
                        Download the Excel template with sample data, fill in your student details, and upload it below.
                      </p>
                      <button
                        onClick={downloadTemplate}
                        className="horizon-btn-secondary px-4 py-2 text-xs inline-flex items-center gap-2"
                      >
                        <FaDownload />
                        Download Template
                      </button>
                    </div>
                  </div>
                </div>

                {/* Class Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                    Select Class <span style={{ color: 'var(--accent-gold)' }}>*</span>
                  </label>
                  {classes.length === 0 ? (
                    <div className="p-4 rounded-lg border-l-4" style={{ background: 'rgba(251, 146, 60, 0.08)', borderLeftColor: 'var(--accent-gold)', borderColor: 'rgba(251, 146, 60, 0.2)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>No classes available</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--gray)' }}>
                        You need to be assigned as a class incharge. Please contact your administrator.
                      </p>
                    </div>
                  ) : (
                    <select
                      value={bulkClassId}
                      onChange={(e) => setBulkClassId(e.target.value)}
                      className="w-full horizon-input px-4 py-2.5 text-sm"
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-dark)' }}>
                    Upload File <span style={{ color: 'var(--accent-gold)' }}>*</span>
                  </label>
                  <div className="border-2 border-dashed p-8 rounded-lg text-center transition-all cursor-pointer hover:border-opacity-100"
                    style={{
                      borderColor: 'rgba(26, 111, 181, 0.3)',
                      background: 'rgba(26, 111, 181, 0.02)'
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = 'var(--primary-blue)';
                      e.currentTarget.style.background = 'rgba(26, 111, 181, 0.06)';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(26, 111, 181, 0.3)';
                      e.currentTarget.style.background = 'rgba(26, 111, 181, 0.02)';
                    }}
                  >
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                      id="bulk-file-input"
                    />
                    <label
                      htmlFor="bulk-file-input"
                      className="cursor-pointer inline-flex flex-col items-center"
                    >
                      <FaUpload className="text-3xl mb-3" style={{ color: 'var(--primary-blue)', opacity: 0.6 }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>
                        {bulkFile ? bulkFile.name : "Click to upload or drag & drop"}
                      </span>
                      <span className="text-xs mt-2" style={{ color: 'var(--gray)' }}>
                        Supports .csv, .xlsx, .xls files
                      </span>
                    </label>
                  </div>
                </div>

                {/* Parsed Data Preview */}
                {parsedData.length > 0 && (
                  <div className="mb-6 fade-in">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-dark)' }}>
                      Preview ({parsedData.length} student{parsedData.length !== 1 ? 's' : ''})
                    </h3>
                    <div className="horizon-card overflow-hidden">
                      <div className="overflow-x-auto max-h-80 overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
                              <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--gray)' }}>#</th>
                              <th className="px-3 py-2 text-left font-semibold whitespace-nowrap" style={{ color: 'var(--gray)' }}>Name</th>
                              <th className="px-3 py-2 text-left font-semibold whitespace-nowrap" style={{ color: 'var(--gray)' }}>Enrollment No</th>
                              <th className="px-3 py-2 text-left font-semibold whitespace-nowrap" style={{ color: 'var(--gray)' }}>DOB</th>
                              <th className="px-3 py-2 text-left font-semibold whitespace-nowrap" style={{ color: 'var(--gray)' }}>Gender</th>
                              <th className="px-3 py-2 text-left font-semibold whitespace-nowrap" style={{ color: 'var(--gray)' }}>Contact</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parsedData.map((student, idx) => (
                              <tr
                                key={idx}
                                style={{
                                  borderBottom: idx !== parsedData.length - 1 ? '1px solid rgba(26, 111, 181, 0.06)' : 'none'
                                }}
                              >
                                <td className="px-3 py-2" style={{ color: 'var(--gray)' }}>{idx + 1}</td>
                                <td className="px-3 py-2 whitespace-nowrap" style={{ color: 'var(--text-dark)' }}>
                                  {student.Name || student.name || '—'}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap" style={{ color: 'var(--text-dark)' }}>
                                  {student['Enrollment No'] || student.enrollmentNo || '—'}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap" style={{ color: 'var(--gray)' }}>
                                  {student.DOB || student.dateOfBirth || '—'}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap" style={{ color: 'var(--gray)' }}>
                                  {student.Gender || student.gender || '—'}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap" style={{ color: 'var(--gray)' }}>
                                  {student.Contact || student.contact || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {parsedData.length > 5 && (
                        <div className="px-3 py-2 text-xs" style={{ background: 'var(--light-bg)', borderTop: '1px solid rgba(26, 111, 181, 0.08)', color: 'var(--gray)' }}>
                          Total: {parsedData.length} student{parsedData.length !== 1 ? 's' : ''} ready to upload
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/students')}
                    className="horizon-btn-secondary px-6 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkUpload}
                    disabled={loading || !bulkClassId || parsedData.length === 0}
                    className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload {parsedData.length} Student{parsedData.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}