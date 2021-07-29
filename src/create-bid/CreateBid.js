import React from 'react';
import './CreateBid.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

class CreateBid extends React.Component{
	constructor(props) {
	  super(props);
		this.createBid = this.createBid.bind(this);
	}

	render(){
		return(
			<div className='container-fluid'>
				<div className='row justify-content-center'>
					<div className='col-4'>
						<form name="myForm" id="myForm" onSubmit={this.createBid}>
							<div className="form-group mb-2">
								<input type="text" className="form-control" name="name" id="name" placeholder="Que vendez-vous ?" />
							</div>
							<div className="form-group mb-2">
								<input type="text" className="form-control" name="description" id="description" placeholder="Description" />
							</div>
							<div className="form-group mb-2">
								<input type="number" className="form-control" name="basePrice" id="basePrice" placeholder="Prix de départ" />
							</div>
							<button type="submit" className="btn btn-primary">Créer une enchère</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

	async createBid(e){
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		var tx = {from: this.props.appProps.account};
		await this.props.appProps.bidding.methods.createBid(JSON.stringify(data),data.basePrice).send(this.props.appProps.account,1000,tx);
		let nftId = await this.props.appProps.ibidcnft.methods.lastCreatedNft().call();
		MySwal.fire({
			title: "NFT créé",
			text: `Le NFT avec l'identifiant ${nftId} a bien été créé`,
			icon: 'success'
		});
	}
}

export default CreateBid;