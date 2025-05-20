import React from 'react';
import '../Css/Navbar.css';
import sms2 from '../assets/sms2.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';  
import { Link } from 'react-router-dom';


function Navbar(){
  return(

    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
            <Link className="nav-link" to="../">Home</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="../eServices">eServices</Link>
            </li>
    
            <a className="navbar-brand d-none d-lg-block" href="">
                <img src={sms2} alt="SMS Logo" className="img-fluid" style={{ height: "100px", }} />
            </a>
            
            <li className="nav-item">
            <Link className="nav-link" to="../About">About</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="../Study">Study</Link>
            </li>
          </ul>
        </div>

    <div className="d-flex ms-auto">
  <Link to="../../Pages/Login" className="login-button">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;