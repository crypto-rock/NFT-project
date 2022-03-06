const axios = require("axios");
const e = require("express");
const { response } = require("express");
const { del } = require("express/lib/application");
const res = require("express/lib/response");
const rand = require("random-seed").create();
require("dotenv").config();

const getArray = async (num, max) => {
    var array = [];
    for (var i = 0; i < num;) {
        var random = getRandomInt(max);
        if (array.indexOf(random) == -1) {
            array[i] = random;
            i++;
        }
    }
    return array;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
const user = [];
module.exports = {
    CardOder: async (req, res) => {
        const { userName, token } = req.body;
        var cardOrder = await getArray(52, 52);
        user[token] = {
            cardArray: cardOrder,
            userName: userName,
            userToken: token,
            winAmount: 0,
            tieAmount: 0,
            flag: 0,
            amount: 0
        }
        try {
            try {
                res.json({
                    cardOder: user[token].cardArray,
                    serverMsg: "Success"
                })
            } catch (error) {
                throw new Error("Can't find Server!");
            };
        } catch (err) {
            res.json({
                serverMsg: err.message
            })
        }
    },
    CasinoWar: async (req, res) => {
        const { userName, token } = req.body;
        var usercard = user[token].cardArray[0] % 13;
        var bortcard = user[token].cardArray[1] % 13;
        try {
            var check;
            if (usercard > bortcard) {
                check = 1;
            } else if (usercard < bortcard) {
                check = -1;
            } else {
                check = 0;
            }
            try {
                res.json({
                    check: check,
                    serverMsg: "Success"
                })
            } catch (error) {
                throw new Error("Can't find Server!");
            };
        } catch (err) {
            res.json({
                serverMsg: err.message
            })
        }
    },
    Result: async (req, res) => {
        const { userName, token, winAmount, tieAmount, result, amount } = req.body;
        var flag = parseInt(result);
        var winValue = parseInt(winAmount);
        var tieValue = parseInt(tieAmount);
        var amountValue = parseFloat(amount);
        user[token].flag = flag;
        user[token].winAmount = winValue;
        user[token].tieAmount = tieValue;
        user[token].amount = amountValue;
        try {

            var raisePrice = 0;
            var msg = "";
            var total;
            if (user[token].flag == 0) {
                if (user[token].tieAmount > 0) {
                    raisePrice = user[token].tieAmount * 11;
                    msg = "Tie : + " + user[token].tieAmount + " x11 = " + raisePrice;
                }
            } else if (user[token].flag == 1) {
                raisePrice = 2 * user[token].winAmount + user[token].tieAmount;
                msg = "You win : +" + (2 * user[token].winAmount);
            } else {
                raisePrice = 0;
                msg = "Better luck next time!";
            }
            total = user[token].amount + raisePrice;

            var bet = user[token].winAmount + user[token].tieAmount;
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/bet",
                    {
                        token: user[token].userToken,
                        amount: bet,
                    }
                );
            } catch (err) {
                throw new Error("Bet Error!");
            }
            if (raisePrice > 0) {
                try {
                    await axios.post(
                        process.env.PLATFORM_SERVER + "api/games/winlose",
                        {
                            token: user[token].userToken,
                            amount: raisePrice,
                            winState: raisePrice != 0 ? true : false,
                        }
                    )
                } catch (err) {
                    throw new Error("WinLose Error!");
                }
            }
            try {
                res.json({
                    msg: msg,
                    total: total,
                    check: user[token].flag,
                    serverMsg: "Success"
                })
            } catch (error) {
                throw new Error("Can't find Server!");
            };
        } catch (err) {
            res.json({
                serverMsg: err.message
            })
        }
    },
    Goto: async (req, res) => {
        const { userName, token, winAmount, amount } = req.body;
        var winValue = parseInt(winAmount);
        var amountValue = parseFloat(amount);
        user[token].winAmount = winValue;
        user[token].amount = amountValue;
        var usercard = user[token].cardArray[2] % 13;
        var bortcard = user[token].cardArray[3] % 13;
        try {
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/bet",
                    {
                        token: user[token].userToken,
                        amount: user[token].winAmount,
                    }
                );
            } catch (err) {
                throw new Error("Bet Error!");
            }
            var msg = "";
            var raisePrice;
            if (usercard >= bortcard) {
                raisePrice = user[token].winAmount * 2;
                msg = "You win : +" + raisePrice;
            } else {
                raisePrice = 0;
                msg = "Better luck next time!";
            }
            var total = user[token].amount + raisePrice;
            if (raisePrice > 0) {
                try {
                    await axios.post(
                        process.env.PLATFORM_SERVER + "api/games/winlose",
                        {
                            token: user[token].userToken,
                            amount: raisePrice,
                            winState: raisePrice != 0 ? true : false,
                        }
                    )
                } catch (err) {
                    throw new Error("WinLose Error!");
                }
            }
            try {
                res.json({
                    msg: msg,
                    total: total,
                    raisePrice: raisePrice,
                    serverMsg: "Success"
                })
            } catch (error) {
                throw new Error("Can't find Server!");
            };
        } catch (err) {
            res.json({
                serverMsg: err.message
            })
        }

    },
    Surrender: async (req, res) => {
        const { userName, token, winAmount, amount } = req.body;
        var winValue = parseInt(winAmount);
        var amountValue = parseFloat(amount);
        user[token].winAmount = winValue;
        user[token].amount = amountValue;
        try {
            var msg = "You Surrender";
            var total = user[token].amount + user[token].winAmount;
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/winlose",
                    {
                        token: user[token].userToken,
                        amount: user[token].winAmount,
                        winState: user[token].winAmount != 0 ? true : false,
                    }
                )
            } catch (err) {
                throw new Error("WinLose Error!");
            }
            try {
                res.json({
                    msg: msg,
                    total: total,
                    serverMsg: "Success"
                })
            } catch (error) {
                throw new Error("Can't find Server!");
            };
        } catch (err) {
            res.json({
                serverMsg: err.message
            })
        }
    },
};