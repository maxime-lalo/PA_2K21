import React from 'react';
import './CreateBid.css';
import $ from 'jquery'

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

	createBid(e){
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		let nftId = this.props.appProps.bidding.methods.createBid(JSON.stringify(data),data.basePrice).call();
		console.log(nftId);
	}
}

export default CreateBid;