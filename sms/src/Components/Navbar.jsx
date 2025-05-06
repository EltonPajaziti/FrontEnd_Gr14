import React from 'react';
import './Navbar.css';
import sms2 from '../assets/sms2.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';  


function Navbar(){
  return(

    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">E-Services</a>
            </li>
    
            <a className="navbar-brand d-none d-lg-block" href="">
                <img src={sms2} alt="SMS Logo" className="img-fluid" style={{ height: "100px", }} />
            </a>
            
            <li className="nav-item">
              <a className="nav-link" href="">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">Study</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;