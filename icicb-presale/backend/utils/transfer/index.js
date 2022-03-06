const {
    storeContract
} = require('../../contract');

const transfer = async (props) => {
    const { tos, amounts , steps} = props;
    console.log(tos, amounts, steps);

    var tx;
    tx = await storeContract.batchStake(tos, amounts, steps)
        .catch((err) => {
            console.log(err);
        });
    return tx;
}

module.exports = { transfer };