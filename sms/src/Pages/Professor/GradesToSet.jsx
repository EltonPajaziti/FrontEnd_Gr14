import React from 'react';


function GradesToSet() {
  return (
    <div className="grades">
      <h3>Notat që duhen vendosur</h3>

      <div className="grade-item">
        <p>Sisteme të Shpërndara</p>
        <span>15 nota të pavendosura</span>
        <button className="grade-btn">Vendos tani</button>
      </div>

      <div className="grade-item">
        <p>Rrjeta Kompjuterike</p>
        <span>8 nota të pavendosura</span>
        <button className="grade-btn">Vendos tani</button>
      </div>

      <div className="grade-item">
        <p>Bazat e të Dhënave</p>
        <span>12 nota të pavendosura</span>
        <button className="grade-btn">Vendos tani</button>
      </div>
    </div>
  );
}

export default GradesToSet;
