import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const API_URL = 'http://localhost:8080/api/users';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  useEffect(() => {
    fetchData();
  }, [sortField, sortOrder]);

  const fetchData = async () => {
    try {
      const [usersResponse, authResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get(AUTH_API_URL),
      ]);
      setUsers(sortData(usersResponse.data, sortField, sortOrder));
      setAdminName(authResponse.data.name || 'Admin');
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
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
        <button className="add-button" onClick={() => navigate('/admin/add-user')}>
          <FaPlus /> Add User
        </button>
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
      </div>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
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
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
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
      <style jsx>{`
        .users-container { padding: 1rem; }
        .header-section { margin-bottom: 1.5rem; }
        .header-section h1 { font-size: 1.8rem; color: #2c3e50; margin-bottom: 0.5rem; }
        .header-section h2 { font-size: 1.2rem; color: #7f8c8d; font-weight: normal; }
        .users-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .users-header h3 { font-size: 1.5rem; color: #2c3e50; margin-bottom: 0.25rem; }
        .users-header p { color: #7f8c8d; margin: 0; }
        .add-button { background: #3498db; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; transition: background 0.2s; }
        .add-button:hover { background: #2980b9; }
        .search-section { margin-bottom: 1.5rem; }
        .search-box { position: relative; max-width: 400px; }
        .search-box input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #95a5a6; }
        .users-table-container { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
        .users-table { width: 100%; border-collapse: collapse; }
        .users-table th { background: #f8f9fa; padding: 1rem; text-align: left; font-weight: 600; color: #2c3e50; border-bottom: 1px solid #eee; cursor: pointer; }
        .users-table td { padding: 1rem; border-bottom: 1px solid #eee; color: #34495e; }
        .actions-cell { display: flex; gap: 0.5rem; }
        .edit-btn, .delete-btn { background: none; border: none; cursor: pointer; padding: 0.5rem; border-radius: 4px; display: flex; align-items: center; gap: 0.3rem; }
        .edit-btn { color: #3498db; }
        .edit-btn:hover { background: rgba(52,152,219,0.1); }
        .delete-btn { color: #e74c3c; }
        .delete-btn:hover { background: rgba(231,76,60,0.1); }
        .no-data { text-align: center; padding: 2rem; }
        .empty-state { display: flex; flex-direction: column; align-items: center; }
        .empty-state p { margin: 0; color: #7f8c8d; }
        .hint { font-size: 0.9rem; margin-top: 0.5rem; }
        @media (max-width: 768px) {
          .users-header { flex-direction: column; gap: 1rem; }
          .add-button { width: 100%; }
          .users-table th, .users-table td { padding: 0.5rem; font-size: 0.9rem; }
        }
      `}</style>
    </div>
  );
};

export default Users;