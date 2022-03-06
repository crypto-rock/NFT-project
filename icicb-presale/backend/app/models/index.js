const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

const {CompletedTxs} = require("./transactions.js")(mongoose);
const {ChainIds} = require("./chainIds.js")(mongoose);

db.completedTxs = CompletedTxs;
db.chainIds = ChainIds;

module.exports = db;
