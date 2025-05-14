import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import Sidebar from '../../Components/Admin/Sidebar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_URL = 'http://localhost:8080/api/users';
  const FACULTIES_API_URL = 'http://localhost:8080/api/faculties';
  const ROLES_API_URL = 'http://localhost:8080/api/roles'; // Assuming an endpoint for roles
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const fetchRoles = async () => {
    try {
      const response = await axios.get(ROLES_API_URL);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
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
    fetchUsers();
    fetchFaculties();
    fetchRoles();
    fetchAdminName();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const currentHour = parseInt(
      currentTime.toLocaleString('en-US', { timeZone: 'Europe/Paris', hour: 'numeric', hour12: false })
    );
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const getFacultyName = (tenantId) => {
    const faculty = faculties.find(f => f.id === tenantId);
    return faculty ? faculty.name : '-';
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : '-';
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-container">
        <div className="user-container">
          <div className="header-section">
            <h1>SMS 2025/26</h1>
            <h2>{getGreeting()}, {adminName}</h2>
          </div>
          <div className="user-header">
            <div>
              <h3>Users</h3>
              <p>View all users in the institution</p>
            </div>
          </div>
          <div className="search-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Faculty</th>
                  <th>Created At</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{getRoleName(user.role?.id)}</td>
                      <td>{getFacultyName(user.tenantID?.id)}</td>
                      <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                      <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      <div className="empty-state">
                        <p>No users found</p>
                        <p className="hint">Try a different search term</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .user-header h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }
        .user-header p {
          color: #7f8c8d;
          margin: 0;
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
        .user-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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
    </div>
  );
};

export default Users;