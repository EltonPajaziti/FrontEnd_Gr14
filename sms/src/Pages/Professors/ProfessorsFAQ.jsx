import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaTrash, FaPlus, FaReply } from 'react-icons/fa';
import Sidebar from "../../Components/Professor/ProfessorsSidebar";
import Header from "../../Components/Professor/ProfessorsHeader";

// Sample initial data with some questions without answers
const initialFAQs = [
  { 
    id: 1,
    question: "How do I submit grades for my students?",
    answer: "You can submit grades through the Professors Grades section in the dashboard.",
    category: "Grades",
    isVisible: true,
    createdBy: { id: 1, name: "Prof. Ilir Deda" },
    createdAt: "2025-04-15T12:00:00",
    updatedAt: "2025-04-15T12:00:00",
    tenantID: { id: 4, name: "Fakulteti i Inxhinierisë" },
  },
  { 
    id: 2,
    question: "What is the deadline for grade submission?",
    answer: "", // Pyetje pa përgjigje
    category: "Grades",
    isVisible: true,
    createdBy: { id: 2, name: "Student Arben Gashi" }, // Supozojmë se pyetja vjen nga një student
    createdAt: "2025-04-18T14:30:00",
    updatedAt: "2025-04-18T14:30:00",
    tenantID: { id: 4, name: "Fakulteti i Inxhinierisë" },
  },
  { 
    id: 3,
    question: "How can I schedule an exam?",
    answer: "You can schedule an exam by contacting the faculty administration.",
    category: "Exams",
    isVisible: true,
    createdBy: { id: 1, name: "Prof. Ilir Deda" },
    createdAt: "2025-05-01T09:00:00",
    updatedAt: "2025-05-01T09:00:00",
    tenantID: { id: 4, name: "Fakulteti i Inxhinierisë" },
  },
  { 
    id: 4,
    question: "Where can I find the exam schedule?",
    answer: "", // Pyetje pa përgjigje
    category: "Exams",
    isVisible: true,
    createdBy: { id: 3, name: "Student Ema Berisha" },
    createdAt: "2025-05-02T10:00:00",
    updatedAt: "2025-05-02T10:00:00",
    tenantID: { id: 4, name: "Fakulteti i Inxhinierisë" },
  },
];

const ProfessorsFAQ = () => {
  const [faqs, setFaqs] = useState(initialFAQs);
  const [professorName, setProfessorName] = useState('Prof. Ilir Deda');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [replyFAQ, setReplyFAQ] = useState(null);

  const userId = localStorage.getItem('userId') || '1';
  const tenantId = localStorage.getItem('tenantId') || '4';

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
        answer: faq.answer || '',
        category: faq.category || 'Uncategorized',
        isVisible: faq.isVisible,
        createdBy: faq.createdBy || { id: 0, name: "Unknown" },
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
        tenantID: faq.tenantID || { id: 0, name: "Unknown Faculty" },
      }));
      setFaqs(mappedFAQs.length > 0 ? mappedFAQs : initialFAQs);
      setProfessorName(authResponse.data.firstName || authResponse.data.name || 'Professor');
    } catch (error) {
      console.error('Error fetching data:', error);
      setFaqs(initialFAQs);
    }
  };

  const categories = ['All', ...new Set(initialFAQs.map(faq => faq.category))];

  const handleToggleExpand = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleReply = (faq) => {
    setReplyFAQ(faq);
    setIsReplyModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('A jeni i sigurt që dëshironi të fshini këtë FAQ?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setFaqs(faqs.filter(faq => faq.id !== id));
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        alert('Gabim gjatë fshirjes së FAQ.');
      }
    }
  };

  const handleSaveReply = async () => {
    if (replyFAQ && replyFAQ.answer) {
      try {
        const updatedFAQ = { 
          ...replyFAQ, 
          answer: replyFAQ.answer,
          updatedAt: new Date().toISOString(),
          updatedBy: { id: parseInt(userId), name: professorName },
        };
        const response = await axios.put(`${API_URL}/${replyFAQ.id}`, updatedFAQ);
        setFaqs(faqs.map(faq => faq.id === replyFAQ.id ? response.data : faq));
        setIsReplyModalOpen(false);
        setReplyFAQ(null);
      } catch (error) {
        console.error('Error replying to FAQ:', error);
        alert('Gabim gjatë përgjigjes së FAQ.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReplyFAQ(prev => ({ ...prev, [name]: value }));
  };

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
          <div className="professor-faqs">
            <div className="faqs-container">
              <div className="faq-header">
                <h1>Pyetjet e Shpeshta për Profesorët</h1>
                <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
                  <FaPlus /> Përgjigju FAQ
                </button>
              </div>
              <div className="faq-filters">
                <label>Filtro sipas Kategorisë:</label>
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
                        <span>Kategoria: {faq.category}</span>
                        <span>Dukshme: {faq.isVisible ? 'Po' : 'Jo'}</span>
                      </div>
                      <div className="faq-actions">
                        <button className="view-btn" onClick={() => handleToggleExpand(faq.id)}>
                          <FaEye /> {expandedFAQ === faq.id ? 'Fshih' : 'Shiko'}
                        </button>
                        {faq.answer === "" && (
                          <button className="reply-btn" onClick={() => handleReply(faq)}>
                            <FaReply /> Përgjigju
                          </button>
                        )}
                        <button className="delete-btn" onClick={() => handleDelete(faq.id)}>
                          <FaTrash /> Fshi
                        </button>
                      </div>
                    </div>
                    {expandedFAQ === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer ? faq.answer : 'Nuk ka përgjigje ende.'}</p>
                        <p><strong>Krijuar nga:</strong> {faq.createdBy.name}</p>
                        <p><strong>Krijuar më:</strong> {new Date(faq.createdAt).toLocaleDateString('en-US')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Përgjigju një Pyetjeje Ekzistuese</h2>
            <label>
              Zgjidh Pyetjen:
              <select
                name="question"
                value={selectedFAQ ? selectedFAQ.question : ''}
                onChange={(e) => {
                  const selected = faqs.find(faq => faq.question === e.target.value);
                  setSelectedFAQ(selected);
                }}
              >
                <option value="">Zgjidh një pyetje</option>
                {faqs.filter(faq => faq.answer === "").map(faq => (
                  <option key={faq.id} value={faq.question}>{faq.question}</option>
                ))}
              </select>
            </label>
            {selectedFAQ && (
              <>
                <label>
                  Përgjigja:
                  <textarea
                    name="answer"
                    value={selectedFAQ.answer || ''}
                    onChange={(e) => setSelectedFAQ({ ...selectedFAQ, answer: e.target.value })}
                  />
                </label>
                <button
                  onClick={() => {
                    if (selectedFAQ && selectedFAQ.answer) {
                      setReplyFAQ(selectedFAQ);
                      handleSaveReply();
                      setIsAddModalOpen(false);
                    }
                  }}
                >
                  Përgjigju
                </button>
              </>
            )}
            <button onClick={() => setIsAddModalOpen(false)}>Anulo</button>
          </div>
        </div>
      )}
      {isReplyModalOpen && replyFAQ && (
        <div className="modal">
          <div className="modal-content">
            <h2>Përgjigju FAQ</h2>
            <label>
              Pyetja:
              <textarea
                name="question"
                value={replyFAQ.question}
                readOnly
              />
            </label>
            <label>
              Përgjigja:
              <textarea
                name="answer"
                value={replyFAQ.answer || ''}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSaveReply}>Ruaj Përgjigjen</button>
            <button onClick={() => setIsReplyModalOpen(false)}>Anulo</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .professor-faqs {
          padding: 20px;
          background: #eef2f7;
          min-height: 100vh;
        }
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
          background: #4a90e2;
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
          background: #357abd;
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
          color: #4a90e2;
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
        .view-btn, .reply-btn, .delete-btn {
          background: #4a90e2;
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
        .delete-btn {
          background: #e74c3c;
        }
        .reply-btn {
          background: #2ecc71;
        }
        .view-btn:hover {
          background: #357abd;
        }
        .delete-btn:hover {
          background: #c0392b;
        }
        .reply-btn:hover {
          background: #27ae60;
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
        .modal-content input, .modal-content textarea, .modal-content select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .modal-content textarea {
          min-height: 100px;
        }
        .modal-content button {
          background: #4a90e2;
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
          background: #357abd;
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
          .view-btn, .reply-btn, .delete-btn {
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

export default ProfessorsFAQ;