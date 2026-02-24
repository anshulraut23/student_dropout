import { useState, useEffect } from 'react';
import { FaPlus, FaSchool, FaEdit, FaTrash } from 'react-icons/fa';
import { injectHorizonStyles } from '../../styles/horizonTheme';

function SchoolManagement() {
  const [schools, setSchools] = useState([
    {
      id: 'SCH-001',
      name: 'Sunrise Public School',
      type: 'School',
      address: '123 Main Street, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 9876543210',
      email: 'info@sunriseschool.edu',
      principal: 'Dr. Rajesh Kumar',
      establishedYear: '2005',
      status: 'active'
    }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Inject Horizon theme on mount
  useEffect(() => {
    injectHorizonStyles();
  }, []);

  const handleAddSchool = () => {
    setSelectedSchool(null);
    setModalOpen(true);
  };

  const handleEditSchool = (school) => {
    setSelectedSchool(school);
    setModalOpen(true);
  };

  const handleDeleteSchool = (schoolId) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      setSchools(schools.filter(s => s.id !== schoolId));
    }
  };

  return (
    <div className="hd-page">
      <div className="hd-container">
        {/* Header */}
        <div className="hd-section-header hd-flex-between mb-8">
          <div>
            <h1 className="hd-section-title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>School Management</h1>
            <p className="hd-text-muted hd-text-sm">Create and manage school details</p>
          </div>
          <button
            onClick={handleAddSchool}
            className="hd-btn-primary"
          >
            <FaPlus />
            Add School
          </button>
        </div>

        {/* Stats */}
        <div className="hd-grid-3 mb-8">
          <div className="hd-stat-card hd-fade">
            <div className="hd-flex-between mb-3">
              <p className="hd-text-xs hd-text-muted hd-font-semibold">Total Schools</p>
              <div className="hd-icon-box" style={{ background: 'rgba(26,111,181,0.1)' }}>
                <FaSchool size={18} style={{ color: '#1a6fb5' }} />
              </div>
            </div>
            <p className="hd-stat-num" style={{ color: '#1a6fb5' }}>{schools.length}</p>
          </div>
          <div className="hd-stat-card hd-fade">
            <div className="hd-flex-between mb-3">
              <p className="hd-text-xs hd-text-muted hd-font-semibold">Active Schools</p>
              <div className="hd-icon-box" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <FaSchool size={18} style={{ color: '#10b981' }} />
              </div>
            </div>
            <p className="hd-stat-num" style={{ color: '#10b981' }}>
              {schools.filter(s => s.status === 'active').length}
            </p>
          </div>
          <div className="hd-stat-card hd-fade">
            <div className="hd-flex-between mb-3">
              <p className="hd-text-xs hd-text-muted hd-font-semibold">Cities</p>
              <div className="hd-icon-box" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <FaSchool size={18} style={{ color: '#8b5cf6' }} />
              </div>
            </div>
            <p className="hd-stat-num" style={{ color: '#8b5cf6' }}>
              {new Set(schools.map(s => s.city)).size}
            </p>
          </div>
        </div>

        {/* Schools Table */}
        <div className="hd-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'rgba(26,111,181,0.08)', borderBottom: '1px solid rgba(26,111,181,0.2)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1a6fb5' }}>School ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1a6fb5' }}>Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1a6fb5' }}>Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1a6fb5' }}>City</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1a6fb5' }}>Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1a6fb5' }}>Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold" style={{ color: '#1a6fb5' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid rgba(26,111,181,0.1)' }}>
                {schools.map((school) => (
                  <tr key={school.id} style={{ borderBottom: '1px solid rgba(26,111,181,0.08)', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(26,111,181,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: '#1e2c3a' }}>{school.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#1e2c3a' }}>{school.name}</p>
                        <p className="text-xs" style={{ color: '#6b7a8d' }}>{school.principal}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7a8d' }}>{school.type}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7a8d' }}>{school.city}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: '#6b7a8d' }}>
                        <p>{school.phone}</p>
                        <p className="text-xs">{school.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="hd-badge" style={{
                        background: school.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(107,122,141,0.1)',
                        color: school.status === 'active' ? '#10b981' : '#6b7a8d',
                        border: `1px solid ${school.status === 'active' ? 'rgba(16,185,129,0.3)' : 'rgba(107,122,141,0.3)'}`
                      }}>
                        {school.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="hd-flex" style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEditSchool(school)}
                          className="hd-btn-icon"
                          title="Edit School"
                          style={{ color: '#1a6fb5', background: 'rgba(26,111,181,0.1)', padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(26,111,181,0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(26,111,181,0.1)'}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteSchool(school.id)}
                          className="hd-btn-icon"
                          title="Delete School"
                          style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
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
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <SchoolModal
          school={selectedSchool}
          onClose={() => setModalOpen(false)}
          onSuccess={(schoolData) => {
            if (selectedSchool) {
              setSchools(schools.map(s => s.id === selectedSchool.id ? { ...schoolData, id: selectedSchool.id } : s));
            } else {
              setSchools([...schools, { ...schoolData, id: `SCH-${String(schools.length + 1).padStart(3, '0')}`, status: 'active' }]);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function SchoolModal({ school, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: school?.name || '',
    type: school?.type || 'School',
    address: school?.address || '',
    city: school?.city || '',
    state: school?.state || '',
    pincode: school?.pincode || '',
    phone: school?.phone || '',
    email: school?.email || '',
    principal: school?.principal || '',
    establishedYear: school?.establishedYear || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0" style={{ background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div className="hd-card" style={{ width: '100%', maxWidth: '42rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'sticky', top: 0, background: '#ffffff', borderBottom: '1px solid rgba(26,111,181,0.15)', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <h2 className="hd-section-title" style={{ fontSize: '1.25rem', marginBottom: 0, color: '#1e2c3a' }}>
            {school ? 'Edit School' : 'Add New School'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7a8d', fontSize: '1.5rem', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                School Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="hd-input"
                placeholder="Sunrise Public School"
              />
            </div>

            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                School Type <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="hd-input"
              >
                <option value="School">School</option>
                <option value="NGO">NGO</option>
                <option value="Tuition Center">Tuition Center</option>
                <option value="College">College</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="hd-input"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                City <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="hd-input"
                placeholder="Mumbai"
              />
            </div>

            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                State <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="hd-input"
                placeholder="Maharashtra"
              />
            </div>

            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                Pincode <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="hd-input"
                placeholder="400001"
              />
            </div>

            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                Phone <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="hd-input"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="hd-input"
                placeholder="info@school.edu"
              />
            </div>

            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                Principal Name
              </label>
              <input
                type="text"
                name="principal"
                value={formData.principal}
                onChange={handleChange}
                className="hd-input"
                placeholder="Dr. Rajesh Kumar"
              />
            </div>

            <div>
              <label className="hd-label" style={{ marginBottom: '0.5rem' }}>
                Established Year
              </label>
              <input
                type="text"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                className="hd-input"
                placeholder="2005"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(26,111,181,0.1)' }}>
            <button
              type="button"
              onClick={onClose}
              className="hd-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="hd-btn-primary"
            >
              {school ? 'Update School' : 'Add School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SchoolManagement;
