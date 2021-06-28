const IBidC = artifacts.require("IBidC");
const IBidCNFT = artifacts.require("IBidCNFT");
const Bidding = artifacts.require("Bidding");
module.exports = async function (deployer) {
  await deployer.deploy(IBidC);
  const token = await IBidC.deployed();

  await deployer.deploy(IBidCNFT);
  const nft = await IBidCNFT.deployed();

  await deployer.deploy(Bidding,token.address,nft.address);
};