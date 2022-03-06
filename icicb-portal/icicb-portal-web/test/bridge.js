require("colors");
const { expect } = require("chai");
const { ethers } = require("hardhat");

let bridge, owner, admin, addrs, tokens = [], swapTokens = [];
describe("UnitTest for Bridge Contract", () => {
	it("test deploy", async ()=>{
		/* const Bridge = await ethers.getContractFactory("Bridge");
		[owner, admin, ...addrs] = await ethers.getSigners()
		bridge = await Bridge.deploy(admin.address);
		await bridge.deployed();
		console.log('\tBridge: '.gray + bridge.address.green) */
		let k=0;
		for(let i=0; i<1e8; i++) {
			k++
		}
	})
})
