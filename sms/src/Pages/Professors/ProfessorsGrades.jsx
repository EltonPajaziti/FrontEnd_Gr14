import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import Sidebar from "../../Components/Professor/ProfessorsSidebar";
import Header from "../../Components/Professor/ProfessorsHeader";

const ProfessorsGrades = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);

  const initialGrades = [
    {
      id: 1,
      student_id: 101,
      student_name: "Arben Gashi",
      academic_year_id: 2024,
      academic_year_name: "2024-2025",
      grade_value: 8,
      graded_by: 1,
      graded_by_name: "Prof. Ilir Deda",
      graded_at: "2025-05-20",
      tenant_id: 4,
      tenant_name: "Fakulteti i Inxhinierisë",
      exam_id: 1,
      exam_type: "FINAL",
      course_name: "Matematikë 1",
    },
  ];

  const [gradeData, setGradeData] = useState(initialGrades);

  const userId = localStorage.getItem('userId') || '1';
  const tenantId = localStorage.getItem('tenantId') || '4';

  const API_URL = `http://localhost:8080/api/grades`;
  const COURSE_API_URL = `http://localhost:8080/api/courses?professor_id=${userId}`;
  const EXAM_API_URL = `http://localhost:8080/api/exams?professor_id=${userId}`;
  const STUDENT_API_URL = `http://localhost:8080/api/students`;
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';
  const ACADEMIC_YEAR_API_URL = 'http://localhost:8080/api/academic-years';

  const contentRef = useRef(null);

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
      const [gradeResponse, courseResponse, examResponse, academicYearResponse, authResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get(COURSE_API_URL),
        axios.get(EXAM_API_URL),
        axios.get(ACADEMIC_YEAR_API_URL),
        axios.get(AUTH_API_URL),
      ]);
      const fetchedGrades = gradeResponse.data.length > 0 ? gradeResponse.data : initialGrades;
      setGradeData(fetchedGrades);
      setCourses(courseResponse.data);
      setExams(examResponse.data);
      setAcademicYears(academicYearResponse.data);
      setProfessorName(authResponse.data.firstName || authResponse.data.name || 'Professor');
    } catch (error) {
      console.error('Error fetching data:', error);
      setGradeData(initialGrades);
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

  const fetchStudentsAndGrades = async () => {
    if (selectedCourse && selectedExam && selectedAcademicYear) {
      setStudentLoading(true);
      try {
        const studentResponse = await axios.get(`${STUDENT_API_URL}?course_id=${selectedCourse}`);
        setStudents(studentResponse.data);

        const gradeResponse = await axios.get(`${API_URL}?exam_id=${selectedExam}&academic_year_id=${selectedAcademicYear}`);
        const gradesData = gradeResponse.data.reduce((acc, grade) => {
          acc[grade.student_id] = grade.grade_value;
          return acc;
        }, {});
        setGrades(gradesData);
      } catch (error) {
        console.error('Error fetching students or grades:', error);
        setStudents([]);
        setGrades({});
      } finally {
        setStudentLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStudentsAndGrades();
  }, [selectedCourse, selectedExam, selectedAcademicYear]);

  const handleGradeChange = (studentId, value) => {
    const gradeValue = value === '' ? null : parseInt(value);
    if (gradeValue !== null && (gradeValue < 5 || gradeValue > 10)) {
      alert('Nota duhet të jetë mes 5 dhe 10!');
      return;
    }
    setGrades({ ...grades, [studentId]: gradeValue });
  };

  const handleDeleteGrade = async (studentId) => {
    if (confirm('A jeni i sigurt që dëshironi të fshini këtë notë?')) {
      try {
        const existingGrade = (await axios.get(`${API_URL}?student_id=${studentId}&exam_id=${selectedExam}&academic_year_id=${selectedAcademicYear}`)).data;
        if (existingGrade.length > 0) {
          await axios.delete(`${API_URL}/${existingGrade[0].id}`);
          const updatedGrades = { ...grades };
          delete updatedGrades[studentId];
          setGrades(updatedGrades);
          fetchStudentsAndGrades();
          fetchData();
          alert('Nota u fshi me sukses!');
        }
      } catch (error) {
        console.error('Error deleting grade:', error);
        alert('Gabim gjatë fshirjes së notës!');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !selectedExam || !selectedAcademicYear) {
      alert('Ju lutem zgjidhni kursin, provimin dhe vitin akademik!');
      return;
    }

    if (!confirm('A jeni i sigurt që dëshironi të ruani notat?')) return;

    try {
      const gradePromises = Object.keys(grades).map(async (studentId) => {
        const gradeValue = grades[studentId];
        if (gradeValue === null) return;

        const existingGrade = (await axios.get(`${API_URL}?student_id=${studentId}&exam_id=${selectedExam}&academic_year_id=${selectedAcademicYear}`)).data;

        const gradeData = {
          student_id: parseInt(studentId),
          academic_year_id: parseInt(selectedAcademicYear),
          grade_value: gradeValue,
          graded_by: parseInt(userId),
          graded_at: new Date().toISOString().split('T')[0],
          tenant_id: parseInt(tenantId),
          exam_id: parseInt(selectedExam),
        };

        if (existingGrade.length > 0) {
          return axios.put(`${API_URL}/${existingGrade[0].id}`, gradeData);
        } else {
          return axios.post(API_URL, gradeData);
        }
      });

      await Promise.all(gradePromises.filter(promise => promise));
      alert('Notat u ruajtën me sukses!');
      fetchStudentsAndGrades();
      fetchData();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Gabim gjatë ruajtjes së notave!');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Duke ngarkuar të dhënat...</div>;
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
              <div className="grades-container">
                <main className="grades-main">
                  <div className="header-section">
                    <h2>Vendosja e Notave</h2>
                    <p>Shikoni dhe menaxhoni notat e studentëve</p>
                    <button
                      className="add-button"
                      onClick={() => setShowForm(true)}
                      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                    >
                      <FaPlus /> Vendos Nota
                    </button>
                  </div>

                  <div className="grades-content">
                    <h3>Notat e Vendosura</h3>
                    <p>Të gjitha notat e vendosura për studentët</p>
                    <table className="grades-table">
                      <thead>
                        <tr>
                          <th>Studenti</th>
                          <th>Kursi</th>
                          <th>Provimi</th>
                          <th>Viti Akademik</th>
                          <th>Nota</th>
                          <th>Vendosur nga</th>
                          <th>Data e Vlerësimit</th>
                          <th>Fakulteti</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradeData.length === 0 ? (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                              Nuk u gjetën nota të regjistruara<br />Nuk ka nota të vendosura aktualisht
                            </td>
                          </tr>
                        ) : (
                          gradeData.map((grade) => (
                            <tr key={grade.id}>
                              <td>{grade.student_name || 'N/A'}</td>
                              <td>{grade.course_name || 'N/A'}</td>
                              <td>{grade.exam_type || 'N/A'}</td>
                              <td>{grade.academic_year_name || 'N/A'}</td>
                              <td>{grade.grade_value || 'N/A'}</td>
                              <td>{grade.graded_by_name || 'N/A'}</td>
                              <td>{grade.graded_at || 'N/A'}</td>
                              <td>{grade.tenant_name || 'N/A'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {showForm && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <h3>Vendos Notat <button className="close-btn" onClick={() => setShowForm(false)}><FaTimes /></button></h3>
                        
                        <div className="form-group">
                          <label>Kursi*</label>
                          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                            <option value="">Zgjidh Kursin</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Provimi*</label>
                          <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} required>
                            <option value="">Zgjidh Provimin</option>
                            {exams
                              .filter((exam) => exam.course_id === parseInt(selectedCourse))
                              .map((exam) => (
                                <option key={exam.id} value={exam.id}>
                                  {exam.exam_type} - {exam.exam_date}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Viti Akademik*</label>
                          <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)} required>
                            <option value="">Zgjidh Vitin Akademik</option>
                            {academicYears.map((year) => (
                              <option key={year.id} value={year.id}>{year.name}</option>
                            ))}
                          </select>
                        </div>

                        {studentLoading ? (
                          <p style={{ textAlign: 'center', padding: '20px' }}>Duke ngarkuar studentët...</p>
                        ) : selectedCourse && selectedExam && selectedAcademicYear && (
                          <>
                            <h4>Studentët e Regjistruar</h4>
                            <p>Vendosni notat për secilin student (5-10)</p>
                            <table className="grades-table">
                              <thead>
                                <tr>
                                  <th>Studenti</th>
                                  <th>Nota</th>
                                  <th>Aksion</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.length === 0 ? (
                                  <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                                      Nuk u gjetën studentë të regjistruar në këtë kurs
                                    </td>
                                  </tr>
                                ) : (
                                  students.map((student) => (
                                    <tr key={student.id}>
                                      <td>{student.name || 'N/A'}</td>
                                      <td>
                                        <input
                                          type="number"
                                          min="5"
                                          max="10"
                                          value={grades[student.id] || ''}
                                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                          placeholder="Nota (5-10)"
                                          style={{ width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                        />
                                      </td>
                                      <td>
                                        <button
                                          onClick={() => handleDeleteGrade(student.id)}
                                          style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                          <FaTrash />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                            {students.length > 0 && (
                              <div className="form-actions">
                                <button className="cancel-btn" onClick={() => setShowForm(false)}>
                                  <FaTimes /> Anulo
                                </button>
                                <button className="save-btn" onClick={handleSubmit}>
                                  <FaSave /> Ruaj Notat
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </main>
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
        .grades-container {
          position: relative;
          display: flex;
          min-height: calc(100% - 40px);
          flex-direction: column;
          padding: 0.5rem;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .grades-main {
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
        .grades-content {
          padding: 1rem;
          background: #f9fbfd;
          border-radius: 8px;
          min-height: 300px;
        }
        .grades-content h3 {
          font-size: 1.2rem;
          color: #4a90e2;
          margin-bottom: 0.5rem;
        }
        .grades-content p {
          color: #7f8c8d;
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
        }
        .grades-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
          background: white;
        }
        .grades-table th {
          background: #eef2f7;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #ddd;
          font-size: 0.9rem;
        }
        .grades-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
          color: #34495e;
          font-size: 0.9rem;
          vertical-align: middle;
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
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .modal-content h3 {
          margin: 0 0 1rem;
          color: #2c3e50;
          font-size: 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #e74c3c;
          cursor: pointer;
        }
        .close-btn:hover {
          color: #c0392b;
        }
        .modal-content h4 {
          font-size: 1.1rem;
          color: #4a90e2;
          margin-bottom: 0.5rem;
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
          margin-top: 1rem;
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
          display: flex;
          align-items: center;
          gap: 0.2rem;
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
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }
        .save-btn:hover {
          background: #357abd;
        }
        @media (max-width: 768px) {
          .grades-table th,
          .grades-table td {
            padding: 0.5rem;
            font-size: 0.8rem;
          }
          .modal-content {
            max-width: 90%;
            padding: 1rem;
          }
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

export default ProfessorsGrades;