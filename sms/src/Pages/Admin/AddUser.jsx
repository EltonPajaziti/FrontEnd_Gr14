import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../CSS/Admin/AddUser.css";
import smsLogo from "../../assets/SMS-logo-no-background.png";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import axios from "axios";

const AddUser = () => {
  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Emri është i detyrueshëm"),
      lastName: Yup.string().required("Mbiemri është i detyrueshëm"),
      email: Yup.string().email("Email-i nuk është valid").required("Email-i është i detyrueshëm"),
      password: Yup.string().required("Password-i është i detyrueshëm"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Fjalëkalimet nuk përputhen")
        .required("Konfirmimi i password-it është i detyrueshëm")
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      try {
        const tenantId = localStorage.getItem("tenantId");
        const token = localStorage.getItem("token");

        const genderMap = {
          "Mashkull": "MALE",
          "Femër": "FEMALE"
        };

        const roleMap = {
          "Student": "STUDENT",
          "Profesor": "PROFESSOR"
        };

        const payload = {
          ...values,
          gender: genderMap[values.gender],
          roleName: roleMap[values.roleName],
          profilePicture: null
        };

        await axios.post(`/api/users/create?tenantId=${tenantId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        resetForm();
        setStatus({ success: "Përdoruesi u shtua me sukses!" });
      } catch (err) {
        setStatus({ error: "Gabim gjatë shtimit: " + (err.response?.data?.message || "Error") });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Link to="/admin-dashboard" className="back-button">
        <FaLongArrowAltLeft /> Kthehu prapa
      </Link>
      <form className="enrollment-form" onSubmit={formik.handleSubmit}>
        <div className="enrollment-form-header">
          <h2>Shto Përdorues</h2>
          <div className="logo-container">
            <img src={smsLogo} alt="SMS Logo" className="logo" />
          </div>
        </div>

        {/* Sample Input */}
        <div className="form-row">
          <div>
            <label>Emri *</label>
            <input {...formik.getFieldProps("firstName")} />
            {formik.touched.firstName && formik.errors.firstName && <div className="error">{formik.errors.firstName}</div>}
          </div>
          <div>
            <label>Mbiemri *</label>
            <input {...formik.getFieldProps("lastName")} />
            {formik.touched.lastName && formik.errors.lastName && <div className="error">{formik.errors.lastName}</div>}
          </div>
        </div>

        <label>Email-i *</label>
        <input type="email" {...formik.getFieldProps("email")} />
        {formik.touched.email && formik.errors.email && <div className="error">{formik.errors.email}</div>}

        <label>Numri i telefonit</label>
        <input type="tel" {...formik.getFieldProps("phone")} />

        <label>Adresa</label>
        <input {...formik.getFieldProps("address")} />

        <label>Gjinia</label>
        <select {...formik.getFieldProps("gender")}>
          <option value="">Zgjidh gjininë</option>
          <option value="Mashkull">Mashkull</option>
          <option value="Femër">Femër</option>
        </select>

        <label>Data e lindjes</label>
        <input type="date" {...formik.getFieldProps("dateOfBirth")} />

        <label>Numri i leternjoftimit</label>
        <input {...formik.getFieldProps("nationalId")} />

        <label>Fotoja e profilit</label>
        <input
          type="file"
          name="profilePicture"
          onChange={(e) => formik.setFieldValue("profilePicture", e.currentTarget.files[0])}
        />

        <label>Roli</label>
        <select {...formik.getFieldProps("roleName")}>
          <option value="">Zgjidh rolin</option>
          <option value="Student">Student</option>
          <option value="Profesor">Profesor</option>
        </select>

        <label>Password-i *</label>
        <input type="password" {...formik.getFieldProps("password")} />
        {formik.touched.password && formik.errors.password && <div className="error">{formik.errors.password}</div>}

        <label>Konfirmo passwordin *</label>
        <input type="password" {...formik.getFieldProps("confirmPassword")} />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="error">{formik.errors.confirmPassword}</div>}

        {formik.status?.error && <p style={{ color: "red" }}>{formik.status.error}</p>}
        {formik.status?.success && <p style={{ color: "green" }}>{formik.status.success}</p>}

        <button type="submit" disabled={formik.isSubmitting}>Shto</button>
      </form>
    </>
  );
};

export default AddUser;

