
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

/**
 * sort and return map
 * @param {cards : array[5]} props 
 */

const sortWithMap = (cards) => {
    var cards = [...cards];
    var sArray = [...cards].sort(function (a, b) { return a - b });
    // find map
    var map = [];
    sArray.forEach((sCard, index) => {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i] == sCard) {
                map[index] = i;
                break;
            }
        }
    });
    return { sArray, map };
}
const isEqual = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}
module.exports = { getRandomInt, sortWithMap, isEqual }