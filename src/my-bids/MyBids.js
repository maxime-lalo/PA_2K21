import React from 'react';
import './MyBids.css';
import Bid from '../bid/Bid';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

class MyBids extends React.Component{
	constructor(props) {
	  super(props);
		this.myBids = this.myBids.bind(this);
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

	async myBids(e){
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		var tx = {from: this.props.appProps.account};
		await this.props.appProps.bidding.methods.myBids(JSON.stringify(data),data.basePrice).send(this.props.appProps.account,1000,tx);
		let nftId = await this.props.appProps.ibidcnft.methods.lastCreatedNft().call();
		MySwal.fire({
			title: "NFT créé",
			text: `Le NFT avec l'identifiant ${nftId} a bien été créé`,
			icon: 'success'
		});
	}
}

export default MyBids;