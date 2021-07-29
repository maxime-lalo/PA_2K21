import React from 'react';
import './Bid.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

class Bid extends React.Component{
    numberWithSpaces(x){
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

    constructor(props) {
        super(props);
        this.bid = this.bid.bind(this);
        this.getBid = this.getBid.bind(this);

        this.state = {
            price: 0,
            bidder: "0x0",
            json: {
                name: 'Loading...',
                description: 'Loading...',
                basePrice: 0
            },
            owner: "0x0"
          }
    }

    render(){
        return(
            <div className='col-3 bid'>
                <form onSubmit={this.bid}>
                    <h3 className='text-center'>{this.state.json.name}</h3>
                    <p className='text-center'>{this.state.json.description}</p>
                    <hr/>
                    <p className='text-left'>
                        {this.state.owner}
                        <br/>
                        Base price | {parseInt(this.state.json.basePrice)} IBC
                    </p>
                    <hr/>
                    <p className='text-left'>
                        {this.numberWithSpaces(this.state.price)} IBC enchéris par
                        <br/>
                        {this.state.bidder}
                    </p>
                    <hr/>
                    <input type='number' min-val={(parseInt(this.state.price) + 1)} name='bid' className='form-control mb-2' />
                    <button type="submit" className='btn btn-primary mb-2'>Enchérir</button>
                </form>
            </div>
        );
    }

    componentDidMount(){
        setTimeout(() => {
            this.getBid();
        },3000)
    }

    async getBid(){
        if (this.props.appProps.isLoading === true) {
            let exists = await this.props.appProps.ibidcnft.methods.exists(this.props.id).call();
            if(exists){
                let owner = await this.props.appProps.ibidcnft.methods.ownerOf(this.props.id).call();
                let json = await this.props.appProps.ibidcnft.methods.tokenURI(this.props.id).call();
                json = JSON.parse(json);

                let bidder = "0x0";
                let max = 0;

                let data = await this.props.appProps.bidding.methods.viewBids(this.props.id).call();
                for(let i = 0; i < data.length; i++){
                    if(parseInt(data[i].price) > max){
                        max = parseInt(data[i].price);
                        bidder = data[i].bidder;
                    }
                }
                this.setState({
                    price: max,
                    bidder,
                    owner,
                    json
                });
            }
        }
    }

    async bid(e){
        e.preventDefault();
        const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
        if(data.bid <= this.state.price){
            MySwal.fire({
                title: "Erreur",
                text: `Vous devez enchérir au moins 1 IBC de plus que l'enchère la plus grosse`,
                icon: 'error'
            });
        }else{
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
}

export default Bid;