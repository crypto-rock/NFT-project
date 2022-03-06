const axios = require("axios");
const { response } = require("express");
const rand = require("random-seed").create();
require("dotenv").config();
const { checkScore } = require("./poker/index");
const { getRandomInt } = require("./poker/utils");

function sizeDecision(array1, array2) {
    var sort1 = [...array1].sort(function (a, b) { return b - a });
    var sort2 = [...array2].sort(function (a, b) { return b - a });
    var msg = "";
    var n = 0;
    for (var i = 0; i < sort1.length; i++) {
        if (sort1[i] == sort2[i]) {
            msg = "equal";
            n = 0;
        } else if (sort1[i] > sort2[i]) {
            msg = "first";
            n = sort1[i];
            i = sort1.length - 1;

        } else {
            msg = "second";
            n = sort2[i];
            i = sort2.length - 1;
        }
    }
    var result;
    if (msg == "first") {
        result = {
            result: msg,
            index: array1.indexOf(n)
        }
    } else if (msg == "second") {
        result = {
            result: msg,
            index: array2.indexOf(n)
        }
    } else {
        result = {
            result: msg,
            index: n
        }
    }
    return result;
}
function getMaxValue(array) {
    const max = Math.max(...array);
    return max;
}
function getArray(num, max) {
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
function bortDecision(array, data) {
    var bort = 0;
    var change_array = [];
    array.forEach((s, i) => { change_array[i] = s % 13 });
    if (data.score > 0) {
        for (var i = 0; i < data.matched.length; i++) {
            if (data.matched[i] == true && i < 2) {
                bort = 1;
                i = data.matched.length - 1;
            } else {
                for (var j = 0; j < change_array.length; j++) {
                    if (change_array[j] > 8 && j < 2) {
                        bort = 1;
                        j = change_array.length;
                    } else {
                        bort = getRandomInt(2);
                    }
                }
            }
        }
    } else {
        for (var j = 0; j < change_array.length; j++) {
            if (change_array[j] > 8 && j < 2) {
                bort = 1;
                j = change_array.length;
            } else {
                bort = getRandomInt(2);
            }
        }
    }
    return bort;
}
function getMixture(main, middle) {
    var checkResult = [];
    for (var i = 0; i < middle.length; i++) {
        for (var j = i + 1; j < middle.length; j++) {
            for (var k = j + 1; k < middle.length; k++) {
                var cards = [main[0], main[1], middle[i], middle[j], middle[k]];
                var result = checkScore({ cards });
                checkResult.push(result);
            }
        }
    }
    for (var i = 0; i < middle.length; i++) {
        for (var j = i + 1; j < middle.length; j++) {
            for (var k = j + 1; k < middle.length; k++) {
                for (var l = k + 1; l < middle.length; l++) {
                    var array1 = [main[0], middle[i], middle[j], middle[k], middle[l]];
                    var array2 = [main[1], middle[i], middle[j], middle[k], middle[l]];
                    var result1 = checkScore({ cards: array1 });
                    var result2 = checkScore({ cards: array2 });
                    checkResult.push(result1);
                    checkResult.push(result2);
                }
            }
        }
    }
    return checkResult;
}
function getActive(array, findArray, flag) {
    var change_array = [];
    var active_array = [false, false, false, false, false, false, false, false, false];
    array.forEach((s, i) => { change_array[i] = s % 13 });

    findArray.forEach((a) => {
        change_array.forEach((b, j) => {
            if (a == b) {
                if (flag == "user") {
                    if (j >= 0 && j <= 1)
                        active_array[j] = true;
                    else
                        active_array[j + 2] = true;
                } else {
                    active_array[j + 2] = true;
                }
            }
        })
    })
    return active_array;
}
function ResultCheck(user, middle, bort, all) {
    var gameResult;
    var active_array = [];
    var userResult = getMixture(user, middle);
    var bortResult = getMixture(bort, middle);
    var userResultScores = [];
    var bortResultScores = [];
    var userAllArray = [];
    var bortAllArray = [];
    for (var i = 0; i < all.length; i++) {
        if (i >= 0 && i <= 1) {
            userAllArray.push(all[i]);
        } else if (i >= 2 && i <= 3) {
            bortAllArray.push(all[i]);
        } else {
            userAllArray.push(all[i]);
            bortAllArray.push(all[i]);
        }
    }
    for (var i = 0; i < userResult.length; i++) {
        userResultScores.push(userResult[i].score);
        bortResultScores.push(bortResult[i].score);
    }
    var maxScore1 = getMaxValue(userResultScores);
    var maxScore2 = getMaxValue(bortResultScores);

    var maxCaseResultArray1 = [];
    var maxCaseResultArray2 = [];

    for (var i = 0; i < userResult.length; i++) {
        if (userResult[i].score == maxScore1) {
            maxCaseResultArray1.push(userResult[i]);
        }
        if (bortResult[i].score == maxScore2) {
            maxCaseResultArray2.push(bortResult[i]);
        }
    }
    if (maxScore1 > maxScore2) {
        gameResult = "user";
        active_array = getActive(userAllArray, maxCaseResultArray1[0].caseNum, gameResult);
    } else if (maxScore1 < maxScore2) {
        gameResult = "bort";
        active_array = getActive(bortAllArray, maxCaseResultArray2[0].caseNum, gameResult);
    } else {
        if (maxScore1 == 0) {
            var usercards = [];
            user.forEach((s, i) => { usercards[i] = s % 13 });
            var bortcards = [];
            bort.forEach((s, i) => { bortcards[i] = s % 13 });
            var deci = sizeDecision(usercards, bortcards);
            if (deci == "first") {
                gameResult = "user";
                active_array = getActive(userAllArray, maxCaseResultArray1[0].caseNum, gameResult);
            } else if (deci == "second") {
                gameResult = "bort";
                active_array = getActive(bortAllArray, maxCaseResultArray2[0].caseNum, gameResult);
            } else {
                active_array = [false, false, false, false, false, false, false, false, false];
                gameResult = "tie";
            }
        } else {
            var usercards = [];
            user.forEach((s, i) => { usercards[i] = s % 13 });
            var bortcards = [];
            bort.forEach((s, i) => { bortcards[i] = s % 13 });
            var decision = sizeDecision(usercards, bortcards);
            if (decision.result == "first") {
                gameResult = "user";
                active_array = getActive(userAllArray, maxCaseResultArray1[0].caseNum, gameResult);
            } else if (decision.result == "second") {
                gameResult = "bort";
                active_array = getActive(bortAllArray, maxCaseResultArray2[0].caseNum, gameResult);
            } else {
                active_array = [false, false, false, false, false, false, false, false, false];
                gameResult = "tie";
            }
        }
    }

    var result = {
        gameResult: gameResult,
        active_array: active_array
    }
    return result;
}

const user = [];
module.exports = {
    CardOder: async (req, res) => {
        const { userName, token } = req.body;
        try {
            var cardOrder = getArray(52, 52);
            user[token] = {
                cardArray: cardOrder,
                userName: userName,
                betAmount: 0,
                userToken: token,
                amount: 0,
                bort: 0
            }
            res.json({
                cardOder: user[token].cardArray,
                serverMsg: "Success"
            })
        } catch (err) {
            res.json({
                serverMsg: "Can't find Server!"
            })
        }
    },
    BetHoldem: async (req, res) => {
        const { userName, token } = req.body;
        try {
            var UserCardArray = [];
            var BortCardArray = [];
            for (var i = 0; i < 7; i++) {
                if (i >= 0 && i < 2) {
                    UserCardArray.push(user[token].cardArray[i]);
                } else if (i > 1 && i < 4) {
                    BortCardArray.push(user[token].cardArray[i])
                } else {
                    BortCardArray.push(user[token].cardArray[i])
                    UserCardArray.push(user[token].cardArray[i]);
                }
            }
            var response1 = checkScore({ cards: UserCardArray });
            var response2 = checkScore({ cards: BortCardArray });
            user[token].bort = bortDecision(BortCardArray, response2);
            try {
                res.json({
                    activeArray: response1.matched,
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
    ResultHoldem: async (req, res) => {
        const { userName, betAmount, token, amount } = req.body;
        try {
            var betValue = parseFloat(betAmount);
            var amountValue = parseFloat(amount);
            user[token].betAmount = betValue;
            user[token].amount = amountValue;

            var raisePrice;
            var msg = "";
            var result;
            var activeArray = [];
            if (user[token].bort == 1) {
                var UserArray = [];
                var CenterArray = [];
                var BortArray = [];
                var allArray = [];
                for (var i = 0; i < 9; i++) {
                    if (i >= 0 && i < 2) {
                        UserArray.push(user[token].cardArray[i]);
                    } else if (i > 1 && i < 4) {
                        BortArray.push(user[token].cardArray[i])
                    } else {
                        CenterArray.push(user[token].cardArray[i]);
                    }
                    allArray.push(user[token].cardArray[i]);
                }
                var resultResponse = ResultCheck(UserArray, CenterArray, BortArray, allArray);
                activeArray = resultResponse.active_array;
                if (resultResponse.gameResult == "user") {
                    raisePrice = 2 * user[token].betAmount;
                    result = "user";
                    msg = "You win : +" + raisePrice;
                } else if (resultResponse.gameResult == "bort") {
                    raisePrice = 0;
                    result = "bort";
                    msg = "Better luck next time!";
                } else {
                    raisePrice = 1.5 * user[token].betAmount;
                    result = "tie";
                    msg = "You tie";
                }
            } else {
                raisePrice = 2 * user[token].betAmount;
                result = "user";
                activeArray = [false, false, false, false, false, false, false, false, false];
                msg = "Opponent is abstention : +" + raisePrice;
            }
            var total = user[token].amount + raisePrice;
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/bet",
                    {
                        token: user[token].userToken,
                        amount: 1.5 * user[token].betAmount,
                    }
                );
            } catch (err) {
                throw new Error("Bet Error!");
            }
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/winlose",
                    {
                        token: user[token].userToken,
                        amount: response.raisePrice,
                        winState: response.raisePrice != 0 ? true : false,
                    }
                )
            } catch (err) {
                throw new Error("WinLose Error!");
            }
            try {
                res.json({
                    msg: msg,
                    activeArray: activeArray,
                    total: total,
                    result: result,
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
    ResultFold: async (req, res) => {
        const { userName, betAmount, token } = req.body;
        try {
            var betValue = parseFloat(betAmount);
            user[token].betAmount = betValue;
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/bet",
                    {
                        token: user[token].userToken,
                        amount: user[token].betAmount / 2,
                    }
                );
            } catch (err) {
                throw new Error("Bet Error!");
            }
            try {
                res.json({
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
    }
};