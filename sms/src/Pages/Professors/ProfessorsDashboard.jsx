import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Professors/ProfessorSidebar";
import Header from "../../Components/Professors/ProfessorHeader";
import StatsCard from "../../Components/Admin/StatsCard";
import '../../CSS/Professors/ProfessorsDashboard.css';

const ProfessorDashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [professorName, setProfessorName] = useState("Professor User");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const getGreeting = () => {
    const currentHour = currentTime.getHours();
    if (currentHour < 12) return "Mirëmëngjes";
    if (currentHour < 18) return "Mirëdita";
    return "Mirëmbrëma";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId");
    const token = localStorage.getItem("token");

    console.log("tenantId:", tenantId, "token:", token); // Debug

    if (!tenantId || !token) {
      console.log("Missing tenantId or token, redirecting to /");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Fetching student count...");
        const studentResponse = await fetch(`/api/professors/students/count/${tenantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!studentResponse.ok) throw new Error(`HTTP error! status: ${studentResponse.status}`);
        const studentData = await studentResponse.json();
        console.log("Student data:", studentData);
        setStudentCount(studentData.count || 0);

        console.log("Fetching course count...");
        const courseResponse = await fetch(`/api/professors/courses/count/${tenantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!courseResponse.ok) throw new Error(`HTTP error! status: ${courseResponse.status}`);
        const courseData = await courseResponse.json();
        console.log("Course data:", courseData);
        setCourseCount(courseData.count || 0);

        console.log("Fetching user data...");
        const userResponse = await fetch("http://localhost:8080/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error(`HTTP error! status: ${userResponse.status}`);
        const userData = await userResponse.json();
        console.log("User data:", userData);
        setProfessorName(userData.firstName || userData.name || "Professor User");
      } catch (error) {
        console.error("Fetch error:", error.message);
        setProfessorName("Professor User");
        setStudentCount(0);
        setCourseCount(0);
      }
    };

    fetchData();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <Sidebar professorName={professorName} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Header
            professorName={professorName}
            toggleSidebar={toggleSidebar}
            notificationCount={0}
          />
          <div className="professor-dashboard">
            <div className="professor-dashboard-header">
              <div>
                <h2>{getGreeting()}, {professorName}</h2>
                <p>Menaxho kurset dhe studentët tuaj</p>
              </div>
            </div>
            <div className="stats-grid">
              <StatsCard
                title="Totali i Studentëve"
                value={studentCount}
                info="Studentët e regjistruar në kurset tuaja"
              />
              <StatsCard
                title="Kurset Aktive"
                value={courseCount}
                info="Kurset që ju ligjëroni"
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;