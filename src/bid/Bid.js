import React from 'react';
import './Bid.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

class Bid extends React.Component{
    constructor(props) {
        super(props);
        this.bid = this.bid.bind(this);
        this.getLastBid = this.getLastBid.bind(this);

        this.state = {
            price: 0,
            bidder: "0x0"
          }
    }

    render(){
        return(
            <div className='col-3 bid'>
                <form onSubmit={this.bid}>
                    <h3 className='text-center'>{this.props.title}</h3>
                    <p className='text-center'>Description de l'enchère</p>
                    <hr/>
                    <p className='text-left'>
                        {this.state.price} IBIDC enchéris par
                        <br/>
                        {this.state.bidder}
                    </p>
                    <hr/>
                    <input type='number' min-val={(this.state.price+1)} defaultValue={(this.state.price+1)} name='bid' className='form-control mb-2' />
                    <button type="submit" className='btn btn-primary mb-2'>Enchérir</button>
                </form>
            </div>
        );
    }

    componentDidMount(){
        setTimeout(() => {
            this.getLastBid();
        },3000) 
    }

    getLastBid(){
        let bidder = "0x0";
        let max = 0;
        this.props.appProps.bidding.methods.viewBids(this.props.id).call().then( (data) => {
            for(let i = 0; i < data.length; i++){
                if(data[i].price > max){
                    max = data[i].price;
                    bidder = data[i].bidder;
                }
            }
            this.setState({
                price: max,
                bidder: bidder
            });
        });
    }

    async bid(e){
        e.preventDefault();
        const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
        var tx = {from: this.props.appProps.account};
        // On approuve d'abord la transaction de nos IBIDC vers le contrat
		await this.props.appProps.ibidc.methods.approve(this.props.appProps.bidding._address,data.bid).send(this.props.appProps.account,1000,tx);
		MySwal.fire({
			title: "Transaction",
			text: `La transaction a bien été approuvée`,
			icon: 'success'
		});
        await this.props.appProps.bidding.methods.addBid(this.props.id,data.bid).send(this.props.appProps.account,1000,tx);
		MySwal.fire({
			title: "Enchère ajoutée",
			text: `L'enchère a bien été prise en compte`,
			icon: 'success'
		});
    }
}

export default Bid;