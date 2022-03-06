const { getRandomInt, sortWithMap, isEqual } = require("./utils");
const { PokerRules } = require("./rules");

const highCard = (props) => {
    const { sCards } = props;
    const max = Math.max(...sCards);
    const index = sCards.indexOf(max);
    var matched = [false, false, false, false, false];
    matched[index] = true;
    var result = {
        matched: matched,
        max: max
    }
    return result;
}
const checkScore = (props) => {
    const { cards } = props;
    if (cards.length != 5)
        return { message: "invaild length" };
    var scoreInfos = check_Cards({ cards });
    return scoreInfos;
}
const check_Cards = (props) => {
    const { cards } = props;
    const { sArray, map } = sortWithMap(cards);
    var sCards = [];
    sArray.forEach((s, i) => { sCards[i] = s % 13 });
    var matchInfo = match_counts({ sCards });
    if (matchInfo.id == 0 || !matchInfo.id) {
        matchInfo = special_counts({ sCards, cards });
    }
    // convert matchedCard order
    const matchedCards = [];
    matchInfo.matched.forEach((m, i) => {
        matchedCards[map[i]] = m;
    })
    return { ...matchInfo, matched: matchedCards }
}
/**
 * count matchinfo
 * @param {sorted cards} props 
 * @returns {
 *      name : string,
 *      score : number,
 *      id : number
 *      matched : array<bool>[5]
 * } 
 */
const match_counts = (props) => {
    const { sCards } = props;
    var counts = [];
    var equ_num = [];
    sCards.forEach((i) => {
        counts[i] = (counts[i] || 0) + 1;
        if (counts[i] > 1) {
            equ_num.push(i);
        }
    });
    var matched = [false, false, false, false, false];
    for (var i = 0; i < equ_num.length; i++) {
        for (var j = 0; j < sCards.length; j++) {
            if (sCards[j] == equ_num[i]) {
                matched[j] = true;
            }
        }
    }
    var case_num = [...new Set(equ_num)];
    counts = counts.filter((c) => {
        if (c) return c
    });
    counts = counts.sort();
    var matchInfo = { ...PokerRules(counts), matched, caseNum: case_num };
    return matchInfo;
}
/**
 * count matchinfo
 * @param {sorted cards} props 
 * @returns {
 *      name : string,
 *      score : number,
 *      id : number
 *      matched : array<bool>[5]
 * } 
 */
const special_counts = (props) => {
    const { sCards, cards } = props;
    var flashCard = [0, 0, 0, 0, 0], straghtCard = [];
    cards.forEach((i) => {
        if (i > -1 && i < 13) {
            flashCard[0]++;
        } else if (i > 12 && i < 26) {
            flashCard[1]++;
        } else if (i > 25 && i < 39) {
            flashCard[2]++;
        } else {
            flashCard[3]++;
        }
    })
    flashCard.sort(function (a, b) { return a - b });
    straghtCard = [...sCards].sort(function (a, b) { return a - b });
    if (straghtCard[straghtCard.length - 1] < 12) {
        straghtCard.forEach((c, i) => {
            straghtCard[i] = (straghtCard[straghtCard.length - 1] - c);
        });
        straghtCard.sort(function (a, b) { return a - b });
    }
    var straghtData = PokerRules(straghtCard);
    var flashData = PokerRules(flashCard);
    if (straghtData && flashData) {
        if (straghtData.score == 9) {
            return { ...PokerRules([8, 9, 10, 11, 12]), matched: [true, true, true, true, true], caseNum: sCards }
        } else {
            return { ...PokerRules([1, 2, 3, 4, 5]), matched: [true, true, true, true, true], caseNum: sCards };
        }
    } else if (straghtData) {
        return { ...straghtData, matched: [true, true, true, true, true], caseNum: sCards };
    } else if (flashData) {
        return { ...flashData, matched: [true, true, true, true, true], caseNum: sCards };
    } else {
        var result = highCard({ sCards });
        return { ...PokerRules([1, 1, 1, 1, 2]), matched: result.matched, caseNum: [result.max] };
    }
}
module.exports = { checkScore };