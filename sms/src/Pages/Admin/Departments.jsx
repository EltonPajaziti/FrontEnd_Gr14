import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({ name: '', tenantId: '' });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [adminName, setAdminName] = useState('Admin');

  const API_URL = 'http://localhost:8080/api/departments';
  const FACULTIES_API_URL = 'http://localhost:8080/api/faculties';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(API_URL);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await axios.get(FACULTIES_API_URL);
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchAdminName = async () => {
    try {
      const response = await axios.get(AUTH_API_URL);
      setAdminName(response.data.name || 'Admin');
    } catch (error) {
      console.error('Error fetching admin name:', error);
      setAdminName('Admin');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchFaculties();
    fetchAdminName();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    else if (currentHour < 18) return 'Good Afternoon';
    else return 'Good Evening';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: formData.name, tenantID: { id: formData.tenantId } };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleEdit = (department) => {
    setFormData({ name: department.name, tenantId: department.tenantID?.id || '' });
    setEditingId(department.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', tenantId: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(search.toLowerCase())
  );

  const getFacultyName = (tenantId) => faculties.find(f => f.id === tenantId)?.name || '-';

  return (
    <div className="department-container">
      <div className="header-section">
        <h1>SMS 2025/26</h1>
        <h2>{getGreeting()}, {adminName}</h2>
      </div>
      <div className="department-header">
        <div>
          <h3>Departments</h3>
          <p>Manage academic departments in the institution</p>
        </div>
        <button className="add-button" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Department
        </button>
      </div>
      <div className="search-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="department-table-container">
        <table className="department-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Faculty</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department) => (
                <tr key={department.id}>
                  <td>{department.id}</td>
                  <td>{department.name}</td>
                  <td>{getFacultyName(department.tenantID?.id)}</td>
                  <td>{department.createdAt ? new Date(department.createdAt).toLocaleString() : '-'}</td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => handleEdit(department)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(department.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  <div className="empty-state">
                    <p>No departments found</p>
                    <p className="hint">Try a different search term or add a new department</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Edit Department' : 'Add New Department'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Faculty*</label>
                <select
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a faculty</option>
                  {faculties.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update Department' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style jsx>{`
        .department-container {
          padding: 1rem;
        }
        .header-section {
          margin-bottom: 2rem;
        }
        .header-section h1 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        .header-section h2 {
          font-size: 1.2rem;
          color: #7f8c8d;
          font-weight: normal;
        }
        .department-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .department-header h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }
        .department-header p {
          color: #7f8c8d;
          margin: 0;
        }
        .add-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: background-color 0.2s;
        }
        .add-button:hover {
          background-color: #2980b9;
        }
        .search-section {
          margin-bottom: 1.5rem;
        }
        .search-box {
          position: relative;
          width: 100%;
          max-width: 400px;
        }
        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #95a5a6;
        }
        .department-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .department-table {
          width: 100%;
          border-collapse: collapse;
        }
        .department-table th {
          background-color: #f8f9fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #eee;
        }
        .department-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          color: #34495e;
        }
        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }
        .edit-btn, .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .edit-btn {
          color: #3498db;
        }
        .edit-btn:hover {
          background-color: rgba(52,152,219,0.1);
        }
        .delete-btn {
          color: #e74c3c;
        }
        .delete-btn:hover {
          background-color: rgba(231,76,60,0.1);
        }
        .no-data {
          text-align: center;
          padding: 2rem;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-state p {
          margin: 0;
          color: #7f8c8d;
        }
        .hint {
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .modal-content h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #2c3e50;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #34495e;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        .form-group select {
          appearance: none;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>') no-repeat right 0.75rem center;
          background-size: 12px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .cancel-btn {
          background-color: #f8f9fa;
          color: #34495e;
          border: 1px solid #ddd;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .cancel-btn:hover {
          background-color: #e9ecef;
        }
        .submit-btn {
          background-color: #2ecc71;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
        }
        .submit-btn:hover {
          background-color: #27ae60;
        }
      `}</style>
    </div>
  );
};

export default Departments;