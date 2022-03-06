import { ethers } from "ethers";

import Contrats from "./contracts/26.json";

const supportChainId = 26;

const RPCS = {
    1: "http://13.59.118.124/eth",
    4002: "https://rpc.testnet.fantom.network",
    26: "http://18.117.255.252/chain",
    417: "https://testnet-rpc.icicbchain.org",
    1337: "http://localhost:7545",
    31337: "http://localhost:8545/"
}

const providers = {
    1: new ethers.providers.JsonRpcProvider(RPCS[1]),
    4002: new ethers.providers.JsonRpcProvider(RPCS[4002]),
    26: new ethers.providers.JsonRpcProvider(RPCS[26]),
    417: new ethers.providers.JsonRpcProvider(RPCS[417]),
    // 1337: new ethers.providers.JsonRpcProvider(RPCS[1337]),
    // 31337: new ethers.providers.JsonRpcProvider(RPCS[31337])
}

const atariContract = new ethers.Contract(Contrats.atariToken.address, Contrats.atariToken.abi, providers[supportChainId]);

const atariNFTContract = new ethers.Contract(Contrats.atariNFT.address, Contrats.atariNFT.abi, providers[supportChainId]);

const marketPlaceContract = new ethers.Contract(Contrats.marketPlace.address, Contrats.marketPlace.abi, providers[supportChainId]);

const multiCallContract = new ethers.Contract(Contrats.multiCall.address, Contrats.multiCall.abi, providers[supportChainId]);

const NFTContractABI = Contrats.atariNFT.abi;

const supportedNFTs = [atariNFTContract.address];

export {
    providers, atariContract, atariNFTContract,
    marketPlaceContract, multiCallContract, supportChainId,
    NFTContractABI, supportedNFTs
}