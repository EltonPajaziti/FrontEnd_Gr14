import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaEye, FaEdit } from 'react-icons/fa';
import "../../CSS/Admin/AdminDashboard.css";
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');
  const [courseCount, setCourseCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    credits: '',
    semester: '',
    year_study: '',
    program_id: '',
    description: '',
  });

const isFormValid = () => {
  const { name, code, credits, semester, year_study, program_id, description } = newCourse;
  return (
    name.trim() !== '' &&
    code.trim() !== '' &&
    credits !== '' &&
    semester !== '' &&
    year_study !== '' &&
    program_id !== '' &&
    description.trim() !== ''
  );
};


  const [programs, setPrograms] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const COURSES_API_URL = 'http://localhost:8080/api/courses';
  const PROGRAMS_API_URL = 'http://localhost:8080/api/programs';

 const fetchData = async (url, setData, errorMessage, transform = (d) => d, token = null) => {
  if (!token) {
    setError('Authentication token is missing. Please log in.');
    setLoading(false);
    return false;
  }

  setLoading(true);
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const transformedData = transform(response.data);
    setData(transformedData);

    if (url === COURSES_API_URL) {
      setCourseCount(transformedData.length);
    }

    return true;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    setError(errorMessage || `Failed to load data from ${url}`);
    return false;
  } finally {
    setLoading(false);
  }
};


 const addCourse = async () => {
  setFormError('');

  if (!isFormValid()) {
    setFormError('Please fill in all required fields before saving.');
    return;
  }

  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenantId');

  if (!token) {
    setError('Authentication token is missing. Please log in.');
    return;
  }

  const courseToSend = {
    name: newCourse.name,
    code: newCourse.code,
    credits: Number(newCourse.credits),
    semester: Number(newCourse.semester),
    yearStudy: Number(newCourse.year_study),
    description: newCourse.description,
    program: { id: Number(newCourse.program_id) },
    tenant: { id: Number(tenantId) },
  };

  try {
    const response = await axios.post(COURSES_API_URL, courseToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCourses([...courses, response.data]);
    setCourseCount(courses.length + 1);
    setShowAddModal(false);
    setNewCourse({
      name: '',
      code: '',
      credits: '',
      semester: '',
      year_study: '',
      program_id: '',
      description: '',
    });
  } catch (error) {
    console.error('Error adding course:', error.response?.data || error.message);
    setError('Failed to add course: ' + (error.response?.data?.message || 'Unexpected error'));
  }
};


  const updateCourse = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing. Please log in.');
      return;
    }

    try {
      const response = await axios.put(
        `${COURSES_API_URL}/${selectedCourse.id}`,
        selectedCourse,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id ? response.data : course
        )
      );
      setShowEditModal(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course');
    }
  };

  const deleteCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    setError('Authentication token is missing. Please log in.');
    return;
  }

  const confirmed = window.confirm("Are you sure you want to delete this course?");
  if (!confirmed) return;

  try {
    await axios.delete(`${COURSES_API_URL}/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCourses(courses.filter((course) => course.id !== courseId));
    setCourseCount((prev) => prev - 1);
  } catch (error) {
    console.error('Error deleting course:', error);
    setError('Failed to delete course');
  }
};
 
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token missing.");
        return;
      }

      await fetchData(
        COURSES_API_URL,
        setCourses,
        'Failed to load courses',
        (data) =>
          Array.isArray(data)
            ? data.map((c) => ({
                id: c.id || '',
                name: c.name || '',
                code: c.code || '',
                credits: c.credits || null,
                semester: c.semester || null,
                  year_study: c.yearStudy  || null,
                   program_id: c.program?.id || '-',
                program_name: c.program?.name || "-",
                description: c.description || '',
              created_at: c.createdAt ? new Date(c.createdAt) : null,
              }))
            : [],
        token
      );

      setAdminName('Admin');
    };

    loadData();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const loadPrograms = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    await fetchData(
      PROGRAMS_API_URL,
      setPrograms,
      'Failed to load programs',
      (data) =>
        Array.isArray(data)
          ? data.map(p => ({
              id: p.id,
              name: p.name
            }))
          : [],
      token
    );
  };

  loadPrograms();
}, []);

  useEffect(() => {
  if (showAddModal || showEditModal || showViewModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}, [showAddModal, showEditModal, showViewModal]);

  const getGreeting = () => {
    const currentHour = currentTime.getHours();
    return currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';
  };

  const filteredCourses = courses.filter((course) => {
    const name = (course.name || '').toLowerCase();
    const code = (course.code || '').toLowerCase();
    const description = (course.description || '').toLowerCase();
    return (
      name.includes(searchTerm.toLowerCase()) ||
      code.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase())
    );
  });

  const exportToCSV = () => {
    const headers = [
      'ID,Name,Code,Credits,Semester,Year Study,Program ID,Description,Created At',
    ];
    const rows = filteredCourses.map((course) => [
      course.id,
      course.name,
      course.code,
      course.credits,
      course.semester,
      course.year_study,
      course.program_id,
      course.description,
      course.created_at,
    ]
      .map((value) => `"${value || ''}"`)
      .join(','));

    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `courses_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <div className="courses-container">
                <div className="header-section">
                  <div className="header-text">
                    <h1>SMS 2025/26</h1>
                    <h2>{getGreeting()}, {adminName}</h2>
                  </div>
                  <button className="export-btn" onClick={exportToCSV}>
                    Export
                  </button>
                </div>

                <div className="section-header">
                  <div>
                    <h3>Courses</h3>
                    <p>Manage and view all course records</p>
                  </div>
                  <button className="add-btn" onClick={() => setShowAddModal(true)}>
                    Add Course
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}


                <div className="filter-section">
                  <h3>Course Records</h3>
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search courses by name, code, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="loading">Loading...</div>
                ) : (
                  <div className="table-container">
                    <table className="courses-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Code</th>
                          <th>Credits</th>
                          <th>Semester</th>
                          <th>Year Study</th>
                          <th>Program ID</th>
                          <th>Description</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map((course) => (
                            <tr key={course.id}>
                              <td>{course.id}</td>
                              <td>{course.name}</td>
                              <td>{course.code}</td>
                              <td>{course.credits || '-'}</td>
                              <td>{course.semester || '-'}</td>
                              <td>{course.year_study}</td>
                              <td>{course.program_name || '-'}</td>
                              <td>{course.description || '-'}</td>
                              <td>{course.created_at ? new Date(course.created_at).toLocaleString('sq-AL') : '-'}</td>
                               <td>
                                <button
                                  className="action-btn view-btn"
                                  onClick={() => {
                                    setSelectedCourse(course);
                                    setShowViewModal(true);
                                  }}
                                >
                                  <FaEye /> View
                                </button>
                                <button
                                  className="action-btn edit-btn"
                                  onClick={() => {
                                    setSelectedCourse(course);
                                    setShowEditModal(true);
                                  }}
                                >
                                  <FaEdit /> Edit
                                </button>

                                <button className="action-btn delete-btn" onClick={() => deleteCourse(course.id)} >
                                🗑 Delete
                              </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" className="no-data">
                              <div className="empty-state">
                                <p>No courses found</p>
                                <p className="hint">Try a different search term</p>
                              </div>
                            </td>
                          </tr>
                          
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add Course Modal */}
                {showAddModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <h2>Add New Course</h2>
                      <div className="modal-form">
                        {formError && (
                    <div style={{ color: 'red', marginBottom: '1rem' }}>
                      {formError}
                    </div>
                  )}

                        <label>Name:</label>
                        <input
                          type="text"
                          value={newCourse.name}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, name: e.target.value })
                          }
                        />
                        <label>Code:</label>
                        <input
                          type="text"
                          value={newCourse.code}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, code: e.target.value })
                          }
                        />
                        <label>Credits:</label>
                        <input
                          type="number"
                          value={newCourse.credits}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, credits: e.target.value })
                          }
                        />
                        <label>Semester:</label>
                        <input
                          type="number"
                          value={newCourse.semester}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, semester: e.target.value })
                          }
                        />
                        <label>Year Study:</label>
                        <input
                          type="number"
                          value={newCourse.year_study}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, year_study: e.target.value })
                          }
                        />
                        <label>Program:</label>
                        <select
                        value={newCourse.program_id}
                        onChange={(e) =>
                        setNewCourse({ ...newCourse, program_id: e.target.value })
                        }
                          >
                            <option value="">-- Select a program --</option>
                            {programs.map((program) => (
                              <option key={program.id} value={program.id}>
                                {program.name}
                              </option>
                            ))}
                          </select>

                      
                        <label>Description:</label>
                        <textarea
                          value={newCourse.description}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, description: e.target.value })
                          }
                        />
                        <div className="modal-actions">
                         <button className="modal-btn save-btn" onClick={addCourse} disabled={!isFormValid()}>
                                Save
                              </button>

                          <button
                            className="modal-btn cancel-btn"
                            onClick={() => setShowAddModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Course Modal */}
                {showViewModal && selectedCourse && (
                  <div className="modal">
                    <div className="modal-content">
                      <h2>Course Details</h2>
                      <div className="modal-details">
                        <p><strong>ID:</strong> {selectedCourse.id}</p>
                        <p><strong>Name:</strong> {selectedCourse.name}</p>
                        <p><strong>Code:</strong> {selectedCourse.code}</p>
                        <p><strong>Credits:</strong> {selectedCourse.credits || '-'}</p>
                        <p><strong>Semester:</strong> {selectedCourse.semester || '-'}</p>
                        <p><strong>Year Study:</strong> {selectedCourse.year_study || '-'}</p>
                        <p><strong>Program ID:</strong> {selectedCourse.program_id || '-'}</p>
                        <p><strong>Description:</strong> {selectedCourse.description || '-'}</p>
                        <p><strong>Created At:</strong> {selectedCourse.created_at ? new Date(selectedCourse.created_at).toLocaleString('en-GB') : '-'}</p>
                      </div>
                      <div className="modal-actions">
                        <button
                          className="modal-btn close-btn"
                          onClick={() => setShowViewModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Course Modal */}
                {showEditModal && selectedCourse && (
                  <div className="modal">
                    <div className="modal-content">
                      <h2>Edit Course</h2>
                      <div className="modal-form">
                        <label>Name:</label>
                        <input
                          type="text"
                          value={selectedCourse.name}
                          onChange={(e) =>
                            setSelectedCourse({ ...selectedCourse, name: e.target.value })
                          }
                        />
                        <label>Code:</label>
                        <input
                          type="text"
                          value={selectedCourse.code}
                          onChange={(e) =>
                            setSelectedCourse({ ...selectedCourse, code: e.target.value })
                          }
                        />
                        <label>Credits:</label>
                        <input
                          type="number"
                          value={selectedCourse.credits}
                          onChange={(e) =>
                            setSelectedCourse({ ...selectedCourse, credits: e.target.value })
                          }
                        />
                        <label>Semester:</label>
                        <input
                          type="number"
                          value={selectedCourse.semester}
                          onChange={(e) =>
                            setSelectedCourse({ ...selectedCourse, semester: e.target.value })
                          }
                        />
                        <label>Year Study:</label>
                        <input
                          type="number"
                          value={selectedCourse.year_study}
                          onChange={(e) =>
                            setSelectedCourse({ ...selectedCourse, year_study: e.target.value })
                          }
                        />
                       <label>Program:</label>
<select
  value={selectedCourse.program_id}
  onChange={(e) =>
    setSelectedCourse({ ...selectedCourse, program_id: e.target.value })
  }
>
  <option value="">-- Select a program --</option>
  {programs.map((program) => (
    <option key={program.id} value={program.id}>
      {program.name}
    </option>
  ))}
</select>


                      
                        <label>Description:</label>
                        <textarea
                          value={selectedCourse.description}
                          onChange={(e) =>
                            setSelectedCourse({ ...selectedCourse, description: e.target.value })
                          }
                        />
                        <div className="modal-actions">
                          <button className="modal-btn save-btn" onClick={updateCourse}>
                            Save
                          </button>
                          <button
                            className="modal-btn cancel-btn"
                            onClick={() => setShowEditModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
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
          flex-direction: column;
          min-height: 100%;
          height: auto;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Poppins', sans-serif;
        }
        .content-container {
            flex: 1;
         padding: 20px;
         transition: margin-left 0.3s;
        }
        .courses-container {
          padding: 1.5rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          position: relative;
        }
        .courses-container:hover {
          transform: translateY(-5px);
        }
        .header-section {
          position: relative;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .header-text {
          display: inline-block;
        }
        .header-section h1 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 0.4rem;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .header-section h2 {
          font-size: 1.2rem;
          color: #7f8c8d;
          font-weight: 500;
          animation: fadeIn 1s ease-in;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .export-btn {
          position: absolute;
          top: 0;
          right: 0;
          padding: 8px 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          color: #007bff;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .export-btn:hover {
          background: #007bff;
          color: #fff;
          border-color: #007bff;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .section-header h3 {
          font-size: 1.6rem;
          color: #2c3e50;
          margin-bottom: 0.2rem;
          font-weight:  ENSURE THIS IS COMPLETE600;
        }
        .section-header p {
          color: #7f8c8d;
          margin: 0;
          font-size: 0.9rem;
        }
        .add-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          background: #28a745;
          color: #fff;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .add-btn:hover {
          background: #218838;
        }
        .stats-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          justify-content: center;
        }
        .stat-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          padding: 1rem;
          border-radius: 10px;
          width: 200px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3 WTCH OUT FOR THISs ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #e7f3ff 0%, #d1e7ff 100%);
        }
        .stat-card h3 {
          font-size: 1.1rem;
          color: #2c3e50;
          margin: 0;
          font-weight: 600;
        }
        .stat-card p {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin: 0.4rem 0;
        }
        .stat-card .count {
          font-size: 1.5rem;
          color: #007bff;
          font-weight: 700;
          transition: color 0.3s ease;
        }
        .stat-card:hover .count {
          color: #0056b3;
        }
        .filter-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .filter-section h3 {
          font-size: 1.2rem;
          color: #2c3e50;
          margin: 0;
          font-weight: 600;
        }
        .search-box {
          position: relative;
          width: 100%;
          max-width: 400px;
          transition: all 0.3s ease;
        }
        .search-box input {
          width: 100%;
          padding: 0.8rem 1.2rem 0.8rem 2.5rem;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 0.9rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .search-box input:focus {
          border-color: #007bff;
          box-shadow: 0 2px 12px rgba(0, 123, 255, 0.2);
          outline: none;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #95a5a6;
          font-size: 1rem;
        }
        .table-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .loading {
          text-align: center;
          padding: 2.5rem;
          color: #7f8c8d;
          font-size: 1rem;
          font-weight: 500;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .courses-table {
          width: 100%;
          border-collapse: collapse;
        }
        .courses-table th {
          background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #ddd;
          font-size: 1rem;
        }
        .courses-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          color: #34495e;
          font-size: 0.9rem;
        }
        .courses-table tr:hover {
          background-color: #f8f9fa;
          transition: background-color 0.3s ease;
        }
        .action-btn {
          padding: 6px 12px;
          margin-right: 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .view-btn {
          background: #17a2b8;
          color: #fff;
        }
        .view-btn:hover {
          background: #138496;
        }
        .edit-btn {
          background: #ffc107;
          color: #fff;
        }
        .edit-btn:hover {
          background: #e0a800;
        }

         .delete-btn {
          background: #dc3545;
          color: #fff;
        }
        .delete-btn:hover {
          background: #c82333;
        }

        .no-data {
          text-align: center;
          padding: 2.5rem;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-state p {
          margin: 0;
          color: #7f8c8d;
          font-size: 1rem;
        }
        .hint {
          font-size: 0.8rem;
          margin-top: 0.4rem;
          color: #95a5a6;
        }
        .error-message {
          color: #e74c3c;
          margin-bottom: 1rem;
          text-align: center;
          padding: 0.4rem;
          border-radius: 6px;
          background: #ffe6e6;
          font-weight: 500;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          align-items: flex-start; 
           padding-top: 50px; 
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .modal-content h2 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        .modal-form label {
          display: block;
          font-size: 0.9rem;
          color: #2c3e50;
          margin-bottom: 0.4rem;
        }
        .modal-form input,
        .modal-form textarea {
          width: 100%;
          padding: 0.8rem;
          margin-bottom: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .modal-form textarea {
          height: 100px;
          resize: vertical;
        }
        .modal-details p {
          font-size: 0.9rem;
          color: #34495e;
          margin-bottom: 0.5rem;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        .modal-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .save-btn {
          background: #28a745;
          color: #fff;
        }
        .save-btn:hover {
          background: #218838;
        }
        .cancel-btn,
        .close-btn {
          background: #dc3545;
          color: #fff;
        }
        .cancel-btn:hover,
        .close-btn:hover {
          background: #c82333;
        }
      `}</style>
    </div>
  );
};

export default Courses;