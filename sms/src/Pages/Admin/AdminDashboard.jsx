import React, { useEffect, useState } from "react";
import '../../CSS/Admin/AdminDashboard.css';
import Sidebar from "../../Components/Admin/Sidebar";
import StatsCard from "../../Components/Admin/StatsCard";
import { Link } from "react-router-dom";
import Header from "../../Components/Admin/Header";

function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [professorCount, setProfessorCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  const [adminName, setAdminName] = useState('Admin User');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getGreeting = () => {
    const currentHour = currentTime.getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId || !token) return;

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const fetchStats = async () => {
      try {
        const [studentsRes, professorsRes, coursesRes, departmentsRes] = await Promise.all([
          fetch(`/api/students/count/by-tenant/${tenantId}`, { headers }),
          fetch(`/api/professors/count/by-tenant/${tenantId}`, { headers }),
          fetch(`/api/courses/count/by-tenant/${tenantId}`, { headers }),
          fetch(`/api/departments/count/by-tenant/${tenantId}`, { headers }),
        ]);

        const [students, professors, courses, departments] = await Promise.all([
          studentsRes.ok ? studentsRes.json() : 0,
          professorsRes.ok ? professorsRes.json() : 0,
          coursesRes.ok ? coursesRes.json() : 0,
          departmentsRes.ok ? departmentsRes.json() : 0,
        ]);

        setStudentCount(students);
        setProfessorCount(professors);
        setCourseCount(courses);
        setDepartmentCount(departments);
      } catch (err) {
        console.error("Gabim gjatë marrjes së statistikave:", err);
      }
    };

    const fetchAdminName = async () => {
      try {
        const res = await fetch(`/api/auth/user`, { headers });
        const data = await res.json();
        setAdminName(data.firstName || data.name || 'Admin User');
      } catch (error) {
        console.error("Gabim gjatë marrjes së emrit të adminit:", error);
        setAdminName('Admin User');
      }
    };

    fetchStats();
    fetchAdminName();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : 'closed'}`}>
          <Sidebar adminName={adminName} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Header adminName={adminName} toggleSidebar={toggleSidebar} />
          <div className="admin-dashboard">
            <div className="admin-dashboard-header">
              <div>
                <h2>{getGreeting()}, {adminName}</h2>
                <p>Manage faculty, students, and professors</p>
              </div>
              <Link to="/admin-add-user">
                <button className="add-user-btn">+Add User</button>
              </Link>
            </div>

            <div className="stats-grid">
              <StatsCard
                title="Total Students"
                value={studentCount}
                info="+12% from the previous quarter"
              />
              <StatsCard title="Professors" value={professorCount} info="+4% from last year" />
              <StatsCard title="Active Courses" value={courseCount} info="0% change" />
              <StatsCard title="Departments" value={departmentCount} info="↑ 1 new department" />
            </div>

            <div className="content-grid">
              <div className="regjistrimi">
                <h3>Registration Statistics</h3>
                <div className="placeholder-graph">
                  Graphs and detailed statistics will be displayed here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
