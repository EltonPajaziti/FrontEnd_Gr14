import React from "react";
import ProfessorSidebar from "../../Components/Professor/ProfessorSidebar";
import Header from "./Header";
import "../../CSS/Professor/ProfessorGrades.css";

const grades = [
  {
    course: "Introduction to Computer Science",
    grade: 85,
    credits: 4,
    semester: "Fall 2024",
    date: "2024-12-15",
    status: "PASSED",
  },
  {
    course: "Calculus I",
    grade: 78,
    credits: 3,
    semester: "Fall 2024",
    date: "2024-12-20",
    status: "PASSED",
  },
  {
    course: "Database Systems",
    grade: 92,
    credits: 4,
    semester: "Spring 2025",
    date: "2025-05-01",
    status: "PASSED",
  },
  {
    course: "Networks",
    grade: 65,
    credits: 3,
    semester: "Spring 2025",
    date: "2025-05-03",
    status: "PENDING",
  },
];

function ProfessorGrades() {
  const totalPoints = grades.reduce((acc, g) => acc + g.grade * g.credits, 0);
  const totalCredits = grades.reduce((acc, g) => acc + g.credits, 0);
  const GPA = totalPoints / totalCredits;

  return (
    <div className="dashboard-container">
      <ProfessorSidebar />
      <div className="dashboard-content">
        <Header />
        <div className="grades-page">
          <h2>Academic Grades</h2>
          <p>Your academic performance across all courses</p>

          <div className="gpa-display">GPA: {GPA.toFixed(2)}</div>

          <table className="grades-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Grade</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, index) => (
                <tr key={index}>
                  <td>{g.course}</td>
                  <td>{g.grade}</td>
                  <td>{g.credits}</td>
                  <td>{g.semester}</td>
                  <td>{g.date}</td>
                  <td>
                    <span
                      className={`status ${
                        g.status === "PASSED" ? "passed" : "pending"
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfessorGrades;
