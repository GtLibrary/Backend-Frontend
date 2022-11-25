import React from 'react';
import './footer.styles.scss';
import { GithubIcon, TwitterIcon, LinkIcon } from "./socialIcon"

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className='footer'>
      <div className="container footer-content">
        <div className="copyright">
          Copyright greatlibrary.io 2021-2022. <br/>
          All rights reserved.
        </div>
        <div className="social-area">
          <a href="https://github.com/GtLibrary/"><div className="social-icon-git"><GithubIcon /></div></a>
          <a href="#"><div className="social-icon"><TwitterIcon /></div></a>
          <a href="#"><div className="social-icon"><LinkIcon /></div></a>
        </div>
      </div>
    </div>
  );
}

export default Footer;