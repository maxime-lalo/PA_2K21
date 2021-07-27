// import logo from './logo.png';

import React from 'react';
import './App.css';
import Web3 from 'web3';
import Header from './header/Header';
import CreateBid from './create-bid/CreateBid';
import Home from './home/Home';
import IBidC from './abi/IBidC.json';
import Bidding from './abi/Bidding.json';
import IBidCNFT from './abi/IBidCNFT.json';

class App extends React.Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChain()
  }

  async loadBlockChain() {
    const web3 = new Web3(Web3.givenProvider || Web3.providers.HttpProvider('https://ropsten.infura.io/v3/16cac94d5d4a43f3a79b7b0923aa0d0d'))
    
    const networkId = await web3.eth.net.getId();
    
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    //Load IBidC
    const IBidCData = IBidC.networks[networkId];
    if (IBidCData) {
      const ibidc = new web3.eth.Contract(IBidC.abi, IBidCData.address)
      this.setState({ibidc})

      let balance = await this.state.ibidc.methods.balanceOf(this.state.account).call();
      this.setState({ balance: balance});
    } else {
      window.alert('IBidC contract not deployed to detected network.')
    }

    //Load Bidding
    const BiddingData = Bidding.networks[networkId];
    if (BiddingData) {
      const bidding = new web3.eth.Contract(Bidding.abi, BiddingData.address)
      this.setState({bidding})

    } else {
      window.alert('Bidding contract not deployed to detected network.')
    }

    //Load IBidCNFT
    const IBidCNFTData = IBidCNFT.networks[networkId];
    if (IBidCNFTData) {
      const ibidcnft = new web3.eth.Contract(IBidCNFT.abi, IBidCNFTData.address)
      this.setState({ibidcnft})
      
    } else {
      window.alert('IBidCNFT contract not deployed to detected network.')
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      balance: 0
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
    if(window.location.pathname === '/'){
        return (
          <div>
            <Header appProps={this.state} />
            <Home />
          </div>
        );
    }

    if(window.location.pathname === '/create-bid'){
        return(
          <div>
            <Header appProps={this.state} />
            <CreateBid appProps={this.state}/>
          </div>
        );
    }

    return (
      <div>
        <Header appProps={this.state} />
        <Home />
      </div>
    );
  }
}

export default App;