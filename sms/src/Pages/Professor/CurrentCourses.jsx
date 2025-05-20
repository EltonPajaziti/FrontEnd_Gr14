import React from 'react';


function CurrentCourses() {
  return (
    <div className="courses">
      <h3>Kurset Aktuale</h3>
      <div className="course-list">
        <div className="course">
          <p>Sisteme të Shpërndara</p>
          <span>CS404 - 89 studentë</span>
          <button className="grade-btn">Vendos Nota</button>
        </div>
      </div>
    </div>
  );
}

export default CurrentCourses;
