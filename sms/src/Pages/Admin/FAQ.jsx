import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import "../../CSS/Admin/AdminDashboard.css"; // Import existing CSS
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";

// Sample initial data based on the FAQ table
const initialFAQs = [
  { 
    id: 1,
    question: "What are the requirements for enrollment?",
    answer: "You need to submit your transcripts, ID, and complete the application form.",
    category: "Enrollment",
    isVisible: true,
    createdBy: { id: 1, name: "Admin" },
    createdAt: "2025-04-15T12:00:00",
    updatedAt: "2025-04-15T12:00:00",
    tenantID: { id: 1, name: "General Faculty" },
  },
  { 
    id: 2,
    question: "How can I apply for a scholarship?",
    answer: "Visit the scholarships page and submit your application online.",
    category: "Scholarships",
    isVisible: true,
    createdBy: { id: 1, name: "Admin" },
    createdAt: "2025-04-18T14:30:00",
    updatedAt: "2025-04-18T14:30:00",
    tenantID: { id: 1, name: "General Faculty" },
  },
  { 
    id: 3,
    question: "What is the deadline for transcript submission?",
    answer: "The deadline is typically June 1st of each year.",
    category: "Transcripts",
    isVisible: true,
    createdBy: { id: 1, name: "Admin" },
    createdAt: "2025-05-01T09:00:00",
    updatedAt: "2025-05-01T09:00:00",
    tenantID: { id: 1, name: "General Faculty" },
  },
];

const FAQ = () => {
  const [faqs, setFaqs] = useState(initialFAQs);
  const [adminName, setAdminName] = useState('Admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: '', isVisible: true });

  const API_URL = 'http://localhost:8080/api/faqs';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const [faqsResponse, authResponse] = await Promise.all([
        selectedCategory === 'All' 
          ? axios.get(API_URL) 
          : axios.get(`${API_URL}/category/${selectedCategory}`),
        axios.get(AUTH_API_URL),
      ]);
      const mappedFAQs = faqsResponse.data.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'Uncategorized',
        isVisible: faq.isVisible,
        createdBy: faq.createdBy || { id: 0, name: "Unknown" },
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
        tenantID: faq.tenantID || { id: 0, name: "Unknown Faculty" },
      }));
      setFaqs(mappedFAQs.length > 0 ? mappedFAQs : initialFAQs);
      setAdminName(authResponse.data.name || 'Admin');
    } catch (error) {
      console.error('Error fetching data:', error);
      setFaqs(initialFAQs);
    }
  };

  const categories = ['All', ...new Set(initialFAQs.map(faq => faq.category))];

  const handleToggleExpand = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleEdit = (faq) => {
    setSelectedFAQ(faq);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setFaqs(faqs.filter(faq => faq.id !== id));
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        alert('Failed to delete FAQ.');
      }
    }
  };

  const handleSaveEdit = async () => {
    if (selectedFAQ) {
      try {
        const response = await axios.put(`${API_URL}/${selectedFAQ.id}`, selectedFAQ);
        setFaqs(faqs.map(faq => faq.id === selectedFAQ.id ? response.data : faq));
        setIsEditModalOpen(false);
        setSelectedFAQ(null);
      } catch (error) {
        console.error('Error updating FAQ:', error);
        alert('Failed to update FAQ.');
      }
    }
  };

  const handleAddFAQ = async () => {
    try {
      const response = await axios.post(API_URL, {
        ...newFAQ,
        createdBy: { id: 1 }, // Replace with actual user ID
        tenantID: { id: 1 },  // Replace with actual faculty ID
      });
      setFaqs([...faqs, response.data]);
      setIsAddModalOpen(false);
      setNewFAQ({ question: '', answer: '', category: '', isVisible: true });
    } catch (error) {
      console.error('Error adding FAQ:', error);
      alert('Failed to add FAQ.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (isEditModalOpen) {
      setSelectedFAQ(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    } else {
      setNewFAQ(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
            <div className="faqs-container">
              <div className="faq-header">
                <h1>Frequently Asked Questions</h1>
                <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
                  <FaPlus /> Add FAQ
                </button>
              </div>
              <div className="faq-filters">
                <label>Filter by Category:</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="faqs-list">
                {faqs.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                      <div className="faq-meta">
                        <span>Category: {faq.category}</span>
                        <span>Visible: {faq.isVisible ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="faq-actions">
                        <button className="view-btn" onClick={() => handleToggleExpand(faq.id)}>
                          <FaEye /> {expandedFAQ === faq.id ? 'Hide' : 'View'}
                        </button>
                        <button className="edit-btn" onClick={() => handleEdit(faq)}>
                          <FaEdit /> Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(faq.id)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                    {expandedFAQ === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                        <p><strong>Created by:</strong> {faq.createdBy.name}</p>
                        <p><strong>Created at:</strong> {new Date(faq.createdAt).toLocaleDateString('en-US')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && selectedFAQ && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit FAQ</h2>
            <label>
              Question:
              <textarea
                name="question"
                value={selectedFAQ.question}
                onChange={handleChange}
              />
            </label>
            <label>
              Answer:
              <textarea
                name="answer"
                value={selectedFAQ.answer || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="category"
                value={selectedFAQ.category || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Visible:
              <input
                type="checkbox"
                name="isVisible"
                checked={selectedFAQ.isVisible}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add FAQ</h2>
            <label>
              Question:
              <textarea
                name="question"
                value={newFAQ.question}
                onChange={handleChange}
              />
            </label>
            <label>
              Answer:
              <textarea
                name="answer"
                value={newFAQ.answer}
                onChange={handleChange}
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="category"
                value={newFAQ.category}
                onChange={handleChange}
              />
            </label>
            <label>
              Visible:
              <input
                type="checkbox"
                name="isVisible"
                checked={newFAQ.isVisible}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleAddFAQ}>Add</button>
            <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .faqs-container {
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }
        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .faqs-container h1 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin: 0;
        }
        .add-btn {
          background: #2ecc71;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .add-btn:hover {
          background: #27ae60;
        }
        .faq-filters {
          margin-bottom: 1.5rem;
        }
        .faq-filters label {
          margin-right: 10px;
          color: #34495e;
        }
        .faq-filters select {
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .faqs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .faq-item {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          transition: box-shadow 0.2s;
        }
        .faq-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .faq-question h3 {
          color: #3498db;
          margin: 0;
          font-size: 1.2rem;
          flex: 1;
        }
        .faq-meta {
          color: #7f8c8d;
          font-size: 0.9rem;
          display: flex;
          gap: 15px;
        }
        .faq-actions {
          display: flex;
          gap: 10px;
        }
        .view-btn, .edit-btn, .delete-btn {
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
        .delete-btn {
          background: #e74c3c;
        }
        .view-btn:hover {
          background: #2980b9;
        }
        .edit-btn:hover {
          background: #d35400;
        }
        .delete-btn:hover {
          background: #c0392b;
        }
        .faq-answer {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }
        .faq-answer p {
          margin: 5px 0;
          color: #34495e;
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
          width: 500px;
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
        .modal-content textarea {
          min-height: 100px;
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
          .faq-question {
            flex-direction: column;
            align-items: flex-start;
          }
          .faq-meta {
            flex-direction: column;
            gap: 5px;
          }
          .faq-actions {
            flex-direction: column;
            gap: 5px;
            width: 100%;
          }
          .view-btn, .edit-btn, .delete-btn {
            width: 100%;
            justify-content: center;
          }
          .modal-content {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ;