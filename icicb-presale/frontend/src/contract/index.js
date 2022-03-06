require('dotenv').config();
const {ethers} = require("ethers");

const mContracts = require("./contracts/contracts.json");
const ICICBContracts = require("./contracts/icicb_contracts.json");

const supportChainId = [4002, 417];

const RPCS = {
    1:"http://13.59.118.124/eth",
    4002:"https://rpc.testnet.fantom.network",
    26:"https://mainnet-rpc.icicbchain.org",
    417:"https://testnet-rpc.icicbchain.org",
    1337:"http://localhost:7545",
    31337:"http://localhost:8545/"
}

const providers = {
    1       : new ethers.providers.JsonRpcProvider(RPCS[1]),
    4002    : new ethers.providers.JsonRpcProvider(RPCS[4002]),
    26      : new ethers.providers.JsonRpcProvider(RPCS[26]),
    417     : new ethers.providers.JsonRpcProvider(RPCS[417]),
}

/* --------- testnet ----------- */
const presaleContract = new ethers.Contract(mContracts.presale.address, mContracts.presale.abi,   providers[supportChainId[0]]);
const usdtContract    = new ethers.Contract(mContracts.usdt.address,    mContracts.usdt.abi,      providers[supportChainId[0]]);

const storeContract   = new ethers.Contract(ICICBContracts.store.address,ICICBContracts.store.abi,providers[supportChainId[1]]);

module.exports = {
     providers, presaleContract, usdtContract, storeContract, supportChainId
}