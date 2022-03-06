
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

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

contract presaleStore is Ownable{
    
    event  Deposit(address indexed from, uint value);
    event  Withdrawal(address indexed from, uint value);

    fallback() external payable {
        deposit();
    }

    receive() external payable {
        deposit();
    }
    
    function deposit() public payable {
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(address to, uint amount) internal {
        totalLockedBalance -= amount;
        payable(to).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    //stake feature

    struct StakingType {
        uint stakePeriod;
        uint stakingRate; // 1000000
    }

    struct StakerInfo {
        mapping(uint => uint) stakeEndTime;
        mapping(uint => uint) stakingAmount;
    }

    uint public stakerSteps;
    mapping(uint => StakingType) stakingType;

    mapping(address => StakerInfo) stakerInfos;

    uint public totalLockedBalance;
	
    constructor(uint[] memory _stakePeriod, uint[] memory _stakingRate){
        _setStakeTerm(_stakePeriod,_stakingRate);
	}

    function setStakeTerm(uint[] memory _stakePeriod, uint[] memory _stakingRate) public onlyOwner{
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

    function stake(address staker, uint amount, uint stakeStep) public onlyOwner{
        
        totalLockedBalance += amount;
        require(totalLockedBalance < address(this).balance,"store: presaleEnded");

        uint period = stakingType[stakeStep].stakePeriod;
        if(period == 0) {
            withdraw(staker,amount);
        }
        else {
            stakerInfos[staker].stakeEndTime[stakeStep] = period + block.timestamp;
            stakerInfos[staker].stakingAmount[stakeStep] += amount;  
        }
    }

    function batchStake(address[] memory tos, uint[] memory amounts, uint[] memory stakeSteps) external onlyOwner{
        uint num = tos.length;
        for (uint i = 0; i < num; i++) {
            stake(tos[i], amounts[i], stakeSteps[i]);
        }
    }

    function unlock() external {
        address staker = msg.sender;
        for (uint i = 0; i < stakerSteps; i++) {
            uint stakeAmount = stakerInfos[staker].stakingAmount[i];
            uint stakeEndTime = stakerInfos[staker].stakeEndTime[i];

            if(stakeAmount > 0 || stakeEndTime < block.timestamp) {
                stakerInfos[staker].stakingAmount[i] = 0;
                withdraw(staker, stakeAmount);
            }
        }
    }

    function unlockableAmount(address staker) external view returns(uint _amount){
        for (uint i = 0; i < stakerSteps; i++) {
            uint stakeAmount = stakerInfos[staker].stakingAmount[i];
            uint stakeEndTime = stakerInfos[staker].stakeEndTime[i];

            if(stakeAmount > 0 && stakeEndTime < block.timestamp) {
                _amount += stakeAmount;
            }
        }
    }

    function getStakingType(uint index) external view returns(StakingType memory) {
        return stakingType[index];
    }

    function getStakerInfos(address staker) external view returns(uint[] memory _stakeEndTime, uint[] memory _stakingAmount) {
        _stakeEndTime = new uint[](stakerSteps);
        _stakingAmount = new uint[](stakerSteps);

        for(uint i = 1; i < stakerSteps; i ++) {
            _stakeEndTime[i] = stakerInfos[staker].stakeEndTime[i];
            _stakingAmount[i] = stakerInfos[staker].stakingAmount[i];
        }
    }

}