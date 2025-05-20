import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfessorsSidebar from "../../Components/Professor/ProfessorsSidebar";
import ProfessorsHeader from "../../Components/Professor/ProfessorsHeader";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "../../CSS/Student/StudentSchedule.css";

const ProfessorSchedule = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [professorName, setProfessorName] = useState("Professor");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
    room: "",
    tenant_id: "",
    course_professor_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  const userId = localStorage.getItem("userId") || "1"; // Default to 1 for testing
  const tenantId = localStorage.getItem("tenantId") || "4"; // Default to 4 for testing

  const days = ["E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte"];
  const times = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchData();
  }, [userId, tenantId]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/lecture-schedule", {
        params: {
          tenantId: tenantId,
          course_professor_id: userId
        }
      });
      const filteredSchedule = response.data.map(item => ({
        id: item.id,
        dayOfWeek: item.day_of_week,
        startTime: item.start_time.split(':')[0] + ':00',
        endTime: item.end_time.split(':')[0] + ':00',
        courseName: item.courseName || 'Kurs i Panjohur',
        room: item.room
      }));
      if (filteredSchedule.length === 0) {
        // Add a sample schedule if none exist
        const sampleSchedule = [
          {
            id: 1,
            dayOfWeek: "E Martë",
            startTime: "10:00",
            endTime: "11:00",
            courseName: "Fizikë I",
            room: "C303"
          }
        ];
        setScheduleData(sampleSchedule);
      } else {
        setScheduleData(filteredSchedule);
      }
    } catch (err) {
      console.error("Gabim në marrjen e orarit:", err);
      // Fallback to sample schedule on error
      const sampleSchedule = [
        {
          id: 1,
          dayOfWeek: "E Martë",
          startTime: "10:00",
          endTime: "11:00",
          courseName: "Fizikë I",
          room: "C303"
        }
      ];
      setScheduleData(sampleSchedule);
    }
  };

  useEffect(() => {
    const fetchProfessorName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const authResponse = await axios.get('http://localhost:8080/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfessorName(authResponse.data.firstName || authResponse.data.name || 'Professor');
        }
      } catch (error) {
        console.error('Error fetching professor name:', error);
      }
    };
    fetchProfessorName();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        day_of_week: formData.day_of_week,
        start_time: formData.start_time + ":00",
        end_time: formData.end_time + ":00",
        room: formData.room,
        tenant_id: parseInt(tenantId),
        course_professor_id: parseInt(userId),
      };
      if (editingId) {
        await axios.put(`${"http://localhost:8080/api/lecture-schedule"}/${editingId}`, data);
      } else {
        await axios.post("http://localhost:8080/api/lecture-schedule", data);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Gabim në ruajtjen e orarit:", error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      day_of_week: item.dayOfWeek,
      start_time: item.startTime.split(':')[0],
      end_time: item.endTime.split(':')[0],
      room: item.room,
      tenant_id: tenantId,
      course_professor_id: userId,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("A je i sigurt që dëshiron të fshish këtë orar?")) {
      try {
        await axios.delete(`${"http://localhost:8080/api/lecture-schedule"}/${id}`);
        fetchData();
      } catch (error) {
        console.error("Gabim në fshirjen e orarit:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      day_of_week: "",
      start_time: "",
      end_time: "",
      room: "",
      tenant_id: tenantId,
      course_professor_id: userId,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <ProfessorsSidebar professorName={professorName} isSidebarOpen={isSidebarOpen} />
        </div>

        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <ProfessorsHeader professorName={professorName} toggleSidebar={toggleSidebar} />

          <div className="page-container student-schedule">
            <h2 className="section-title">Orari Javor</h2>
            <p className="sub-title">Orari yt i mësimdhënies për semestrin aktual</p>

            <div className="schedule-table">
              <div className="schedule-header">
                <div className="cell header">Koha</div>
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
                            <div className="room">Salla: {lecture.room}</div>
                            <div className="time">{lecture.startTime} - {lecture.endTime}</div>
                            <div className="schedule-actions">
                              <button className="edit-btn" onClick={() => handleEdit(lecture)}>
                                <FaEdit /> Redakto
                              </button>
                              <button className="delete-btn" onClick={() => handleDelete(lecture.id)}>
                                <FaTrash /> Fshi
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <button className="add-button" onClick={() => setShowForm(true)} style={{ marginTop: "1rem" }}>
              <FaPlus /> Shto Orar
            </button>

            {showForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>{editingId ? "Redakto Orarin" : "Shto Orar të Ri"}</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Dita*</label>
                      <select name="day_of_week" value={formData.day_of_week} onChange={handleInputChange} required>
                        <option value="">Zgjidh Ditën</option>
                        {days.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Koha e Fillimit*</label>
                      <select name="start_time" value={formData.start_time} onChange={handleInputChange} required>
                        <option value="">Zgjidh Kohën</option>
                        {times.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Koha e Përfundimit*</label>
                      <select name="end_time" value={formData.end_time} onChange={handleInputChange} required>
                        <option value="">Zgjidh Kohën</option>
                        {times.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Salla*</label>
                      <input
                        type="text"
                        name="room"
                        value={formData.room}
                        onChange={handleInputChange}
                        required
                        placeholder="Salla"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={resetForm}>
                        Anulo
                      </button>
                      <button type="submit" className="save-btn">
                        Ruaj
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
  .add-button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.8rem;
    margin-left: auto;
  }
  .add-button:hover {
    background: #2980b9;
  }
  .lecture-box {
    position: relative;
    padding: 0.5rem;
    background: #e6f0fa;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  .schedule-actions {
    margin-top: 0.3rem;
    display: flex;
    gap: 0.3rem;
  }
  .edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.7rem;
    color: #3498db;
  }
  .edit-btn:hover {
    background: rgba(52, 152, 219, 0.1);
  }
  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.7rem;
    color: #e74c3c;
  }
  .delete-btn:hover {
    background: rgba(231, 76, 60, 0.1);
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    max-width: 350px;
    width: 100%;
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .form-group {
    margin-bottom: 0.5rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.2rem;
    font-weight: 600;
    color: #34495e;
    font-size: 0.8rem;
  }
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.4rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .cancel-btn {
    background: #f8f9fa;
    color: #34495e;
    border: 1px solid #ddd;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8rem;
  }
  .cancel-btn:hover {
    background: #e9ecef;
  }
  .save-btn {
    background: #2ecc71;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8rem;
  }
  .save-btn:hover {
    background: #27ae60;
  }
`}</style>
    </div>
  );
};

export default ProfessorSchedule;

