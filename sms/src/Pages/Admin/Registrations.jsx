import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaEdit, FaEye, FaDownload } from 'react-icons/fa';
import "../../CSS/Admin/AdminDashboard.css"; 
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

const initialEnrollments = [
  {
    id: 1,
    student_id: 101,
    course_name: "--",
    enrollment_date: '2025-05-15',
    academic_year: 2025,
    tenant_id: 4,
    created_at: '2025-05-16T17:27:00+02:00', 
  },
];

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [formData, setFormData] = useState({ student_id: '', course_name: '', enrollment_date: '', academic_year: '', tenant_id: 1 });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEnrollment, setViewEnrollment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [adminName, setAdminName] = useState('Admin');
  const [sortField, setSortField] = useState('enrollment_date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const API_URL = 'http://localhost:8080/api/enrollments';
  //const AUTH_API_URL = 'http://localhost:8080/api/auth/user';


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
    const [enrollmentsResponse] = await Promise.all([
      axios.get(API_URL, config),
      //axios.get(AUTH_API_URL, config),
    ]);

    const transformed = enrollmentsResponse.data.map((enr) => ({
      id: enr.id,
      student_id: enr.student?.id,
      course_name: enr.course?.name,
      enrollment_date: enr.enrollmentDate,
      academic_year: new Date(enr.academicYear?.startDate).getFullYear(),
      tenant_name: enr.tenantID?.name,
      created_at: enr.createdAt,
      original: enr, 
    }));

    setEnrollments(sortData(transformed, sortField, sortOrder));
    setAdminName('Admin');
  } catch (error) {
    console.error('Error fetching data:', error);
    setEnrollments(sortData(initialEnrollments, sortField, sortOrder));
  }
};

  const sortData = (data, field, order) => {
    return [...data].sort((a, b) => {
      if (field === 'enrollment_date' || field === 'created_at') {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return order === 'asc' ? a[field] - b[field] : b[field] - a[field];
    });
  };

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const getGreeting = () => {
    const currentHour = new Date('2025-05-16T17:27:00+02:00').getHours();
    return currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const data = {
        student_id: parseInt(formData.student_id),
        course_name: parseInt(formData.course_name),
        enrollment_date: formData.enrollment_date,
        academic_year: parseInt(formData.academic_year),
        tenant_id: parseInt(formData.tenant_id),
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data, config);
      } else {
        await axios.post(API_URL, data, config);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving enrollment:', error);
    }
  };

  const handleView = async (enrollment) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/${enrollment.id}`, config);
      setViewEnrollment(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
      setViewEnrollment(enrollment);
      setShowViewModal(true);
    }
  };

  const handleEdit = (enrollment) => {
    setFormData({
      student_id: enrollment.student_id,
      course_name: enrollment.course_name,
      enrollment_date: enrollment.enrollment_date,
      academic_year: enrollment.academic_year,
      tenant_id: enrollment.tenant_id,
    });
    setEditingId(enrollment.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        await axios.delete(`${API_URL}/${id}`, config);
        fetchData();
      } catch (error) {
        console.error('Error deleting enrollment:', error);
      }
    }
  };

  const handleExport = () => {
    const exportData = enrollments.map(enrollment => ({
      Student_ID: enrollment.student_id,
      Course: enrollment.course_name,
      Enrollment_Date: enrollment.enrollment_date,
      Academic_Year: enrollment.academic_year,
      Faculty: enrollment.tenant_name || 'Unknown Faculty',
    }));

    const headers = ['Student_ID', 'Course', 'Enrollment_Date', 'Academic_Year', 'Faculty'];
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(',')),
    ];
    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'enrollments.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({ student_id: '', course_name: '', enrollment_date: '', academic_year: '', tenant_id: 1 });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredEnrollments = enrollments.filter((enrollment) =>
    enrollment.student_id.toString().includes(search) ||
    enrollment.course_name.toString().includes(search) ||
    enrollment.enrollment_date.includes(search) ||
    enrollment.academic_year.toString().includes(search)
  );


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
              <div className="enrollments-container" style={{ position: 'relative' }}>
                <div className="header-section">
                  <h1>SMS 2025/26</h1>
                  <h2>{getGreeting()}, {adminName}</h2>
                </div>
                <div className="enrollments-header">
                  <div>
                    <h3>Enrollments</h3>
                    <p>Manage student enrollments for all courses</p>
                  </div>
                  <div className="header-buttons">
                    <button className="add-button" onClick={() => setShowForm(true)}>
                      <FaPlus /> Add Enrollment
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
                      placeholder="Search enrollments..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="enrollments-table-container">
                  <table className="enrollments-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('student_id')}>
                          Student ID {sortField === 'student_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('course_name')}>
                          Course Name {sortField === 'course_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('enrollment_date')}>
                          Enrollment Date {sortField === 'enrollment_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('academic_year')}>
                          Academic Year {sortField === 'academic_year' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Faculty</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnrollments.length > 0 ? (
                        filteredEnrollments.map((enrollment, index) => (
                          <tr key={enrollment.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td>{enrollment.student_id}</td>
                            <td>{enrollment.course_name}</td>
                            <td>{enrollment.enrollment_date}</td>
                            <td>{enrollment.academic_year}</td>
                            <td>{enrollment.tenant_name}</td>
                            <td className="actions-cell">
                              <button className="view-btn" onClick={() => handleView(enrollment)}>
                                <FaEye /> View
                              </button>
                              <button className="edit-btn" onClick={() => handleEdit(enrollment)}>
                                <FaEdit /> Edit
                              </button>
                              <button className="delete-btn" onClick={() => handleDelete(enrollment.id)}>
                                <FaTrash /> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-data">
                            <div className="empty-state">
                              <p>No enrollments found</p>
                              <p className="hint">Try a different search term or add a new enrollment</p>
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
                      <h3>{editingId ? 'Edit Enrollment' : 'Add New Enrollment'}</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>Student ID*</label>
                          <input
                            type="number"
                            name="student_id"
                            value={formData.student_id}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Course Name</label>
                          <input
                            type="text"
                            name="course_name"
                            value={formData.course_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Enrollment Date*</label>
                          <input
                            type="date"
                            name="enrollment_date"
                            value={formData.enrollment_date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Academic Year*</label>
                          <input
                            type="number"
                            name="academic_year"
                            value={formData.academic_year}
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

                {showViewModal && viewEnrollment && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>View Enrollment</h3>
                      <div className="view-details">
                        <p><strong>Student ID:</strong> {viewEnrollment.student?.id}</p>
                        <p><strong>Course ID:</strong> {viewEnrollment.course?.id}</p>
                        <p><strong>Enrollment Date:</strong> {viewEnrollment.enrollmentDate}</p>
                        <p><strong>Academic Year:</strong> {viewEnrollment.academicYear?.name}</p>
                        <p><strong>Faculty:</strong> {viewEnrollment.tenantID?.name}</p>
                      </div>
                      <div className="form-actions">
                        <button className="cancel-btn" onClick={() => setShowViewModal(false)}>
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Poppins', sans-serif;
        }
        .content-container {
          flex: 1;
          padding: 20px;
          min-height: 100vh; /* Ensure it stretches to the bottom */
          overflow-y: auto; /* Allow scrolling if content overflows */
          transition: margin-left 0.3s;
        }
        .enrollments-container { 
          position: relative; /* Provide positioning context for modal */
          padding: 1rem; 
          background: #ffffff; 
          border-radius: 12px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
          transition: transform 0.3s ease; 
          min-height: calc(100% - 40px); /* Stretch to bottom, accounting for padding */
          display: flex;
          flex-direction: column;
        }
        .enrollments-container:hover { transform: translateY(-5px); }
        .header-section { margin-bottom: 1.5rem; text-align: center; }
        .header-section h1 { font-size: 1.8rem; color: #2c3e50; margin-bottom: 0.5rem; }
        .header-section h2 { font-size: 1.2rem; color: #7f8c8d; font-weight: normal; animation: fadeIn 1s ease-in; }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .enrollments-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .enrollments-header h3 { font-size: 1.5rem; color: #2c3e50; margin-bottom: 0.25rem; }
        .enrollments-header p { color: #7f8c8d; margin: 0; }
        .header-buttons { display: flex; gap: 1rem; }
        .add-button, .export-button { background: #3498db; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; transition: background 0.2s; }
        .export-button { background: #2ecc71; }
        .add-button:hover { background: #2980b9; }
        .export-button:hover { background: #27ae60; }
        .search-section { margin-bottom: 1.5rem; }
        .search-box { position: relative; max-width: 400px; }
        .search-box input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: border-color 0.3s ease, box-shadow 0.3s ease; }
        .search-box input:focus { border-color: #3498db; box-shadow: 0 2px 12px rgba(52,152,219,0.2); outline: none; }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #95a5a6; }
        .enrollments-table-container { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 1.5rem; flex-grow: 1; }
        .enrollments-table { width: 100%; border-collapse: collapse; }
        .enrollments-table th { 
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
        .enrollments-table td { 
          padding: 1.25rem 1.5rem; 
          border-bottom: 1px solid #e0e0e0; 
          color: #34495e; 
          font-size: 0.9rem; 
        }
        .even-row { background: #fafafa; }
        .odd-row { background: #ffffff; }
        .enrollments-table tr:hover { background: #f1f8ff; }
        .actions-cell { display: flex; gap: 0.5rem; align-items: center; }
        .view-btn, .edit-btn, .delete-btn { 
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
        .no-data { text-align: center; padding: 2rem; }
        .empty-state { display: flex; flex-direction: column; align-items: center; }
        .empty-state p { margin: 0; color: #7f8c8d; }
        .hint { font-size: 0.9rem; margin-top: 0.5rem; }
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
          overflow-y: auto; 
        }
        .modal-content { 
          background: white; 
          padding: 2rem; 
          border-radius: 8px; 
          max-width: 600px; 
          max-height: 70vh; 
          overflow-y: auto; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          margin: 0; 
        }
        .modal-content h3 { margin: 0 0 1.5rem; color: #2c3e50; }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #34495e; }
        .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
        .view-details p { margin: 0.5rem 0; }
        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
        .cancel-btn { background: #f8f9fa; color: #34495e; border: 1px solid #ddd; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .cancel-btn:hover { background: #e9ecef; }
        .submit-btn { background: #2ecc71; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
        .submit-btn:hover { background: #27ae60; }
        @media (max-width: 768px) {
          .enrollments-header { flex-direction: column; gap: 1rem; }
          .header-buttons { flex-direction: column; width: 100%; }
          .add-button, .export-button { width: 100%; }
          .enrollments-table th, .enrollments-table td { padding: 0.5rem; font-size: 0.9rem; }
          .actions-cell { flex-direction: column; gap: 0.25rem; }
          .modal-content { width: 90%; }
        }
      `}</style>
    </div>
  );
};

export default Enrollments;