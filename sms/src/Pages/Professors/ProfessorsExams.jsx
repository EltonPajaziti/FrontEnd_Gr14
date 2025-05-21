import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from "../../Components/Professor/ProfessorsSidebar";
import Header from "../../Components/Professor/ProfessorsHeader";

const initialExams = [
  {
    id: 1,
    course_id: 1,
    exam_period_id: 1,
    exam_date: '2025-06-01',
    start_time: '10:00:00',
    end_time: '12:00:00',
    room: 'C303',
    exam_type: 'FINAL',
    professor_id: 1,
    tenant_id: 4,
    created_at: '2025-05-16T23:26:00+02:00',
    updated_at: '2025-05-16T23:26:00+02:00',
  },
  {
    id: 2,
    course_id: 2,
    exam_period_id: 1,
    exam_date: '2025-06-02',
    start_time: '13:00:00',
    end_time: '15:00:00',
    room: 'B202',
    exam_type: 'PARCIAL',
    professor_id: 1,
    tenant_id: 4,
    created_at: '2025-05-16T23:26:00+02:00',
    updated_at: '2025-05-16T23:26:00+02:00',
  },
];

const ProfessorsExams = () => {
  const [exams, setExams] = useState(initialExams);
  const [formData, setFormData] = useState({
    course_id: '',
    exam_period_id: '',
    exam_date: '',
    start_time: '',
    end_time: '',
    room: '',
    exam_type: '',
    professor_id: '', // Mund të jetë i lexuar nga localStorage ose API
    tenant_id: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [professorName, setProfessorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userId = localStorage.getItem('userId') || '1'; // Merr ID e profesorit nga localStorage
  const tenantId = localStorage.getItem('tenantId') || '4'; // Merr tenantId nga localStorage

  const API_URL = `http://localhost:8080/api/exams?professor_id=${userId}`;
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';
  const COURSE_API_URL = 'http://localhost:8080/api/courses';
  const EXAM_PERIOD_API_URL = 'http://localhost:8080/api/exam-periods';
  const PROFESSOR_API_URL = `http://localhost:8080/api/professors/${userId}`; // API për të dhënat e profesorit
  const TENANT_API_URL = `http://localhost:8080/api/faculties/${tenantId}`;

  const [courses, setCourses] = useState([]);
  const [examPeriods, setExamPeriods] = useState([]);
  const [tenants, setTenants] = useState([]);

  const contentRef = useRef(null);

  const examTypes = ['PARCIAL', 'FINAL', 'RIMARRJE', 'SEMINAR', 'PROJEKT'];
  const timeSlots = ['08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00'];

  useEffect(() => {
    fetchData();
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (contentRef.current && savedScrollPosition) {
      contentRef.current.scrollTop = parseInt(savedScrollPosition, 10);
    }
  }, [userId, tenantId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examsResponse, authResponse, courseResponse, examPeriodResponse, professorResponse, tenantResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get(AUTH_API_URL),
        axios.get(COURSE_API_URL),
        axios.get(EXAM_PERIOD_API_URL),
        axios.get(PROFESSOR_API_URL),
        axios.get(TENANT_API_URL),
      ]);
      const fetchedExams = examsResponse.data.length > 0 ? examsResponse.data : initialExams;
      setExams(fetchedExams);
      setProfessorName(authResponse.data.firstName || authResponse.data.name || 'Professor');
      setCourses(courseResponse.data);
      setExamPeriods(examPeriodResponse.data);
      setTenants([tenantResponse.data]); // Vetëm tenant-i aktual
    } catch (error) {
      console.error('Error fetching data:', error);
      setExams(initialExams);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        sessionStorage.setItem('scrollPosition', contentRef.current.scrollTop);
      }
    };
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        course_id: parseInt(formData.course_id),
        exam_period_id: parseInt(formData.exam_period_id),
        exam_date: formData.exam_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room,
        exam_type: formData.exam_type,
        professor_id: parseInt(userId), // Vendos automatikisht ID e profesorit
        tenant_id: parseInt(tenantId), // Vendos automatikisht tenantId
      };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      course_id: item.course_id,
      exam_period_id: item.exam_period_id,
      exam_date: item.exam_date,
      start_time: item.start_time,
      end_time: item.end_time,
      room: item.room,
      exam_type: item.exam_type,
      professor_id: userId, // I lexuar nga localStorage
      tenant_id: tenantId,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('A je i sigurt që dëshiron të fshish këtë provim?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      course_id: '',
      exam_period_id: '',
      exam_date: '',
      start_time: '',
      end_time: '',
      room: '',
      exam_type: '',
      professor_id: userId,
      tenant_id: tenantId,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const adjustedHour = hourNum % 12 || 12;
    return `${adjustedHour}:${minute} ${period}`;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Duke ngarkuar provimet...</div>;
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <Sidebar professorName={professorName} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Header professorName={professorName} toggleSidebar={toggleSidebar} />
          <div className="page-container">
            <div className="content-container" ref={contentRef}>
              <div className="exams-container" style={{ position: 'relative' }}>
                <main className="exams-main">
                  <div className="header-section">
                    <h2>Provimet e Mia</h2>
                    <p>Planifikoni dhe menaxhoni provimet tuaja</p>
                    <button className="add-button" onClick={() => setShowForm(true)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                      <FaPlus /> Shto Provim
                    </button>
                  </div>
                  <div className="exams-content">
                    <h3>Provimet e Ardhshme</h3>
                    <p>Të gjitha provimet e planifikuara për semestrin aktual</p>
                    <table className="exams-table">
                      <thead>
                        <tr>
                          <th>Kursi</th>
                          <th>Periudha e Provimit</th>
                          <th>Data</th>
                          <th>Koha</th>
                          <th>Salla</th>
                          <th>Lloji i Provimit</th>
                          <th>Fakulteti</th>
                          <th>Veprimet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exams.length === 0 ? (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                              Nuk u gjetën provime të ardhshme<br />Nuk ka provime të planifikuara aktualisht
                            </td>
                          </tr>
                        ) : (
                          exams.map((exam) => (
                            <tr key={exam.id}>
                              <td>{courses.find(c => c.id === exam.course_id)?.name || 'N/A'}</td>
                              <td>{examPeriods.find(ep => ep.id === exam.exam_period_id)?.name || 'N/A'}</td>
                              <td>{exam.exam_date}</td>
                              <td>{`${formatTime(exam.start_time)} - ${formatTime(exam.end_time)}`}</td>
                              <td>{exam.room || 'N/A'}</td>
                              <td>{exam.exam_type}</td>
                              <td>{tenants.find(t => t.id === exam.tenant_id)?.name || 'N/A'}</td>
                              <td>
                                <div className="exam-actions">
                                  <button className="edit-btn" onClick={() => handleEdit(exam)}>
                                    <FaEdit /> Redakto
                                  </button>
                                  <button className="delete-btn" onClick={() => handleDelete(exam.id)}>
                                    <FaTrash /> Fshi
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </main>

                {showForm && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>{editingId ? 'Redakto Provimin' : 'Planifiko Provim të Ri'}</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>Kursi*</label>
                          <select name="course_id" value={formData.course_id} onChange={handleInputChange} required>
                            <option value="">Zgjidh Kursin</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Periudha e Provimit*</label>
                          <select name="exam_period_id" value={formData.exam_period_id} onChange={handleInputChange} required>
                            <option value="">Zgjidh Periudhën</option>
                            {examPeriods.map((period) => (
                              <option key={period.id} value={period.id}>{period.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Data e Provimit*</label>
                          <input
                            type="date"
                            name="exam_date"
                            value={formData.exam_date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Koha e Fillimit*</label>
                          <select name="start_time" value={formData.start_time} onChange={handleInputChange} required>
                            <option value="">Zgjidh Kohën</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>{formatTime(time)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Koha e Përfundimit*</label>
                          <select name="end_time" value={formData.end_time} onChange={handleInputChange} required>
                            <option value="">Zgjidh Kohën</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>{formatTime(time)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Salla</label>
                          <input
                            type="text"
                            name="room"
                            value={formData.room}
                            onChange={handleInputChange}
                            placeholder="Salla (Opsionale)"
                          />
                        </div>
                        <div className="form-group">
                          <label>Lloji i Provimit*</label>
                          <select name="exam_type" value={formData.exam_type} onChange={handleInputChange} required>
                            <option value="">Zgjidh Llojin</option>
                            {examTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Fakulteti*</label>
                          <select name="tenant_id" value={formData.tenant_id} onChange={handleInputChange} required>
                            <option value="">Zgjidh Fakultetin</option>
                            {tenants.map((tenant) => (
                              <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-actions">
                          <button type="button" className="cancel-btn" onClick={resetForm}>
                            Anulo
                          </button>
                          <button type="submit" className="save-btn">
                            Ruaj
                          </button>
                        </div>
                      </form>
                    </div>
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
          background: #eef2f7;
          font-family: 'Arial', sans-serif;
        }
        .content-container {
          flex: 1;
          padding: 20px;
          min-height: 100vh;
          overflow-y: auto;
          transition: margin-left 0.3s;
        }
        .exams-container {
          position: relative;
          display: flex;
          min-height: calc(100% - 40px);
          flex-direction: column;
          padding: 0.5rem;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .exams-main {
          flex: 1;
          position: relative;
          overflow-y: auto;
        }
        .header-section {
          margin-bottom: 1rem;
          position: relative;
          text-align: left;
          padding: 10px;
          background: #eef2f7;
          border-bottom: 1px solid #ddd;
        }
        .header-section h2 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin: 0;
        }
        .header-section p {
          color: #7f8c8d;
          margin: 5px 0;
          font-size: 0.9rem;
        }
        .add-button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.9rem;
        }
        .add-button:hover {
          background: #357abd;
        }
        .exams-content {
          padding: 1rem;
          background: #f9fbfd;
          border-radius: 8px;
          min-height: 300px;
        }
        .exams-content h3 {
          font-size: 1.2rem;
          color: #4a90e2;
          margin-bottom: 0.5rem;
        }
        .exams-content p {
          color: #7f8c8d;
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
        }
        .exams-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
          background: white;
        }
        .exams-table th {
          background: #eef2f7;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #ddd;
          font-size: 0.9rem;
        }
        .exams-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
          color: #34495e;
          font-size: 0.9rem;
          vertical-align: middle;
        }
        .exam-actions {
          display: flex;
          gap: 0.5rem;
        }
        .edit-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.8rem;
          color: #4a90e2;
        }
        .edit-btn:hover {
          background: rgba(74, 144, 226, 0.1);
        }
        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.8rem;
          color: #e74c3c;
        }
        .delete-btn:hover {
          background: rgba(231, 76, 60, 0.1);
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .modal-content h3 {
          margin: 0 0 1rem;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: 600;
          color: #34495e;
          font-size: 0.9rem;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        .cancel-btn {
          background: #f1f1f1;
          color: #34495e;
          border: 1px solid #ddd;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .cancel-btn:hover {
          background: #e0e0e0;
        }
        .save-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .save-btn:hover {
          background: #357abd;
        }
        @media (max-width: 768px) {
          .exams-table th,
          .exams-table td {
            padding: 0.5rem;
            font-size: 0.8rem;
          }
          .modal-content {
            max-width: 90%;
            padding: 1rem;
          }
          .form-group input,
          .form-group select {
            padding: 0.4rem;
            font-size: 0.8rem;
          }
          .form-actions {
            flex-direction: column;
          }
          .save-btn,
          .cancel-btn {
            width: 100%;
            padding: 0.4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessorsExams;