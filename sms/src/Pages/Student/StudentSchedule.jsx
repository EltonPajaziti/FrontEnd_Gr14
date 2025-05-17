import React, { useState } from "react";
import StudentSidebar from "../../Components/Student/StudentSidebar";
import StudentHeader from "../../Components/Student/StudentHeader";
import "../../CSS/Student/StudentSchedule.css";

const StudentSchedule = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const studentName = "Student Johnson";

  const scheduleData = [
    {
      day: "Monday",
      course: "Calculus I",
      room: "B202",
      start: "13:00",
      end: "15:00",
    },
    {
      day: "Tuesday",
      course: "Physics I",
      room: "C303",
      start: "10:00",
      end: "12:00",
    },
    {
      day: "Thursday",
      course: "Software Engineering",
      room: "D404",
      start: "14:00",
      end: "16:00",
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <StudentSidebar isSidebarOpen={isSidebarOpen} />
        </div>

        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <StudentHeader studentName={studentName} toggleSidebar={toggleSidebar} />

          <div className="page-container student-schedule">
            <h2 className="section-title">Weekly Schedule</h2>
            <p className="sub-title">Your class schedule for the current semester</p>

            <div className="schedule-table">
              <div className="schedule-header">
                <div className="cell header">Time</div>
                {days.map((day) => (
                  <div key={day} className="cell header">{day}</div>
                ))}
              </div>

              {times.map((time) => (
                <div key={time} className="schedule-row">
                  <div className="cell time-cell">{`${time}`}</div>
                  {days.map((day) => {
                    const lecture = scheduleData.find(
                      (item) => item.day === day && item.start === time
                    );
                    return (
                      <div key={day + time} className="cell">
                        {lecture && (
                          <div className="lecture-box">
                            <div className="course-name">{lecture.course}</div>
                            <div className="room">Room: {lecture.room}</div>
                            <div className="time">{lecture.start} - {lecture.end}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
