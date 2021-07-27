import React from 'react';
import './Header.css';
import logo from '../logo.png';

class Header extends React.Component{
  numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }
  
  render() {
    return (
      <div className="Header">
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-custom">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src={logo} alt="Logo" className="d-inline-block align-text-top" width="250"/>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/create-bid">Créer une enchère</a>
                </li>
              </ul>
              <span className="navbar-text" id="ticker"></span>
            </div>
            <div className=""><b>Your balance: {this.numberWithSpaces(this.props.appProps.balance)} IBIDC | </b></div>
            <div className=""><b>&nbsp;Your account: {this.props.appProps.account}</b></div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
