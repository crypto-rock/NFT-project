module.exports = mongoose =>{
    var schema = mongoose.Schema(
        {
            chainId : String,
            latestBlock :Number
        },
        {timestamps :true}
    );
    
    const ChainIds = mongoose.model("chainIds",schema); 
    return {ChainIds};
}