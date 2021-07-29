import React from 'react';
import './Home.css';
import Bid from '../bid/Bid';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bids: [],
            requestEnded: false
        };
    }

    componentDidMount(){
        fetch("http://51.83.45.52:8080/bid")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
                bids: result,
                requestEnded: true
            });
          }
        )
    }

    render(){
        const { bids, requestEnded } = this.state;
        if(requestEnded){
            let bidsToDisplay = [];
            for(var i = 0; i < bids.length; i++){
                bidsToDisplay.push(<Bid appProps={this.props.appProps} key={i} id={bids[i].id} title={"Enchère " + bids[i].id}/>);
            }
            return (
                <div className='row justify-content-center'>
                    {bidsToDisplay}
                </div>
            );
        }else{
            return(<div>Loading...</div>);
        }
        
    }
}

export default Home;