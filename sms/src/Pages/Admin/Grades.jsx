import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import "../../CSS/Admin/AdminDashboard.css";
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

const initialGrades = [
  {
    id: 1,
    student_id: 1,
    academic_year_id: 2025,
    grade_value: 85,
    graded_by: 1,
    graded_at: '2025-05-16',
    tenant_id: 4,
    exam_id: 1,
  },
  {
    id: 2,
    student_id: 2,
    academic_year_id: 2025,
    grade_value: 78,
    graded_by: 2,
    graded_at: '2025-05-16',
    tenant_id: 4,
    exam_id: 2,
  },
];

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    academic_year_id: '',
    grade_value: '',
    graded_by: '',
    graded_at: '',
    tenant_id: '',
    exam_id: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [adminName, setAdminName] = useState('Admin');
  const [adminRole] = useState('ADMIN');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const API_URL = 'http://localhost:8080/api/grades';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';
  const STUDENT_API_URL = 'http://localhost:8080/api/students';
  const ACADEMIC_YEAR_API_URL = 'http://localhost:8080/api/academic-years';
  const PROFESSOR_API_URL = 'http://localhost:8080/api/professors';
  const TENANT_API_URL = 'http://localhost:8080/api/faculties';
  const EXAM_API_URL = 'http://localhost:8080/api/exams';

  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [exams, setExams] = useState([]);

  const contentRef = useRef(null);

  useEffect(() => {
    fetchData();
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (contentRef.current && savedScrollPosition) {
      contentRef.current.scrollTop = parseInt(savedScrollPosition, 10);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gradesResponse, authResponse, studentResponse, academicYearResponse, professorResponse, tenantResponse, examResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get(AUTH_API_URL),
        axios.get(STUDENT_API_URL),
        axios.get(ACADEMIC_YEAR_API_URL),
        axios.get(PROFESSOR_API_URL),
        axios.get(TENANT_API_URL),
        axios.get(EXAM_API_URL),
      ]);
      setGrades(gradesResponse.data.length > 0 ? gradesResponse.data : initialGrades);
      setAdminName(authResponse.data.name || 'Admin');
      setStudents(studentResponse.data);
      setAcademicYears(academicYearResponse.data);
      setProfessors(professorResponse.data);
      setTenants(tenantResponse.data);
      setExams(examResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setGrades(initialGrades); // Fallback to initial data if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        sessionStorage.setItem('scrollPosition', contentRef.current.scrollTop);
      }
    };
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        student_id: parseInt(formData.student_id),
        academic_year_id: parseInt(formData.academic_year_id),
        grade_value: parseInt(formData.grade_value),
        graded_by: parseInt(formData.graded_by),
        graded_at: formData.graded_at,
        tenant_id: formData.tenant_id ? parseInt(formData.tenant_id) : null,
        exam_id: parseInt(formData.exam_id),
      };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      student_id: item.student_id,
      academic_year_id: item.academic_year_id,
      grade_value: item.grade_value,
      graded_by: item.graded_by,
      graded_at: item.graded_at,
      tenant_id: item.tenant_id || '',
      exam_id: item.exam_id,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting grade:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      academic_year_id: '',
      grade_value: '',
      graded_by: '',
      graded_at: '',
      tenant_id: '',
      exam_id: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading grades...</div>;
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <Sidebar adminName={adminName} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Header adminName={adminName} toggleSidebar={toggleSidebar} />
          <div className="page-container">
            <div className="content-container" ref={contentRef}>
              <div className="grades-container" style={{ position: 'relative' }}>
                <main className="grades-main">
                  <div className="header-section">
                    <h2>Grades</h2>
                    <p>Manage and view student grades</p>
                    {adminRole === 'ADMIN' && (
                      <button className="add-button" onClick={() => setShowForm(true)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <FaPlus /> Add Grade
                      </button>
                    )}
                  </div>
                  <div className="grades-content">
                    <h3>Student Grades</h3>
                    <p>Grades for the current academic year</p>
                    <table className="grades-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Course</th>
                          <th>Grade</th>
                          <th>Academic Year</th>
                          <th>Graded By</th>
                          <th>Graded At</th>
                          {adminRole === 'ADMIN' && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {grades.length === 0 ? (
                          <tr>
                            <td colSpan={adminRole === 'ADMIN' ? 7 : 6} style={{ textAlign: 'center', padding: '20px' }}>
                              No grades found<br />No grades have been recorded
                            </td>
                          </tr>
                        ) : (
                          grades.map((grade) => (
                            <tr key={grade.id}>
                              <td>{students.find(s => s.id === grade.student_id)?.name || 'N/A'}</td>
                              <td>{exams.find(e => e.id === grade.exam_id)?.course?.name || 'N/A'}</td>
                              <td>{grade.grade_value}</td>
                              <td>{academicYears.find(ay => ay.id === grade.academic_year_id)?.year || 'N/A'}</td>
                              <td>{professors.find(p => p.id === grade.graded_by)?.name || 'N/A'}</td>
                              <td>{grade.graded_at}</td>
                              {adminRole === 'ADMIN' && (
                                <td>
                                  <div className="grade-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(grade)}>
                                      <FaEdit /> Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(grade.id)}>
                                      <FaTrash /> Delete
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </main>

                {showForm && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>{editingId ? 'Edit Grade' : 'Add New Grade'}</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>Student*</label>
                          <select name="student_id" value={formData.student_id} onChange={handleInputChange} required>
                            <option value="">Select Student</option>
                            {students.map((student) => (
                              <option key={student.id} value={student.id}>{student.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Exam*</label>
                          <select name="exam_id" value={formData.exam_id} onChange={handleInputChange} required>
                            <option value="">Select Exam</option>
                            {exams.map((exam) => (
                              <option key={exam.id} value={exam.id}>{exam.course?.name || 'N/A'} ({exam.exam_type})</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Grade Value*</label>
                          <input
                            type="number"
                            name="grade_value"
                            value={formData.grade_value}
                            onChange={handleInputChange}
                            required
                            min="0"
                            max="100"
                            placeholder="Enter grade (0-100)"
                          />
                        </div>
                        <div className="form-group">
                          <label>Academic Year*</label>
                          <select name="academic_year_id" value={formData.academic_year_id} onChange={handleInputChange} required>
                            <option value="">Select Academic Year</option>
                            {academicYears.map((year) => (
                              <option key={year.id} value={year.id}>{year.year}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Graded By*</label>
                          <select name="graded_by" value={formData.graded_by} onChange={handleInputChange} required>
                            <option value="">Select Professor</option>
                            {professors.map((professor) => (
                              <option key={professor.id} value={professor.id}>{professor.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Graded At*</label>
                          <input
                            type="date"
                            name="graded_at"
                            value={formData.graded_at}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Faculty</label>
                          <select name="tenant_id" value={formData.tenant_id} onChange={handleInputChange}>
                            <option value="">Select Faculty (Optional)</option>
                            {tenants.map((tenant) => (
                              <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-actions">
                          <button type="button" className="cancel-btn" onClick={resetForm}>
                            Cancel
                          </button>
                          <button type="submit" className="save-btn">
                            Save
                          </button>
                        </div>
                      </form>
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
          background: #eef2f7;
          font-family: 'Arial', sans-serif;
        }
        .content-container {
          flex: 1;
          padding: 20px;
          min-height: 100vh;
          overflow-y: auto;
          transition: margin-left 0.3s;
        }
        .grades-container {
          position: relative;
          display: flex;
          min-height: calc(100% - 40px);
          flex-direction: column;
          padding: 0.5rem;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .grades-main {
          flex: 1;
          position: relative;
          overflow-y: auto;
        }
        .header-section {
          margin-bottom: 1rem;
          position: relative;
          text-align: left;
          padding: 10px;
          background: #eef2f7;
          border-bottom: 1px solid #ddd;
        }
        .header-section h2 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin: 0;
        }
        .header-section p {
          color: #7f8c8d;
          margin: 5px 0;
          font-size: 0.9rem;
        }
        .add-button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.9rem;
        }
        .add-button:hover {
          background: #357abd;
        }
        .grades-content {
          padding: 1rem;
          background: #f9fbfd;
          border-radius: 8px;
          min-height: 300px;
        }
        .grades-content h3 {
          font-size: 1.2rem;
          color: #4a90e2;
          margin-bottom: 0.5rem;
        }
        .grades-content p {
          color: #7f8c8d;
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
        }
        .grades-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
          background: white;
        }
        .grades-table th {
          background: #eef2f7;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #ddd;
          font-size: 0.9rem;
        }
        .grades-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
          color: #34495e;
          font-size: 0.9rem;
          vertical-align: middle;
        }
        .grade-actions {
          display: flex;
          gap: 0.5rem;
        }
        .edit-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.8rem;
          color: #4a90e2;
        }
        .edit-btn:hover {
          background: rgba(74, 144, 226, 0.1);
        }
        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.8rem;
          color: #e74c3c;
        }
        .delete-btn:hover {
          background: rgba(231, 76, 60, 0.1);
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .modal-content h3 {
          margin: 0 0 1rem;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: 600;
          color: #34495e;
          font-size: 0.9rem;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        .cancel-btn {
          background: #f1f1f1;
          color: #34495e;
          border: 1px solid #ddd;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .cancel-btn:hover {
          background: #e0e0e0;
        }
        .save-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .save-btn:hover {
          background: #357abd;
        }
        @media (max-width: 768px) {
          .grades-table th,
          .grades-table td {
            padding: 0.5rem;
            font-size: 0.8rem;
          }
          .modal-content {
            max-width: 90%;
            padding: 1rem;
          }
          .form-group input,
          .form-group select {
            padding: 0.4rem;
            font-size: 0.8rem;
          }
          .form-actions {
            flex-direction: column;
          }
          .save-btn,
          .cancel-btn {
            width: 100%;
            padding: 0.4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Grades;