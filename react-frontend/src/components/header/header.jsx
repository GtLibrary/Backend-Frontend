import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../walletconnect/walletconnect';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './header.styles.scss';

const Header = () => {
  return (
    <div className="header">
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="https://greatlibrary.io/">The Great Library</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-btn" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="nav-list">
              <Nav.Link href="/books">Books</Nav.Link>
              <Nav.Link href="https://author.greatlibrary.io">Authors</Nav.Link>
              <Nav.Link href="/swap">Swap</Nav.Link>
              {/* <Nav.Link href="/marketplace">Marketplace</Nav.Link> */}
              <Nav.Link href="/auctionhouse">Auction House</Nav.Link>
              <Nav.Link href="/xspaces">𝕏Spaces</Nav.Link>
              <Nav.Link href="/terms">Terms & Services</Nav.Link>
              <Nav.Link href="mailto:johnrraymond@greatlibrary.io">Contact Us</Nav.Link>
            </Nav>
            <WalletConnect />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <img className="header-effect" src="/assets/img/navbarbg.png" alt="header effect" />
    </div>
  );
}

export default Header;
