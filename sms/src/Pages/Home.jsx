import React from 'react';
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
            <div class="carousel-item c-item">
                <img src={unii3} class="d-block w-100 c-img"/>
            </div>

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

    <div className="UP-text-container">
        <div className="Up-text-header">
        <h1>The University of Prishtina is the academic heart of Kosovo, making an impact beyond borders</h1>
        </div>
        <div className="Up-text-paragraph">
        <p>The University of Prishtina is located in the capital of Kosovo and stands as the oldest and largest higher education institution in the country. With thousands of dedicated students and academic staff, it forms a dynamic scientific and educational community. In the region, the University is recognized for its ongoing contribution to society, education, and scientific research. Since its establishment on February 13, 1970, the University of Prishtina has played a vital role in shaping a brighter future for new generations.</p>
        </div>
    </div>
    <Footer />

        </>

    )
}

export default Home;