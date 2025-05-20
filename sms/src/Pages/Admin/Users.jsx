import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../../CSS/Admin/AdminDashboard.css";
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const [sortField, setSortField] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const API_URL = 'http://localhost:8080/api/users';
  //const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  useEffect(() => {
    fetchData();
  }, [sortField, sortOrder]);

  const fetchData = async () => {
    try {
      const [usersResponse] = await Promise.all([
        axios.get(API_URL),
        //axios.get(AUTH_API_URL),
      ]);
      setUsers(sortData(usersResponse.data, sortField, sortOrder));
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
  `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())
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
              <div className="users-container">
                <div className="header-section">
                  <h1>SMS 2025/26</h1>
                  <h2>{getGreeting()}, {adminName}</h2>
                </div>
                <div className="users-header">
                  <div>
                    <h3>Users</h3>
                    <p>View all users in the system</p>
                  </div>
                </div>
                <div className="search-section">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search users..."
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
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('id')}>ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th onClick={() => handleSort('firstName')}>Name {sortField === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th onClick={() => handleSort('createdAt')}>Created At {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td>{user.role?.name || 'N/A'}</td>
                            <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                            <td className="actions-cell">
                              <button className="edit-btn" onClick={() => navigate(`/admin/manage-users/${user.id}`)}>
                                <FaEdit /> Edit
                              </button>
                              <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                                <FaTrash /> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-data">
                            <div className="empty-state">
                              <p>No users found</p>
                              <p className="hint">Try a different search term or add a new user</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <style jsx>{`
                .page-container {
                  display: flex;
                  flex-direction: column;
                  min-height: calc(100vh - 60px);
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
                .users-container {
                  padding: 2rem;
                  background: #fff;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0 marketers, 0.05);
                  flex: 1;
                  min-height: 100%;
                }
                .header-section {
                  margin-bottom: 2rem;
                }
                .header-section h1 {
                  font-size: 2rem;
                  color: #2c3e50;
                  margin-bottom: 0.5rem;
                }
                .header-section h2 {
                  font-size: 1.5rem;
                  color: #7f8c8d;
                  font-weight: normal;
                }
                .users-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 2rem;
                }
                .users-header h3 {
                  font-size: 1.8rem;
                  color: #2c3e50;
                  margin-bottom: 0.25rem;
                }
                .users-header p {
                  color: #7f8c8d;
                  margin: 0;
                  font-size: 1.1rem;
                }
                .search-section {
                  margin-bottom: 2rem;
                  display: flex;
                  align-items: center;
                }
                .search-box {
                  position: relative;
                  width: 100%;
                  max-width: 500px;
                }
                .search-box input {
                  width: 100%;
                  padding: 1rem 1rem 1rem 3rem;
                  border: 1px solid #ddd;
                  border-radius: 6px;
                  font-size: 1.2rem;
                }
                .search-icon {
                  position: absolute;
                  left: 1rem;
                  top: 50%;
                  transform: translateY(-50%);
                  color: #95a5a6;
                  font-size: 1.2rem;
                }
                .clear-btn {
                  padding: 0.8rem 1.5rem;
                  margin-left: 1rem;
                  border: 1px solid #ddd;
                  border-radius: 6px;
                  background: none;
                  cursor: pointer;
                  font-size: 1.1rem;
                  transition: background-color 0.3s;
                }
                .clear-btn:hover {
                  background-color: #f0f0f0;
                }
                .users-table-container {
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                  overflow: hidden;
                  flex: 1;
                  min-height: 500px;
                }
                .users-table {
                  width: 100%;
                  border-collapse: collapse;
                }
                .users-table th {
                  background: #f8f9fa;
                  padding: 1.5rem;
                  text-align: left;
                  font-weight: 600;
                  color: #2c3e50;
                  border-bottom: 1px solid #eee;
                  cursor: pointer;
                  font-size: 1.1rem;
                }
                .users-table td {
                  padding: 1.5rem;
                  border-bottom: 1px solid #eee;
                  color: #34495e;
                  font-size: 1rem;
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
                  font-size: 1.2rem;
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
                  padding: 3rem;
                }
                .empty-state {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                .empty-state p {
                  margin: 0;
                  color: #7f8c8d;
                  font-size: 1.2rem;
                }
                .hint {
                  font-size: 1rem;
                  margin-top: 0.5rem;
                }
                @media (max-width: 768px) {
                  .users-header {
                    flex-direction: column;
                    gap: 1rem;
                  }
                  .users-table th, .users-table td {
                    padding: 0.5rem;
                    font-size: 0.9rem;
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

export default Users;