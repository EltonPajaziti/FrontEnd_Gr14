import React, { useState } from "react";
import "../../CSS/Admin/AddUser.css";
import smsLogo from "../../assets/SMS-logo-no-background.png";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import axios from "axios";

function AddUser() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    nationalId: "",
    profilePicture: null,
    roleName: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Fjalëkalimet nuk përputhen.");
      setSuccess("");
      return;
    }

    try {
      const tenantId = localStorage.getItem("tenantId");

      // MAPIMI I GJINISË DHE ROLIT NE ENUM që backend pret
      const genderMap = {
        "Mashkull": "MALE",
        "Femër": "FEMALE"
      };

      const roleMap = {
        "Student": "STUDENT",
        "Profesor": "PROFESSOR"
      };

      const {
        confirmPassword,
        ...rawData
      } = formData;

      const payload = {
        ...rawData,
        gender: genderMap[formData.gender],
        roleName: roleMap[formData.roleName],
        profilePicture: null // ende nuk po e dërgojmë si file
      };

      // await axios.post(
      //   `http://localhost:8080/api/users/create?tenantId=${tenantId}`,
      //   payload
      // );

      await axios.post(`/api/users/create?tenantId=${tenantId}`, payload);


      setSuccess("Përdoruesi u shtua me sukses!");
      setError("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        dateOfBirth: "",
        nationalId: "",
        profilePicture: null,
        roleName: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError("Gabim gjatë shtimit: " + (err.response?.data?.message || "Error"));
      setSuccess("");
    }
  };

  return (
    <>
      <Link to="/admin-dashboard" className="back-button">
        <FaLongArrowAltLeft /> Kthehu prapa
      </Link>
      <form className="enrollment-form" onSubmit={handleSubmit}>
        <div className="enrollment-form-header">
          <h2>Shto Përdorues</h2>
          <div className="logo-container">
            <img src={smsLogo} alt="SMS Logo" className="logo" />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Emri *</label>
            <input
              type="text"
              name="firstName"
              required
              maxLength="50"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Mbiemri *</label>
            <input
              type="text"
              name="lastName"
              required
              maxLength="50"
              value={formData.lastName}
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
          <option value="Mashkull">Mashkull</option>
          <option value="Femër">Femër</option>
        </select>

        <label>Data e lindjes</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <label>Numri i leternjoftimit</label>
        <input
          type="text"
          name="nationalId"
          maxLength="20"
          value={formData.nationalId}
          onChange={handleChange}
        />

        <label>Fotoja e profilit</label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
        />

        <label>Roli</label>
        <select name="roleName" value={formData.roleName} onChange={handleChange}>
          <option value="">Zgjidh rolin</option>
          <option value="Student">Student</option>
          <option value="Profesor">Profesor</option>
        </select>

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
