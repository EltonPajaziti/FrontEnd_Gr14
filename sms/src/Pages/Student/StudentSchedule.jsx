import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentSidebar from "../../Components/Student/StudentSidebar";
import StudentHeader from "../../Components/Student/StudentHeader";
import "../../CSS/Student/StudentSchedule.css";

const StudentSchedule = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const studentName = "Student";

  const userId = localStorage.getItem("userId");
  const tenantId = localStorage.getItem("tenantId");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (userId && tenantId) {
      axios
        .get("http://localhost:8080/api/lecture-schedules/student", {
          params: {
            userId: userId,
            tenantId: tenantId
          }
        })
        .then((res) => {
          setScheduleData(res.data);
        })
        .catch((err) => {
          console.error("Gabim në marrjen e orarit:", err);
        });
    }
  }, [userId, tenantId]);

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
                  <div className="cell time-cell">{time}</div>
                  {days.map((day) => {
                    const lecture = scheduleData.find(
                      (item) =>
                        item.dayOfWeek === day &&
                        item.startTime === time
                    );
                    return (
                      <div key={day + time} className="cell">
                        {lecture && (
                          <div className="lecture-box">
                            <div className="course-name">{lecture.courseName}</div>
                            <div className="room">Room: {lecture.room}</div>
                            <div className="time">{lecture.startTime} - {lecture.endTime}</div>
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
