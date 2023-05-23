import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from "react-router-dom";
import './hero.styles.scss';
import '../featured-collection/featured-collection.styles.scss'

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero is-info is-large">
      <Carousel showArrows={true} autoPlay showThumbs={false} infiniteLoop showIndicators={false}>
          <div className="slider-item">
              <img src="assets/img/slider/image2.png" alt=''/>
              <div className="content-area">
                <p className="content-title">Welcome to The Great Library!</p>
                <p className="content-description">Connect your wallet to embark on a literary journey like no other.</p>
                <button className="btn btn-header" onClick={() => window.open("https://whitepaper.greatlibrary.io/the-great-library/welcome-to-the-great-library", "_blank")}>Learn More</button>

      <div className="row">
        <div className="col-md-12 viewmore-area" style={{"display": "flex",  "flex-direction": "column", "align-items": "center" , "justify-content": "center"}}>
          <button className="btn btn-header" onClick={() => navigate(`/books`)}>View Books</button>
        </div>
      </div>

              </div>
          </div>
          <div className="slider-item">
              <img src="assets/img/slider/image1.png"  alt=''/>
              <div className="content-area">
                <p className="content-title">Books reimagined for modern life.</p>
                <p className="content-description">Books for the new millennium.</p>
                <button className="btn btn-header" onClick={() => window.open("https://whitepaper.greatlibrary.io/the-great-library/welcome-to-the-great-library", "_blank")}>Learn More</button>

      <div className="row">
        <div className="col-md-12 viewmore-area" style={{"display": "flex",  "flex-direction": "column", "align-items": "center" , "justify-content": "center"}}>
          <button className="btn btn-header" onClick={() => navigate(`/books`)}>View Books</button>
        </div>
      </div>

              </div>
          </div>

          <div className="slider-item">
              <img src="assets/img/slider/image3.png"  alt=''/>
              <div className="content-area">
                <p className="content-title">Books reimagined for modern life.</p>
                <button className="btn btn-header" onClick={() => window.open("https://whitepaper.greatlibrary.io/the-great-library/welcome-to-the-great-library", "_blank")}>Learn More</button>

      <div className="row">
        <div className="col-md-12 viewmore-area" style={{"display": "flex",  "flex-direction": "column", "align-items": "center" , "justify-content": "center"}}>
          <button className="btn btn-header" onClick={() => navigate(`/books`)}>View Books</button>
        </div>
      </div>
              </div>
          </div>
      </Carousel>
    </section>
  );
}

export default Hero;
