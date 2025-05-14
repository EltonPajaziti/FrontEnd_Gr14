import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaEye, FaEdit } from 'react-icons/fa';
import Sidebar from '../../Components/Admin/Sidebar';

const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Students');
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const STUDENTS_API_URL = 'http://localhost:8080/api/students';
  const PROFESSORS_API_URL = 'http://localhost:8080/api/professors';
  const FACULTIES_API_URL = 'http://localhost:8080/api/faculties';
  const DEPARTMENTS_API_URL = 'http://localhost:8080/api/departments';
  const PROGRAMS_API_URL = 'http://localhost:8080/api/programs';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  const fetchData = async (url, setData, errorMessage) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing. Please log in.');
      return false;
    }

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`API Response from ${url}:`, response.data); // Detailed log
      if (url === PROFESSORS_API_URL) {
        const transformedData = Array.isArray(response.data)
          ? response.data.map(prof => ({
              id: prof.id || prof._id || 0,
              user: {
                firstName: prof.firstName || prof.user?.firstName || '',
                lastName: prof.lastName || prof.user?.lastName || '',
                email: prof.email || prof.user?.email || '',
              },
              department_id: prof.departmentId || prof.department_id || null,
              academic_title: prof.title || prof.academic_title || '',
              hired_date: prof.hiredDate || prof.hired_date || '',
              status: prof.status || 'Active',
            }))
          : [];
        console.log('Transformed Professors:', transformedData); // Log transformed data
        setData(transformedData);
      } else if (url === STUDENTS_API_URL) {
        const transformedData = Array.isArray(response.data)
          ? response.data.map(student => ({
              id: student.id || student._id || 0,
              user: {
                firstName: student.firstName || student.user?.firstName || '',
                lastName: student.lastName || student.user?.lastName || '',
                email: student.email || student.user?.email || '',
              },
              program_id: student.programId || student.program_id || null,
              enrollment_date: student.enrollmentDate || student.enrollment_date || '',
              status: student.status || 'Active',
            }))
          : [];
        setData(transformedData);
      } else {
        setData(response.data);
      }
      return true;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setError(errorMessage || `Failed to load data from ${url}`);
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(AUTH_API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAdminName(response.data.firstName || response.data.name || 'Admin');
      } catch (error) {
        console.error('Error fetching admin name:', error);
        setAdminName('Admin');
      }

      const studentsSuccess = await fetchData(STUDENTS_API_URL, setStudents, 'Failed to load students');
      const professorsSuccess = await fetchData(PROFESSORS_API_URL, setProfessors, 'Failed to load professors');
      const programsSuccess = await fetchData(PROGRAMS_API_URL, setPrograms, 'Failed to load programs');
      const departmentsSuccess = await fetchData(DEPARTMENTS_API_URL, setDepartments, 'Failed to load departments');
      await fetchData(FACULTIES_API_URL, setFaculties, 'Failed to load faculties');

      if (!studentsSuccess) {
        setStudents([
          {
            id: 1,
            user: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
            program_id: 1,
            enrollment_date: '2023-09-01',
            status: 'Active',
          },
        ]);
      }
      if (!professorsSuccess) {
        console.log('Setting mock professors because API failed');
        setProfessors([
          {
            id: 1,
            user: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
            department_id: 1,
            academic_title: 'Associate Professor',
            hired_date: '2020-01-15',
            status: 'Active',
          },
        ]);
      }
      if (!programsSuccess) {
        setPrograms([{ id: 1, name: 'Computer Science' }]);
      }
      if (!departmentsSuccess) {
        setDepartments([{ id: 1, name: 'Engineering' }]);
      }
    };

    loadData();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const currentHour = parseInt(
      currentTime.toLocaleString('en-US', { timeZone: 'Europe/Paris', hour: 'numeric', hour12: false })
    );
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getProgramName = (programId) => programs.find(p => p.id === programId)?.name || '-';
  const getDepartmentName = (departmentId) => departments.find(d => d.id === departmentId)?.name || '-';

  const filteredStudents = students.filter(student => {
    const name = `${student.user?.firstName || ''} ${student.user?.lastName || ''}`.toLowerCase();
    const email = (student.user?.email || '').toLowerCase();
    console.log('Filtering students:', { searchTerm, name, email });
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const filteredProfessors = professors.filter(professor => {
    const name = `${professor.user?.firstName || ''} ${professor.user?.lastName || ''}`.toLowerCase();
    const email = (professor.user?.email || '').toLowerCase();
    console.log('Filtering professors:', { searchTerm, name, email });
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsViewing(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsViewing(false);
    setIsEditing(false);
    setError(null);
  };

  const handleSaveEdit = async () => {
    try {
      const url = activeTab === 'Students' ? `${STUDENTS_API_URL}/${selectedUser.id}` : `${PROFESSORS_API_URL}/${selectedUser.id}`;
      await axios.put(url, selectedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (activeTab === 'Students') {
        setStudents(students.map(s => (s.id === selectedUser.id ? selectedUser : s)));
      } else {
        setProfessors(professors.map(p => (p.id === selectedUser.id ? selectedUser : p)));
      }
      closeModal();
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user changes. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-container">
        <div className="manage-users-container">
          <div className="header-section">
            <h1>SMS 2025/26</h1>
            <h2>{getGreeting()}, {adminName}</h2>
          </div>

          <div className="section-header">
            <div>
              <h3>Manage Users</h3>
              <p>Manage students and professors in your system</p>
            </div>
          </div>

          <div className="search-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>
                Clear
              </button>
            )}
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'Students' ? 'active' : ''}`}
              onClick={() => setActiveTab('Students')}
            >
              Students
            </button>
            <button
              className={`tab ${activeTab === 'Professors' ? 'active' : ''}`}
              onClick={() => setActiveTab('Professors')}
            >
              Professors
            </button>
          </div>

          {activeTab === 'Students' && (
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Program</th>
                    <th>Enrollment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{`${student.user?.firstName || ''} ${student.user?.lastName || ''}`}</td>
                      <td>{student.user?.email || '-'}</td>
                      <td>{getProgramName(student.program_id)}</td>
                      <td>{student.enrollment_date || '-'}</td>
                      <td>{student.status || 'Active'}</td>
                      <td>
                        <button className="action-btn view-btn" onClick={() => openViewModal(student)}>
                          <FaEye /> View
                        </button>
                        <button className="action-btn edit-btn" onClick={() => openEditModal(student)}>
                          <FaEdit /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="6" className="no-data">
                        <div className="empty-state">
                          <p>No students found</p>
                          <p className="hint">Try a different search term</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Professors' && (
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Academic Title</th>
                    <th>Hired Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfessors.map(professor => (
                    <tr key={professor.id}>
                      <td>{`${professor.user?.firstName || ''} ${professor.user?.lastName || ''}`}</td>
                      <td>{professor.user?.email || '-'}</td>
                      <td>{getDepartmentName(professor.department_id)}</td>
                      <td>{professor.academic_title || '-'}</td>
                      <td>{professor.hired_date || '-'}</td>
                      <td>{professor.status || 'Active'}</td>
                      <td>
                        <button className="action-btn view-btn" onClick={() => openViewModal(professor)}>
                          <FaEye /> View
                        </button>
                        <button className="action-btn edit-btn" onClick={() => openEditModal(professor)}>
                          <FaEdit /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProfessors.length === 0 && (
                    <tr>
                      <td colSpan="7" className="no-data">
                        <div className="empty-state">
                          <p>No professors found</p>
                          <p className="hint">Try a different search term</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {error && error !== 'Failed to load admin name' && (
            <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>
          )}

          {isViewing && selectedUser && (
            <div className="modal">
              <div className="modal-content">
                <h2>{activeTab === 'Students' ? 'Student Details' : 'Professor Details'}</h2>
                <p>
                  <strong>Name:</strong> {`${selectedUser.user?.firstName || ''} ${selectedUser.user?.lastName || ''}`}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.user?.email || '-'}
                </p>
                {activeTab === 'Students' ? (
                  <>
                    <p>
                      <strong>Program:</strong> {getProgramName(selectedUser.program_id)}
                    </p>
                    <p>
                      <strong>Enrollment Date:</strong> {selectedUser.enrollment_date || '-'}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedUser.status || 'Active'}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Department:</strong> {getDepartmentName(selectedUser.department_id)}
                    </p>
                    <p>
                      <strong>Academic Title:</strong> {selectedUser.academic_title || '-'}
                    </p>
                    <p>
                      <strong>Hired Date:</strong> {selectedUser.hired_date || '-'}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedUser.status || 'Active'}
                    </p>
                  </>
                )}
                <button className="modal-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}

          {isEditing && selectedUser && (
            <div className="modal">
              <div className="modal-content">
                <h2>Edit {activeTab === 'Students' ? 'Student' : 'Professor'}</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    value={selectedUser.user?.firstName || ''}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        user: { ...selectedUser.user, firstName: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    value={selectedUser.user?.lastName || ''}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        user: { ...selectedUser.user, lastName: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={selectedUser.user?.email || ''}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        user: { ...selectedUser.user, email: e.target.value },
                      })
                    }
                  />
                </div>
                {activeTab === 'Students' ? (
                  <>
                    <div className="form-group">
                      <label>Program:</label>
                      <select
                        value={selectedUser.program_id || ''}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            program_id: parseInt(e.target.value) || null,
                          })
                        }
                      >
                        <option value="">Select Program</option>
                        {programs.map(program => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Enrollment Date:</label>
                      <input
                        type="date"
                        value={selectedUser.enrollment_date || ''}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            enrollment_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Department:</label>
                      <select
                        value={selectedUser.department_id || ''}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            department_id: parseInt(e.target.value) || null,
                          })
                        }
                      >
                        <option value="">Select Department</option>
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Academic Title:</label>
                      <input
                        type="text"
                        value={selectedUser.academic_title || ''}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            academic_title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Hired Date:</label>
                      <input
                        type="date"
                        value={selectedUser.hired_date || ''}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            hired_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={selectedUser.status || 'Active'}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <button className="modal-btn save-btn" onClick={handleSaveEdit}>
                  Save
                </button>
                <button className="modal-btn" onClick={closeModal}>
                  Cancel
                </button>
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
          margin-left: 40px;
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
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .section-header h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }
        .section-header p {
          color: #7f8c8d;
          margin: 0;
        }
        .search-section {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
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
        .clear-btn {
          padding: 0.6rem 1.2rem;
          margin-left: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.3s;
        }
        .clear-btn:hover {
          background-color: #f0f0f0;
        }
        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .tab {
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          color: #7f8c8d;
        }
        .tab.active {
          color: #2c3e50;
          font-weight: bold;
          border-bottom: 2px solid #007bff;
        }
        .table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .user-table {
          width: 100%;
          border-collapse: collapse;
        }
        .user-table th {
          background-color: #f8f9fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #eee;
        }
        .user-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          color: #34495e;
        }
        .action-btn {
          padding: 0.6rem 1.2rem;
          margin-right: 0.8rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background-color 0.3s, transform 0.1s;
        }
        .view-btn {
          background-color: #e7f3ff;
          color: #1e90ff;
        }
        .edit-btn {
          background-color: #e6ffed;
          color: #28a745;
        }
        .view-btn:hover {
          background-color: #d1e7ff;
          transform: translateY(-1px);
        }
        .edit-btn:hover {
          background-color: #c3ffdb;
          transform: translateY(-1px);
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
      `}</style>
      <style jsx global>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .modal-content h2 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        .modal-content p {
          font-size: 1rem;
          color: #34495e;
          margin: 0.5rem 0;
        }
        .form-group {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }
        .form-group label {
          width: 120px;
          font-weight: 600;
          color: #34495e;
        }
        .form-group input,
        .form-group select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 300px;
        }
        .modal-btn {
          padding: 0.6rem 1.2rem;
          margin-right: 1rem;
          margin-top: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.3s;
        }
        .save-btn {
          background-color: #007bff;
          color: white;
          border: none;
        }
        .save-btn:hover {
          background-color: #0056b3;
        }
        .modal-btn:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;