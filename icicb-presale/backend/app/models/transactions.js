module.exports = mongoose =>{
    var schema = mongoose.Schema(
        {
            from :String,
            amount: String,
            step: String,
            fromhash: String,
            tohash:String
        },
        {timestamps :true}
    );
    
    const CompletedTxs = mongoose.model("completedTxs",schema); 
    return {CompletedTxs};
}