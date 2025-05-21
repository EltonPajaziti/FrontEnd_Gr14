import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentSidebar from "../../Components/Student/StudentSidebar";
import StudentHeader from "../../Components/Student/StudentHeader";
import "../../CSS/Admin/AdminDashboard.css";
import "../../CSS/Student/StudentDashboard.css";
import "../../CSS/Student/StudentCourses.css";

const StudentCourses = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("");
  const [semester, setSemester] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [showCourses, setShowCourses] = useState(false);

  const studentId = localStorage.getItem("studentId");
  const tenantId = localStorage.getItem("tenantId");
  const token = localStorage.getItem("token");
  const studentName = "Student";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:8080/api/students/${studentId}`, authHeaders)
        .then((res) => {
          setYearOfStudy(res.data.yearOfStudy);
        })
        .catch((err) =>
          console.error("Gabim në marrjen e vitit të studimit:", err)
        );
    }
  }, [studentId]);

  const generateSemesterOptions = () => {
    const options = [];
    for (let i = 1; i <= yearOfStudy * 2; i++) {
      options.push(
        <option key={i} value={i}>
          Semestri {i}
        </option>
      );
    }
    return options;
  };

  const handleSearchCourses = () => {
    if (!semester || !studentId) return;

    axios
      .get(
        `http://localhost:8080/api/students/${studentId}/available-courses?semester=${semester}`,
        authHeaders
      )
      .then((res) => {
        setAvailableCourses(res.data);
        setShowCourses(true);
      })
      .catch((err) => {
        console.error("Gabim në marrjen e kurseve:", err);
      });
  };

  const handleEnroll = (courseId) => {
    const payload = {
      studentId: Number(studentId),
      courseId: Number(courseId),
      tenantId: Number(tenantId),
    };

    axios
      .post("http://localhost:8080/api/enrollments/register", payload, authHeaders)
      .then(() => {
        setAvailableCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
      })
      .catch((err) => {
        console.error("Gabim gjatë regjistrimit:", err);
      });
  };

  const handleViewCourses = () => {
    if (!studentId) return;
    axios
      .get(
        `http://localhost:8080/api/enrollments/student/${studentId}/registered-courses`,
        authHeaders
      )
      .then((res) => {
        setRegisteredCourses(res.data);
        setShowCourses(true);
      })
      .catch((err) => {
        console.error("Gabim në marrjen e kurseve të regjistruara:", err);
      });
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div
          className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}
        >
          <StudentSidebar isSidebarOpen={isSidebarOpen} />
        </div>

        <div
          className={`content-wrapper ${
            isSidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <StudentHeader
            studentName={studentName}
            toggleSidebar={toggleSidebar}
          />

          <div className="page-container">
            <div className="content-container student-courses-container">
              <h2 className="section-title">Kurset</h2>

              <div className="button-group">
                <button
                  className="register-btn"
                  onClick={() => {
                    setViewMode("register");
                    setRegisteredCourses([]);
                    setShowCourses(false);
                  }}
                >
                  Regjistro Kurs
                </button>
                <button
                  className="view-btn"
                  onClick={() => {
                    setViewMode("view");
                    handleViewCourses();
                  }}
                >
                  Shiko Kurset
                </button>
              </div>

              {viewMode === "register" && (
                <div className="course-registration">
                  <h3 className="subtitle">Regjistrohu në kurset e semestrit</h3>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                      <option value="">Zgjedh semestrin</option>
                      {generateSemesterOptions()}
                    </select>
                    <button className="search-btn" onClick={handleSearchCourses}>
                      Kërko
                    </button>
                  </div>

                  {showCourses && (
                    <div className="course-grid">
                      {availableCourses.length === 0 ? (
                        <p>Nuk ka kurse të disponueshme për këtë semestër.</p>
                      ) : (
                        availableCourses.map((course) => (
                          <div className="course-card" key={course.id}>
                            <div className="course-code">{course.code}</div>
                            <div className="course-name">{course.name}</div>
                            <div className="credit-badge">{course.credits} Kredite</div>
                            <div className="course-details">
                              <strong>Profesori:</strong> {course.professorName || "N/A"}
                            </div>
                            <button className="enroll-btn" onClick={() => handleEnroll(course.id)}>
                              Regjistrohu
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {viewMode === "view" && (
                <div className="course-view">
                  <h3 className="subtitle">Kurset e mia të regjistruara</h3>
                  <div className="course-grid">
                    {registeredCourses.length === 0 ? (
                      <p>Ende nuk je regjistruar në ndonjë kurs.</p>
                    ) : (
                      registeredCourses.map((course) => (
                        <div className="course-card" key={course.courseId}>
                          <div className="course-code">{course.code}</div>
                          <div className="course-name">{course.name}</div>
                          <div className="credit-badge">{course.credits} Kredite</div>
                          <div className="course-details">
                            <strong>Profesori:</strong> {course.professorName || "N/A"}
                          </div>
                        </div>
                      ))
                    )}
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
