import React from 'react';
import './Header.css';
import Web3 from 'web3';
import logo from '../logo.png';

class Header extends React.Component{
  state = {account: ''}

  async loadBlockChain() {
    const web3 = new Web3(Web3.givenProvider || Web3.providers.HttpProvider('https://ropsten.infura.io/v3/16cac94d5d4a43f3a79b7b0923aa0d0d'))
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
  }

  componentDidMount() {
    this.loadBlockChain()
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
                  <a className="nav-link" href="/">Features</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/">Pricing</a>
                </li>
              </ul>
              <span className="navbar-text" id="ticker"></span>
            </div>
            <div className=""><b>Your account: {this.state.account}</b></div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
