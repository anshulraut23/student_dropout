// function DashboardFooter() {
//   return (
//     <footer className="bg-white border-t border-gray-200">
//       <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
//         <span>© 2026 Proactive Education Assistant</span>
//         <div className="flex gap-6">
//           <a href="/privacy" className="hover:text-gray-900">Privacy</a>
//           <a href="/terms" className="hover:text-gray-900">Terms</a>
//           <a href="/contact" className="hover:text-gray-900">Contact</a>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default DashboardFooter;




function DashboardFooter() {
  return (
    <footer 
      className="border-t"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "rgba(26, 111, 181, 0.12)"
      }}
    >
      <div className="px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Copyright */}
        <span 
          className="text-sm"
          style={{ 
            color: "#6b7a8d",
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          © 2026 Proactive Education Assistant. All rights reserved.
        </span>

        {/* Links */}
        <div className="flex gap-8">
          <a 
            href="/privacy" 
            className="text-sm font-medium transition-colors"
            style={{ 
              color: "#6b7a8d",
              fontFamily: "'DM Sans', sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1a6fb5"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#6b7a8d"}
          >
            Privacy Policy
          </a>
          <a 
            href="/terms" 
            className="text-sm font-medium transition-colors"
            style={{ 
              color: "#6b7a8d",
              fontFamily: "'DM Sans', sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1a6fb5"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#6b7a8d"}
          >
            Terms of Service
          </a>
          <a 
            href="/contact" 
            className="text-sm font-medium transition-colors"
            style={{ 
              color: "#6b7a8d",
              fontFamily: "'DM Sans', sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1a6fb5"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#6b7a8d"}
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Bottom divider section with version info */}
      <div 
        className="px-6 py-4 text-center text-xs"
        style={{
          backgroundColor: "#f5f8fb",
          borderTop: "1px solid rgba(26, 111, 181, 0.12)",
          color: "#6b7a8d",
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        <p>Proactive Education Assistant v1.0.0 | Empowering teachers, protecting students</p>
      </div>
    </footer>
  );
}

export default DashboardFooter;