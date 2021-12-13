import React from 'react';
import './Home.css';
import Bid from '../bid/Bid';
import { Default } from 'react-spinners-css';
require('dotenv').config()

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bids: [],
            requestEnded: false
        };
    }

    componentDidMount(){
        fetch(process.env.API_BASE + "/bid")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
                bids: result,
                requestEnded: true
            });
          }
        ).catch( (err) => {
            console.log(err);
        })
    }

    render(){
        const { bids, requestEnded } = this.state;
        if(requestEnded){
            let bidsToDisplay = [];
            for(var i = 0; i < bids.length; i++){
                if(bids[i].active === true){
                    bidsToDisplay.push(<Bid appProps={this.props.appProps} key={i} id={bids[i].id} title={"Enchère " + bids[i].id}/>);
                }
            }
            if(bidsToDisplay.length === 0){
                return (
                    <div className='row justify-content-center'>
                        <p className='text-center'>Aucune enchère en cours</p>
                        <p className='text-center'><a href='/create-bid'>Créer la mienne !</a></p>
                    </div>
                );
            }else{
                return (
                    <div className='row justify-content-center'>
                        {bidsToDisplay}
                    </div>
                );
            }
        }else{
            return(
                <div className='d-flex justify-content-center align-items-center loader'>
                    <Default color="#659DBD" size={200} />
                </div>
            );
        }
        
    }
}

export default Home;
