require('colors');
const fs = require('fs');
const networks = require("../src/config/networks.json");
/* const abiBridge = require("../artifacts/contracts/Bridge.sol/Bridge.json"); */

const hre = require("hardhat");

async function main() {
	const netId = "ETH"
	const decimals = 18
	const admin = "0xC5df89579D7A2f85b8a4b1a6395083da394Bba92";

	const signer = await hre.ethers.getSigner();
	const network = await signer.provider._networkPromise;
	const rpc = 'https://rinkeby.infura.io/v3/580d6de4d2694cbdbee111d2f553dbcc'; // signer.provider.connection.url;
	const explorer = 'https://rinkeby.etherscan.io/'; // signer.provider.connection.url;
	const chainId = network.chainId;
	const blocktime = 15000
	const erc20 = 'ERC20';
	const confirmations = 12
	
	const coin = 'ETH'
	console.log('Starting ' + netId + ('(' + String(chainId).red + ')') + ' by ', signer.address.yellow);

	console.log('Deploying ' + netId + ' Bridge contract...'.blue);
	const Bridge = await hre.ethers.getContractFactory("Bridge");
	const bridge = await Bridge.deploy(admin);
	console.log('\tBridge\t' + bridge.address.green);

	console.log('writing network...'.blue);
	/* -------------- writing... -----------------*/
	fs.writeFileSync(`./src/config/networks.json`,   JSON.stringify({...networks, [netId]:{bridge:bridge.address, chainId, coin, decimals, confirmations, blocktime, rpc, explorer, erc20}}, null, 4));
}

main().then(() => {
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
