import React from 'react';

const StatsCard = ({ title, value, info }) => {
  return (
    <div className="card">
      <h4>{title}</h4>
      <h2>{value}</h2>
      <p className="info">{info}</p>
    </div>
  );
};

export default StatsCard;