import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../walletconnect/walletconnect';
import './header.styles.scss';

const Header = () => {
  return (
    <div>
      <div className="header">
        <nav className='nav-menu container'>
          <div className='logo'>
            <Link to='/'>The Great Library</Link>
          </div>
          <ul>
            <li>
              <Link to='/books'>
                Books
              </Link>
            </li>
            <li>Authors</li>
            <li>Contact Us</li>
            <li>
              <a href="https://thegreatlibrary-unity-game-thegreatlibrary.vercel.app/" target="_blank">Game</a>
            </li>
          </ul>
          <WalletConnect />
        </nav>
      </div>
      <div className="header-lefteffect">
        <img src="/assets/img/header-left.png"></img>
      </div>
      <div className="header-righteffect">
        <img src="/assets/img/header-right.png"></img>
      </div>
    </div>
  );
}

export default Header;
