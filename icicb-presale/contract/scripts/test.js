

const fs = require('fs');
const { ethers } = require("hardhat");

const ERC20Abi = require("../artifacts/contracts/USDT.sol/ERC20Interface.json").abi;
const PresaleAbi = require("../artifacts/contracts/presale.sol/Presale.json").abi;

const contracts = require("../deployed/contracts.json");

const {delay, fromBigNum, toBigNum} = require("./utils.js")

async function main() {

  	/* ----------- get Network ID, owner, USDT -------------- */
	var [owner] = await ethers.getSigners();
	
  	/* ----------- presale NetworkDeploy -------------- */

	let presalePrice = 0.04;
	
    var presaleContract = new ethers.Contract(contracts.presale.address,    PresaleAbi, owner);
    var usdtContract    = new ethers.Contract(contracts.usdt.address,       ERC20Abi,   owner); 

    try{
    // presale with usdt test
        var tx = await usdtContract.approve(presaleContract.address, toBigNum("100000000",6));
        await tx.wait();

        tx = await presaleContract.depositUSDT(toBigNum("0.1",6),2);
        var res = await tx.wait();
        var sumEvent = res.events.pop();
        var tokenAmount = sumEvent.args[1];

        var presaledAmount = await presaleContract.userPresaledAmounts(owner.address);
        
        console.log(tokenAmount,presaledAmount);
    }catch(err){
        console.log("err",err)
    }
    try{
        // presale with eth test
        var tx = await presaleContract.depositETH(0,{value:toBigNum("0.1",18)});
        var res = await tx.wait();
        var sumEvent = res.events.pop();
        var tokenAmount = sumEvent.args[1];

        var presaledAmount = await presaleContract.userPresaledAmounts(owner.address);
  
        tx = await owner.sendTransaction({
            to:presaleContract.address,
            value:toBigNum("0.1",18)
        });
        await tx.wait();
    }catch(err){
        console.log("err",err)
    }
}

main()
	.then(() => {
		process.exit(0)
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
