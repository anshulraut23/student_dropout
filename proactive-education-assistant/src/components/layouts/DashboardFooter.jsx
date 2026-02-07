function DashboardFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
        <span>© 2026 Proactive Education Assistant</span>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-slate-200">Privacy</a>
          <a href="/terms" className="hover:text-slate-200">Terms</a>
          <a href="/contact" className="hover:text-slate-200">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default DashboardFooter;
