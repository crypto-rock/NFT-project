
const cron = require('node-cron');
const {
	signers, providers, presaleContract, usdtContract, storeContract, supportChainId
} = require('../../contract');

const { ChainIdsController } = require("../../app/controllers");

const handleDeposits = (props) => {
	var chainId = supportChainId[0];
	var provider = providers[chainId];

	const { handleTransfer } = props;
	var latestblocknumber;

	const handletransactions = async () => {
		let blockNumber = await provider.getBlockNumber();
		// console.log("fantomtenstnet : ",blockNumber);

        try {
		if (blockNumber > latestblocknumber) {
			var txhistory = presaleContract.queryFilter("ClaimToken", latestblocknumber + 1, blockNumber);
			txhistory.then((res) => {
				res.map((tx, index) => {
					let from = tx.args.from;
					let amount = tx.args.amount;
					let step = tx.args.step;
					let hash = tx.transactionHash;
					let blockNumber = tx.blockNumber;
					console.log(`Transfer require from ${from} amount ${amount} step ${step} with hash ${hash} in block ${blockNumber}`);
					handleTransfer(from, amount, step, tx.transactionHash);
				})
			})
			latestblocknumber = blockNumber;

			await ChainIdsController.update({
				chainId: chainId,
				latestBlock: blockNumber
			});
        }}catch(err){
            console.log("err",err)
        }
        
	}

	const handleDeposits = async () => {
		var blockNumber = await ChainIdsController.find({chainId});
		if (!blockNumber) {
			blockNumber = await provider.getBlockNumber();
			await ChainIdsController.create({
				chainId: chainId,
				latestBlock: blockNumber
			});
		}

		latestblocknumber = blockNumber;
		cron.schedule('*/15 * * * * *', () => {
			console.log("running a transaction handle every 15 second");
			handletransactions()
		});
	}

	handleDeposits();
}


module.exports = { handleDeposits };