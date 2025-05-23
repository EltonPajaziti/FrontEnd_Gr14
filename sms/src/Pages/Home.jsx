import React, { useState } from 'react';
import sms2 from '../assets/sms2.jpg';
import uni1 from '../assets/uni1.jpg';
import unii2 from '../assets/unii2.png';
import unii3 from '../assets/unii3.png';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import '../CSS/Home.css';

function Home(){


    return(
        <>
    <Navbar />

    <div className="home">
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
            <div class="carousel-item active c-item">
                <img src={unii2} class="d-block w-100 c-img"/>
            </div>
            {/* <div class="carousel-item c-item">
                <img src={unii3} class="d-block w-100 c-img"/>
            </div> */}

            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>

  

<div class="student-services-container">
  <div class="sidebar">
    <ul>
      <li><a href="#">Kartela Studentore</a></li>
      <li class="active"><a href="#">SMS</a></li>
      <li><a href="#">SMIS</a></li>
      <li><a href="#">Asistencë Financiare</a></li>
      <li><a href="#">Plani Mësimor</a></li>
      <li><a href="#">Shërbime Këshillimore</a></li>
      <li><a href="#">Transkriptet</a></li>
      <li><a href="#">Studentët Ndërkombëtarë</a></li>
    </ul>
  </div>

  <div class="service-description">
    <h2>Platforma SMS</h2>
    <p>
      SMS është një platformë mësimore e krijuar për të ofruar mësimdhënësve, administratorëve dhe studentëve një sistem të vetëm të sigurt dhe të integruar për të ndërtuar përvoja mësimore të personalizuara.
    </p>
    <p>
      SMS është e besueshme dhe përdoret nga institucione të shumta, përfshirë edhe UBT-në për stafin dhe studentët. Ajo ka një ndërfaqe të thjeshtë, mundësi tërheqje dhe lëshimi (drag-and-drop), si dhe burime të dokumentuara mirë që e bëjnë shumë të lehtë për përdorim.
    </p>
    <p>
      SMS është platformë online dhe mund të aksesohet nga çdo vend në botë. Me mbështetje për pajisje mobile dhe përputhshmëri me shumicën e shfletuesve, përmbajtja në Moodle është gjithmonë e qasshme dhe konsistente.
    </p>
    <p>
      Ashtu si me shërbimet tjera elektronike të UBT-së, studentët kanë qasje në SMS përmes email-it personal të dhënë gjatë regjistrimit.
    </p>
  </div>
</div>

<section class="features-section">
  <h2 class="features-title">Çfarë Ofron Platforma</h2>
  <div class="features-grid">
    <div class="feature-box">
      <div class="feature-icon">📊</div>
      <h3>Raporte Akademike</h3>
      <p>Automatizoni vlerësimet dhe ndjekjen e performancës për të mbështetur suksesin e studentëve.</p>
    </div>
    <div class="feature-box">
      <div class="feature-icon">🗂️</div>
      <h3>Dosje Studentore</h3>
      <p>Profile të centralizuara të studentëve për qasje të shpejtë në historikun akademik dhe të dhënat personale.</p>
    </div>
    <div class="feature-box">
      <div class="feature-icon">👩‍🏫</div>
      <h3>Qasje me Role të Ndryshëm</h3>
      <p>Panele të personalizuara për Administratorë, Mësimdhënës dhe Studentë për bashkëpunim efikas.</p>
    </div>
    <div class="feature-box">
      <div class="feature-icon">📆</div>
      <h3>Orari i Mësimeve</h3>
      <p>Planifikoni, menaxhoni dhe përditësoni oraret e mësimeve me lehtësi dhe efikasitet.</p>
    </div>
  </div>
</section>


    <Footer />

        </>

    )
}

export default Home;