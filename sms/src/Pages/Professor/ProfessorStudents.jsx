import React, { useState } from "react";
import "../../CSS/Professor/ProfessorStudents.css";
import ProfessorSidebar from "../../Components/Professor/ProfessorSidebar";
import Header from "./Header";

const initialStudents = [
  {
    id: "STU001",
    name: "John Doe",
    email: "john.doe@example.com",
    program: "Computer Science",
    year: 3,
    gpa: 3.8,
    status: "Active",
  },
  {
    id: "STU002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    program: "Mathematics",
    year: 2,
    gpa: 3.5,
    status: "Active",
  },
  {
    id: "STU003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    program: "Physics",
    year: 4,
    gpa: 3.2,
    status: "On Leave",
  },
  {
    id: "STU004",
    name: "Emily Williams",
    email: "e.williams@example.com",
    program: "Biology",
    year: 1,
    gpa: 3.9,
    status: "Active",
  },
];

function ProfessorStudents() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <ProfessorSidebar />
      <div className="dashboard-content">
        <Header />
        <div className="students-page">
          <h2>Students</h2>
          <p>Manage and view all student records</p>

          <div className="students-actions">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-add">+ Add Student</button>
          </div>

          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Program</th>
                <th>Year</th>
                <th>GPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>
                    {student.name}
                    <br />
                    <span className="email">{student.email}</span>
                  </td>
                  <td>{student.program}</td>
                  <td>{student.year}</td>
                  <td>{student.gpa}</td>
                  <td>
                    <span className={`status ${student.status.toLowerCase().replace(/\s/g, "-")}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn">View</button>
                    <button className="edit-btn">Edit</button>
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

export default ProfessorStudents;
