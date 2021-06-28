// SPDX-License-Identifier: GNU3
pragma solidity >=0.4.22 <=0.8.6;
import "./IBidC.sol";
import "./IBidCNFT.sol";

contract Bidding {
    address public owner = msg.sender;

    IBidC private _token;
    IBidCNFT private _NFT;

    struct Bid {
        address bidder;
        uint256 price;
    }

    mapping(uint256 => Bid[]) public _bids;

    constructor(IBidC token, IBidCNFT NFT) {
        _token = token;
        _NFT = NFT;
    }

    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    function createBid(string memory bidJSON) public returns (uint256){
        return _NFT.createBid(msg.sender, bidJSON);
    }

    function addBid(uint256 nftId,uint256 amount) public returns (bool){
        if(_NFT.exists(nftId)){
            // Si la personne qui enchérie n'a pas l'argent nécéssaire
            if(_token.balanceOf(msg.sender) >= amount){
                /* 
                 * On vérifie toutes les enchères en cours
                 * si une est déjà existante a + cher ou au même prix
                 * on renvoie false
                 */ 
                Bid[] memory currentBids = _bids[nftId];
                for(uint256 i = 0; i < currentBids.length; i++){
                    if(currentBids[i].price >= amount){
                        return false;
                    }
                }

                // si l'enchère est valide, on la crée et on la rajoute dans l'array
                Bid memory newBid = Bid(msg.sender,amount);
                _bids[nftId].push(newBid);

                // on récupère également la somme de l'enchère pour la bloquer le temps de l'enchère
                if (msg.sender != owner){
                    _token.transfer(owner, amount);
                }else{
                    _token.transfer(0x9ec29AD24069c34C97544b74b1b72b04aB6687F3, amount);
                }
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    function viewBids(uint256 nftId) public view returns(Bid[] memory){
        return _bids[nftId];
    }

    function currentBalance() public view returns(uint256){
        return _token.balanceOf(msg.sender);
    }

}
