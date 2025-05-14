import React, { useEffect, useState } from "react";
import "../../CSS/Student/Kurset.css"; 
import { FaBook, FaFileAlt, FaClock, FaCalendarCheck, FaClipboard, FaGraduationCap, FaQuestionCircle, FaCog } from 'react-icons/fa';
import StudentSidebar from "../../Components/Student/StudentSidebar";

function Kurset() {
  const courses = [
    {
      title: 'Programim i Avancuar',
      code: 'CS300',
      professor: 'Prof. D. Johnson',
    },
    {
      title: 'Programim në Web',
      code: 'CS302',
      professor: 'Lekt. E. King',
    },
    {
      title: 'Algjencësa Artificiale',
      code: 'CS304',
      professor: 'Prof. T. Brown',
    },
    {
      title: 'Algjebra lineare',
      code: 'MATH300',
      professor: 'Prof. A. Smith',
    },
  ];

  return (
   <div className="kurset-container">
  <StudentSidebar />
  <div className="kurset-content">
    <h1>Kurset</h1>
    <div className="cards-grid">
      {courses.map((course, index) => (
        <div className="course-card" key={index}>
          <h3>{course.title}</h3>
          <p>{course.code} &nbsp; {course.professor}</p>
          <div className="buttons">
            <button className="btn-materialet">Materialet</button>
            <button className="btn-detyrat">Detyrat</button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  )
}

export default Kurset;
