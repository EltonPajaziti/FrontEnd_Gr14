import React, { useState } from 'react';
import '../../CSS/Student/ParaqitProvimet.css';
import StudentSidebar from '../../Components/Student/StudentSidebar';

function ParaqitProvimet() {
  const [afati, setAfati] = useState('');
  const [semestri, setSemestri] = useState('');

  return (
    <div className="paraqit-provimet-page">
        <StudentSidebar/>
        <div class="provimet">
      <h2 className="page-title">Paraqit provimet</h2>
      <div className="provimet-form">
        <div className="form-group">
          <label>Afati</label>
          <select value={afati} onChange={(e) => setAfati(e.target.value)}>
            <option value="">Zgjidh</option>
            <option value="afat1">Afati i Përhershëm për Punim Diplome - Ba (Bachelor)-2024</option>
            <option value="afat1">Afati i Qershorit 2023</option>
            <option value="afat1">Afati i Shkurtit 2023</option>
            <option value="afat1">Afati i Janarit 2023</option>
            <option value="afat1">Afati i Nentorit 2022</option>

          </select>
        </div>

        <div className="form-group">
          <label>Semestri</label>
          <select value={semestri} onChange={(e) => setSemestri(e.target.value)}>
            <option value="">Zgjidh</option>
            <option value="sem1">Semestri 1</option>
            <option value="sem2">Semestri 2</option>
          </select>
        </div>
      </div>
      </div>
    </div>
  );
}

export default ParaqitProvimet;
