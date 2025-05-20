import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import "../../CSS/Admin/AdminDashboard.css"; // Import AdminDashboard CSS for sidebar and header
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

const Faculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    email: '',
    address: ''
  });
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const API_URL = "http://localhost:8080/api/faculties";
  const AUTH_API_URL = "http://localhost:8080/api/auth/user";

  const fetchFaculties = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      setError("Failed to fetch faculties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminName = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(AUTH_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminName(response.data.name || "Admin");
    } catch (error) {
      console.error("Error fetching admin name:", error);
      setAdminName("Admin");
    }
  };

  useEffect(() => {
    fetchFaculties();
    fetchAdminName();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const currentHour = parseInt(
      currentTime.toLocaleString("en-US", { timeZone: "Europe/Paris", hour: "numeric", hour12: false })
    );
    return currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        facultyId: Number(formData.facultyId),
        name: formData.name,
        email: formData.email,
        address: formData.address || null,
      };

      if (editingId) {
        delete payload.email;
        await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Faculty updated successfully!");
      } else {
        await axios.post(`${API_URL}/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Faculty added successfully!");
      }
      resetForm();
      fetchFaculties();
    } catch (error) {
      console.error("Error saving faculty:", error);
      setError("Failed to save faculty. Please try again.");
    }
  };

  const handleEdit = (faculty) => {
    setFormData({
      facultyId: faculty.id,
      name: faculty.name,
      email: faculty.email,
      address: faculty.address || "",
    });
    setEditingId(faculty.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Faculty deleted successfully!");
      fetchFaculties();
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting faculty:", error);
      setError("Failed to delete faculty. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", address: "" });
    setEditingId(null);
    setShowForm(false);
    setError(null);
    setSuccessMessage(null);
  };

  const filteredFaculties = faculties.filter((faculty) =>
    [faculty.name, faculty.email, faculty.address || ""]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
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
              <div className="faculty-container">
                <div className="header-section">
                  <h1>SMS 2025/26</h1>
                  <h2>{getGreeting()}, {adminName}</h2>
                </div>

                <div className="faculty-header">
                  <div>
                    <h3>Faculties</h3>
                    <p>Manage academic faculties in the institution</p>
                  </div>
                  <button className="add-button" onClick={() => setShowForm(true)}>
                    <FaPlus /> Add Faculty
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className="search-section">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search faculties..."
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

                <div className="faculty-table-container">
                  {loading ? (
                    <div className="loading">Loading...</div>
                  ) : (
                    <table className="faculty-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Address</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFaculties.length > 0 ? (
                          filteredFaculties.map((faculty) => (
                            <tr key={faculty.id}>
                              <td>{faculty.id}</td>
                              <td>{faculty.name}</td>
                              <td>{faculty.email}</td>
                              <td>{faculty.address || "-"}</td>
                              <td>
                                {faculty.createdAt
                                  ? new Date(faculty.createdAt).toLocaleString()
                                  : "-"}
                              </td>
                              <td className="actions-cell">
                                <button
                                  className="edit-btn"
                                  onClick={() => handleEdit(faculty)}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="delete-btn"
                                  onClick={() => setDeleteConfirmation(faculty.id)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="no-data">
                              <div className="empty-state">
                                <p>No faculties found</p>
                                <p className="hint">
                                  Try a different search term or add a new faculty
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                {showForm && (
                  <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <h3>{editingId ? "Edit Faculty" : "Add New Faculty"}</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>Faculty ID*</label>
                          <input
                            type="number"
                            name="facultyId"
                            value={formData.facultyId}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Faculty Name*</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email*</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled={!!editingId}
                          />
                        </div>
                        <div className="form-group">
                          <label>Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-actions">
                          <button type="button" className="cancel-btn" onClick={resetForm}>
                            Cancel
                          </button>
                          <button type="submit" className="submit-btn">
                            {editingId ? "Update Faculty" : "Add Faculty"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {deleteConfirmation && (
                  <div className="modal-overlay" onClick={() => setDeleteConfirmation(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <h3>Confirm Deletion</h3>
                      <p>Are you sure you want to delete this faculty? This action cannot be undone.</p>
                      <div className="form-actions">
                        <button
                          className="cancel-btn"
                          onClick={() => setDeleteConfirmation(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="delete-confirm-btn"
                          onClick={() => handleDelete(deleteConfirmation)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <style jsx>{`
              .page-container {
                display: flex;
                flex-direction: column; /* Ensure content stacks vertically */
                min-height: calc(100vh - 60px); /* Adjust for header height (assuming 60px) */
                background-color: #f5f7fa;
              }
              .content-container {
                flex: 1;
                padding: 20px;
                margin-left: 0; /* Remove margin-left since sidebar is handled by content-wrapper */
                margin-top: 0; /* Remove default margin-top */
                display: flex;
                flex-direction: column;
                height: 100%; /* Ensure it takes full height */
              }
              @media (max-width: 768px) {
                .content-container {
                  margin-left: 0;
                }
              }
              .faculty-container {
                padding: 2rem; /* Increased padding for larger appearance */
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                flex: 1; /* Allow it to grow and fill available space */
                min-height: 100%; /* Ensure it takes full height of parent */
              }
              .header-section {
                margin-bottom: 2rem; /* Increased margin for spacing */
              }
              .header-section h1 {
                font-size: 2rem; /* Increased font size for larger appearance */
                color: #2c3e50;
                margin-bottom: 0.5rem;
              }
              .header-section h2 {
                font-size: 1.5rem; /* Increased font size */
                color: #7f8c8d;
                font-weight: normal;
              }
              .faculty-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem; /* Increased margin */
              }
              .faculty-header h3 {
                font-size: 1.8rem; /* Increased font size */
                color: #2c3e50;
                margin-bottom: 0.25rem;
              }
              .faculty-header p {
                color: #7f8c8d;
                margin: 0;
                font-size: 1.1rem; /* Slightly larger */
              }
              .add-button {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 1rem 2rem; /* Increased padding for larger button */
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
                font-size: 1.1rem; /* Larger font */
                transition: background-color 0.2s;
              }
              .add-button:hover {
                background-color: #2980b9;
              }
              .error-message {
                color: #e74c3c;
                margin-bottom: 1.5rem; /* Increased margin */
                text-align: center;
                font-size: 1.1rem;
              }
              .success-message {
                color: #2ecc71;
                margin-bottom: 1.5rem;
                text-align: center;
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
                max-width: 500px; /* Increased max-width for larger appearance */
              }
              .search-box input {
                width: 100%;
                padding: 1rem 1rem 1rem 3rem; /* Increased padding */
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1.2rem; /* Larger font */
              }
              .search-icon {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #95a5a6;
                font-size: 1.2rem; /* Larger icon */
              }
              .clear-btn {
                padding: 0.8rem 1.5rem; /* Increased padding */
                margin-left: 1rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                background: none;
                cursor: pointer;
                font-size: 1.1rem; /* Larger font */
                transition: background-color 0.3s;
              }
              .clear-btn:hover {
                background-color: #f0f0f0;
              }
              .faculty-table-container {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                overflow: hidden;
                flex: 1; /* Allow table container to grow */
                min-height: 500px; /* Increased minimum height for larger appearance */
              }
              .loading {
                text-align: center;
                padding: 3rem; /* Increased padding */
                color: #7f8c8d;
                font-size: 1.2rem;
              }
              .faculty-table {
                width: 100%;
                border-collapse: collapse;
              }
              .faculty-table th {
                background-color: #f8f9fa;
                padding: 1.5rem; /* Increased padding */
                text-align: left;
                font-weight: 600;
                color: #2c3e50;
                border-bottom: 1px solid #eee;
                font-size: 1.1rem; /* Larger font */
              }
              .faculty-table td {
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
                color: #34495e;
                font-size: 1rem; /* Slightly larger font */
              }
              .actions-cell {
                display: flex;
                gap: 0.5rem;
              }
              .edit-btn,
              .delete-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .edit-btn {
                color: #3498db;
                font-size: 1.2rem; /* Larger icon */
              }
              .edit-btn:hover {
                background-color: rgba(52, 152, 219, 0.1);
              }
              .delete-btn {
                color: #e74c3c;
                font-size: 1.2rem;
              }
              .delete-btn:hover {
                background-color: rgba(231, 76, 60, 0.1);
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
              .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
              }
              .modal-content {
                background-color: white;
                padding: 2.5rem; /* Increased padding */
                border-radius: 8px;
                width: 100%;
                max-width: 700px; /* Increased max-width for larger modal */
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
              }
              .modal-content h3 {
                margin-top: 0;
                margin-bottom: 1.5rem;
                color: #2c3e50;
                font-size: 1.8rem; /* Larger font */
              }
              .form-group {
                margin-bottom: 1.5rem; /* Increased margin */
              }
              .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #34495e;
                font-size: 1.1rem;
              }
              .form-group input,
              .form-group select {
                width: 100%;
                padding: 1rem; /* Increased padding */
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1.1rem;
              }
              .form-group input:disabled {
                background-color: #f0f0f0;
                cursor: not-allowed;
              }
              .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 1.5rem;
              }
              .cancel-btn {
                background-color: #f8f9fa;
                color: #34495e;
                border: 1px solid #ddd;
                padding: 1rem 2rem; /* Increased padding */
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1.1rem;
                transition: all 0.2s;
              }
              .cancel-btn:hover {
                background-color: #e9ecef;
              }
              .submit-btn,
              .delete-confirm-btn {
                background-color: #2ecc71;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1.1rem;
                transition: background-color 0.2s;
              }
              .submit-btn:hover,
              .delete-confirm-btn:hover {
                background-color: #27ae60;
              }
              .delete-confirm-btn {
                background-color: #e74c3c;
              }
              .delete-confirm-btn:hover {
                background-color: #c0392b;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faculty;