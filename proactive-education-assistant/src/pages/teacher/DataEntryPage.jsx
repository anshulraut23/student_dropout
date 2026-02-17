// // // import { useState } from "react";
// // // import { useGame } from "../../context/GamificationContext";
// // // import GamificationWidget from "../../components/GamificationWidget";


// // // export default function DataEntryPage() {
// // //   const [activeTab, setActiveTab] = useState("student");
// // //   const { addXP } = useGame();

// // //   const reward = (xp) => addXP(xp);

// // //   return (
// // //     <div className="bg-slate-100 min-h-screen px-6 py-6">
// // //       <div className="max-w-6xl mx-auto space-y-6">

// // //         <div>
// // //           <h1 className="text-2xl font-semibold text-slate-900">Data Entry Center</h1>
// // //           <p className="text-sm text-slate-600">
// // //             Enter student data for early risk detection.
// // //           </p>
// // //         </div>

// // //         <div className="flex flex-wrap gap-2">
// // //           <Tab label="Add Student" active={activeTab==="student"} onClick={()=>setActiveTab("student")} />
// // //           <Tab label="Attendance" active={activeTab==="attendance"} onClick={()=>setActiveTab("attendance")} />
// // //           <Tab label="Academic Scores" active={activeTab==="scores"} onClick={()=>setActiveTab("scores")} />
// // //           <Tab label="Behaviour" active={activeTab==="behaviour"} onClick={()=>setActiveTab("behaviour")} />
// // //         </div>

// // //         {activeTab === "student" && <AddStudent onSave={() => reward(15)} />}
// // //         {activeTab === "attendance" && <Attendance onSave={() => reward(10)} />}
// // //         {activeTab === "scores" && <Scores onSave={() => reward(10)} />}
// // //         {activeTab === "behaviour" && <Behaviour onSave={() => reward(10)} />}

// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* UI */

// // // function Tab({ label, active, onClick }) {
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       className={`px-4 py-2 rounded-md text-sm border
// // //       ${active ? "bg-blue-600 text-white" : "bg-white hover:bg-slate-50"}`}
// // //     >
// // //       {label}
// // //     </button>
// // //   );
// // // }

// // // function Card({ title, children }) {
// // //   return (
// // //     <div className="bg-white border rounded-lg p-6 space-y-4">
// // //       <h2 className="font-semibold">{title}</h2>
// // //       {children}
// // //     </div>
// // //   );
// // // }

// // // function Input({ label, type="text" }) {
// // //   return (
// // //     <div className="flex flex-col gap-1">
// // //       <label className="text-sm text-slate-600">{label}</label>
// // //       <input
// // //         type={type}
// // //         className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
// // //         placeholder={label}
// // //       />
// // //     </div>
// // //   );
// // // }

// // // function Button({ onClick, children }) {
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700"
// // //     >
// // //       {children}
// // //     </button>
// // //   );
// // // }

// // // /* FORMS */

// // // function AddStudent({ onSave }) {
// // //   return (
// // //     <Card title="Add New Student">
// // //       <div className="grid sm:grid-cols-2 gap-4">
// // //         <Input label="Student Name" />
// // //         <Input label="Class" />
// // //         <Input label="Date of Birth" type="date" />
// // //         <Input label="Gender" />
// // //         <Input label="Address" />
// // //         <Input label="Parent Contact" />
// // //       </div>
// // //       <Button onClick={onSave}>Save Student</Button>
// // //     </Card>
// // //   );
// // // }

// // // function Attendance({ onSave }) {
// // //   return (
// // //     <Card title="Attendance">
// // //       <div className="grid sm:grid-cols-3 gap-4">
// // //         <Input label="Student ID" />
// // //         <Input label="Date" type="date" />
// // //         <select className="border rounded-md px-3 py-2 text-sm">
// // //           <option>Present</option>
// // //           <option>Absent</option>
// // //         </select>
// // //       </div>
// // //       <Button onClick={onSave}>Save Attendance</Button>
// // //     </Card>
// // //   );
// // // }

// // // function Scores({ onSave }) {
// // //   return (
// // //     <Card title="Academic Score">
// // //       <div className="grid sm:grid-cols-3 gap-4">
// // //         <Input label="Student ID" />
// // //         <Input label="Subject" />
// // //         <Input label="Score %" />
// // //       </div>
// // //       <Button onClick={onSave}>Save Score</Button>
// // //     </Card>
// // //   );
// // // }

// // // function Behaviour({ onSave }) {
// // //   return (
// // //     <Card title="Behaviour Observation">
// // //       <Input label="Student ID" />
// // //       <textarea className="border rounded-md p-2 h-28" placeholder="Observation..." />
// // //       <Button onClick={onSave}>Save Observation</Button>
// // //     </Card>
// // //   );
// // // }




// // latest 2

// // import { useState } from "react";
// // import { useGame } from "../../context/GamificationContext";
// // import GamificationWidget from "../../components/GamificationWidget";

// // export default function DataEntryPage() {
// //   const [activeTab, setActiveTab] = useState("student");
// //   const { addXP } = useGame();

// //   return (
// //     <div className="bg-slate-100 min-h-screen px-6 py-6">
// //       <div className="max-w-6xl mx-auto space-y-6">

// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
// //           <div>
// //             <h1 className="text-2xl font-semibold text-slate-900">
// //               Data Entry Center
// //             </h1>
// //             <p className="text-sm text-slate-600">
// //               Enter student data used for risk prediction.
// //             </p>
// //           </div>

// //           <GamificationWidget />
// //         </div>

// //         {/* Tabs */}
// //         <div className="flex flex-wrap gap-2">
// //           <Tab label="Add Student" active={activeTab==="student"} onClick={()=>setActiveTab("student")} />
// //           <Tab label="Attendance" active={activeTab==="attendance"} onClick={()=>setActiveTab("attendance")} />
// //           <Tab label="Academic Scores" active={activeTab==="scores"} onClick={()=>setActiveTab("scores")} />
// //           <Tab label="Behaviour" active={activeTab==="behaviour"} onClick={()=>setActiveTab("behaviour")} />
// //         </div>

// //         {/* Forms */}
// //         {activeTab === "student" && <AddStudent onSave={() => addXP(15)} />}
// //         {activeTab === "attendance" && <Attendance onSave={() => addXP(10)} />}
// //         {activeTab === "scores" && <Scores onSave={() => addXP(10)} />}
// //         {activeTab === "behaviour" && <Behaviour onSave={() => addXP(10)} />}
// //       </div>
// //     </div>
// //   );
// // }

// // /* UI Helpers */

// // function Tab({ label, active, onClick }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className={`px-4 py-2 rounded-md text-sm font-medium border transition
// //       ${active ? "bg-blue-600 text-white" : "bg-white hover:bg-slate-50"}`}
// //     >
// //       {label}
// //     </button>
// //   );
// // }

// // function Card({ title, children }) {
// //   return (
// //     <div className="bg-white rounded-lg border p-6 space-y-4">
// //       <h2 className="text-lg font-semibold">{title}</h2>
// //       {children}
// //     </div>
// //   );
// // }

// // function Input({ label, type="text" }) {
// //   return (
// //     <div className="flex flex-col gap-1">
// //       <label className="text-sm text-slate-600">{label}</label>
// //       <input
// //         type={type}
// //         className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
// //         placeholder={label}
// //       />
// //     </div>
// //   );
// // }

// // function Button({ onClick, children }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700"
// //     >
// //       {children}
// //     </button>
// //   );
// // }

// // /* FORMS */

// // function AddStudent({ onSave }) {
// //   return (
// //     <Card title="Add New Student">
// //       <div className="grid sm:grid-cols-2 gap-4">
// //         <Input label="Student Name" />
// //         <Input label="Class" />
// //         <Input label="Date of Birth" type="date" />
// //         <Input label="Gender" />
// //         <Input label="Address" />
// //         <Input label="Parent Contact" />
// //       </div>
// //       <Button onClick={onSave}>Save Student</Button>
// //     </Card>
// //   );
// // }

// // function Attendance({ onSave }) {
// //   return (
// //     <Card title="Attendance Record">
// //       <div className="grid sm:grid-cols-3 gap-4">
// //         <Input label="Student ID" />
// //         <Input label="Date" type="date" />
// //         <select className="border rounded-md px-3 py-2 text-sm">
// //           <option>Present</option>
// //           <option>Absent</option>
// //         </select>
// //       </div>
// //       <Button onClick={onSave}>Save Attendance</Button>
// //     </Card>
// //   );
// // }

// // function Scores({ onSave }) {
// //   return (
// //     <Card title="Academic Score">
// //       <div className="grid sm:grid-cols-3 gap-4">
// //         <Input label="Student ID" />
// //         <Input label="Subject" />
// //         <Input label="Score %" />
// //       </div>
// //       <Button onClick={onSave}>Save Score</Button>
// //     </Card>
// //   );
// // }

// // function Behaviour({ onSave }) {
// //   return (
// //     <Card title="Behaviour Observation">
// //       <Input label="Student ID" />
// //       <textarea
// //         className="border rounded-md px-3 py-2 h-28 text-sm focus:ring-2 focus:ring-blue-500"
// //         placeholder="Describe behaviour..."
// //       />
// //       <Button onClick={onSave}>Save Observation</Button>
// //     </Card>
// //   );
// // }


// // latest 3


// import { useState } from "react";

// export default function DataEntryPage() {
//   const [tab, setTab] = useState("student");

//   return (
//     <div className="bg-slate-100 min-h-screen px-6 py-6">
//       <div className="max-w-6xl mx-auto space-y-6">

//         <div>
//           <h1 className="text-2xl font-semibold text-slate-900">
//             Data Entry Center
//           </h1>
//           <p className="text-sm text-slate-600">
//             Add students, attendance, academic records and bulk uploads.
//           </p>
//         </div>

//         {/* TABS */}
//         <div className="flex flex-wrap gap-2">
//           <Tab label="Add Student" active={tab==="student"} onClick={()=>setTab("student")} />
//           <Tab label="Bulk Students" active={tab==="bulk"} onClick={()=>setTab("bulk")} />
//           <Tab label="Attendance" active={tab==="attendance"} onClick={()=>setTab("attendance")} />
//           <Tab label="Bulk Attendance" active={tab==="bulkAttendance"} onClick={()=>setTab("bulkAttendance")} />
//           <Tab label="Scores" active={tab==="scores"} onClick={()=>setTab("scores")} />
//         </div>

//         {tab==="student" && <SingleStudent />}
//         {tab==="bulk" && <BulkStudents />}
//         {tab==="attendance" && <SingleAttendance />}
//         {tab==="bulkAttendance" && <ClassAttendance />}
//         {tab==="scores" && <Scores />}

//       </div>
//     </div>
//   );
// }

// /* ---------- UI ---------- */

// function Tab({label,active,onClick}) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded-md border text-sm font-medium
//         ${active ? "bg-blue-600 text-white" : "bg-white hover:bg-slate-50"}`}
//     >
//       {label}
//     </button>
//   );
// }

// function Card({title, children}) {
//   return (
//     <div className="bg-white rounded-lg border p-6 space-y-4">
//       <h2 className="text-lg font-semibold">{title}</h2>
//       {children}
//     </div>
//   );
// }

// function Input({label,type="text"}) {
//   return (
//     <div>
//       <p className="text-sm text-slate-600 mb-1">{label}</p>
//       <input type={type} className="border rounded-md px-3 py-2 w-full"/>
//     </div>
//   );
// }

// function Button({children}) {
//   return (
//     <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
//       {children}
//     </button>
//   );
// }

// /* ---------- FEATURES ---------- */

// function SingleStudent() {
//   return (
//     <Card title="Add Single Student">
//       <div className="grid sm:grid-cols-2 gap-4">
//         <Input label="Student Name"/>
//         <Input label="Class"/>
//         <Input label="DOB" type="date"/>
//         <Input label="Gender"/>
//         <Input label="Address"/>
//         <Input label="Parent Contact"/>
//       </div>
//       <Button>Save Student</Button>
//     </Card>
//   );
// }

// function BulkStudents() {
//   return (
//     <Card title="Bulk Upload Students (Excel/CSV)">
//       <input type="file" accept=".csv,.xlsx,.xls" className="border p-2 rounded-md"/>
//       <p className="text-xs text-slate-500">
//         Format: Name | Class | DOB | Gender | Address | Parent Contact
//       </p>
//       <Button>Upload & Import</Button>
//     </Card>
//   );
// }

// function SingleAttendance() {
//   return (
//     <Card title="Mark Single Student Attendance">
//       <div className="grid sm:grid-cols-3 gap-4">
//         <Input label="Student ID"/>
//         <Input label="Date" type="date"/>
//         <select className="border rounded-md px-3 py-2">
//           <option>Present</option>
//           <option>Absent</option>
//         </select>
//       </div>
//       <Button>Save Attendance</Button>
//     </Card>
//   );
// }

// function ClassAttendance() {
//   return (
//     <Card title="Upload Class Attendance (Excel)">
//       <div className="space-y-3">
//         <select className="border rounded-md px-3 py-2 w-full">
//           <option>Select Class</option>
//           <option>Grade 6A</option>
//           <option>Grade 7A</option>
//           <option>Grade 7B</option>
//         </select>

//         <input type="file" accept=".csv,.xlsx,.xls" className="border p-2 rounded-md"/>

//         <p className="text-xs text-slate-500">
//           Sheet format: Student ID | Date | Status
//         </p>

//         <Button>Upload Attendance</Button>
//       </div>
//     </Card>
//   );
// }

// function Scores() {
//   return (
//     <Card title="Academic Scores Entry">
//       <div className="grid sm:grid-cols-3 gap-4">
//         <Input label="Student ID"/>
//         <Input label="Subject"/>
//         <Input label="Score (%)"/>
//       </div>

//       <div className="mt-4">
//         <input type="file" accept=".csv,.xlsx,.xls" className="border p-2 rounded-md"/>
//         <p className="text-xs text-slate-500 mt-1">
//           Bulk marksheet upload supported
//         </p>
//       </div>

//       <Button>Save Scores</Button>
//     </Card>
//   );
// }








import { useState } from "react";

export default function DataEntryPage() {
  const [tab, setTab] = useState("student");

  return (
    <div className="bg-slate-100 min-h-screen px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Data Entry Center
          </h1>
          <p className="text-sm text-slate-600">
            Manage student data, attendance, academics, behaviour and bulk uploads.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tab label="Add Student" active={tab==="student"} onClick={()=>setTab("student")} />
          <Tab label="Bulk Students" active={tab==="bulk"} onClick={()=>setTab("bulk")} />
          <Tab label="Attendance" active={tab==="attendance"} onClick={()=>setTab("attendance")} />
          <Tab label="Bulk Attendance" active={tab==="bulkAttendance"} onClick={()=>setTab("bulkAttendance")} />
          <Tab label="Scores" active={tab==="scores"} onClick={()=>setTab("scores")} />
          <Tab label="Behaviour" active={tab==="behaviour"} onClick={()=>setTab("behaviour")} />
        </div>

        {tab==="student" && <SingleStudent />}
        {tab==="bulk" && <BulkStudents />}
        {tab==="attendance" && <SingleAttendance />}
        {tab==="bulkAttendance" && <ClassAttendance />}
        {tab==="scores" && <Scores />}
        {tab==="behaviour" && <Behaviour />}

      </div>
    </div>
  );
}

/* ---------- UI ---------- */

function Tab({label,active,onClick}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md border text-sm font-medium
        ${active ? "bg-blue-600 text-white" : "bg-white hover:bg-slate-50"}`}
    >
      {label}
    </button>
  );
}

function Card({title, children}) {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Input({label,type="text"}) {
  return (
    <div>
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <input type={type} className="border rounded-md px-3 py-2 w-full"/>
    </div>
  );
}

function Button({children}) {
  return (
    <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
      {children}
    </button>
  );
}

/* ---------- STUDENT ---------- */

function SingleStudent() {
  return (
    <Card title="Add Single Student">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Student Name"/>
        <Input label="Class"/>
        <Input label="DOB" type="date"/>
        <Input label="Gender"/>
        <Input label="Address"/>
        <Input label="Parent Contact"/>
      </div>
      <Button>Save Student</Button>
    </Card>
  );
}

/* ---------- BULK STUDENTS ---------- */

function BulkStudents() {
  return (
    <Card title="Bulk Upload Students">
      <input type="file" accept=".csv,.xlsx,.xls" />
      <p className="text-xs text-slate-500">
        Format: Name | Class | DOB | Gender | Address | Parent Contact
      </p>
      <Button>Import Students</Button>
    </Card>
  );
}

/* ---------- ATTENDANCE ---------- */

function SingleAttendance() {
  return (
    <Card title="Single Student Attendance">
      <div className="grid sm:grid-cols-3 gap-4">
        <Input label="Student ID"/>
        <Input label="Date" type="date"/>
        <select className="border rounded-md px-3 py-2">
          <option>Present</option>
          <option>Absent</option>
        </select>
      </div>
      <Button>Save Attendance</Button>
    </Card>
  );
}

function ClassAttendance() {
  return (
    <Card title="Bulk Class Attendance Upload">
      <select className="border rounded-md px-3 py-2 w-full mb-2">
        <option>Select Class</option>
        <option>Grade 6A</option>
        <option>Grade 7A</option>
        <option>Grade 7B</option>
      </select>

      <input type="file" accept=".csv,.xlsx,.xls" />
      <p className="text-xs text-slate-500">
        StudentID | Date | Status
      </p>

      <Button>Upload Attendance</Button>
    </Card>
  );
}

/* ---------- SCORES ---------- */

function Scores() {
  return (
    <Card title="Academic Scores">
      <div className="grid sm:grid-cols-3 gap-4">
        <Input label="Student ID"/>
        <Input label="Subject"/>
        <Input label="Score (%)"/>
      </div>

      <input type="file" accept=".csv,.xlsx,.xls" className="mt-3"/>

      <Button>Save Scores</Button>
    </Card>
  );
}

/* ---------- BEHAVIOUR (NEW & SMART) ---------- */

function Behaviour() {
  const patterns = [
    "Frequent Absences",
    "Low Participation",
    "Drop in Performance",
    "Social Withdrawal",
    "Disruptive Behaviour",
    "Lack of Motivation",
    "Health Issues",
    "Family Problems"
  ];

  return (
    <Card title="Behaviour & Engagement Tracking">

      <Input label="Student ID"/>

      <div>
        <p className="text-sm text-slate-600 mb-2">Observed Patterns</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {patterns.map(p => (
            <label key={p} className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              {p}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-600 mb-1">Concern Level</p>
        <select className="border rounded-md px-3 py-2 w-full">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div>
        <p className="text-sm text-slate-600 mb-1">Teacher Observation Notes</p>
        <textarea
          className="border rounded-md px-3 py-2 w-full h-28"
          placeholder="Describe any concerns, incidents, or changes noticed..."
        />
      </div>

      <Button>Save Behaviour Record</Button>
    </Card>
  );
}
