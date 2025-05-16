import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

const Professors = () => {
  const [professors, setProfessors] = useState([]); // Inicializuar si bosh
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [professorCount, setProfessorCount] = useState(0); // Inicializuar si 0
  const [departmentCount, setDepartmentCount] = useState(0);

  const PROFESSORS_API_URL = 'http://localhost:8080/api/professors';
  const DEPARTMENTS_API_URL = 'http://localhost:8080/api/departments';
  const FACULTIES_API_URL = 'http://localhost:8080/api/faculties';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  const animateCount = (target, setCount) => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
  };

  const fetchData = async (url, setData, errorMessage, transform = (d) => d) => {
    const token = localStorage.getItem('token');
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

      if (url === PROFESSORS_API_URL) {
        animateCount(transformedData.length, setProfessorCount);
      } else if (url === DEPARTMENTS_API_URL) {
        animateCount(transformedData.length, setDepartmentCount);
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const authResponse = await axios.get(AUTH_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminName(authResponse.data.firstName || authResponse.data.name || 'Admin');
      } catch (error) {
        console.error('Error fetching admin name:', error);
        setAdminName('Admin');
      }

      await fetchData(
        PROFESSORS_API_URL,
        setProfessors,
        'Failed to load professors',
        (data) =>
          Array.isArray(data)
            ? data.map((p) => ({
                id: p.id || 0,
                user: {
                  firstName: p.user?.firstName || '',
                  lastName: p.user?.lastName || '',
                  email: p.user?.email || '',
                },
                department_id: p.department_id || null,
                academic_title: p.academic_title || '',
                hired_date: p.hired_date || '',
                tenant_id: p.tenant_id || null,
                created_at: p.created_at || '',
                status: p.status || 'Active',
              }))
            : []
      );
      await fetchData(DEPARTMENTS_API_URL, setDepartments, 'Failed to load departments');
      await fetchData(FACULTIES_API_URL, setFaculties, 'Failed to load faculties');
    };

    loadData();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const currentHour = parseInt(
      currentTime.toLocaleString('en-US', { timeZone: 'Europe/Paris', hour: 'numeric', hour12: false })
    );
    return currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';
  };

  const getDepartmentName = (departmentId) =>
    departments.find((d) => d.id === departmentId)?.name || '-';

  const filteredProfessors = professors.filter((professor) => {
    const name = `${professor.user?.firstName || ''} ${professor.user?.lastName || ''}`.toLowerCase();
    const email = (professor.user?.email || '').toLowerCase();
    const academicTitle = (professor.academic_title || '').toLowerCase();
    return (
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      academicTitle.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="professors-container">
          <div className="header-section">
            <h1>SMS 2025/26</h1>
            <h2>{getGreeting()}, {adminName}</h2>
          </div>

          <div className="section-header">
            <div>
              <h3>Profesorët</h3>
              <p>Menaxhoni të dhënat e profesorëve dhe departamentet e tyre</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="stats-section">
            <div className="stat-card">
              <h3>Statistikat</h3>
              <p>Total Profesorë</p>
              <p className="count">{loading ? 'Loading...' : professorCount}</p>
            </div>
            <div className="stat-card">
              <h3>Departamentet</h3>
              <p>Total Departamente</p>
              <p className="count">{loading ? 'Loading...' : departmentCount}</p>
            </div>
          </div>

          <div className="filter-section">
            <h3>Lista e Profesorëve</h3>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Kërko sipas emrit, emailit ose titullit akademik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table className="professors-table">
                <thead>
                  <tr>
                    <th>Emri</th>
                    <th>Email</th>
                    <th>Departamenti</th>
                    <th>Specializimi</th>
                    <th>Hired Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfessors.length > 0 ? (
                    filteredProfessors.map((professor) => (
                      <tr key={professor.id}>
                        <td>{`${professor.user.firstName} ${professor.user.lastName}`}</td>
                        <td>{professor.user.email || '-'}</td>
                        <td>{getDepartmentName(professor.department_id)}</td>
                        <td>{professor.academic_title || '-'}</td>
                        <td>{professor.hired_date || '-'}</td>
                        <td>{professor.status || 'Active'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        <div className="empty-state">
                          <p>Nuk është gjetur asnjë profesor</p>
                          <p className="hint">Provoni një term tjetër kërkimi</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
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
          max-height: 90vh;
          overflow-y: hidden;
          transition: margin-left 0.3s;
        }
        .professors-container {
          padding: 1.5rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        .professors-container:hover {
          transform: translateY(-5px);
        }
        .header-section {
          margin-bottom: 1.5rem;
          text-align: center;
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
          font-weight: 600;
        }
        .section-header p {
          color: #7f8c8d;
          margin: 0;
          font-size: 0.9rem;
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
          transition: transform 0.3s ease, box-shadow 0.3s ease;
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
        .professors-table {
          width: 100%;
          border-collapse: collapse;
        }
        .professors-table th {
          background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #ddd;
          font-size: 1rem;
        }
        .professors-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          color: #34495e;
          font-size: 0.9rem;
        }
        .professors-table tr:hover {
          background-color: #f8f9fa;
          transition: background-color 0.3s ease;
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
        .success-message {
          color: #2ecc71;
          margin-bottom: 1rem;
          text-align: center;
          padding: 0.4rem;
          border-radius: 6px;
          background: #e6ffed;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Professors;