const axios = require("axios");
const rand = require("random-seed").create();
require("dotenv").config();

const getNumbersArray = (num, max) => {
    let array = [];
    for (let i = 0; i < num;) {
        let random = rand.intBetween(0, max - 1);
        if (array.indexOf(Numbers[random]) == -1) {
            array.push(Numbers[random]);
            i++;
        } else {
            continue;
        }
    }
    return array;
}
const getPrize = (num, max, betAmount) => {
    let array = [];
    for (let i = 0; i < num; i++) {
        let random = rand.intBetween(0, max - 1);
        let prize = Scores[random] * betAmount;
        array.push(prize);
    }
    return array;
}
const getSumsArray = (NumbersArray) => {
    let array = [];
    for (let i = 0; i < 3; i++) {
        let Sum = 0;
        for (let j = i * 3; j < (i * 3 + 3); j++) {
            Sum += NumbersArray[j];
        }
        array.push(Sum);
    }
    return array;
}
const getAmount = (Sum, prize) => {
    let earnAmount = 0;
    for (let i = 0; i < 3; i++) {
        if (Sum[i] == 7) {
            earnAmount += prize[i];
        } else if (Sum[i] == 11) {
            earnAmount += prize[i];
        } else if (Sum[i] == 21) {
            earnAmount += prize[i]
        }
    }
    return earnAmount;
}

let Numbers = [0, 1, 2, 3, 4, 5, 6, 7, 11];
let Scores = [0, 1.25, 1.5, 2, 2.5, 2.5, 3, 3, 4, 4, 4, 4.5, 5, 5, 5, 8, 7.5, 7.5, 10, 10, 10, 10, 15, 15, 15, 15, 20, 20, 20, 20, 30, 30, 30, 30, 40, 40, 40, 50, 50, 50, 100, 100, 100, 500, 1000]

module.exports = {
    Play: async (req, res) => {
        try {
            let users = [];
            let earnAmount = 0;

            const { token, betAmount } = req.body;

            const bet_Amount = parseFloat(betAmount);

            users[token] = {
                token: token,
                betAmount: bet_Amount
            }
            try {
                await axios.post(process.env.PLATFORM_SERVER + "api/games/bet", {
                    token: users[token].token,
                    amount: users[token].betAmount
                });
            } catch (err) {
                throw new Error("BET ERROR!");
            }

            try {
                let NumbersArray = await getNumbersArray(9, 9);
                let SumsArray = await getSumsArray(NumbersArray);
                let prize = await getPrize(3, 45, users[token].betAmount);
                earnAmount = await getAmount(SumsArray, prize);
                res.json({
                    earnAmount: earnAmount,
                    NumbersArray: NumbersArray,
                    SumsArray: SumsArray,
                    prize: prize,
                    Message: "SUCCESS!"
                })

            } catch (err) {
                throw new Error("DATA ERROR!");
            }
            try {
                await axios.post(process.env.PLATFORM_SERVER + "api/games/winlose", {
                    token: users[token].token,
                    amount: earnAmount,
                    winState: earnAmount > 0 ? true : false
                });
            } catch (err) {
                throw new Error("SERVER ERROR!");
            }
        } catch (err) {
            res.json({
                Message: err.message
            });
        }
    },
};
