import React from 'react';
import '../../CSS/Professor/DashboardCards.css';

function DashboardCards() {
  return (
    <div className="dashboard-cards">
      <div className="card">
        <h3>Kurset Tuaja</h3>
        <h2>5</h2>
        <span>Semestri i dytë, 2024</span>
      </div>
      <div className="card">
        <h3>Studentët</h3>
        <h2>187</h2>
        <span>Në të gjitha kurset tuaja</span>
      </div>
      <div className="card">
        <h3>Nota Pa Caktuar</h3>
        <h2>32</h2>
        <span>Afati i fundit: 15 maj</span>
      </div>
      <div className="card">
        <h3>Provimet e Ardhshme</h3>
        <h2>3</h2>
        <span>I pari: 20 maj, 2024</span>
      </div>
    </div>
  );
}

export default DashboardCards;
