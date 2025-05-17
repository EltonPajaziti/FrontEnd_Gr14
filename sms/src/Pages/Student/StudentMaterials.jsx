import React, { useState, useEffect } from "react";
import StudentSidebar from "../../Components/Student/StudentSidebar";
import StudentHeader from "../../Components/Student/StudentHeader";
import "../../CSS/Admin/AdminDashboard.css";
import "../../CSS/Student/StudentDashboard.css";
import "../../CSS/Student/StudentMaterials.css";

const StudentMaterials = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [semester, setSemester] = useState("5");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedCourseInfo, setSelectedCourseInfo] = useState(null);
  const studentName = "Student Johnson";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setCourses([
      { id: 1, name: "Programim në Web", professor: "Ardian Bajrami" },
      { id: 2, name: "Sisteme të Shpërndara", professor: "Blerta Krasniqi" },
      { id: 3, name: "Inteligjenca Artificiale", professor: "Avni Rexhepi" },
    ]);
  }, []);

  const fetchMaterials = () => {
    const selectedCourse = courses.find(course => course.id.toString() === selectedCourseId);
    setSelectedCourseInfo(selectedCourse);
    setShowSummary(true);
    setShowTable(false);
  };

  const loadMoreMaterials = () => {
    const mockMaterials = [
      {
        id: 1,
        title: "Ushtrime JavaScript",
        description: "Seti i parë i ushtrimeve",
        uploaded_at: "2025-05-16T10:00:00",
        file_url: "https://example.com/ushtrime-js.pdf"
      },
      {
        id: 2,
        title: "Slides – JavaScript DOM",
        description: "Prezantimi i leksionit",
        uploaded_at: "2025-05-14T12:30:00",
        file_url: "https://example.com/dom-lecture.pdf"
      }
    ];
    setMaterials(mockMaterials);
    setShowTable(true);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <StudentSidebar isSidebarOpen={isSidebarOpen} />
        </div>

        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <StudentHeader studentName={studentName} toggleSidebar={toggleSidebar} />

          <div className="page-container">
            <div className="content-container">
              <h2 className="section-title">📚 Shkarko materialet mësimore</h2>

              <div className="filter-section">
                <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2023/2024">2023/2024</option>
                </select>

                <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="5">Semestri i pestë</option>
                  <option value="4">Semestri i katërt</option>
                </select>

                <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
                  <option value="">Zgjedh lëndën</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>

                <button className="search-btn" onClick={fetchMaterials}>Kërko</button>
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
                        <td style={{ color: 'green', fontWeight: 'bold' }}>
                          {selectedCourseInfo.name} - (07B04S0{selectedCourseInfo.id})
                        </td>
                        <td>{selectedCourseInfo.professor}</td>
                        <td>
                          <button className="expand-btn" onClick={loadMoreMaterials}>
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
                      {materials.map(material => (
                        <tr key={material.id}>
                          <td>{material.title}</td>
                          <td>{material.description}</td>
                          <td>{new Date(material.uploaded_at).toLocaleString()}</td>
                          <td>
                            <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                              {material.file_url}
                            </a>
                          </td>
                          <td>
                            {/* <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                              <button className="view-btn">View</button>
                            </a> */}
                            <a href={material.file_url} download>
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
