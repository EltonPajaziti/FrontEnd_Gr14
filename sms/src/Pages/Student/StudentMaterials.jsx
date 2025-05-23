import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentSidebar from "../../Components/Student/StudentSidebar";
import StudentHeader from "../../Components/Student/StudentHeader";
import "../../CSS/Admin/AdminDashboard.css";
import "../../CSS/Student/StudentDashboard.css";
import "../../CSS/Student/StudentMaterials.css";

const StudentMaterials = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [semester, setSemester] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedCourseInfo, setSelectedCourseInfo] = useState(null);
  const [yearOfStudy, setYearOfStudy] = useState(1);

  const studentName = "Student Johnson";
  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:8080/api/students/${studentId}`, authHeaders)
        .then((res) => {
          setYearOfStudy(res.data.yearOfStudy);
        })
        .catch((err) =>
          console.error("Gabim në marrjen e vitit të studimeve:", err)
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

  useEffect(() => {
    if (semester && studentId) {
      axios
        .get(
          `http://localhost:8080/api/enrollments/student/${studentId}/courses-by-semester?semester=${semester}`,
          authHeaders
        )
        .then((res) => {
          setCourses(res.data);
          setSelectedCourseId("");
          setShowSummary(false);
          setShowTable(false);
        })
        .catch((err) => {
          console.error("Gabim në marrjen e kurseve:", err);
        });
    }
  }, [semester, studentId]);

  const fetchMaterials = () => {
    const selectedCourse = courses.find(
      (course) => course.id.toString() === selectedCourseId
    );
    setSelectedCourseInfo(selectedCourse);
    setShowSummary(true);
    setShowTable(false);
  };

  const loadMoreMaterials = () => {
    if (!selectedCourseId) return;

    axios
      .get(
        `http://localhost:8080/api/course-materials/by-course?courseId=${selectedCourseId}`,
        authHeaders
      )
      .then((res) => {
        setMaterials(res.data);
        setShowTable(true);
      })
      .catch((err) => {
        console.error("Gabim në marrjen e materialeve:", err);
      });
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
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
            <div className="content-container">
              <h2 className="section-title"> Shkarko materialet mësimore</h2>

              <div className="filter-section">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">Zgjedh semestrin</option>
                  {generateSemesterOptions()}
                </select>

                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">Zgjedh lëndën</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>

                <button className="search-btn" onClick={fetchMaterials}>
                  Kërko
                </button>
              </div>

              {showSummary && selectedCourseInfo && (
                <div className="course-summary-box">
                  <table className="summary-table">
                    <thead>
                      <tr>
                        <th>Lënda</th>
                        <th>Profesori</th>
                        <th>Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ color: "green", fontWeight: "bold" }}>
                          {selectedCourseInfo.name} - ({selectedCourseInfo.code})
                        </td>
                        <td>{selectedCourseInfo.professorName}</td>
                        <td>
                          <button
                            className="expand-btn"
                            onClick={loadMoreMaterials}
                          >
                            Më shumë...
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {showTable && materials.length > 0 && (
                <div className="materials-table-container">
                  <table className="materials-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Upload Date</th>
                        <th>File</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((material) => (
                        <tr key={material.id}>
                          <td>{material.title}</td>
                          <td>{material.description}</td>
                          <td>
                            {new Date(material.uploadedAt).toLocaleString()}
                          </td>
                          <td>
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {material.fileUrl}
                            </a>
                          </td>
                          <td>
                            <a href={material.fileUrl} download>
                              <button className="download-btn">Download</button>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMaterials;
