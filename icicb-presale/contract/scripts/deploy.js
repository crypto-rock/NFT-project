

const fs = require('fs');
const { ethers } = require("hardhat");

const ERC20Abi = require("../artifacts/contracts/USDT.sol/ERC20Interface.json").abi;
const PresaleAbi = require("../artifacts/contracts/presale.sol/Presale.json").abi;
const stakeTerms = require("./stakeTerm.json");

const {delay, fromBigNum, toBigNum} = require("./utils.js")

async function main() {

  	/* ----------- get Network ID, owner, USDT -------------- */
	var [owner] = await ethers.getSigners();
	
	let network = await owner.provider._networkPromise;
	let chainId = network.chainId;

	var USDT;
	
	if(chainId != 1){
		const USDTToken = await ethers.getContractFactory("USDT");
		USDT = await USDTToken.deploy();
		await USDT.deployed();
	}
	else {
		USDT = {address : process.env.USDTADDRESS}
	}

  	/* ----------- presale NetworkDeploy -------------- */

	let presalePrice = 0.04;
	let USDTPrice = toBigNum((1/presalePrice).toFixed(0),12);
	let ETHPrice = toBigNum((3000/presalePrice).toFixed(0),0);
	
	const Presale = await ethers.getContractFactory("Presale");
	var presaleContract = await Presale.deploy(USDT.address, USDTPrice, ETHPrice, stakeTerms.stakePeriod, stakeTerms.stakingRate);
	await presaleContract.deployed();
	
	//object
	var presale = {address:presaleContract.address, abi:PresaleAbi};
    var usdt = {address:USDT.address, abi:ERC20Abi};

	var contractObject = {presale,usdt};
	
	fs.writeFile(`./deployed/contracts.json`,JSON.stringify(contractObject, undefined, 4), function(err,content){
		if (err) throw err;
		console.log('complete');
	});

}

main()
	.then(() => {
		// process.exit(0)
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
