import React from 'react';
import './Home.css';
import Bid from '../bid/Bid';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Home extends React.Component{
    render(){
        let bids = [];
        for(var i = 1; i < 11; i++){
            bids.push(<Bid appProps={this.props.appProps} key={i} id={i} title={"Enchère " + i} price={getRandomInt(2000)}/>);
        }
        return (
            <div className='row justify-content-center'>
                {bids}
            </div>);
    }
}

export default Home;