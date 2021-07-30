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
            bidder: "0x0", //le spinner <Default color="#659DBD" />
            json: {
                name: 'Loading...',
                description: 'Loading...',
                basePrice: 0
            },
            owner: "0x0"
          }
    }

    render(){
        if(this.props.appProps.bidding === undefined){
            return(<div>Loading...</div>);
        }

        return(
            <div className='col-3 bid'>
                <form onSubmit={this.bid}>
                    <h3 className='text-center'>{this.state.json.name}</h3>
                    <p className='text-center'>{this.state.json.description}</p>
                    <hr/>
                    <p className='text-left'>
                        Owner | <span title={this.state.owner} onClick={() => {this.copyBidder("owner")}}>{this.state.owner.substr(0,10)}...</span>
                        <br/>
                        Base price | {parseInt(this.state.json.basePrice)} IBC
                    </p>
                    <hr/>
                    {
                        this.state.bidder === this.state.owner &&
                        <p className='text-left'>Aucune enchère pour l'instant<br/><br/></p>
                    }
                    {
                        this.state.bidder !== this.state.owner &&
                        <p className='text-left'>
                        {this.numberWithSpaces(this.state.price)} IBC enchéris par
                        <br/>
                            <span title={this.state.bidder} onClick={() => {this.copyBidder("bidder")}}>{this.state.bidder.substr(0,10)}...</span>
                        </p>
                    }
                    <hr/>
                    {
                        this.state.owner === this.props.appProps.account && this.state.bidder !== this.props.appProps.account &&
                        <button type="submit" className='btn btn-primary mb-2'>Claim</button>
                    }
                    {
                        this.state.owner === this.props.appProps.account && this.state.bidder === this.props.appProps.account &&
                        <p>Vous ne pouvez pas claim, personne n'a enchéri !</p>
                    }
                    {
                        this.state.owner !== this.props.appProps.account && this.state.owner !== this.props.appProps.bidding._address &&
                        <div>
                            <input type='number' min-val={(parseInt(this.state.price) + 1)} name='bid' className='form-control mb-2' />
                            <button type="submit" className='btn btn-primary mb-2'>Enchérir</button>
                        </div>
                    }
                    {
                        this.state.owner !== this.props.appProps.account && this.state.owner === this.props.appProps.bidding._address &&
                        <p>Cette enchère est terminée</p>
                    }
                </form>
            </div>
        );
    }

    copyBidder(type){
        if(type === "owner"){
            navigator.clipboard.writeText(this.state.owner);
        }else{
            navigator.clipboard.writeText(this.state.bidder);
        }
        MySwal.fire({
            title: "Texte copié",
            text: `L'adresse a bien été copiée dans votre presse-papier`,
            icon: 'success'
        });
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
        var tx = {from: this.props.appProps.account};
        if(this.state.owner === this.props.appProps.account){
            let addressApproved = await this.props.appProps.ibidcnft.methods.getApproved(this.props.id).call();
            if(addressApproved !== this.props.appProps.bidding._address){
                MySwal.fire({
                    title: "Info",
                    text: "Vous devez approuver la transaction avant le claim",
                    icon: "info",
                    allowOutsideClick: false,
                    showCancelButton: false,
                    showConfirmButton: false
                });
                await this.props.appProps.ibidcnft.methods.approve(this.props.appProps.bidding._address,this.props.id).send(this.props.appProps.account,1000,tx);
            }
            MySwal.fire({
                title: "Info",
                text: "La transaction a bien été approuvée, vous pouvez l'envoyer",
                icon: "info",
                allowOutsideClick: false,
                showCancelButton: false,
                showConfirmButton: false
            });
            await this.props.appProps.bidding.methods.claimBid(this.props.id).send(this.props.appProps.account,1000,tx);
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.props.id })
            };
            fetch("http://51.83.45.52:8080/bid/",requestOptions)
            .then(res => res.json())
            .then(
            (result) => {
                console.log(result);
            })

            MySwal.fire({
                title: "Succès",
                text: "Vous avez bien claim l'enchère",
                icon: "success"
            });
        }else{
            if(data.bid <= this.state.price){
                MySwal.fire({
                    title: "Erreur",
                    text: `Vous devez enchérir au moins 1 IBC de plus que l'enchère la plus grosse`,
                    icon: 'error'
                });
            }else{
                // On approuve d'abord la transaction de nos IBIDC vers le contrat
                MySwal.fire({
                    title: "Approuver la transaction",
                    text: `La transaction a besoin d'être approuvée avant d'être éxécutée`,
                    icon: 'info',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    showConfirmButton: false
                });
                await this.props.appProps.ibidc.methods.approve(this.props.appProps.bidding._address,data.bid).send(this.props.appProps.account,1000,tx);
                MySwal.fire({
                    title: "Transaction",
                    text: `La transaction a bien été approuvée, vous devez maintenant la lancer`,
                    icon: 'info',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    showConfirmButton: false
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
}

export default Bid;