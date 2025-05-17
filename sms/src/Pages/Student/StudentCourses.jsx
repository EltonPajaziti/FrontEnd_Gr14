import React, { useState } from "react";
import StudentSidebar from "../../Components/Student/StudentSidebar";
import StudentHeader from "../../Components/Student/StudentHeader";
import "../../CSS/Admin/AdminDashboard.css";
import "../../CSS/Student/StudentDashboard.css";
import "../../CSS/Student/StudentCourses.css";

const StudentCourses = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState(""); // "register" or "view"
  const [semester, setSemester] = useState("5");
  const [showCourses, setShowCourses] = useState(false);
  const studentName = "Student Johnson";

  const registeredCourses = [
    {
      id: 1,
      code: "CS305",
      name: "Programim në Web",
      professor: "Prof. Dr. Williams",
      credits: 3,
    },
    {
      id: 2,
      code: "CS302",
      name: "Programim i Avancuar",
      professor: "Prof. Dr. Johnson",
      credits: 4,
    },
  ];

  const availableCourses = [
    {
      id: 1,
      code: "CS101",
      name: "Hyrje në Shkencat Kompjuterike",
      professor: "Prof. Dr. Jane Smith",
      credits: 3,
      semester: "5",
    },
    {
      id: 2,
      code: "MATH201",
      name: "Kalkulusi II",
      professor: "Prof. Dr. Robert Johnson",
      credits: 4,
      semester: "6",
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearchCourses = () => {
    setShowCourses(true);
  };

  const filteredCourses = availableCourses.filter((c) => c.semester === semester);

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <StudentSidebar isSidebarOpen={isSidebarOpen} />
        </div>

        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <StudentHeader studentName={studentName} toggleSidebar={toggleSidebar} />

          <div className="page-container">
            <div className="content-container student-courses-container">
              <h2 className="section-title">Kurset</h2>

              <div className="button-group">
                <button className="register-btn" onClick={() => setViewMode("register")}>
                  Regjistro Kurs
                </button>
                <button className="view-btn" onClick={() => setViewMode("view")}>
                  Shiko Kurset
                </button>
              </div>

              {viewMode === "register" && (
                <div className="course-registration">
                  <h3 className="subtitle">Regjistrohu në kurset e semestrit</h3>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                      <option value="5">Semestri i pestë</option>
                      <option value="6">Semestri i gjashtë</option>
                    </select>
                    <button className="search-btn" onClick={handleSearchCourses}>
                      Kërko
                    </button>
                  </div>

                  {showCourses && (
                    <div className="course-grid">
                      {filteredCourses.map((course) => (
                        <div className="course-card" key={course.id}>
                          <div className="course-code">{course.code}</div>
                          <div className="course-name">{course.name}</div>
                          <div className="credit-badge">{course.credits} Kredite</div>
                          <div className="course-details">
                            <strong>Profesori:</strong> {course.professor}
                          </div>
                          <button className="enroll-btn">Regjistrohu</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {viewMode === "view" && (
                <div className="course-view">
                  <h3 className="subtitle">Kurset e mia të regjistruara</h3>
                  <div className="course-grid">
                    {registeredCourses.map((course) => (
                      <div className="course-card" key={course.id}>
                        <div className="course-code">{course.code}</div>
                        <div className="course-name">{course.name}</div>
                        <div className="credit-badge">{course.credits} Kredite</div>
                        <div className="course-details">
                          <strong>Profesori:</strong> {course.professor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
