import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import "../../CSS/Admin/AdminDashboard.css"; // Import AdminDashboard CSS for sidebar and header
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: '', departmentId: '', level: '' });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [adminName, setAdminName] = useState('Admin');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const API_URL = 'http://localhost:8080/api/programs';
  const DEPARTMENTS_API_URL = 'http://localhost:8080/api/departments';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  useEffect(() => {
    fetchData();
  }, [sortField, sortOrder]);

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const [progResponse, deptResponse] = await Promise.all([
      axios.get(API_URL, config),
      axios.get(DEPARTMENTS_API_URL, config),
    ]);

    console.log("Programs fetched:", progResponse.data);
    console.log("Departments fetched:", deptResponse.data);

    setPrograms(sortData(progResponse.data, sortField, sortOrder));
    setDepartments(deptResponse.data);
    setAdminName('Admin');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};



  const sortData = (data, field, order) => {
    return [...data].sort((a, b) => {
      if (order === 'asc') return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });
  };

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = {
      name: formData.name,
      departmentId: formData.departmentId,
      level: formData.level,
    };

    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, payload, config);
    } else {
      await axios.post(`${API_URL}/create`, payload, config);
    }

    resetForm();
    fetchData();
  } catch (error) {
    console.error('Error saving program:', error);
  }
};


  const handleEdit = (program) => {
    setFormData({
      name: program.name,
      departmentId: program.department?.id || '',
      credits: program.credits || '',
    });
    setEditingId(program.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`${API_URL}/${id}`, config);
        fetchData();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', departmentId: '', level: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredPrograms = programs.filter(prog =>
    prog.name.toLowerCase().includes(search.toLowerCase())
  );

  const getDepartmentName = (deptId) => departments.find(d => d.id === deptId)?.name || '-';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <Sidebar adminName={adminName} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Header adminName={adminName} toggleSidebar={toggleSidebar} />
          <div className="page-container">
            <div className="content-container">
              <div className="program-container">
                <div className="header-section">
                  <h1>SMS 2025/26</h1>
                  <h2>{getGreeting()}, {adminName}</h2>
                </div>
                <div className="program-header">
                  <div>
                    <h3>Programs</h3>
                    <p>Manage academic programs in the institution</p>
                  </div>
                  <button className="add-button" onClick={() => setShowForm(true)}>
                    <FaPlus /> Add Program
                  </button>
                </div>
                <div className="search-section">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search programs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  {search && (
                    <button className="clear-btn" onClick={() => setSearch("")}>
                      Clear
                    </button>
                  )}
                </div>
                <div className="program-table-container">
                  <table className="program-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('id')}>ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th>Department</th>
                        <th>Level</th>
                        <th onClick={() => handleSort('createdAt')}>Created At {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPrograms.length > 0 ? (
                        filteredPrograms.map((program) => (
                          <tr key={program.id}>
                            <td>{program.id}</td>
                            <td>{program.name}</td>
                            <td>{getDepartmentName(program.department?.id)}</td>
                            <td>{program.level}</td>
                            <td>{program.createdAt ? new Date(program.createdAt).toLocaleString() : '-'}</td>
                            <td className="actions-cell">
                              <button className="edit-btn" onClick={() => handleEdit(program)}>
                                <FaEdit /> Edit
                              </button>
                              <button className="delete-btn" onClick={() => handleDelete(program.id)}>
                                <FaTrash /> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-data">
                            <div className="empty-state">
                              <p>No programs found</p>
                              <p className="hint">Try a different search term or add a new program</p>
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
                      <h3>{editingId ? 'Edit Program' : 'Add New Program'}</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>Program Name*</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Department*</label>
                          <select
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select a department</option>
                            {departments.map(dept => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                        <label>Level*</label>
                        <input
                          type="text"
                          name="level"
                          value={formData.level}
                          onChange={handleInputChange}
                          required
                        />
                        </div>
                        <div className="form-actions">
                          <button type="button" className="cancel-btn" onClick={resetForm}>
                            Cancel
                          </button>
                          <button type="submit" className="submit-btn">
                            {editingId ? 'Update' : 'Add'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
              <style jsx>{`
                .page-container {
                  display: flex;
                  flex-direction: column;
                  min-height: calc(100vh - 60px); /* Adjust for header height */
                  background-color: #f5f7fa;
                }
                .content-container {
                  flex: 1;
                  padding: 20px;
                  margin-left: 0;
                  margin-top: 0;
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                }
                @media (max-width: 768px) {
                  .content-container {
                    margin-left: 0;
                  }
                }
                .program-container {
                  padding: 2rem; /* Increased padding for larger appearance */
                  background: #fff;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                  flex: 1;
                  min-height: 100%;
                }
                .header-section {
                  margin-bottom: 2rem; /* Increased margin */
                }
                .header-section h1 {
                  font-size: 2rem; /* Increased font size */
                  color: #2c3e50;
                  margin-bottom: 0.5rem;
                }
                .header-section h2 {
                  font-size: 1.5rem; /* Increased font size */
                  color: #7f8c8d;
                  font-weight: normal;
                }
                .program-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 2rem; /* Increased margin */
                }
                .program-header h3 {
                  font-size: 1.8rem; /* Increased font size */
                  color: #2c3e50;
                  margin-bottom: 0.25rem;
                }
                .program-header p {
                  color: #7f8c8d;
                  margin: 0;
                  font-size: 1.1rem; /* Slightly larger */
                }
                .add-button {
                  background: #3498db;
                  color: white;
                  border: none;
                  padding: 1rem 2rem; /* Increased padding */
                  border-radius: 6px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  font-weight: 600;
                  font-size: 1.1rem; /* Larger font */
                  transition: background 0.2s;
                }
                .add-button:hover {
                  background: #2980b9;
                }
                .search-section {
                  margin-bottom: 2rem; /* Increased margin */
                  display: flex;
                  align-items: center;
                }
                .search-box {
                  position: relative;
                  width: 100%;
                  max-width: 500px; /* Increased max-width */
                }
                .search-box input {
                  width: 100%;
                  padding: 1rem 1rem 1rem 3rem; /* Increased padding */
                  border: 1px solid #ddd;
                  border-radius: 6px;
                  font-size: 1.2rem; /* Larger font */
                }
                .search-icon {
                  position: absolute;
                  left: 1rem;
                  top: 50%;
                  transform: translateY(-50%);
                  color: #95a5a6;
                  font-size: 1.2rem; /* Larger icon */
                }
                .clear-btn {
                  padding: 0.8rem 1.5rem; /* Increased padding */
                  margin-left: 1rem;
                  border: 1px solid #ddd;
                  border-radius: 6px;
                  background: none;
                  cursor: pointer;
                  font-size: 1.1rem; /* Larger font */
                  transition: background-color 0.3s;
                }
                .clear-btn:hover {
                  background-color: #f0f0f0;
                }
                .program-table-container {
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                  overflow: hidden;
                  flex: 1;
                  min-height: 500px; /* Increased minimum height for larger appearance */
                }
                .program-table {
                  width: 100%;
                  border-collapse: collapse;
                }
                .program-table th {
                  background: #f8f9fa;
                  padding: 1.5rem; /* Increased padding */
                  text-align: left;
                  font-weight: 600;
                  color: #2c3e50;
                  border-bottom: 1px solid #eee;
                  cursor: pointer;
                  font-size: 1.1rem; /* Larger font */
                }
                .program-table td {
                  padding: 1.5rem;
                  border-bottom: 1px solid #eee;
                  color: #34495e;
                  font-size: 1rem; /* Slightly larger font */
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
                  gap: 0.3rem;
                  font-size: 1.2rem; /* Larger font for icons */
                }
                .edit-btn {
                  color: #3498db;
                }
                .edit-btn:hover {
                  background: rgba(52,152,219,0.1);
                }
                .delete-btn {
                  color: #e74c3c;
                }
                .delete-btn:hover {
                  background: rgba(231,76,60,0.1);
                }
                .no-data {
                  text-align: center;
                  padding: 3rem; /* Increased padding */
                }
                .empty-state {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                .empty-state p {
                  margin: 0;
                  color: #7f8c8d;
                  font-size: 1.2rem; /* Larger font */
                }
                .hint {
                  font-size: 1rem; /* Slightly larger */
                  margin-top: 0.5rem;
                }
                .modal-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: rgba(0,0,0,0.5);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 1000;
                }
                .modal-content {
                  background: white;
                  padding: 2.5rem; /* Increased padding */
                  border-radius: 8px;
                  width: 100%;
                  max-width: 700px; /* Increased max-width */
                  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                }
                .modal-content h3 {
                  margin: 0 0 1.5rem;
                  color: #2c3e50;
                  font-size: 1.8rem; /* Larger font */
                }
                .form-group {
                  margin-bottom: 1.5rem; /* Increased margin */
                }
                .form-group label {
                  display: block;
                  margin-bottom: 0.5rem;
                  font-weight: 600;
                  color: #34495e;
                  font-size: 1.1rem; /* Larger font */
                }
                .form-group input, .form-group select {
                  width: 100%;
                  padding: 1rem; /* Increased padding */
                  border: 1px solid #ddd;
                  border-radius: 6px;
                  font-size: 1.1rem; /* Larger font */
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
                  background: #f8f9fa;
                  color: #34495e;
                  border: 1px solid #ddd;
                  padding: 1rem 2rem; /* Increased padding */
                  border-radius: 6px;
                  cursor: pointer;
                  font-weight: 600;
                  font-size: 1.1rem; /* Larger font */
                  transition: all 0.2s;
                }
                .cancel-btn:hover {
                  background: #e9ecef;
                }
                .submit-btn {
                  background: #2ecc71;
                  color: white;
                  border: none;
                  padding: 1rem 2rem; /* Increased padding */
                  border-radius: 6px;
                  cursor: pointer;
                  font-weight: 600;
                  font-size: 1.1rem; /* Larger font */
                  transition: background 0.2s;
                }
                .submit-btn:hover {
                  background: #27ae60;
                }
                @media (max-width: 768px) {
                  .program-header {
                    flex-direction: column;
                    gap: 1rem;
                  }
                  .add-button {
                    width: 100%;
                  }
                  .program-table th, .program-table td {
                    padding: 0.5rem;
                    font-size: 0.9rem;
                  }
                  .modal-content {
                    width: 90%;
                    padding: 1rem;
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;