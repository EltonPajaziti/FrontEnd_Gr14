import React from 'react';
import sms2 from '../assets/sms2.jpg';
import uni1 from '../assets/uni1.jpg';
import unii2 from '../assets/unii2.png';
import unii3 from '../assets/unii3.png';
import about1 from '../assets/about1.jpg';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import studentii from '../assets/studentii.jpg';   
import diploma from '../assets/diploma.jpg'; 
import { FaUserGraduate, FaChartBar, FaUsersCog } from "react-icons/fa";


import '../CSS/About.css';

function About() {
    return <div>
      <Navbar/>
      <div className="about-us-container" style={{ backgroundImage: `url(${about1})` }}>
      <div className="overlay">
        <h1>About us</h1>
      </div>
    </div>

     <div className="about-section">
      <div class="introduction">
        <p className="section-label">ABOUT US</p>
        <h2><span className="highlight">Introduction</span> To Our<br></br> Student Management System</h2>
        </div>
        <div className="description-columns">
          <p>Our platform is designed to streamline and enhance the way academic institutions manage student data, class schedules, and academic performance. We focus on making the entire process seamless for administrators, teachers, and students alike.</p>
          <p>With powerful features and a user-friendly interface, our system reduces manual work, improves accuracy, and ensures smooth communication between all stakeholders in an educational environment.</p>
        </div>
      </div>
            <div className="intro-text">

      <div className="feature-cards">
        <div className="card">
          <div className="icon red"><FaUserGraduate /></div>
          <h4>Accurate Student Records</h4>
          <p>Maintain centralized and error-free student data, from enrollment to graduation.</p>
        </div>

        <div className="card">
          <div className="icon dark"> <FaChartBar /></div>
          <h4>Automated Academic Reports</h4>
          <p>Generate real-time grade reports, attendance summaries, and performance charts.</p>
        </div>

        <div className="card">
          <div className="icon red"><FaUsersCog /></div>
          <h4>User Roles for Admins, Teachers & Students</h4>
          <p>Provide customized dashboards and access levels for every user type.</p>
        </div>
      </div>
    </div>

     
    <Footer/>
    </div>;
  }
  
  export default About;
  