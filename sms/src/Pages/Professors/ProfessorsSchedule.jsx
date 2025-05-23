
import React, { useState, useEffect, createContext, useContext } from "react"; 
import axios from "axios"; // Importing axios for API calls
import ProfessorsSidebar from "../../Components/Professor/ProfessorsSidebar"; 
import ProfessorsHeader from "../../Components/Professor/ProfessorsHeader"; 
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; 

// Create a local Context
const ScheduleContext = createContext();

const ProfessorSchedule = () => {
  // Define the Provider component - This is where ContextProvider is implemented
  const ScheduleProvider = ({ children }) => {
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
      courseName: "", 
    });
    const [editingId, setEditingId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const userId = localStorage.getItem("userId") || "1";
    const tenantId = localStorage.getItem("tenantId") || "4";

    const days = ["E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte"];
    const times = [
      "08:00", "09:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00"
    ];

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
          courseName: formData.courseName,
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
        alert("Orari u shtua me sukses!");
      } catch (error) {
        console.error("Gabim në ruajtjen e orarit:", error);
        alert("Gabim gjatë shtimit të orarit!");
      }
    };

    const handleEdit = (item) => {
      setFormData({
        day_of_week: item.dayOfWeek,
        start_time: item.startTime.split(':')[0],
        end_time: item.endTime.split(':')[0],
        room: item.room,
        courseName: item.courseName,
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
          alert("Orari u fshi me sukses!");
        } catch (error) {
          console.error("Gabim në fshirjen e orarit:", error);
          alert("Gabim gjatë fshirjes së orarit!");
        }
      }
    };

    const resetForm = () => {
      setFormData({
        day_of_week: "",
        start_time: "",
        end_time: "",
        room: "",
        courseName: "",
        tenant_id: tenantId,
        course_professor_id: userId,
      });
      setEditingId(null);
      setShowForm(false);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
      <ScheduleContext.Provider value={{ 
        scheduleData, setScheduleData, professorName, showForm, setShowForm, 
        formData, setFormData, editingId, setEditingId, days, times, 
        handleInputChange, handleSubmit, handleEdit, handleDelete, resetForm,
        isSidebarOpen, toggleSidebar
      }}>
        {children}
      </ScheduleContext.Provider>
    );
  };

  // Move JSX rendering inside a separate component that consumes the context
  const ScheduleContent = () => {
    const { 
      scheduleData, professorName, showForm, setShowForm, formData, editingId, days, times, 
      handleInputChange, handleSubmit, handleEdit, handleDelete, resetForm,
      isSidebarOpen, toggleSidebar
    } = useContext(ScheduleContext);

    const handleAddClick = () => {
      setShowForm(true);
      console.log("Show Form triggered, showForm:", true); // Debug log
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
              <div className="header-section">
                <div>
                  <h2 className="section-title">Orari Javor</h2>
                  <p className="sub-title">Orari yt i mësimdhënies për semestrin aktual</p>
                </div>
                <button className="add-button-modern" onClick={handleAddClick}>
                  <FaPlus /> Shto Orar
                </button>
              </div>

              {scheduleData.length === 0 ? (
                <p>Nuk ka të dhëna për orarin. Shto një orar të ri.</p>
              ) : (
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
                                  <button className="edit-btn-modern" onClick={() => handleEdit(lecture)}>
                                    <FaEdit /> Edit
                                  </button>
                                  <button className="delete-btn-modern" onClick={() => handleDelete(lecture.id)}>
                                    <FaTrash /> Delete
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
              )}

              {showForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>{editingId ? "Redakto Orarin" : "Shto Orar të Ri"}</h3>
                    <form onSubmit={handleSubmit} className="schedule-form">
                      <div className="form-group">
                        <label htmlFor="day_of_week">Dita*</label>
                        <select
                          id="day_of_week"
                          name="day_of_week"
                          value={formData.day_of_week}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                        >
                          <option value="">Zgjidh Ditën</option>
                          {days.map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="start_time">Koha e Fillimit*</label>
                        <select
                          id="start_time"
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                        >
                          <option value="">Zgjidh Kohën</option>
                          {times.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="end_time">Koha e Përfundimit*</label>
                        <select
                          id="end_time"
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                        >
                          <option value="">Zgjidh Kohën</option>
                          {times.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="courseName">Emri i Kursit*</label>
                        <input
                          id="courseName"
                          type="text"
                          name="courseName"
                          value={formData.courseName}
                          onChange={handleInputChange}
                          required
                          placeholder="Emri i Kursit"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="room">Salla*</label>
                        <input
                          id="room"
                          type="text"
                          name="room"
                          value={formData.room}
                          onChange={handleInputChange}
                          required
                          placeholder="Salla"
                          className="form-input"
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
      </div>
    );
  };

  return (
    <ScheduleProvider>
      <ScheduleContent />
    </ScheduleProvider>
  );
};

export default ProfessorSchedule;

<style jsx>{`
  .page-container {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    font-family: 'Poppins', sans-serif;
  }
  .content-container {
    flex: 1;
    padding: 20px;
    min-height: 100vh;
    overflow-y: auto;
    transition: margin-left 0.3s;
  }
  .schedule-container {
    position: relative;
    display: flex;
    min-height: calc(100% - 40px);
    flex-direction: column;
    padding: 0.5rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  .schedule-container:hover {
    transform: translateY(-5px);
  }
  .schedule-main {
    flex: 1;
    position: relative;
    overflow-y: auto;
  }
  .header-section {
    margin-bottom: 1rem;
    position: relative;
    text-align: center;
  }
  .header-section h2 {
    font-size: 1.2rem;
    color: #2c3e50;
    margin-bottom: 0.1rem;
  }
  .header-section p {
    color: #7f8c8d;
    margin: 0;
    font-size: 0.8rem;
  }
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
  }
  .add-button:hover {
    background: #2980b9;
  }
  .schedule-content {
    background: white;
    padding: 0.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    min-height: 300px;
    overflow-x: auto;
    flex-grow: 1;
  }
  .schedule-content h3 {
    font-size: 1rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  .schedule-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  .schedule-table th {
    background: #e6f0fa;
    padding: 0.5rem;
    text-align: left;
    font-weight: 600;
    color: #1a3c5e;
    border-bottom: 2px solid #bbdefb;
    font-size: 0.8rem;
    position: sticky;
    top: 0;
  }
  .schedule-table td {
    padding: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
    color: #34495e;
    font-size: 0.8rem;
    vertical-align: top;
    min-height: 50px;
  }
  .scheduled {
    background: #e6f0fa;
  }
  .schedule-table td p {
    margin: 0;
    font-size: 0.8rem;
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
    overflow-y: auto;
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
    margin: 0;
  }
  .modal-content h3 {
    margin: 0 0 0.5rem;
    color: #2c3e50;
    font-size: 1rem;
  }
  .form-group {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.2rem;
    font-weight: 600;
    color: #34495e;
    font-size: 0.8rem;
    min-width: 120px; /* Gjerësi fikse për etiketa */
    text-align: right;
  }
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.4rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.8rem;
    flex: 1; /* Lejon që inputet të zgjerohen */
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
  @media (max-width: 768px) {
    .schedule-table th,
    .schedule-table td {
      padding: 0.3rem;
      font-size: 0.7rem;
    }
    .modal-content {
      max-width: 300px;
      padding: 0.5rem;
      width: 90%;
    }
    .form-group {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
    }
    .form-group label {
      min-width: auto;
      text-align: left;
    }
    .form-group input,
    .form-group select {
      padding: 0.3rem;
      font-size: 0.7rem;
    }
    .form-actions {
      flex-direction: column;
    }
    .save-btn,
    .cancel-btn {
      width: 100%;
      padding: 0.3rem;
      font-size: 0.7rem;
    }
  }
`}</style>