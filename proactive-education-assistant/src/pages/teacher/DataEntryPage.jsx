import { useState } from "react";

export default function DataEntryPage() {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="bg-slate-100 min-h-screen px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Data Entry Center
          </h1>
          <p className="text-sm text-slate-600">
            Enter student data used for risk prediction and early warnings.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <Tab label="Add Student" active={activeTab==="student"} onClick={()=>setActiveTab("student")} />
          <Tab label="Attendance" active={activeTab==="attendance"} onClick={()=>setActiveTab("attendance")} />
          <Tab label="Academic Scores" active={activeTab==="scores"} onClick={()=>setActiveTab("scores")} />
          <Tab label="Behaviour" active={activeTab==="behaviour"} onClick={()=>setActiveTab("behaviour")} />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
          Enter information regularly. The system will automatically detect students at risk.
        </div>

        {activeTab === "student" && <AddStudent />}
        {activeTab === "attendance" && <Attendance />}
        {activeTab === "scores" && <Scores />}
        {activeTab === "behaviour" && <Behaviour />}

      </div>
    </div>
  );
}

/* ---------------- UI PARTS ---------------- */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium border transition
      ${active 
        ? "bg-blue-600 text-white border-blue-600" 
        : "bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, type="text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-slate-600">{label}</label>
      <input
        type={type}
        placeholder={label}
        className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Button({ children }) {
  return (
    <button className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
      {children}
    </button>
  );
}

/* ---------------- FORMS ---------------- */

function AddStudent() {
  return (
    <Card title="Add New Student">
      <div className="grid sm:grid-cols-2 gap-4">

        <Input label="Student Name" />
        <Input label="Class / Grade" />
        <Input label="Date of Birth" type="date" />
        <Input label="Gender" />
        <Input label="Address" />
        <Input label="Parent Contact" />
        <Input label="Guardian Name" />

      </div>

      <Button>Save Student</Button>
    </Card>
  );
}

function Attendance() {
  return (
    <Card title="Add Attendance Record">
      <div className="grid sm:grid-cols-3 gap-4">

        <Input label="Student ID" />
        <Input label="Date" type="date" />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-600">Status</label>
          <select className="border border-slate-300 rounded-md px-3 py-2 text-sm">
            <option>Present</option>
            <option>Absent</option>
          </select>
        </div>

      </div>

      <Button>Save Attendance</Button>
    </Card>
  );
}

function Scores() {
  return (
    <Card title="Add Academic Score">
      <div className="grid sm:grid-cols-3 gap-4">

        <Input label="Student ID" />
        <Input label="Subject" />
        <Input label="Score (%)" />

      </div>

      <Button>Save Score</Button>
    </Card>
  );
}

function Behaviour() {
  return (
    <Card title="Add Behaviour Observation">
      <div className="space-y-4">

        <Input label="Student ID" />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-600">Observation</label>
          <textarea
            className="border border-slate-300 rounded-md px-3 py-2 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe behaviour..."
          />
        </div>

      </div>

      <Button>Save Observation</Button>
    </Card>
  );
}
