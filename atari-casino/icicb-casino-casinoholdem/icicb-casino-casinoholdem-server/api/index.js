const express = require("express");
const router = express.Router();
const User = require("./api_controller");

module.exports = (router) => {
    // User API
    router.post("/CardOder", User.CardOder);
    router.post("/bet-holdem", User.BetHoldem);
    router.post("/result-holdem", User.ResultHoldem);
    router.post("/result-fold", User.ResultFold);
};
