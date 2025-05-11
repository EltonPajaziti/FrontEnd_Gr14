import './Footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';  

function Footer(){
    return(
    <footer className="footeri pt-5 pb-4">
        <div className="sms1">
          <h1>SMS</h1>
          <p>University of Prishtina</p>
        </div>
        <hr />
        <div className="contact">
          <div className="c1">
            <h3>Contact</h3>
            <p>Adress: Rr. "George Bush", p.n., 10 000 Prishtinë, Republic of Kosovo</p>
            <p>Tel: +383 38 452 122/189 973</p>
            <br />
            <p>E-Mail: sms@gmail.com</p>
          </div>
        
          <div className="social">
            <div class="social1">
              <a href="https://facebook.com"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
            </div>
            <div class="social2">
              <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
              <a href="https://pinterest.com"><i className="fab fa-pinterest-p"></i></a>
            </div>
          </div>
        </div>
      
        <div className="copyr">
          <div className="footer-bottom">
            <p>&copy; 2025 SMS</p>
          </div>
        </div>
    </footer>
    )
}
export default Footer;