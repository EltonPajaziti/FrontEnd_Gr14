import React, { useState, useEffect } from "react";
import StudentSidebar from "../../Components/Student/StudentSidebar";
import StudentHeader from "../../Components/Student/StudentHeader";
import "../../CSS/Admin/AdminDashboard.css";
import "../../CSS/Student/StudentDashboard.css";
import "../../CSS/Student/StudentExams.css";

const StudentExams = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(""); // fillimisht bosh
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedResultPeriod, setSelectedResultPeriod] = useState("");

  const studentName = "Student Johnson";

  const [notGradedCourses, setNotGradedCourses] = useState([]);
  const [examResults, setExamResults] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setNotGradedCourses([
      { id: 1, name: "Programim në Web", professor: "Ardian Bajrami" },
      { id: 2, name: "Sisteme të Shpërndara", professor: "Blerta Krasniqi" },
    ]);

    setExamResults([
      {
        id: 1,
        course: "Rrjetet Kompjuterike",
        professor: "Blerim Rexha",
        gradedAt: "2025-02-14",
        grade: 10,
        status: "Nota ka kaluar në transkript"
      },
      {
        id: 2,
        course: "Mikroprocesorët",
        professor: "Lavdim Kurtaj",
        gradedAt: "2025-02-12",
        grade: 10,
        status: "Nota ka kaluar në transkript"
      },
      {
        id: 3,
        course: "Testimi i softuerit",
        professor: "Vigan Raça",
        gradedAt: "2025-03-14",
        grade: 8,
        status: "Nota është refuzuar"
      }
    ]);
  }, []);

  const handleRegisterExam = (courseId) => {
    alert(`Provimi për lëndën me ID ${courseId} u paraqit me sukses!`);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <StudentSidebar isSidebarOpen={isSidebarOpen} />
        </div>

        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <StudentHeader studentName={studentName} toggleSidebar={toggleSidebar} />

          <div className="page-container student-exams-page">
            <div className="content-container">
              <div className="exam-buttons-initial">
                <button
                  className={activeTab === "register" ? "active" : ""}
                  onClick={() => setActiveTab("register")}
                >
                  Paraqit provimet
                </button>
                <button
                  className={activeTab === "results" ? "active" : ""}
                  onClick={() => setActiveTab("results")}
                >
                  Rezultatet
                </button>
              </div>

              {/* ==================== PARAQITJA ==================== */}
              {activeTab === "register" && (
                <>
                  <h2 className="section-title">Paraqitja e Provimeve</h2>

                  <div className="filter-section">
                    <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                      <option value="">Zgjidh Afatin</option>
                      <option value="Afati Janarit">Afati i Janarit 2025</option>
                      <option value="Afati Qershorit">Afati i Qershorit 2025</option>
                    </select>
                  </div>

                  {selectedPeriod && (
                    <div className="exam-cards-container">
                      {notGradedCourses.map(course => (
                        <div key={course.id} className="exam-card">
                          <h3 className="course-title">{course.name}</h3>
                          <p><strong>Profesori:</strong> {course.professor}</p>
                          <button className="register-btn" onClick={() => handleRegisterExam(course.id)}>
                            Paraqit
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ==================== REZULTATET ==================== */}
              {activeTab === "results" && (
                <>
                  <h2 className="section-title">Rezultatet e Provimeve</h2>

                  <div className="filter-section">
                    <select value={selectedResultPeriod} onChange={(e) => setSelectedResultPeriod(e.target.value)}>
                      <option value="">Zgjidh Afatin</option>
                      <option value="Afati Janarit">Afati i Janarit 2025</option>
                      <option value="Afati Qershorit">Afati i Qershorit 2025</option>
                    </select>
                  </div>

                  {selectedResultPeriod && (
                    <div className="materials-table-container">
                      <table className="materials-table">
                        <thead>
                          <tr>
                            <th>Lënda</th>
                            <th>Profesori</th>
                            <th>Data e notës</th>
                            <th>Nota</th>
                            <th>Statusi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examResults.map(result => (
                            <tr key={result.id}>
                              <td>{result.course}</td>
                              <td>{result.professor}</td>
                              <td>{result.gradedAt}</td>
                              <td>{result.grade}</td>
                              <td className={result.status.includes("refuzuar") ? "rejected" : "accepted"}>
                                {result.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExams;
