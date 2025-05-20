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
  const bachelorPrograms = [
    {
      img: finance,
      title: "Management, Business and Economics",
      backText: "This program equips students with a deep understanding of economic theories, business strategies, and financial systems. It prepares future leaders to make informed decisions in both corporate and public sectors. Graduates are well-positioned for careers in management, banking, marketing, and entrepreneurship."
    },
    {
      img: computer1,
      title: "Computer Science and Engineering",
      backText: "Focusing on both software and hardware systems, this program blends theoretical knowledge with practical skills. Students learn programming, data structures, AI, and computer architecture. The degree opens doors to careers in software development, cybersecurity, and tech innovation."
    },
    {
      img: mechatronics,
      title: "Mechatronics Engineering",
      backText: "Combining mechanical, electrical, and computer engineering, this interdisciplinary program is ideal for students passionate about robotics and automation. It emphasizes the design and development of smart systems and machines. Graduates often work in high-tech industries such as automotive, manufacturing, and aerospace."
    },
    {
      img: medicine,
      title: "Medicine",
      backText: "This rigorous program trains future doctors with a solid foundation in biomedical sciences, clinical practice, and patient care. Students gain hands-on experience through hospital rotations and laboratory work. Upon graduation, they are prepared to enter medical practice or specialize further."
    },
    {
      img: gazeta,
      title: "Journalism",
      backText: "This program trains students to become ethical and skilled storytellers across print, digital, and broadcast platforms. It covers investigative reporting, media law, and communication theory. Graduates can pursue careers in news media, public relations, or digital content creation."
    },
    {
      img: teacher,
      title: "Education",
      backText: "Designed for future teachers and educators, this program focuses on child development, pedagogy, and classroom management. It emphasizes practical experience through school placements. Graduates are prepared to work in primary and secondary education settings or pursue further specialization."
    },
    {
      img: art,
      title: "Art",
      backText: "This program nurtures creativity and artistic expression through courses in drawing, painting, sculpture, and digital media. Students develop a strong portfolio and learn both traditional and modern art techniques. It prepares them for careers as professional artists, designers, or art educators."
    },
    {
      img: lawyer,
      title: "Lawyer",
      backText: "Focused on legal theory, ethics, and practice, this program prepares students for a career in law and justice. It includes modules on constitutional law, civil rights, and international law. Graduates can continue with legal training or work in government, business, or advocacy roles."
    }
  ];

  const masterPrograms = [
    {
      img: code9,
      title: "Computer Science",
      backText: "This advanced program deepens students' knowledge in algorithms, software development, artificial intelligence, and data systems. It emphasizes research, critical thinking, and solving complex computational problems. Graduates are well-prepared for roles in academia, advanced engineering, or tech leadership."
    },
    {
      img: konta1,
      title: "Accounting",
      backText: "The program builds on core financial principles, exploring advanced topics like auditing, financial reporting, and strategic management. It prepares students to become certified professionals or take on senior roles in finance departments. Emphasis is also placed on analytical skills and ethical practices"
    },
    {
      img: medicine2,
      title: "Medicine",
      backText: "This program is designed for medical graduates seeking specialization or advanced research skills in the medical field. It integrates scientific knowledge with clinical training and evidence-based practice. Graduates often pursue roles in specialized medicine, hospital leadership, or medical research."
    },
    {
      img: elektronik,
      title: "Electronics",
      backText: "Focusing on the design and analysis of electronic systems, this program covers embedded systems, signal processing, and power electronics. It combines theory with practical lab work and project development. Graduates typically work in industrial automation, telecommunications, or R&D sectors."
    }
  ];

  const renderCard = (item, programType) => (
    <div className="program-card" key={item.title}>
      <div className="card-inner">
        <div className="card-front">
          <img src={item.img} alt={item.title} />
          <div className="text-content">
            <h3>{item.title}</h3>
            <p>{programType} Programs</p>
          </div>
        </div>
        <div className="card-back">
          <p>{item.backText}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />

      <div className="program-links">
        <a href="#bachelor" className="link-button">Bachelor Programs</a>
        <a href="#master" className="link-button">Master Programs</a>
      </div>

      <div id="bachelor" className="section">
        <div className="study-container">
          {bachelorPrograms.map(item => renderCard(item, 'Bachelor'))}
        </div>
      </div>
    <div class="master-h2">
      <h2 id="master" className="section-title">Master Programs</h2>
      </div>

      <div className="study-container">
        {masterPrograms.map(item => renderCard(item, 'Master'))}
      </div>

      <Footer />
    </div>
  );
}

export default Study;
