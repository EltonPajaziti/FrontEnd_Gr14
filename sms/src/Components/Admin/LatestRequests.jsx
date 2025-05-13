import React from 'react';

const requests = [
  { name: "Leutrim Hajdini", type: "student", time: "Sot, 14:35" },
  { name: "Filan Fisteku", type: "profesor", time: "Dje, 09:12" },
  { name: "Test Testovski", type: "student", time: "Para 2 ditësh" },
];

const LatestRequests = () => {
  return (
    <div className="latest-requests">
      <h3>Kërkesat e Fundit</h3>
      {requests.map((r, i) => (
        <div key={i} className="request">
          <div>
            <strong>{r.name}</strong>
            <p>Kërkesë për regjistrim si {r.type}</p>
            <small>{r.time}</small>
          </div>
          <div>
            <button className="btn decline">Refuzo</button>
            <button className="btn approve">Aprovo</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestRequests;
