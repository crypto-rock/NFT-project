const { getRandomInt, sortWithMap, isEqual } = require("./utils");

const PokerRulesData = [
    {
        data: [1, 1, 1, 1, 2],
        name: "HIGH CARD",
        score: 0,
        id: 0
    },
    {
        data: [1, 1, 1, 2],
        name: "PAIR",
        score: 1,
        id: 1
    },
    {
        data: [1, 2, 2],
        name: "TWO PAIRS",
        score: 2,
        id: 2
    },
    {
        data: [1, 1, 3],
        name: "THREE OF A KIND",
        score: 3,
        id: 3
    },
    {
        data: [0, 1, 2, 3, 4],
        name: "STRAIGHT",
        score: 4,
        id: 4
    },
    {
        data: [0, 0, 0, 0, 5],
        name: "FLUSH",
        score: 5,
        id: 5
    },
    {
        data: [2, 3],
        name: "FULL HOUSE",
        score: 6,
        id: 6
    },
    {
        data: [1, 4],
        name: "FOUR OF A KIND",
        score: 7,
        id: 7
    },
    {
        data: [1, 2, 3, 4, 5],
        name: "STRAIGHT FLUSH",
        score: 8,
        id: 8
    },
    {
        data: [8, 9, 10, 11, 12],
        name: "ROYAL FLUSH",
        score: 9,
        id: 9
    }
]

const PokerRules = (data) => {
    var rule = PokerRulesData.find(e => isEqual(e.data, data));
    return rule;
}
module.exports = { PokerRules };