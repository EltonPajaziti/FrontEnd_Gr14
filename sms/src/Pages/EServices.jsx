import React from 'react';
import sms2 from '../assets/sms2.jpg';
import uni1 from '../assets/uni1.jpg';
import unii2 from '../assets/unii2.png';
import unii3 from '../assets/unii3.png';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

import '../CSS/EServices.css';


function EServices() {
  const services = [
    { title: "Student", icon: "👨‍🎓" },
    { title: "Faculty", icon: "👩‍🏫" },
    { title: "AU Staff", icon: "👥" },
    { title: "Alumni", icon: "🎓" },
    {
      title: "Graduation Certificate & Student Letter Verification Systems",
      icon: "📜✅"
    },
  ];

  return (
    <>
      <Navbar />
      <div className="eServices">
        <h1 className="title">e-Services</h1>
        <div className="cards-grid">
          {services.map((service, index) => (
            <div className="card" key={index}>
              <div className="icon">{service.icon}</div>
              <h3 className="card-title">{service.title}</h3>
              <p className="explore-link">Explore More →</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EServices;