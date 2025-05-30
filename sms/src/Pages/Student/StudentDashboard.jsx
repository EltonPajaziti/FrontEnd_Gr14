import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentSidebar from "../../Components/Student/StudentSidebar";
import '../../CSS/Student/StudentDashboard.css';
import StudentHeader from "../../Components/Student/StudentHeader";
import "../../CSS/Admin/AdminDashboard.css";
import "../../CSS/Student/StudentDashboard.css";


function StudentDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get(`http://localhost:8080/api/students/by-user/${userId}`)
        .then(res => {
          const studentId = res.data.id;
          const fullName = `${res.data.user.firstName} ${res.data.user.lastName}`;
          localStorage.setItem("studentId", studentId);
          setStudentName(fullName);
        })
        .catch(err => {
          console.error("Nuk u gjet studenti:", err);
        });
    } else {
      alert("User nuk është i kyçur.");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
              <div className="dashboard-header">
                <div>
                  <h1>Student Dashboard</h1>
                  <p>Menaxhoni kurset, orarin dhe notat tuaja</p>
                </div>
                <button className="today-button">Orari i Sotëm</button>
              </div>

              <div className="dashboard-summary">
                <div className="summary-card">
                  <p>Kurset e Mia</p>
                  <h2>6</h2>
                  <span>Semestri i dytë, 2024</span>
                </div>
                <div className="summary-card">
                  <p>Nota Mesatare</p>
                  <h2>8.7</h2>
                  <span className="positive">↑ 0.2 nga semestri i kaluar</span>
                </div>
                <div className="summary-card">
                  <p>Provimet e Ardhshme</p>
                  <h2>4</h2>
                  <span>I pari: 20 maj, 2024</span>
                </div>
                <div className="summary-card">
                  <p>Kredite</p>
                  <h2>85/180</h2>
                  <span>47% e përfunduar</span>
                </div>
              </div>

              <div className="dashboard-content">
                <div className="courses-section">
                  <div className="courses-header">
                    <h3>Kurset Aktuale</h3>
                    <button className="view-all">Shiko të gjitha</button>
                  </div>

                  <div className="courses-grid">
                    <div className="course-card">
                      <h4>Sisteme të Shpërndara</h4>
                      <p>CS404 • Prof. Dr. Smith</p>
                      <span className="time-label">E Hënë, 10:00</span>
                      <div className="card-buttons">
                        <button className="materialet">Materialet</button>
                        <button className="detyra">Detyrat</button>
                      </div>
                    </div>

                    <div className="course-card">
                      <h4>Programim i Avancuar</h4>
                      <p>CS302 • Prof. Dr. Johnson</p>
                      <span className="time-label">E Martë, 14:00</span>
                      <div className="card-buttons">
                        <button className="materialet">Materialet</button>
                        <button className="detyra">Detyrat</button>
                      </div>
                    </div>

                    <div className="course-card">
                      <h4>Programim në Web</h4>
                      <p>CS305 • Prof. Dr. Williams</p>
                      <span className="time-label">E Mërkurë, 12:00</span>
                      <div className="card-buttons">
                        <button className="materialet">Materialet</button>
                        <button className="detyra">Detyrat</button>
                      </div>
                    </div>

                    <div className="course-card">
                      <h4>Inteligjenca Artificiale</h4>
                      <p>CS501 • Prof. Dr. Brown</p>
                      <span className="time-label">E Enjte, 15:30</span>
                      <div className="card-buttons">
                        <button className="materialet">Materialet</button>
                        <button className="detyra">Detyrat</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grades-section">
                  <h3>Notat e Fundit</h3>
                  <ul>
                    <div className="SSH">
                      <li><span>Sisteme të Shpërndara</span><span className="grade">9</span></li>
                    </div>
                    <div className="PA">
                      <li><span>Programim i Avancuar</span><span className="grade">8</span></li>
                    </div>
                    <div className="PW">
                      <li><span>Programim në Web</span><span className="grade">10</span></li>
                    </div>
                    <div className="AI">
                      <li><span>Inteligjenca Artificiale</span><span className="grade">7</span></li>
                    </div>
                  </ul>
                  <button className="view-all-grades">Shiko të gjitha notat</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
