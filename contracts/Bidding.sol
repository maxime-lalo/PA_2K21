// SPDX-License-Identifier: GNU3
pragma solidity >=0.4.22 <=0.8.6;
import "./IBidC.sol";
import "./IBidCNFT.sol";

contract Bidding {
    address public owner = msg.sender;
    address public burnAddr = 0x0000000000000000000000000000000000000000;

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

    function createBid(string memory bidJSON, uint256 defaultPrice) public returns (uint256){
        uint256 nftId = _NFT.createBid(msg.sender, bidJSON);
        Bid memory newBid = Bid(msg.sender,defaultPrice);
        _bids[nftId].push(newBid);
        return nftId;
    }

    function addBid(uint256 nftId,uint256 amount) public returns (bool){
        // On vérifie que le NFT existe bien
        require(_NFT.exists(nftId),"The NFT doesn't exists");
            
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

        // On vérifie si la personne a déjà enchéri
        Bid memory alreadyBid = Bid(burnAddr,0);
        for(uint256 i = 0; i < currentBids.length; i++){
            if(currentBids[i].bidder == msg.sender){
                alreadyBid = currentBids[i];
            }
        }

        /**
        * si la personne a déjà enchéri, on bloque la différence entre la dernière enchère
        * et la nouvelle, sinon on bloque la somme entière
        */
        uint256 lockedAmount = 0;
        if (alreadyBid.bidder != burnAddr){
            lockedAmount = (amount - alreadyBid.price);
        }else{
            lockedAmount = amount;
        }

        // Si la personne qui enchérit n'a pas l'argent nécéssaire
        require(_token.balanceOf(msg.sender) >= lockedAmount,"You don't have the amount you're bidding for");

        // On bloque sur le compte du owner la somme de l'enchère
        _token.approve(address(this), amount);
        _token.transferFrom(msg.sender,address(this), lockedAmount);

        // si l'enchère est valide, on la crée et on la rajoute dans l'array
        Bid memory newBid = Bid(msg.sender,amount);
        _bids[nftId].push(newBid);
        return true;
    }

    function viewBids(uint256 nftId) public view returns(Bid[] memory){
        return _bids[nftId];
    }

    function claimBid(uint256 nftId) public returns(bool) {
        Bid[] memory currentBids = _bids[nftId];

        // On récupère la dernière entrée, qui est forcément l'enchère la plus haute
        Bid memory winnerBid = currentBids[currentBids.length-1];

        // On récupère l'adresse de celui qui possède le NFT
        address nftOwner = _NFT.ownerOf(nftId);
        require((msg.sender == nftOwner),"You must be the owner of the bid to claim it");
        // On burn le NFT et on transfère l'argent à celui qui a mis l'enchère
        _NFT.transferFrom(nftOwner, burnAddr, nftId);
        _token.transferFrom(owner, nftOwner, winnerBid.price);

        // On supprime le vainqueur des enchères pour pouvoir garder uniquement les perdants
        delete currentBids[currentBids.length-1];

        // On rend les tokens pris aux gens qui ont enchéri mais n'ont pas gagné
        for(uint256 i = 0; i < currentBids.length; i++){
            _token.transferFrom(owner, currentBids[i].bidder, currentBids[i].price);
        }
        return true;
        
    }

    function currentBalance() public view returns(uint256){
        return _token.balanceOf(msg.sender);
    }

    function getAllowance() public view returns(uint256){
        return _token.allowance(address(this), msg.sender);
    }

    function getMe() public view returns(address){
        return msg.sender;
    }
}
