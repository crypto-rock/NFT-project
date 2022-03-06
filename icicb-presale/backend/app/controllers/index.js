const db = require("../models");
const CompletedTxs = db.completedTxs;
const ChainIds = db.chainIds;

const CompletedTxController = {

    create: async (props) => {
        const { txs } = props;
        var dTxs = [];
        try {
            await txs.map(async (tx, index) => {
                const completedTxs = new CompletedTxs(tx);
                let res = await completedTxs.save(completedTxs)
                dTxs.push(res);
            });
        } catch (err) {

        }
        return (dTxs);
    },

    remove: async (txs) => {
        var dTxs = [];
        await txs.map(async (tx, index) => {
            const res = await CompletedTxs.findAndRemove(tx);
            dtxs.push(res);
        })
        return dTxs;
    },

    find: async (req, res) => {
        var address = req.body.address;
        CompletedTxs.find({ from: address }).then((data) => {
            res.send(data);
        })
    },

    findAll: async (req, res) => {
        CompletedTxs.find().then((data) => {
            res.send(data);
        })
    }
}

const ChainIdsController = {
    find: async (props) => {
        try {
            var { chainId } = props;
            var data = await ChainIds.find({ chainId: chainId });
            return data[0].latestBlock;
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    create: async (props) => {
        try {
            var { chainId, latestBlock } = props;
            const chainIds = new ChainIds({ chainId, latestBlock });
            let res = await chainIds.save(chainIds)
            return res;
        } catch (err) {
            console.log(err);
        }
    },

    update: async (props) => {
        var { chainId, latestBlock } = props;
        try {
            await ChainIds.updateOne(
                {"chainId":chainId},
                {
                    $set: {"latestBlock" : latestBlock},
                    $currentDate: { "lastModified": true }
                }
            )
            return latestBlock;
        } catch (err) {
            console.log(err);
            return { error: "database Error" };
        }
    },
}

module.exports = { CompletedTxController, ChainIdsController };