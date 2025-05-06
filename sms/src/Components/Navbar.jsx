import React from 'react';
import './Navbar.css';
import sms2 from '../assets/sms2.jpg';

function Navbar(){
  return(

    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">E-Services</a>
            </li>
    
            <a class="navbar-brand d-none d-lg-block" href="">
                <img src={sms2} alt="SMS Logo" className="img-fluid" style={{ height: "100px", }} />
            </a>
            
            <li class="nav-item">
              <a class="nav-link" href="">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">Study</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;