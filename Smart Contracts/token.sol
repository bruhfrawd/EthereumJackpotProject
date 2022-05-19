pragma solidity >=0.7.0 <0.9.0;
//SPDX-License-Identifier: UNLICENSED
//Address = "0x8665Fe36ddEdB37EBe606ef74caA9EB9a0453d11"
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol';

contract realCoin is ERC20{

    address public admin;

    constructor() ERC20('Real Coin','RCN'){
        _mint(msg.sender,50000*10**18);
        admin=msg.sender;
    }

    function mint(address to, uint amount) external {
        require(msg.sender==admin, 'only admin');
        _mint(to,amount);
    }

    function burn(uint amount) external {
        _burn(msg.sender,amount);
    }

}