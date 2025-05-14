import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Sidebar from '../../Components/Admin/Sidebar';

const Faculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:8080/api/faculties';

  const fetchFaculties = async () => {
    try {
      const response = await axios.get(API_URL);
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address
      };

      if (editingId) {
        // For updates, exclude email since the backend doesn't update it
        delete payload.email;
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        // For creation, include email
        await axios.post(API_URL, payload);
      }
      resetForm();
      fetchFaculties();
    } catch (error) {
      console.error('Error saving faculty:', error);
    }
  };

  const handleEdit = (faculty) => {
    setFormData({
      name: faculty.name,
      email: faculty.email, // Set email for display, but it will be disabled
      address: faculty.address || ''
    });
    setEditingId(faculty.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchFaculties();
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', address: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="content-container">
        <div className="faculty-container">
          <div className="header-section">
            <h1>SMS 2025/26</h1>
            <h2>Mirëmëngjes, Adrian Mehaj</h2>
          </div>

          <div className="faculty-header">
            <div>
              <h3>Faculties</h3>
              <p>Manage academic faculties in the institution</p>
            </div>
            <button className="add-button" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Faculty
            </button>
          </div>

          <div className="search-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search faculties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="faculty-table-container">
            <table className="faculty-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculties.length > 0 ? (
                  filteredFaculties.map((faculty) => (
                    <tr key={faculty.id}>
                      <td>{faculty.id}</td>
                      <td>{faculty.name}</td>
                      <td>{faculty.email}</td>
                      <td>{faculty.address || '-'}</td>
                      <td>{faculty.createdAt ? new Date(faculty.createdAt).toLocaleString() : '-'}</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEdit(faculty)}>
                          <FaEdit />
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(faculty.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      <div className="empty-state">
                        <p>No faculties found</p>
                        <p className="hint">Try a different search term or add a new faculty</p>
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
                <h3>{editingId ? 'Edit Faculty' : 'Add New Faculty'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Faculty Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={!!editingId} // Disable email field when editing
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {editingId ? 'Update Faculty' : 'Add Faculty'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
        }
        
        .content-container {
          flex: 1;
          padding: 2rem;
          margin-top: 50px;
          margin-left: 30px;
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
        
        .faculty-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .faculty-header h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }
        
        .faculty-header p {
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
        
        .faculty-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        
        .faculty-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .faculty-table th {
          background-color: #f8f9fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #eee;
        }
        
        .faculty-table td {
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
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .form-group input:disabled {
          background-color: #f0f0f0;
          cursor: not-allowed;
        }
        
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
        }
        
        .form-row .form-group {
          flex: 1;
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

export default Faculty;