import React from 'react';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './hero.styles.scss';

const Hero = () => {
  return (
    <section className="hero is-info is-large">
      <Carousel showArrows={true} autoPlay showThumbs={false} infiniteLoop showIndicators={false}>
          <div className="slider-item">
              <img src="assets/img/slider/image1.png" />
          </div>
          <div className="slider-item">
              <img src="assets/img/slider/image2.png" />
              <div className="content-area">
                <p className="content-title">Books reimagined for modern life.</p>
                <p className="content-description">Books for the new millennium.</p>
                <button className="btn btn-header">Learn More</button>
              </div>
          </div>
          <div className="slider-item">
              <img src="assets/img/slider/image3.png" />
              <div className="content-area">
                <p className="content-title">Books reimagined for modern life.</p>
              </div>
          </div>
      </Carousel>
    </section>
  );
}

export default Hero;
