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
          <div className="social-icon-git"><GithubIcon /></div>
          <div className="social-icon"><TwitterIcon /></div>
          <div className="social-icon"><LinkIcon /></div>
        </div>
      </div>
    </div>
  );
}

export default Footer;