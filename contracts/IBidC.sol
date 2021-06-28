// SPDX-License-Identifier: GNU3
pragma solidity >=0.4.22 <=0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IBidC is ERC20 {
    
    uint256 initialSupply = 281298050198;

    constructor() ERC20("IBidC", "IBC") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}