// import logo from './logo.png';

import React from 'react';
import './App.css';
import Web3 from 'web3';
import Header from './header/Header';
import { IBidCAbi, BiddingAbi, IbidCNFTAbi } from './abi/abis';

class App extends React.Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChain()
  }

  async loadBlockChain() {
    const web3 = new Web3(Web3.givenProvider || Web3.providers.HttpProvider('https://ropsten.infura.io/v3/16cac94d5d4a43f3a79b7b0923aa0d0d'))
    
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0'
    }
  }
  
  render() {
    // let content
    
    // if(this.state.loading) {
    //   content = <p id="loader" className="text-center">Loading...</p>
    // } else {
    //   content = <App
    //     register={this.state.register}
    //     userBalance={this.state.userBalance}
    //     userName={this.state.userName}
    //     // daiTokenBalance={this.state.daiTokenBalance}
    //     // stakingBalance={this.state.stakingBalance}
    //     // stakeTokens={this.stakeTokens}
    //     // unstakeTokens={this.unstakeTokens}
    //   />
    // }

    return (
      <div>
        <Header account={this.state.account} />
        <div className="App">
          <div className="row justify-content-center">
            <header className="App-header">
            </header>
          </div>
        </div>
      </div>
    );
  }
}

export default App;