import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Sample initial data for the lecture schedule
const initialSchedule = [
  {
    id: 1,
    day_of_week: 'Tuesday',
    start_time: '10:00:00',
    end_time: '11:00:00',
    room: 'C303',
    tenant_id: 4,
    course_professor_id: 1,
    program_id: 1,
    created_at: '2025-05-16T04:58:00Z',
  },
  {
    id: 2,
    day_of_week: 'Monday',
    start_time: '13:00:00',
    end_time: '14:00:00',
    room: 'B202',
    tenant_id: 4,
    course_professor_id: 2,
    program_id: 1,
    created_at: '2025-05-16T04:58:00Z',
  },
  {
    id: 3,
    day_of_week: 'Friday',
    start_time: '14:00:00',
    end_time: '15:00:00',
    room: 'D404',
    tenant_id: 4,
    course_professor_id: 3,
    program_id: 1,
    created_at: '2025-05-16T04:58:00Z',
  },
];

const WeeklySchedule = () => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [formData, setFormData] = useState({
    day_of_week: '',
    start_time: '',
    end_time: '',
    room: '',
    tenant_id: 1,
    course_professor_id: '',
    program_id: 1,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [adminName, setAdminName] = useState('Adrian Mehaj');
  const [adminRole] = useState('ADMIN');

  const API_URL = 'http://localhost:8080/api/lecture-schedule';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  const timeSlots = ['08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Placeholder mappings for foreign keys (replace with actual API calls)
  const tenantToFaculty = {
    1: 'Computer Science Faculty',
    2: 'Mathematics Faculty',
    3: 'Physics Faculty',
    4: 'Engineering Faculty',
  };
  const courseProfessorToDetails = {
    1: { course: 'Physics I', professor: 'Dr. Smith' },
    2: { course: 'Calculus I', professor: 'Dr. Johnson' },
    3: { course: 'Software Engineering', professor: 'Dr. Lee' },
  };
  const programToDetails = {
    1: 'Spring 2025',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scheduleResponse, authResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get(AUTH_API_URL),
      ]);
      setSchedule(scheduleResponse.data.length > 0 ? scheduleResponse.data : initialSchedule);
      setAdminName(authResponse.data.name || 'Adrian Mehaj');
    } catch (error) {
      console.error('Error fetching data:', error);
      setSchedule(initialSchedule);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room,
        tenant_id: parseInt(formData.tenant_id),
        course_professor_id: parseInt(formData.course_professor_id),
        program_id: parseInt(formData.program_id),
      };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      room: item.room,
      tenant_id: item.tenant_id,
      course_professor_id: item.course_professor_id,
      program_id: item.program_id,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture schedule?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      day_of_week: '',
      start_time: '',
      end_time: '',
      room: '',
      tenant_id: 1,
      course_professor_id: '',
      program_id: 1,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getScheduleItem = (day, time) => {
    return schedule.find(item => item.day_of_week === day && item.start_time === time);
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const adjustedHour = hourNum % 12 || 12;
    return `${adjustedHour}:${minute} ${period}`;
  };

  return (
    <div className="schedule-container">
      <main className="schedule-main">
        <div className="header-section">
          <h2>Weekly Schedule</h2>
          <p>Your class schedule for the current semester</p>
          {adminRole === 'ADMIN' && (
            <button className="add-button" onClick={() => setShowForm(true)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
              <FaPlus /> Add
            </button>
          )}
        </div>
        <div className="schedule-content">
          <h3>Spring Semester 2025</h3>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td>{formatTime(time)}</td>
                  {days.map((day) => {
                    const scheduleItem = getScheduleItem(day, time);
                    return (
                      <td key={`${day}-${time}`} className={scheduleItem ? 'scheduled' : ''}>
                        {scheduleItem && (
                          <div>
                            <p>{courseProfessorToDetails[scheduleItem.course_professor_id]?.course || 'Unknown Course'}</p>
                            <p>Room: {scheduleItem.room}</p>
                            {adminRole === 'ADMIN' && (
                              <div className="schedule-actions">
                                <button className="edit-btn" onClick={() => handleEdit(scheduleItem)}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(scheduleItem.id)}>
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-info">
          <span>{adminName}</span>
          <span>{adminRole}</span>
        </div>
      </main>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Edit Schedule' : 'Add New Schedule'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Day*</label>
                <select name="day_of_week" value={formData.day_of_week} onChange={handleInputChange} required>
                  <option value="">Select Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Start Time*</label>
                <select name="start_time" value={formData.start_time} onChange={handleInputChange} required>
                  <option value="">Select Time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>End Time*</label>
                <select name="end_time" value={formData.end_time} onChange={handleInputChange} required>
                  <option value="">Select Time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Room*</label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  required
                  placeholder="Room"
                />
              </div>
              <div className="form-group">
                <label>Faculty*</label>
                <select name="tenant_id" value={formData.tenant_id} onChange={handleInputChange} required>
                  {Object.entries(tenantToFaculty).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Course & Professor*</label>
                <select name="course_professor_id" value={formData.course_professor_id} onChange={handleInputChange} required>
                  <option value="">Select Course & Professor</option>
                  {Object.entries(courseProfessorToDetails).map(([id, details]) => (
                    <option key={id} value={id}>{`${details.course} - ${details.professor}`}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Program*</label>
                <select name="program_id" value={formData.program_id} onChange={handleInputChange} required>
                  {Object.entries(programToDetails).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .schedule-container { display: flex; height: 100vh; }
        .schedule-main { flex: 1; padding: 0.5rem; background: #ecf0f1; position: relative; }
        .header-section { margin-bottom: 1rem; position: relative; }
        .header-section h2 { font-size: 1.2rem; color: #2c3e50; margin-bottom: 0.1rem; }
        .header-section p { color: #7f8c8d; margin: 0; font-size: 0.8rem; }
        .add-button { background: #3498db; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.2rem; font-size: 0.8rem; }
        .add-button:hover { background: #2980b9; }
        .schedule-content { background: white; padding: 0.5rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .schedule-content h3 { font-size: 1rem; color: #2c3e50; margin-bottom: 0.5rem; }
        .schedule-table { width: 100%; border-collapse: collapse; }
        .schedule-table th { background: #e6f0fa; padding: 0.5rem; text-align: left; font-weight: 600; color: #1a3c5e; border-bottom: 2px solid #bbdefb; font-size: 0.8rem; }
        .schedule-table td { padding: 0.5rem; border-bottom: 1px solid #e0e0e0; color: #34495e; font-size: 0.8rem; }
        .scheduled { background: #e6f0fa; }
        .schedule-table td p { margin: 0; font-size: 0.8rem; }
        .schedule-actions { margin-top: 0.3rem; display: flex; gap: 0.3rem; }
        .edit-btn { background: none; border: none; cursor: pointer; padding: 0.2rem 0.5rem; border-radius: 4px; display: flex; align-items: center; gap: 0.2rem; font-size: 0.7rem; color: #3498db; }
        .edit-btn:hover { background: rgba(52,152,219,0.1); }
        .delete-btn { background: none; border: none; cursor: pointer; padding: 0.2rem 0.5rem; border-radius: 4px; display: flex; align-items: center; gap: 0.2rem; font-size: 0.7rem; color: #e74c3c; }
        .delete-btn:hover { background: rgba(231,76,60,0.1); }
        .admin-info { margin-top: 0.5rem; text-align: right; color: #2c3e50; }
        .admin-info span { display: block; font-size: 0.8rem; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 1rem; border-radius: 8px; max-width: 350px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .modal-content h3 { margin: 0 0 0.5rem; color: #2c3e50; font-size: 1rem; }
        .form-group { margin-bottom: 0.5rem; }
        .form-group label { display: block; margin-bottom: 0.2rem; font-weight: 600; color: #34495e; font-size: 0.8rem; }
        .form-group input, .form-group select { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.8rem; }
        .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
        .cancel-btn { background: #f8f9fa; color: #34495e; border: 1px solid #ddd; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.8rem; }
        .cancel-btn:hover { background: #e9ecef; }
        .save-btn { background: #2ecc71; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.8rem; }
        .save-btn:hover { background: #27ae60; }
        @media (max-width: 768px) {
          .schedule-table th, .schedule-table td { padding: 0.3rem; font-size: 0.7rem; }
          .modal-content { max-width: 300px; padding: 0.5rem; }
          .form-group input, .form-group select { padding: 0.3rem; font-size: 0.7rem; }
          .form-actions { flex-direction: column; }
          .save-btn, .cancel-btn { width: 100%; padding: 0.3rem; font-size: 0.7rem; }
        }
      `}</style>
    </div>
  );
};

export default Schedule;