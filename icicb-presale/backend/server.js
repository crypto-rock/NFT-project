const express = require("express");
const http = require("http");
const passport = require("passport");
const cors = require('cors');
const bodyParser = require("body-parser");
const port = process.env.PORT || 5001;
const cron = require('node-cron');
const app = express();
const router = require('express').Router();
const axios = require('axios');

const { handleDeposits } = require("./utils/handles");

const { transfer } = require("./utils/transfer");

app.use(cors());

app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// our server instance
const server = http.createServer(app);

//db
const db = require("./app/models");

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

//controller
const { CompletedTxController } = require("./app/controllers");

var conformedTransaction = { "Transfer": [] };
var completedTransaction = { "Transfer": [] };


cron.schedule('*/15 * * * * *', () => {
});

//handleTransfer

const handleTransfer = async (from, amount, step, fromhash) => {
    console.log("handleTransfer", from, amount.toString(), Number(step), fromhash);

    if (amount > 0) {
        conformedTransaction["Transfer"].push({ from, amount: amount.toString(), step: Number(step), fromhash });
    }
}

const orderTransfer = async () => {
    console.log("ordertTransfer : ");
    let tos = [];
    let amounts = [];
    let steps = [];
    conformedTransaction["Transfer"].map((conformedTx, index) => {
        console.log("conformedTx", conformedTx)
        //batch 200 tx;
        if (index <= 200) {
            tos.push(conformedTx.from);
            amounts.push(conformedTx.amount);
            steps.push(conformedTx.step);
        }
    });

    if (tos.length > 0) {
        var tx = transfer({ tos, amounts, steps});
        tx.then(async (res) => {
            let txResult = await res.wait();
            if(txResult) {
                var txs = conformedTransaction["Transfer"].splice(0, tos.length);
                //cache clean
                completedTransaction["Transfer"].splice(0, completedTransaction["Transfer"].length - 400);
                txs.map((ctx, index) => {
                    completedTransaction["Transfer"].push({ ...ctx, ...{ tohash: txResult.transactionHash } });
                    CompletedTxController.create({ txs: [{ ...ctx, ...{ tohash: txResult.transactionHash } }] });
                })
                console.log("compiletedTransaction[Transfer]", completedTransaction["Transfer"]);
            }
        })
    }
}

// order pending transactions
cron.schedule('*/20 * * * * *', () => {
    console.log("running transactions every 20 second");
    orderTransfer();
});

const startHandle = async () => {
    handleDeposits({ handleTransfer });
}

startHandle();
const getData = (req, res) => {
    console.log("getData");
    res.json({ conformedTransaction, completedTransaction })
}

router.post('/getData', getData);
router.post("/address", CompletedTxController.find);
router.post("/", CompletedTxController.findAll);

// router.post('/setData',setData);
// router.post('/startSell',startSell);
// router.post('/withDraws',withDraws);


app.use("/api", router);
server.listen(port, () => console.log(`Listening on port ${port}`));
