import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaPlus } from 'react-icons/fa';
import "../../CSS/Admin/AdminDashboard.css"; // Import existing CSS
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

// Sample initial data based on the scholarship_application table
const initialApplications = [
  { 
    id: 1,
    student: { id: 101, name: "John Doe" },
    academicYear: { id: 1, year: 2025 },
    tenantID: { id: 1, name: "Academic Excellence Scholarship" },
    gpa: 3.9,
    status: "SUBMITTED",
    requestDate: "2025-04-15T12:00:00",
    decisionDate: null,
    note: "Awaiting review",
    createdAt: "2025-04-15T12:00:00",
    updatedAt: "2025-04-15T12:00:00",
  },
  { 
    id: 2,
    student: { id: 102, name: "Jane Smith" },
    academicYear: { id: 1, year: 2025 },
    tenantID: { id: 2, name: "University Leadership Scholarship" },
    gpa: 3.7,
    status: "PENDING",
    requestDate: "2025-04-18T14:30:00",
    decisionDate: null,
    note: "Under evaluation",
    createdAt: "2025-04-18T14:30:00",
    updatedAt: "2025-04-18T14:30:00",
  },
  { 
    id: 3,
    student: { id: 103, name: "Michael Johnson" },
    academicYear: { id: 1, year: 2025 },
    tenantID: { id: 3, name: "STEM Excellence Scholarship" },
    gpa: 3.6,
    status: "SUBMITTED",
    requestDate: "2025-05-01T09:00:00",
    decisionDate: null,
    note: "Documents pending",
    createdAt: "2025-05-01T09:00:00",
    updatedAt: "2025-05-01T09:00:00",
  },
];

// Mock scholarship details
const scholarshipDetails = {
  1: {
    amount: 5000,
    deadline: "2025-06-15",
    requirements: ["GPA 3.8+", "Two faculty recommendations", "Personal essay"],
  },
  2: {
    amount: 3500,
    deadline: "2025-05-30",
    requirements: ["Active in student organizations", "Leadership essay", "One recommendation"],
  },
  3: {
    amount: 4000,
    deadline: "2025-06-01",
    requirements: ["STEM major", "Research experience", "GPA 3.5+"],
  },
};

const Bursat = () => {
  const [applications, setApplications] = useState(initialApplications);
  const [adminName, setAdminName] = useState('Admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const API_URL = 'http://localhost:8080/api/scholarship-applications';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentId = 101; // Replace with actual logged-in student ID from auth
      const [applicationsResponse, authResponse] = await Promise.all([
        axios.get(`${API_URL}/student/${studentId}`),
        axios.get(AUTH_API_URL),
      ]);
      const mappedApplications = applicationsResponse.data.map(app => ({
        id: app.id,
        student: app.student || { id: "Unknown", name: "Unknown" },
        academicYear: app.academicYear || { id: 1, year: 2025 },
        tenantID: app.tenantID || { id: 0, name: "Unknown Scholarship" },
        gpa: app.gpa,
        status: app.status || "PENDING",
        requestDate: app.requestDate,
        decisionDate: app.decisionDate,
        note: app.note,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      }));
      setApplications(mappedApplications.length > 0 ? mappedApplications : initialApplications);
      setAdminName(authResponse.data.name || 'Admin');
    } catch (error) {
      console.error('Error fetching data:', error);
      setApplications(initialApplications);
    }
  };

  const handleApply = async (tenantId) => {
    const newApplication = {
      student: { id: 101 }, // Replace with actual student ID
      academicYear: { id: 1 }, // Replace with current academic year
      tenantID: { id: tenantId },
      gpa: 3.8, // Replace with actual GPA
      status: "PENDING",
      requestDate: new Date().toISOString(),
      decisionDate: null,
      note: "",
    };
    try {
      const response = await axios.post(API_URL, newApplication);
      setApplications([...applications, response.data]);
    } catch (error) {
      console.error('Error applying for scholarship:', error);
      alert('Failed to apply. Please try again.');
    }
  };

  const handleView = (app) => {
    setSelectedApp(app);
    // Placeholder for modal or detailed view
    console.log('Viewing application:', app);
  };

  const handleEdit = (app) => {
    setSelectedApp(app);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedApp) {
      try {
        const response = await axios.put(`${API_URL}/${selectedApp.id}`, selectedApp);
        setApplications(applications.map(app => app.id === selectedApp.id ? response.data : app));
        setIsEditModalOpen(false);
        setSelectedApp(null);
      } catch (error) {
        console.error('Error updating application:', error);
        alert('Failed to update application.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedApp(prev => ({ ...prev, [name]: value }));
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
          <div className="admin-dashboard">
            <div className="scholarships-container">
              <h1>Scholarships</h1>
              <p className="subtitle">Browse and apply for available scholarships</p>
              <div className="apply-section">
                <h3>Available Scholarships</h3>
                <div className="available-scholarships">
                  {Object.entries(scholarshipDetails).map(([id, details]) => (
                    <div key={id} className="scholarship-card">
                      <h4>{initialApplications.find(app => app.tenantID.id === parseInt(id))?.tenantID.name || `Scholarship ${id}`}</h4>
                      <p><strong>Amount:</strong> ${details.amount}</p>
                      <p><strong>Deadline:</strong> {details.deadline}</p>
                      <p><strong>Requirements:</strong></p>
                      <ul>
                        {details.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                      <button 
                        className="apply-btn" 
                        onClick={() => handleApply(parseInt(id))}
                        disabled={applications.some(app => app.tenantID.id === parseInt(id) && app.status !== "REJECTED")}
                      >
                        <FaPlus /> Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="my-applications">
                <h2>My Applications</h2>
                <div className="applications-list">
                  {applications.map((app) => {
                    const details = scholarshipDetails[app.tenantID.id] || {
                      amount: 0,
                      deadline: "N/A",
                      requirements: [],
                    };
                    return (
                      <div key={app.id} className="application-card">
                        <div className="card-header">
                          <h3>{app.tenantID.name}</h3>
                          <span className={`status ${app.status.toLowerCase()}`}>
                            {app.status}
                          </span>
                        </div>
                        <p>Submitted on {new Date(app.requestDate).toLocaleDateString('en-US')}</p>
                        <div className="card-details">
                          <p><strong>Amount:</strong> ${details.amount}</p>
                          <p><strong>Deadline:</strong> {details.deadline}</p>
                          <p><strong>Requirements:</strong></p>
                          <ul>
                            {details.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="card-actions">
                          <button className="view-btn" onClick={() => handleView(app)}>
                            <FaEye /> View
                          </button>
                          <button className="edit-btn" onClick={() => handleEdit(app)}>
                            <FaEdit /> Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && selectedApp && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Application</h2>
            <label>
              GPA:
              <input
                type="number"
                name="gpa"
                value={selectedApp.gpa || ''}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="4.0"
              />
            </label>
            <label>
              Note:
              <textarea
                name="note"
                value={selectedApp.note || ''}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .scholarships-container {
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }
        .scholarships-container h1 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        .subtitle {
          color: #7f8c8d;
          margin-bottom: 2rem;
        }
        .apply-section {
          margin-bottom: 2rem;
        }
        .apply-section h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        .available-scholarships {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .scholarship-card {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          transition: box-shadow 0.2s;
        }
        .scholarship-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .scholarship-card h4 {
          color: #3498db;
          margin: 0 0 10px;
          font-size: 1.2rem;
        }
        .scholarship-card p {
          margin: 5px 0;
          color: #34495e;
        }
        .scholarship-card ul {
          list-style-type: disc;
          padding-left: 20px;
          margin: 5px 0;
          color: #7f8c8d;
        }
        .apply-btn {
          background: #2ecc71;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          transition: background 0.2s;
          margin-top: 10px;
        }
        .apply-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }
        .apply-btn:hover:not(:disabled) {
          background: #27ae60;
        }
        .my-applications {
          margin-top: 2rem;
        }
        .my-applications h2 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        .applications-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .application-card {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          transition: box-shadow 0.2s;
        }
        .application-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .card-header h3 {
          color: #3498db;
          margin: 0;
          font-size: 1.2rem;
        }
        .status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .status.submitted {
          background: #e6f4ea;
          color: #2ecc71;
        }
        .status.pending {
          background: #fff4e5;
          color: #f39c12;
        }
        .card-details p {
          margin: 5px 0;
          color: #34495e;
        }
        .card-details ul {
          list-style-type: disc;
          padding-left: 20px;
          margin: 5px 0;
          color: #7f8c8d;
        }
        .card-actions {
          margin-top: 15px;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .view-btn, .edit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .edit-btn {
          background: #e67e22;
        }
        .view-btn:hover {
          background: #2980b9;
        }
        .edit-btn:hover {
          background: #d35400;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          max-width: 90%;
        }
        .modal-content h2 {
          margin-top: 0;
          color: #2c3e50;
        }
        .modal-content label {
          display: block;
          margin: 15px 0 5px;
          color: #34495e;
        }
        .modal-content input, .modal-content textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .modal-content button {
          background: #3498db;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
          transition: background 0.2s;
        }
        .modal-content button:last-child {
          background: #e74c3c;
        }
        .modal-content button:hover {
          background: #2980b9;
        }
        .modal-content button:last-child:hover {
          background: #c0392b;
        }
        @media (max-width: 768px) {
          .available-scholarships, .applications-list {
            grid-template-columns: 1fr;
          }
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          .card-actions {
            flex-direction: column;
            gap: 5px;
          }
          .modal-content {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default Bursat;