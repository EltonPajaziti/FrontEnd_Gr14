import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import "../../CSS/Admin/AdminDashboard.css"; // Use AdminDashboard.css for consistency
import Sidebar from "../../Components/Professor/ProfessorsSidebar";
import Header from "../../Components/Professor/ProfessorsHeader";

const ProfessorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [professorName, setProfessorName] = useState('Professor');
  const [currentTime, setCurrentTime] = useState(new Date()); // Use current time
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const COURSES_API_URL = 'http://localhost:8080/api/professors/courses'; // Adjusted endpoint for professor's courses
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  const fetchData = async (url, setData, errorMessage, transform = (d) => d) => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    console.log('Token:', token, 'TenantId:', tenantId);
    if (!token || !tenantId) {
      setError('Authentication token or tenant ID is missing. Please log in.');
      setLoading(false);
      return false;
    }

    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { tenantId },
        timeout: 5000,
      });
      console.log('API Response:', response.data);
      const transformedData = transform(response.data);
      setData(transformedData);
      return true;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error.response?.data || error.message);
      setError(errorMessage || `Failed to load data: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  useEffect(() => {
    console.log('ProfessorCourses component mounted');
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const authResponse = await axios.get(AUTH_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Auth Response:', authResponse.data);
        setProfessorName(authResponse.data.firstName || authResponse.data.name || 'Professor');
      } catch (error) {
        console.error('Error fetching professor name:', error);
        setProfessorName('Professor');
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
                year_study: c.year_study || null,
                program_id: c.program_id || null,
                tenant_id: c.tenant_id || null,
                description: c.description || '',
                created_at: c.created_at || '',
              }))
            : []
      );
      console.log('Courses:', courses);
    };

    loadData();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const currentHour = currentTime.getHours();
    return currentHour < 12 ? 'Mirëmëngjes' : currentHour < 18 ? 'Mirëdita' : 'Mirëmbrëma';
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <Sidebar professorName={professorName} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Header professorName={professorName} toggleSidebar={toggleSidebar} />
          <div className="page-container">
            <div className="content-container">
              <div className="courses-container">
                <div className="header-section">
                  <div className="header-text">
                    <h1>SMS 2025/26</h1>
                    <h2>{getGreeting()}, {professorName}</h2>
                  </div>
                </div>

                <div className="section-header">
                  <div>
                    <h3>Kurset</h3>
                    <p>Shiko kurset e tua</p>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="stats-section">
                  <div className="stat-card">
                    <h3>Statistikat</h3>
                    <p>Totali i Kurseve</p>
                    <p className="count">{loading ? 'Ngarkohet...' : filteredCourses.length}</p>
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Regjistrimet e Kurseve</h3>
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Kërko kurse..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="loading">Ngarkohet...</div>
                ) : (
                  <div className="table-container">
                    <table className="courses-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Emri</th>
                          <th>Kodi</th>
                          <th>Kreditë</th>
                          <th>Semestri</th>
                          <th>Viti i Studimit</th>
                          <th>Program ID</th>
                          <th>Tenant ID</th>
                          <th>Përshkrimi</th>
                          <th>Krijuar Më</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map((course) => (
                            <tr key={course.id}>
                              <td>{course.id}</td>
                              <td>{course.name || '-'}</td>
                              <td>{course.code || '-'}</td>
                              <td>{course.credits || '-'}</td>
                              <td>{course.semester || '-'}</td>
                              <td>{course.year_study || '-'}</td>
                              <td>{course.program_id || '-'}</td>
                              <td>{course.tenant_id || '-'}</td>
                              <td>{course.description || '-'}</td>
                              <td>{course.created_at || '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="no-data">
                              <div className="empty-state">
                                <p>Nuk u gjetën kurse</p>
                                <p className="hint">Provo një term tjetër kërkimi</p>
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
          max-height: 90vh;
          overflow-y: hidden;
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
      `}</style>
    </div>
  );
};

export default ProfessorCourses;