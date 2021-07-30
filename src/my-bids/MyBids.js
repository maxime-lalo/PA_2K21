import React from 'react';
import './MyBids.css';
import Bid from '../bid/Bid';
import { Default } from 'react-spinners-css';

class MyBids extends React.Component{
	constructor(props) {
	  super(props);
		this.state = {
            bids: [],
            requestEnded: false
        };
	}

    getMyBids(){
        fetch("http://51.83.45.52:8080/bid/" + this.props.appProps.account)
        .then(res => res.json())
        .then(
          (result) => {
              console.log(result);
            this.setState({
                bids: result,
                requestEnded: true
            });
          }
        )
    }

    componentDidMount(){
        setTimeout(() => {
            this.getMyBids();
        },2000);
    }
    render(){
        const { bids, requestEnded } = this.state;
        if(requestEnded){
            if(bids.length === 0){
                return (<div>Vous n'avez aucune enchère à afficher</div>)
            }else{
                let bidsToDisplay = [];
                for(var i = 0; i < bids.length; i++){
                    bidsToDisplay.push(<Bid appProps={this.props.appProps} key={i} id={bids[i].id} title={"Enchère " + bids[i].id}/>);
                }
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

export default MyBids;