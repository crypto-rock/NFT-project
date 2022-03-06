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

contract Context {

	function _msgSender() internal view returns (address payable) {
		return payable(msg.sender);
	}

	function _msgData() internal view returns (bytes memory) {
		this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
		return msg.data;
	}
}

contract Ownable is Context {
	address private _owner;

	event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

	constructor (){
		address msgSender = _msgSender();
		_owner = msgSender;
		emit OwnershipTransferred(address(0), msgSender);
	}

	function owner() public view returns (address) {
		return _owner;
	}

	modifier onlyOwner() {
		require(_owner == _msgSender(), "Ownable: caller is not the owner");
		_;
	}

	function renounceOwnership() public onlyOwner {
		emit OwnershipTransferred(_owner, address(0));
		_owner = address(0);
	}

	function transferOwnership(address newOwner) public onlyOwner {
		_transferOwnership(newOwner);
	}

	function _transferOwnership(address newOwner) internal {
		require(newOwner != address(0), "Ownable: new owner is the zero address");
		emit OwnershipTransferred(_owner, newOwner);
		_owner = newOwner;
	}
}

contract Presale is Ownable {

	ERC20Interface public USDT;

	uint USDTPrice;
	uint ETHPrice;

	uint presaleStartTime;
	uint presaleEndTime;

	mapping(address => uint) public userPresaledAmounts;
	uint public totalPresaledAmount;

	event ClaimToken(address indexed from, uint256 indexed amount, uint indexed step);

    struct StakeingType {
        uint stakePeriod;
        uint stakingRate; // 1000000
    }

    // staking feature
    uint stakerSteps;
    mapping(uint => StakeingType) stakingType;

	constructor(address USDTAddress, uint256 _USDTPrice, uint256 _ETHPrice, uint[] memory _stakePeriod, uint[] memory _stakingRate){
		USDT = ERC20Interface(USDTAddress);
		USDTPrice = _USDTPrice;
		ETHPrice = _ETHPrice;
        presaleStartTime = block.timestamp;
        presaleEndTime = block.timestamp + 30 days;
        _setStakeTerm(_stakePeriod,_stakingRate);
	}

    function _setStakeTerm(uint[] memory _stakePeriod, uint[] memory _stakingRate) internal{
        stakerSteps = _stakePeriod.length;
        require (_stakePeriod.length == _stakePeriod.length);
        for( uint i = 0; i < stakerSteps; i++){
            stakingType[i].stakePeriod = _stakePeriod[i];
            stakingType[i].stakingRate = _stakingRate[i];
        }
    }

    function setStakeTerm(uint[] memory _stakePeriod, uint[] memory _stakingRate) public onlyOwner{
        _setStakeTerm(_stakePeriod,_stakingRate);
    }

	function setPresaleStartTime (uint _presaleStartTime) external onlyOwner {
		presaleStartTime = _presaleStartTime;
	}

	function setPresaleEndTime (uint _presaleEndTime) external onlyOwner {
		presaleEndTime = _presaleEndTime;
	}

	function depositUSDT(uint256 amount, uint step) external {
		require(presaleStartTime < block.timestamp && presaleEndTime >block.timestamp ,"presale Ended");
		USDT.transferFrom(msg.sender, owner(), amount);

		uint tokenAmount = amount * (USDTPrice) * stakingType[step].stakingRate/1000000;
		userPresaledAmounts[msg.sender] += tokenAmount;
		totalPresaledAmount += tokenAmount;
		emit ClaimToken(msg.sender,tokenAmount,step);
	}

	function depositETH(uint step) public payable {
		require(presaleStartTime < block.timestamp && presaleEndTime >block.timestamp ,"presale Ended");
		payable(owner()).transfer(msg.value);
		uint tokenAmount = msg.value * ETHPrice * stakingType[step].stakingRate/1000000;

		userPresaledAmounts[msg.sender] += tokenAmount;
		totalPresaledAmount += tokenAmount;
		emit ClaimToken(msg.sender, tokenAmount, step);
	}

    // information 
    function getStakeInfo() external view returns (uint _steps, StakeingType[] memory _stakingType) {
        _steps = stakerSteps;
        _stakingType = new StakeingType[](_steps);
        
        for (uint i = 0; i < _steps; i++) {
            _stakingType[i].stakePeriod = stakingType[i].stakePeriod;
            _stakingType[i].stakingRate = stakingType[i].stakingRate;
        }
    }

	// claim tokens that sent by accidentally
	function claimToken(address token,address to,uint256 amount) external onlyOwner {
		ERC20Interface(token).transfer(to,amount);
	}

	function claimETH(address to, uint256 amount) external onlyOwner {
		payable(to).transfer(amount);
	}

	fallback() external payable {
		depositETH(0);
	}

	receive() external payable {
        depositETH(0);
    }
}