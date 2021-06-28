// import logo from './logo.png';

import React from 'react';
import './App.css';
import Web3 from 'web3';
import { IBidCAbi, Bidding } from './abi/abis';

class App extends React.Component {
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
      <div className="App">
        <div className="row justify-content-center">
          <header className="App-header">
          </header>
        </div>
      </div>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <div className="row justify-content-center">
//         <header className="App-header">
//         </header>
//       </div>
//     </div>
//   );
// }

export default App;