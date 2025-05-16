import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaEdit, FaEye, FaDownload } from 'react-icons/fa';

// Sample initial data to ensure a course is visible
const initialMaterials = [
  {
    id: 1,
    title: 'Introduction to Algorithms',
    tenant_id: 4, // Engineering course
    uploaded_at: '2025-05-16T04:36:00Z',
    file_url: 'https://example.com/files/algorithms.pdf',
    description: 'Basic algorithms course material',
  },
];

const CourseMaterials = () => {
  const [materials, setMaterials] = useState(initialMaterials);
  const [formData, setFormData] = useState({ title: '', description: '', file: null, tenantId: 1 });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [adminName, setAdminName] = useState('Admin');
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const API_URL = 'http://localhost:8080/api/course-materials';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  const tenantToCourse = {
    1: 'Computer Science',
    2: 'Mathematics',
    3: 'Physics',
    4: 'Engineering',
  };

  useEffect(() => {
    fetchData();
  }, [sortField, sortOrder]);

  const fetchData = async () => {
    try {
      const [materialsResponse, authResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get(AUTH_API_URL),
      ]);
      setMaterials(sortData(materialsResponse.data.length > 0 ? materialsResponse.data : initialMaterials, sortField, sortOrder));
      setAdminName(authResponse.data.name || 'Admin');
    } catch (error) {
      console.error('Error fetching data:', error);
      setMaterials(sortData(initialMaterials, sortField, sortOrder));
    }
  };

  const sortData = (data, field, order) => {
    return [...data].sort((a, b) => {
      if (field === 'uploaded_at') {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return order === 'asc' ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else if (name === 'tenantId') {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('tenantId', formData.tenantId);
      if (formData.file) data.append('file', formData.file);

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const handleView = async (material) => {
    try {
      const response = await axios.get(`${API_URL}/${material.id}`);
      setViewMaterial(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching material details:', error);
      setViewMaterial(material);
      setShowViewModal(true);
    }
  };

  const handleEdit = (material) => {
    setFormData({
      title: material.title,
      description: material.description || '',
      file: null,
      tenantId: material.tenant_id || 1,
    });
    setEditingId(material.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course material?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleDownload = (material) => {
    if (!material.file_url) {
      alert('No file available to download.');
      return;
    }
    const link = document.createElement('a');
    link.href = material.file_url;
    link.download = material.file_url.split('/').pop() || material.title || 'material';
    link.click();
  };

  const handleExport = () => {
    const exportData = materials.map(material => ({
      Title: material.title,
      Course: tenantToCourse[material.tenant_id] || 'Unknown Course',
      'Uploaded By': adminName,
      'Upload Date': material.uploaded_at ? new Date(material.uploaded_at).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : '-',
      File: material.file_url || '-',
    }));

    const headers = ['Title', 'Course', 'Uploaded By', 'Upload Date', 'File'];
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(',')),
    ];
    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'course_materials.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', file: null, tenantId: 1 });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(search.toLowerCase())
  );

  const getCourseName = (tenantId) => tenantToCourse[tenantId] || 'Unknown Course';

  const getFileInfo = (material) => {
    if (!material.file_url) return 'Not Uploaded';
    const fileName = material.file_url.split('/').pop() || 'Unknown File';
    const extension = fileName.split('.').pop().toLowerCase();
    return extension === 'pdf' ? `${fileName} (PDF Uploaded)` : 
           extension === 'doc' || extension === 'docx' ? `${fileName} (Word Uploaded)` : 
           `${fileName} (Uploaded)`;
  };

  return (
    <div className="materials-container">
      <div className="header-section">
        <h1>SMS 2025/26</h1>
        <h2>{getGreeting()}, {adminName}</h2>
      </div>
      <div className="materials-header">
        <div>
          <h3>Course Materials</h3>
          <p>Browse and download course materials for all courses</p>
        </div>
        <div className="header-buttons">
          <button className="add-button" onClick={() => setShowForm(true)}>
            <FaPlus /> Upload Material
          </button>
          <button className="export-button" onClick={handleExport}>
            <FaDownload /> Export
          </button>
        </div>
      </div>
      <div className="search-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="materials-table-container">
        <table className="materials-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Course</th>
              <th onClick={() => handleSort('adminName')}>
                Uploaded By {sortField === 'adminName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('uploaded_at')}>
                Upload Date {sortField === 'uploaded_at' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material, index) => (
                <tr key={material.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{material.title}</td>
                  <td>{getCourseName(material.tenant_id)}</td>
                  <td>{adminName}</td>
                  <td>
                    {material.uploaded_at
                      ? new Date(material.uploaded_at).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
                      : '-'}
                  </td>
                  <td>{getFileInfo(material)}</td>
                  <td className="actions-cell">
                    <button className="view-btn" onClick={() => handleView(material)}>
                      <FaEye /> View
                    </button>
                    <button className="edit-btn" onClick={() => handleEdit(material)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(material.id)}>
                      <FaTrash /> Delete
                    </button>
                    <button className="download-btn" onClick={() => handleDownload(material)} disabled={!material.file_url}>
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  <div className="empty-state">
                    <p>No course materials found</p>
                    <p className="hint">Try a different search term or upload a new material</p>
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
            <h3>{editingId ? 'Edit Material' : 'Upload New Material'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Course*</label>
                <select
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleInputChange}
                  required
                >
                  {Object.entries(tenantToCourse).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>File*</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  required={!editingId}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && viewMaterial && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>View Material</h3>
            <div className="view-details">
              <p><strong>Title:</strong> {viewMaterial.title}</p>
              <p><strong>Description:</strong> {viewMaterial.description || 'No description'}</p>
              <p><strong>Course:</strong> {getCourseName(viewMaterial.tenant_id)}</p>
              <p>
                <strong>File:</strong>{' '}
                <a href={viewMaterial.file_url} target="_blank" rel="noopener noreferrer">
                  Download File
                </a>
              </p>
              <p><strong>Uploaded At:</strong> {new Date(viewMaterial.uploaded_at).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</p>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .materials-container { padding: 1rem; }
        .header-section { margin-bottom: 1.5rem; }
        .header-section h1 { font-size: 1.8rem; color: #2c3e50; margin-bottom: 0.5rem; }
        .header-section h2 { font-size: 1.2rem; color: #7f8c8d; font-weight: normal; }
        .materials-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .materials-header h3 { font-size: 1.5rem; color: #2c3e50; margin-bottom: 0.25rem; }
        .materials-header p { color: #7f8c8d; margin: 0; }
        .header-buttons { display: flex; gap: 1rem; }
        .add-button, .export-button { background: #3498db; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; transition: background 0.2s; }
        .export-button { background: #2ecc71; }
        .add-button:hover { background: #2980b9; }
        .export-button:hover { background: #27ae60; }
        .search-section { margin-bottom: 1.5rem; }
        .search-box { position: relative; max-width: 400px; }
        .search-box input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #95a5a6; }
        .materials-table-container { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
        .materials-table { width: 100%; border-collapse: collapse; }
        .materials-table th { 
          background: #e6f0fa; 
          padding: 1rem 1.5rem; 
          text-align: left; 
          font-weight: 600; 
          color: #1a3c5e; 
          border-bottom: 2px solid #bbdefb; 
          cursor: pointer; 
          font-size: 0.95rem; 
          text-transform: uppercase; 
        }
        .materials-table td { 
          padding: 1.25rem 1.5rem; 
          border-bottom: 1px solid #e0e0e0; 
          color: #34495e; 
          font-size: 0.9rem; 
        }
        .even-row { background: #fafafa; }
        .odd-row { background: #ffffff; }
        .materials-table tr:hover { background: #f1f8ff; }
        .actions-cell { display: flex; gap: 0.5rem; align-items: center; }
        .view-btn, .edit-btn, .delete-btn, .download-btn { 
          background: none; 
          border: none; 
          cursor: pointer; 
          padding: 0.375rem 0.75rem; 
          border-radius: 4px; 
          display: flex; 
          align-items: center; 
          gap: 0.3rem; 
          font-size: 0.9rem; 
        }
        .view-btn { color: #2ecc71; }
        .view-btn:hover { background: rgba(46,204,113,0.1); }
        .edit-btn { color: #3498db; }
        .edit-btn:hover { background: rgba(52,152,219,0.1); }
        .delete-btn { color: #e74c3c; }
        .delete-btn:hover { background: rgba(231,76,60,0.1); }
        .download-btn { color: #f39c12; }
        .download-btn:hover { background: rgba(243,156,18,0.1); }
        .download-btn:disabled { color: #bdc3c7; cursor: not-allowed; }
        .no-data { text-align: center; padding: 2rem; }
        .empty-state { display: flex; flex-direction: column; align-items: center; }
        .empty-state p { margin: 0; color: #7f8c8d; }
        .hint { font-size: 0.9rem; margin-top: 0.5rem; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 2rem; border-radius: 8px; max-width: 600px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .modal-content h3 { margin: 0 0 1.5rem; color: #2c3e50; }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #34495e; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
        .view-details p { margin: 0.5rem 0; }
        .view-details a { color: #3498db; text-decoration: none; }
        .view-details a:hover { text-decoration: underline; }
        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
        .cancel-btn { background: #f8f9fa; color: #34495e; border: 1px solid #ddd; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .cancel-btn:hover { background: #e9ecef; }
        .submit-btn { background: #2ecc71; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
        .submit-btn:hover { background: #27ae60; }
        @media (max-width: 768px) {
          .materials-header { flex-direction: column; gap: 1rem; }
          .header-buttons { flex-direction: column; width: 100%; }
          .add-button, .export-button { width: 100%; }
          .materials-table th, .materials-table td { padding: 0.5rem; font-size: 0.9rem; }
          .actions-cell { flex-direction: column; gap: 0.25rem; }
        }
      `}</style>
    </div>
  );
};

export default CourseMaterials;