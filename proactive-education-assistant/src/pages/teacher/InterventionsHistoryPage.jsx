import { useState, useEffect } from "react";
import { FaHandsHelping, FaFilter, FaEye, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiService from "../../services/apiService";

export default function InterventionsHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState([]);
  const [filteredInterventions, setFilteredInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    status: "all",
    searchQuery: ""
  });

  useEffect(() => {
    loadInterventions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, interventions]);

  const loadInterventions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await apiService.getInterventions();
      if (result.success) {
        setInterventions(result.interventions || []);
      } else {
        setError(result.error || 'Failed to load interventions');
      }
    } catch (err) {
      console.error('Load interventions error:', err);
      setError(err.message || 'Failed to load interventions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...interventions];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter(intervention => intervention.status === filters.status);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(intervention => 
        intervention.studentName?.toLowerCase().includes(query) ||
        intervention.type?.toLowerCase().includes(query) ||
        intervention.description?.toLowerCase().includes(query)
      );
    }

    setFilteredInterventions(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      searchQuery: ""
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      planned: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const labels = {
      planned: t("teacher_interventions.planned", "Planned"),
      in_progress: t("teacher_interventions.in_progress", "In Progress"),
      completed: t("teacher_interventions.completed", "Completed"),
      cancelled: t("teacher_interventions.cancelled", "Cancelled")
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.planned}`}>
        {labels[status] || status}
      </span>
    );
  };



  if (error) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: '1.5rem' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">{t("teacher_interventions.error_loading", "Error Loading Interventions")}</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={loadInterventions}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              {t("teacher_interventions.retry", "Retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6" style={{ paddingTop: '4.5rem' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">{t("teacher_interventions.title", "Interventions History")}</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {t("teacher_interventions.found_count", "{{count}} intervention(s) found", { count: filteredInterventions.length })}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 mb-4 md:mb-6 space-y-3 md:space-y-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 text-sm" />
            <h2 className="text-sm font-medium text-gray-900">{t("teacher_interventions.filters", "Filters")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder={t("teacher_interventions.search_placeholder", "Search student, type...")}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 md:py-2.5 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">{t("teacher_interventions.all_statuses", "All Statuses")}</option>
                <option value="planned">{t("teacher_interventions.planned", "Planned")}</option>
                <option value="in_progress">{t("teacher_interventions.in_progress", "In Progress")}</option>
                <option value="completed">{t("teacher_interventions.completed", "Completed")}</option>
                <option value="cancelled">{t("teacher_interventions.cancelled", "Cancelled")}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("teacher_interventions.clear_filters", "Clear Filters")}
            </button>
          </div>
        </div>

        {/* Interventions List */}
        {filteredInterventions.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t("teacher_interventions.student", "Student")}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t("teacher_interventions.type", "Type")}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t("teacher_interventions.description", "Description")}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t("teacher_interventions.date", "Date")}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t("teacher_interventions.status", "Status")}</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t("teacher_interventions.action", "Action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInterventions.map((intervention) => (
                    <tr key={intervention.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{intervention.studentName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 capitalize">{intervention.type?.replace('_', ' ')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{intervention.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(intervention.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(intervention.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/students/${intervention.studentId}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          <FaEye className="text-xs" />
                          {t("teacher_interventions.view_student", "View Student")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {filteredInterventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{intervention.studentName}</h3>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{intervention.type?.replace('_', ' ')}</p>
                    </div>
                    {getStatusBadge(intervention.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{intervention.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(intervention.date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => navigate(`/students/${intervention.studentId}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <FaEye />
                      {t("teacher_interventions.view_student", "View Student")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Info */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
              {t("teacher_interventions.showing_count", "Showing {{count}} intervention(s)", { count: filteredInterventions.length })}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FaHandsHelping className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">{t("teacher_interventions.no_interventions", "No interventions found")}</p>
            <p className="text-xs text-gray-400 mt-1">{t("teacher_interventions.adjust_filters", "Try adjusting your filters or add new interventions")}</p>
          </div>
        )}

      </div>
    </div>
  );
}
