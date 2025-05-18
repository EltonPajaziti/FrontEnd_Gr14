import React from 'react';
import sms2 from '../assets/sms2.jpg';
import uni1 from '../assets/uni1.jpg';
import unii2 from '../assets/unii2.png';
import unii3 from '../assets/unii3.png';
import mechatronics from '../assets/mechatronics.jpg';
import architecture from '../assets/architecture.jpg';
import finance from '../assets/finance.jpg';
import computer1 from '../assets/computer1.jpg';
import medicine from '../assets/medicine.jpg';
import gazeta from '../assets/gazeta.jpg';
import art from '../assets/art.jpg';
import teacher from '../assets/teacher.jpg';
import lawyer from '../assets/lawyer.jpg';
import code9 from '../assets/code9.jpg';
import elektronik from '../assets/elektronik.jpg';
import konta1 from '../assets/konta1.jpg';
import medicine2 from '../assets/medicine2.jpg';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

import '../CSS/Study.css';
function Study() {
    return(
      <div>
        <Navbar/>
        <div className="program-links">
        <a href="#bachelor" className="link-button">Bachelor Programs</a>
        <a href="#master" className="link-button">Master Programs</a>
      </div>


    

      <div id="bachelor" className="section">
<div className="study-container">
      <div className="program-card">
        <img src={finance} alt="Management" />
        <h3>Management, Business and Economics</h3>
        <p>Bachelor Programs</p>
      </div>

      <div className="program-card">
        <img src={computer1} alt="Computer Science" />
        <h3>Computer Science and Engineering</h3>
        <p>Bachelor Programs</p>
      </div>

      <div className="program-card">
        <img src={mechatronics} alt="Mechatronics" />
        <h3>Mechatronics Engineering</h3>
        <p>Bachelor Programs</p>
      </div>

      <div className="program-card">
        <img src={medicine} alt="Medicine" />
        <h3>Medicine</h3>
        <p>Bachelor Programs</p>
      </div>

      <div className="program-card">
        <img src={gazeta} alt="journalism" />
        <h3>Journalism</h3>
        <p>Bachelor Programs</p>
      </div>

      <div className="program-card">
        <img src={teacher} alt="Education" />
        <h3>Education</h3>
        <p>Bachelor Programs</p>
      </div>


       <div className="program-card">
        <img src={art} alt="Art" />
        <h3>Art</h3>
        <p>Bachelor Programs</p>
      </div>


       <div className="program-card">
        <img src={lawyer} alt="Lawyer" />
        <h3>Lawyer</h3>
        <p>Bachelor Programs</p>
      </div>
      </div>
    </div> 

 <h2 id="master" className="section-title">Master Programs</h2>
      <div className="study-container">
        <div className="program-card">
          <img src={code9} alt="Computer Science" />
          <h3>Computer Science</h3>
          <p>Master Programs</p>
        </div>

        <div className="program-card">
          <img  src={konta1} alt="accounting" />
          <h3>Accounting</h3>
          <p>Master Programs</p>
        </div>

        <div className="program-card">
          <img src={medicine2} alt="Medicine" />
          <h3>Medicine</h3>
          <p>Master Programs</p>
        </div>

        <div className="program-card">
          <img src={elektronik}  alt="Electronics" />
          <h3>Electronics</h3>
          <p>Master Programs</p>
        </div>
      </div>
<div/>
    <Footer/>
    </div>

    )
  }
  
  export default Study;
  