import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCamera, FaSave } from 'react-icons/fa';
import Sidebar from "../../Components/Professor/ProfessorsSidebar";
import Header from "../../Components/Professor/ProfessorsHeader";

// Sample initial data for a professor
const initialProfile = {
  id: 1,
  firstName: "Ilir",
  lastName: "Deda",
  email: "ilir.deda@example.com",
  bio: "Shkruani një bio të shkurtër rreth vetes...",
  avatarInitials: "ID",
  photo: null, // To store the profile photo URL or base64 string
};

const ProfessorsSettings = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [professorName, setProfessorName] = useState('Prof. Ilir Deda');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  const API_URL = 'http://localhost:8080/api/professor';
  const AUTH_API_URL = 'http://localhost:8080/api/auth/user';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileResponse, authResponse] = await Promise.all([
        axios.get(`${API_URL}/profile`), // Hypothetical endpoint for professor profile
        axios.get(AUTH_API_URL),
      ]);
      setProfile(profileResponse.data || initialProfile);
      setProfessorName(authResponse.data.firstName || authResponse.data.name || 'Professor');
    } catch (error) {
      console.error('Error fetching data:', error);
      setProfile(initialProfile);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', profile.firstName);
      formData.append('lastName', profile.lastName);
      formData.append('email', profile.email);
      formData.append('bio', profile.bio);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await axios.put(`${API_URL}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsEditing(false);
      setPhotoFile(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : "closed"}`}>
          <Sidebar professorName={professorName} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Header professorName={professorName} toggleSidebar={toggleSidebar} />
          <div className="professor-settings">
            <div className="profile-container">
              <h1>Informacioni i Profilit</h1>
              <p className="subtitle">Përditësoni informacionin tuaj personal</p>
              <div className="profile-content">
                <div className="profile-left">
                  <div className="avatar-section">
                    {profile.photo ? (
                      <img src={profile.photo} alt="Profile" className="avatar-photo" />
                    ) : (
                      <span className="avatar-initials">{profile.avatarInitials}</span>
                    )}
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                      disabled={!isEditing}
                    />
                    <label htmlFor="avatar-upload" className="avatar-edit">
                      <FaCamera /> Ngarko Foto
                    </label>
                  </div>
                  <div className="profile-details">
                    <label>
                      Emri
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </label>
                    <label>
                      Mbiemri
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={true}
                        placeholder="Email adresa juaj menaxhohet nga administratori."
                      />
                    </label>
                    <label>
                      Bio
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="button-section">
                <button 
                  className="save-btn" 
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  <FaSave /> {isEditing ? 'Ruaj ndryshimet' : 'Redakto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .professor-settings {
          padding: 20px;
          background: #eef2f7;
          min-height: 100vh;
        }
        .profile-container {
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
          background: linear-gradient(to bottom, #eef2f7, #ffffff);
        }
        .profile-container h1 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        .subtitle {
          color: #7f8c8d;
          margin-bottom: 1.5rem;
        }
        .profile-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 500px;
          margin: 0 auto;
        }
        .profile-left {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .avatar-section {
          position: relative;
          text-align: center;
          margin-bottom: 20px;
        }
        .avatar-initials {
          background: #4a90e2;
          color: white;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        .avatar-photo {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }
        .avatar-edit {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          margin-top: 10px;
          transition: background 0.2s;
        }
        .avatar-edit:hover {
          background: #357abd;
        }
        .profile-details {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .profile-details label {
          display: block;
        }
        .profile-details label span {
          font-weight: bold;
          color: #34495e;
          display: block;
          margin-bottom: 5px;
        }
        .profile-details input,
        .profile-details textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #fff;
          resize: vertical;
          box-sizing: border-box;
        }
        .profile-details textarea {
          min-height: 100px;
        }
        .profile-details input:disabled,
        .profile-details textarea:disabled {
          background: #f9f9f9;
          color: #7f8c8d;
        }
        .button-section {
          margin-top: 30px;
          text-align: right;
          width: 100%;
          max-width: 500px;
          margin: 30px auto 0;
        }
        .save-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .save-btn:hover {
          background: #357abd;
        }
        @media (max-width: 768px) {
          .professor-settings {
            padding: 15px;
          }
          .profile-container {
            padding: 15px;
          }
          .profile-content {
            max-width: 100%;
          }
          .button-section {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessorsSettings;