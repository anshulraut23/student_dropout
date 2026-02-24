// import { NavLink } from "react-router-dom";
// import { 
//   FaChartLine, 
//   FaUsers, 
//   FaClipboardList, 
//   FaRobot 
// } from "react-icons/fa";

// export default function Sidebar() {
//   return (
//     <aside 
//       className="fixed top-0 left-0 w-64 h-screen z-40 flex flex-col"
//       style={{ 
//         backgroundColor: '#1d2530',
//         background: '#1d2530'
//       }}
//     >
//       {/* Header Logo Section */}
//       <div className="px-4 py-4 border-b" style={{ borderColor: '#2a3744' }}>
//         <h2 className="text-sm font-semibold text-white">EduShield</h2>
//         <p className="text-xs text-gray-400 mt-1">Dashboard</p>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//         <NavItem to="/dashboard" label="Dashboard" icon={FaChartLine} />
//         <NavItem to="/students" label="Students" icon={FaUsers} />
//         <NavItem to="/data-entry" label="Data Entry" icon={FaClipboardList} />
//         <NavItem to="/chatbot" label="Chatbot" icon={FaRobot} />
//       </nav>

//       {/* Footer */}
//       <div 
//         className="px-4 py-3 border-t text-xs text-center" 
//         style={{ borderColor: "#2a3744", color: "#9ca3af" }}
//       >
//         Proactive Education Assistant
//       </div>
//     </aside>
//   );
// }

// function NavItem({ to, label, icon: Icon }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
//           isActive
//             ? "#3c7fdd text-white shadow-lg"
//             : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
//         }`
//       }
//     >
//       {Icon && <Icon className="text-lg" />}
//       <span>{label}</span>
//     </NavLink>
//   );
// }


