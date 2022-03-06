const express = require("express");
const router = express.Router();
const User = require("./api_controller");

module.exports = (router) => {
    // User API
    router.post("/CardOder", User.CardOder);
    router.post("/bet-casinoWar", User.CasinoWar);
    router.post("/result-CasinoWar", User.Result);
    router.post("/goto-CasinoWar", User.Goto);
    router.post("/surrender-CasinoWar", User.Surrender);
};
