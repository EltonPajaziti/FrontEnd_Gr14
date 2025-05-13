import React, { useState } from "react";
import '../../CSS/Admin/AddUser.css';
import smsLogo from '../../assets/SMS-logo-no-background.png';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";

function AddUser() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    alt_email: "",
    phone: "",
    address: "",
    gender: "",
    date_of_birth: "",
    national_id: "",
    profile_picture: null,
    role_id: "",
    tenant_id: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Fjalëkalimet nuk përputhen.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Përdoruesi u shtua me sukses!");

    // TODO: Duhet te nderrohet me api call per regjistrimin e user-it

  };

  return (
    <>
    
    <Link to="/admin-dashboard" className="back-button"><FaLongArrowAltLeft /> Kthehu prapa</Link>
    <form className="enrollment-form" onSubmit={handleSubmit}>
        <div className="enrollment-form-header">
            <h2>Regjistro Përdorues</h2>
            <div className="logo-container">
            <img src={smsLogo} alt="SMS Logo" className="logo" />
            </div>
        </div>
      <div className="form-row">
        <div>
          <label>Emri *</label>
          <input
            type="text"
            name="first_name"
            required
            maxLength="50"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mbiemri *</label>
          <input
            type="text"
            name="last_name"
            required
            maxLength="50"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
      </div>

      <label>Email-i *</label>
      <input
        type="email"
        name="email"
        required
        maxLength="100"
        value={formData.email}
        onChange={handleChange}
      />

      <label>Email-i i fakultetit</label>
      <input
        type="email"
        name="alt_email"
        maxLength="100"
        value={formData.alt_email}
        onChange={handleChange}
      />

      <label>Numri i telefonit</label>
      <input
        type="tel"
        name="phone"
        maxLength="20"
        value={formData.phone}
        onChange={handleChange}
      />

      <label>Adresa</label>
      <input
        type="text"
        name="address"
        maxLength="100"
        value={formData.address}
        onChange={handleChange}
      />

      <label>Gjinia</label>
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Zgjidh gjininë</option>
        <option value="Male">Mashkull</option>
        <option value="Female">Femër</option>
      </select>

      <label>Data e lindjes</label>
      <input
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
      />

      <label>Numri i leternjoftimit</label>
      <input
        type="text"
        name="national_id"
        maxLength="20"
        value={formData.national_id}
        onChange={handleChange}
      />

      <label>Fotoja e profilit</label>
      <input
        type="file"
        name="profile_picture"
        accept="image/*"
        onChange={handleChange}
      />

      <label>Roli</label>
      <select name="role_id" value={formData.role_id} onChange={handleChange}>
        <option value="">Zgjidh rolin</option>
        <option value="1">Student</option>
        <option value="2">Profesor</option>
      </select>

      <label>Tenant ID</label>
      <input
        type="number"
        name="tenant_id"
        value={formData.tenant_id}
        onChange={handleChange}
      />

      <label>Password-i *</label>
      <input
        type="password"
        name="password"
        required
        maxLength="255"
        value={formData.password}
        onChange={handleChange}
      />

      <label>Konfirmo passwordin-i *</label>
      <input
        type="password"
        name="confirmPassword"
        required
        maxLength="255"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <button type="submit">Shto</button>
    </form>
    </>
  );
}

export default AddUser;
