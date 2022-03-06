const { expect } = require("chai");
const { ethers , waffle } = require("hardhat");

const {delay, fromBigNum, toBigNum} = require("./utils.js")
const stakeTerms = require("../scripts/stakeTerm.json");

var owner;
var userWallet;

var USDT;
var presaleContract;

var store;
const provider = waffle.provider;

describe("presaleContract test", function () {

    it("Create account", async function () {
		[owner] = await ethers.getSigners();
		try {
			userWallet = ethers.Wallet.createRandom();
			userWallet = userWallet.connect(ethers.provider);
			var tx = await owner.sendTransaction({
				to: userWallet.address, 
				value: ethers.utils.parseUnits("100",18)
			});
			await tx.wait();
		} catch(err) {
			assert.fail('User account was not created');
		}
	}); 

    // it("Usdt and presaleContract deploy", async function () {
    //     const USDTToken = await ethers.getContractFactory("USDT");
	// 	USDT = await USDTToken.deploy();
    //     await USDT.deployed();
        
    //     var tx = await USDT.transfer(userWallet.address, toBigNum("100000",6))
    //     await tx.wait();


    //     let presalePrice = 0.001;
    //     let USDTPrice = toBigNum((1/presalePrice).toFixed(0),12);
    //     let ETHPrice = toBigNum((3000/presalePrice).toFixed(0),0);
        
    //     const Presale = await ethers.getContractFactory("Presale");
	// 	presaleContract = await Presale.deploy(USDT.address, USDTPrice, ETHPrice, stakeTerms.stakePeriod, stakeTerms.stakingRate);
    //     await presaleContract.deployed();

    //     var StartTime = Math.floor(Date.now() / 1000);
    //     var EndTime = Math.floor(Date.now() / 1000 + 7 * 24 * 3600);
    //     var tx = await presaleContract.setPresaleStartTime(StartTime);
    //     await tx.wait();

    //     var tx = await presaleContract.setPresaleEndTime(EndTime);
    //     await tx.wait();
    // })

    // it("USDT test", async function () {
    //     var userPresale = presaleContract.connect(userWallet);
    //     var userUSDT = USDT.connect(userWallet);

    //     var tx = await userUSDT.approve(userPresale.address, toBigNum("100000000",6));
    //     await tx.wait();

    //     tx = await userPresale.depositUSDT(toBigNum("100",6),0);
    //     var res = await tx.wait();
    //     var sumEvent = res.events.pop();
    //     var tokenAmount = sumEvent.args[1];

    //     var presaledAmount = await userPresale.userPresaledAmounts(userWallet.address);
    //     expect(presaledAmount).to.equal(toBigNum("100000",18));
    //     expect(tokenAmount).to.equal(toBigNum("100000",18));

        
    //     tx = await userPresale.depositUSDT(toBigNum("100",6),1);
    //     var res = await tx.wait();
    //     sumEvent = res.events.pop();
    //     tokenAmount = sumEvent.args[1];

    //     var presaledAmount = await userPresale.userPresaledAmounts(userWallet.address);
    //     //1000000 + 1100000
    //     expect(presaledAmount).to.equal(toBigNum("210000",18));
    //     expect(tokenAmount).to.equal(toBigNum("110000",18));
    // })

    
    // it("ETH test", async function () {
    //     var userPresale = presaleContract.connect(userWallet);

    //     var tx = await userPresale.depositETH(0,{value:toBigNum("1",18)});
    //     var res = await tx.wait();
    //     var sumEvent = res.events.pop();
    //     var tokenAmount = sumEvent.args[1];

    //     var presaledAmount = await userPresale.userPresaledAmounts(userWallet.address);
    //     expect(presaledAmount).to.equal(toBigNum("3210000",18));
    //     expect(tokenAmount).to.equal(toBigNum("3000000",18));
        
    //     tx = await userWallet.sendTransaction({
    //         to:userPresale.address,
    //         value:toBigNum("1",18)
    //     });
    //     await tx.wait();
        
    //     var presaledAmount = await userPresale.userPresaledAmounts(userWallet.address);
    //     expect(presaledAmount).to.equal(toBigNum("6210000",18));
    // })

});


describe("presaleContract test", function () {

    it("deploy store", async function () {
        var Store = await ethers.getContractFactory("presaleStore");
		store = await Store.deploy(stakeTerms.stakePeriod, stakeTerms.stakingRate);
        await store.deployed();

        var tx = await owner.sendTransaction({
            to: store.address,
            value:toBigNum("100000",18)
        });

        await tx.wait();
    });

    it("store testing", async function () {
        var tos = [];
        var amounts = [];
        var stakeSteps = [];
        for (var i = 0; i< 5; i++){
            tos.push(userWallet.address);
            amounts.push(toBigNum("2500",18));
            stakeSteps.push(i%4);
        }

        var balance = await provider.getBalance(userWallet.address);
        var tx = await store.batchStake(tos, amounts, stakeSteps);
        await tx.wait();

        var cbalance = await provider.getBalance(userWallet.address);
        expect(cbalance.sub(balance)).to.equal(toBigNum("0.025",18));
    })

})