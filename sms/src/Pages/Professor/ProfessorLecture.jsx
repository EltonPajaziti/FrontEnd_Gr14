import React from "react";
import ProfessorSidebar from "../../Components/Professor/ProfessorSidebar";
import Header from "./Header";
import "../../CSS/Professor/ProfessorLecture.css";

const lectures = [
  {
    day: "Monday",
    time: "09:00 - 10:30",
    course: "Introduction to Computer Science",
    professor: "Dr. Smith",
    room: "A101",
  },
  {
    day: "Tuesday",
    time: "11:00 - 12:30",
    course: "Database Systems",
    professor: "Dr. Johnson",
    room: "B205",
  },
  {
    day: "Wednesday",
    time: "14:00 - 15:30",
    course: "Software Engineering",
    professor: "Prof. Williams",
    room: "C310",
  },
  {
    day: "Thursday",
    time: "16:00 - 17:30",
    course: "Artificial Intelligence",
    professor: "Dr. Brown",
    room: "D415",
  },
];

function ProfessorLectureSchedule() {
  return (
    <div className="dashboard-container">
      <ProfessorSidebar />
      <div className="dashboard-content">
        <Header />
        <div className="lecture-schedule-page">
          <h2>Lecture Schedule</h2>
          <p>Your scheduled lectures for this semester</p>

          <div className="calendar-header">
            <h3>Weekly Timetable</h3>
            <button className="calendar-btn">📅 Calendar View</button>
          </div>

          <table className="lecture-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Course</th>
                <th>Professor</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture, index) => (
                <tr key={index}>
                  <td>{lecture.day}</td>
                  <td>{lecture.time}</td>
                  <td>{lecture.course}</td>
                  <td>{lecture.professor}</td>
                  <td>{lecture.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfessorLectureSchedule;
