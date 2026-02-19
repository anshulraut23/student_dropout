import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

function DebugPanel() {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      // Get current user info
      const userResponse = await apiService.getCurrentUser();
      
      // Get all teachers
      const teachersResponse = await apiService.getAllTeachers();
      
      // Get debug data from backend
      const backendDebug = await fetch('http://localhost:5000/api/debug/data').then(r => r.json());
      
      setDebugData({
        currentUser: userResponse,
        teachers: teachersResponse,
        backend: backendDebug
      });
    } catch (error) {
      console.error('Debug fetch error:', error);
      setDebugData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  if (loading) return <div className="p-4">Loading debug info...</div>;
  if (!debugData) return null;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Debug Information</h3>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded">
          <h4 className="font-semibold mb-2">Current User (from API)</h4>
          <pre className="text-xs overflow-auto">{JSON.stringify(debugData.currentUser, null, 2)}</pre>
        </div>

        <div className="bg-white p-4 rounded">
          <h4 className="font-semibold mb-2">Teachers Response</h4>
          <pre className="text-xs overflow-auto">{JSON.stringify(debugData.teachers, null, 2)}</pre>
        </div>

        <div className="bg-white p-4 rounded">
          <h4 className="font-semibold mb-2">Backend Data Store</h4>
          <pre className="text-xs overflow-auto">{JSON.stringify(debugData.backend, null, 2)}</pre>
        </div>

        <div className="bg-white p-4 rounded">
          <h4 className="font-semibold mb-2">Local Storage</h4>
          <pre className="text-xs overflow-auto">{JSON.stringify({
            token: localStorage.getItem('token')?.substring(0, 20) + '...',
            role: localStorage.getItem('role'),
            school_id: localStorage.getItem('school_id'),
            school_name: localStorage.getItem('school_name')
          }, null, 2)}</pre>
        </div>
      </div>

      <button
        onClick={fetchDebugData}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Debug Data
      </button>
    </div>
  );
}

export default DebugPanel;
