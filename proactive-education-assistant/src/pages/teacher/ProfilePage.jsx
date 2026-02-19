import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeacher } from "../../context/TeacherContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { teacher, logoutTeacher } = useTeacher();

  const [edit, setEdit] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const [form, setForm] = useState({
    name: teacher?.name || "Guest User",
    email: teacher?.email || "guest@email.com",
    school: teacher?.school || "Demo School",
    subject: teacher?.subject || "All Subjects",
    experience: teacher?.experience || "2 Years",
    phone: teacher?.phone || "",
    location: teacher?.location || "",
    qualification: teacher?.qualification || "",
  });

  const change = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const uploadImage = e => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  return (
    <div className="bg-slate-100 min-h-screen px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>

        {/* PROFILE HEADER */}
        <div className="bg-white rounded-xl p-6 text-white flex flex-col sm:flex-row justify-between gap-4 items-center">

          <div className="flex items-center gap-4">
            <label className="cursor-pointer relative">
              <input type="file" hidden onChange={uploadImage} />
              <div className="w-20 h-20 rounded-xl bg-blue-600 flex items-center justify-center text-3xl font-bold overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} className="w-full h-full object-cover" />
                ) : (
                  form.name.charAt(0)
                )}
              </div>
              {edit && (
                <span className="absolute bottom-0 right-0 bg-white text-slate-900 text-xs px-1 rounded">
                  Edit
                </span>
              )}
            </label>

            <div>
              {edit ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={change}
                  className="bg-slate-800 border border-slate-600 rounded-md px-3 py-1 text-white text-xl font-semibold"
                />
              ) : (
                <h2 className="text-2xl font-semibold">{form.name}</h2>
              )}

              <p className="text-sm opacity-80">{form.subject}</p>
              <p className="text-xs opacity-60">{form.school}</p>
            </div>
          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="bg-blue-600 px-5 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            {edit ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* DETAILS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <Field label="Email" name="email" edit={edit} value={form.email} onChange={change} />
          <Field label="Phone" name="phone" edit={edit} value={form.phone} onChange={change} />
          <Field label="Location" name="location" edit={edit} value={form.location} onChange={change} />
          <Field label="School" name="school" edit={edit} value={form.school} onChange={change} />
          <Field label="Subject" name="subject" edit={edit} value={form.subject} onChange={change} />
          <Field label="Experience" name="experience" edit={edit} value={form.experience} onChange={change} />
          <Field label="Qualification" name="qualification" edit={edit} value={form.qualification} onChange={change} />

        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat title="Students Managed" value="48" />
          <Stat title="Dropouts Prevented" value="12" />
          <Stat title="Current Level" value="Level 3" />
        </div>

        {/* LOGOUT */}
        <div className="bg-white border rounded-lg p-5 flex justify-between items-center">
          <span className="text-sm text-slate-600">Account Active</span>
          <button
            onClick={() => {
              logoutTeacher();
              navigate("/");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

/* -------- SMALL COMPONENTS -------- */

function Field({ label, value, edit, name, onChange }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      {edit ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="border rounded-md px-3 py-2 w-full text-sm"
        />
      ) : (
        <p className="font-medium text-slate-900">{value || "-"}</p>
      )}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white border rounded-lg p-4 text-center">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-semibold text-blue-600 mt-1">{value}</p>
    </div>
  );
}
