import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDownload, FaPrint } from 'react-icons/fa';
import "../../CSS/Admin/AdminDashboard.css";
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

const initialTranscripts = [
  { 
    id: 1, 
    student: { id: "S12345", name: "John Doe", program: "Computer Science" }, 
    generatedAt: "2025-04-15T12:00:00", 
    tenant: { id: 1, name: "Computer Science Faculty" }, 
    academicYear: { id: 1, year: 2025 },
  },
  { 
    id: 2, 
    student: { id: "S23456", name: "Jane Smith", program: "Electrical Engineering" }, 
    generatedAt: "2025-04-18T14:30:00", 
    tenant: { id: 2, name: "Engineering Faculty" }, 
    academicYear: { id: 1, year: 2025 },
  },
  { 
    id: 3, 
    student: { id: "S34567", name: "Michael Johnson", program: "Data Science" }, 
    generatedAt: null, 
    tenant: { id: 1, name: "Computer Science Faculty" }, 
    academicYear: { id: 1, year: 2025 },
  },
  { 
    id: 4, 
    student: { id: "S45678", name: "Emily Brown", program: "Computer Engineering" }, 
    generatedAt: null, 
    tenant: { id: 2, name: "Engineering Faculty" }, 
    academicYear: { id: 1, year: 2025 },
  },
];

const Transcripts = () => {
  const [transcripts, setTranscripts] = useState(initialTranscripts);
  const [filter, setFilter] = useState("ALL");
  const [adminName, setAdminName] = useState('Admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const API_URL = 'http://localhost:8080/api/transcripts';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transcriptsResponse, authResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get(AUTH_API_URL),
      ]);
      const mappedTranscripts = transcriptsResponse.data.map(transcript => ({
        id: transcript.id,
        student: transcript.student || { id: "Unknown", name: "Unknown", program: "Unknown" },
        generatedAt: transcript.generatedAt,
        tenant: transcript.tenant || { id: 1, name: "Unknown Faculty" },
        academicYear: transcript.academicYear || { id: 1, year: 2025 },
      }));
      setTranscripts(mappedTranscripts.length > 0 ? mappedTranscripts : initialTranscripts);
      setAdminName(authResponse.data.name || 'Admin');
    } catch (error) {
      console.error('Error fetching data:', error);
      setTranscripts(initialTranscripts);
    }
  };

  const getStatus = (generatedAt) => (generatedAt ? "ISSUED" : "PENDING");
  const filteredTranscripts = filter === "ALL" 
    ? transcripts 
    : transcripts.filter(transcript => getStatus(transcript.generatedAt) === filter);

  const handleExport = () => {
    const exportData = filteredTranscripts.map(transcript => ({
      Student_ID: transcript.student.id,
      Student_Name: transcript.student.name,
      Program: transcript.student.program || transcript.tenant.name,
      Issue_Date: transcript.generatedAt ? new Date(transcript.generatedAt).toLocaleDateString('en-US') : "N/A",
      Status: getStatus(transcript.generatedAt),
    }));

    const headers = ['Student_ID', 'Student_Name', 'Program', 'Issue_Date', 'Status'];
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header] || 'N/A'}"`).join(',')),
    ];
    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transcripts.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/download`, { responseType: 'blob' });
      if (response.status !== 200) {
        throw new Error('Failed to download transcript');
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transcript_${id}.pdf`);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading transcript:', error);
      alert('Failed to download transcript. Please try again later.');
    }
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
            <div className="transcripts-container">
              <h1>Academic Transcripts</h1>
              <div className="transcript-filters">
                <button 
                  className={filter === "ALL" ? "active" : ""} 
                  onClick={() => setFilter("ALL")}
                >
                  ALL
                </button>
                <button 
                  className={filter === "ISSUED" ? "active" : ""} 
                  onClick={() => setFilter("ISSUED")}
                >
                  ISSUED
                </button>
                <button 
                  className={filter === "PENDING" ? "active" : ""} 
                  onClick={() => setFilter("PENDING")}
                >
                  PENDING
                </button>
              </div>
              <div className="transcript-header">
                <div>
                  <h3>Transcript Records</h3>
                  <p>View and manage student transcript requests</p>
                </div>
                <div className="header-buttons">
                  <button className="export-button" onClick={handleExport}>
                    <FaDownload /> Export
                  </button>
                  <button className="print-button" onClick={handlePrint}>
                    <FaPrint /> Print
                  </button>
                </div>
              </div>
              <div className="transcript-table-container">
                <table className="transcript-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Program</th>
                      <th>Issue Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTranscripts.length > 0 ? (
                      filteredTranscripts.map((transcript, index) => (
                        <tr key={transcript.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td>{transcript.student.id}</td>
                          <td>{transcript.student.name}</td>
                          <td>{transcript.student.program || transcript.tenant.name}</td>
                          <td>{transcript.generatedAt ? new Date(transcript.generatedAt).toLocaleDateString('en-US') : "N/A"}</td>
                          <td>
                            <span className={`status ${getStatus(transcript.generatedAt).toLowerCase()}`}>
                              {getStatus(transcript.generatedAt)}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button className="download-btn" onClick={() => handleDownload(transcript.id)}>
                              <FaDownload />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">
                          <div className="empty-state">
                            <p>No transcripts found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .transcripts-container {
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }
        .transcripts-container h1 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }
        .transcript-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 1.5rem;
        }
        .transcript-filters button {
          background: none;
          border: none;
          padding: 5px 10px;
          font-size: 1rem;
          color: #34495e;
          cursor: pointer;
          transition: color 0.2s;
        }
        .transcript-filters button.active {
          color: #3498db;
          font-weight: bold;
          border-bottom: 2px solid #3498db;
        }
        .transcript-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .transcript-header h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }
        .transcript-header p {
          color: #7f8c8d;
          margin: 0;
        }
        .header-buttons {
          display: flex;
          gap: 1rem;
        }
        .export-button, .print-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .print-button {
          background: #2ecc71;
        }
        .export-button:hover {
          background: #2980b9;
        }
        .print-button:hover {
          background: #27ae60;
        }
        .transcript-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .transcript-table {
          width: 100%;
          border-collapse: collapse;
        }
        .transcript-table th {
          background: #e6f0fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #1a3c5e;
          border-bottom: 2px solid #bbdefb;
          font-size: 0.9rem;
        }
        .transcript-table td {
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
          color: #34495e;
          font-size: 0.9rem;
        }
        .even-row {
          background: #fafafa;
        }
        .odd-row {
          background: #ffffff;
        }
        .transcript-table tr:hover {
          background: #f1f8ff;
        }
        .status {
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .status.issued {
          background: #e6f4ea;
          color: #2ecc71;
        }
        .status.pending {
          background: #fff4e5;
          color: #f39c12;
        }
        .actions-cell {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .download-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #3498db;
          font-size: 1rem;
        }
        .download-btn:hover {
          color: #2980b9;
        }
        .no-data {
          text-align: center;
          padding: 2rem;
        }
        .empty-state p {
          margin: 0;
          color: #7f8c8d;
        }
        @media (max-width: 768px) {
          .transcript-header {
            flex-direction: column;
            gap: 1rem;
          }
          .header-buttons {
            flex-direction: column;
            width: 100%;
          }
          .export-button, .print-button {
            width: 100%;
          }
          .transcript-table th, .transcript-table td {
            padding: 0.5rem;
            font-size: 0.8rem;
          }
          .transcript-filters {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default Transcripts;