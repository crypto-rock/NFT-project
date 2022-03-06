

const fs = require('fs');
const { ethers } = require("hardhat");

const storeAbi = require("../artifacts/contracts/store.sol/presaleStore.json").abi;
const {delay, fromBigNum, toBigNum} = require("./utils.js");
const stakeTerms = require("./stakeTerm.json");

async function main() {
	
	const PresaleStore = await ethers.getContractFactory("presaleStore");
	var presaleStore = await PresaleStore.deploy(stakeTerms.stakePeriod, stakeTerms.stakingRate);
	await presaleStore.deployed();

	//object
	var store = {address:presaleStore.address, abi:storeAbi};

	var contractObject = {store};
	
	fs.writeFile(`./deployed/icicb_contracts.json`,JSON.stringify(contractObject, undefined, 4), function(err,content){
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
