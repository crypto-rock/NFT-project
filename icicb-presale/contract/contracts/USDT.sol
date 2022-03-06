
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ERC20Interface {
    function totalSupply() external view returns (uint256);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract USDT is ERC20Interface {
    
    string public constant name = "USDT";
    string public constant symbol = "USDT";
    uint8 public constant decimals = 6;
    
    event RegistrationSuccessful(uint256 nonce);
    event RegistrationFailed(uint256 nonce);
    
    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 totalSupply_ = 7771000000 * 1e6;
    
    mapping (string => address) addressTable;

    using SafeMath for uint256;
    
    constructor() {
	    balances[msg.sender] = totalSupply_;
    }
    
    function totalSupply() public override view returns (uint256) {
	    return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public override view returns (uint) {
        return balances[tokenOwner];
    }
    
    function transfer(address receiver, uint numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender],"insufficient balance");
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    
    function approve(address delegate, uint numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }
    
    
    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }
    
     function transferFrom(address owner, address buyer, uint numTokens) public override returns (bool) {
        require(numTokens <= balances[owner],"transferFrom : amount over than balance");    
        require(numTokens <= allowed[owner][msg.sender],"transferFrom : amount over than balance");
    
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
    
    function registerUser(string memory user, uint256 nonce) public returns (bool) {
        if (addressTable[user] == address(0)) {
            addressTable[user] = msg.sender;
            emit RegistrationSuccessful(nonce);
            return true;
        } else {
            emit RegistrationFailed(nonce);
            return false;
        }
    }
}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}