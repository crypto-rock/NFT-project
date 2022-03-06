import React,{useEffect,useState} from "react";
import {useWallet} from 'use-wallet';
import Swapform from "./swapform.js";
import {Radio, Grid} from '@material-ui/core';
import {useApplicationContext} from '../../contexts';
import Axios from "axios";
import loadingScreen from "../../assets/img/box.gif";
import {
    providers, presaleContract, usdtContract, supportChainId, storeContract
} from "../../contract"

import {ethers} from "ethers"
import AlertModal from "../alertModal"
import { store } from 'react-notifications-component'

import {delay,handleErr,fromBigNum, toBigNum} from "../utils.js";
import {stakeTerm} from "../../constants";

const stlyedNum = (num) => {
    return((parseFloat(Number(num).toFixed(3))));
}

function BridgeCard (){

    const wallet = useWallet();

    const [usdtBalance,setUsdtBalance] = useState("0");
    const [balance,setBalance] = useState("0");
    const [icicbBalance,setICICBBalance] = useState("0");
    const [lockedBalance,setLockedBalance] = useState("0");

    const [fromAmount,setFromAmount] = useState("0");
    const [toAmount,setToAmount] = useState("0");

    const [token, setToken] = useState("ETH");
    const [txDatas,setTxDatas] = useState({completedTransaction:[],conformedTransaction:[]})
    
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(false);
    
    const [pending,setPending] = useState("");
    const [pendingData,setPendingData] = useState({});
    const [alertInfos, setAlertInfos] = useState({title:"text",info:"error"});
    const [alertOpen, setAlertOpen] = useState(false);
    const [step, setStep] = useState("0");

    const [presaleStartTime, setPresaleStartTime] = useState(0);
    const [presaleEndTime, setPresaleEndTime] = useState(0);

    const explorer = {
        1:"https://etherscan.io/tx/",
        56:"https://bscscan.com/tx/",
        137:"https://polygonscan.com/tx/",
        250:"https://ftmscan.com/tx/",
        26:"http://13.58.153.103/tx/",
        4002: "https://testnet.ftmscan.com/tx/"
    }

    const PendingCard = (props)=>{
        const {fromhash,tohash} = props;
        return (
            <div className = "x-font3 pendingCard">
                <div>{fromhash===undefined?<div>Pending</div>:<a href = {explorer[4002]+fromhash} target = "_blank" rel="noreferrer" >completed Transaction</a>}</div>
                {tohash===undefined?<div>Pending</div>:<a href = {explorer[26]+tohash} target = "_blank" rel="noreferrer" >completed Transaction</a>}
            </div>
        )
    }

    const AlertCard = ()=>{
        return (
            <div className = "AlertCard" onClick={()=>{ console.log("transaction "); setAlertOpen(true);}}>
                {pending==="completed"?"completed Transaction":"Pending Transaction"}
            </div>
            )
    }

    const price = {
        USDT : 25,
        ETH : 75000
    }

    const getUserData = async ()=>{
        if(wallet.status ==="connected"){
            try{
                const provider = new ethers.providers.Web3Provider(wallet.ethereum);
                const signer =await provider.getSigner();
                
                var signedusdtContract = usdtContract.connect(signer);

                let usdtbalance = await signedusdtContract.balanceOf(wallet.account)
                setUsdtBalance(fromBigNum(usdtbalance,6));

                let balance = await provider.getBalance(wallet.account);
                setBalance(fromBigNum(balance,18));
            }catch(err){
                setBalance("0");
                setUsdtBalance("0");
            }
        }
    }

    const getICICBbalance  = async ()=>{
        console.log("getICICBbalance",wallet.status)
        if(wallet.status==="connected"){
            try {
                var balance = await providers[supportChainId[1]].getBalance(wallet.account);
                setICICBBalance(fromBigNum(balance,18));
            }catch(err){
                console.log(err);
                setICICBBalance("0");
            }
        }

    }

    const getLockedbalance  = async ()=>{
        if(wallet.status === "connected"){
            console.log("getLockedbalance")
            try {
                var stakerInfo = await storeContract.getStakerInfos(wallet.account);
                var length = stakerInfo._stakingAmount.length;
                console.log("stakerInfo", stakerInfo._stakingAmount);
                var lockedBalance = toBigNum("0",18);
                for(var i = 1; i<length; i++) {
                    lockedBalance = lockedBalance.add(stakerInfo._stakingAmount[i])
                }
                setLockedBalance(fromBigNum(lockedBalance, 18));
            }catch(err){
                console.log(err);
                setLockedBalance("0");
            }
        }

    }

    useEffect(()=>{
        getData();
    },[wallet.status])
    
    useEffect(()=>{
        setInterval(() => {
            console.log('This will run every 5 second!');
            getData();
        }, 5000);
    },[])

    /* -------- bridge Data -------- */
    ///////////////////////////////////
    const getData = async()=>{
        try{
            let txDatas = await Axios.post(process.env.REACT_APP_ENDPOINT+"/api/getData");
            console.log(txDatas.data);
            setTxDatas(txDatas.data);
        }catch(err){
            handleErr(err)
        }
    }

    const checkTxs = (transferType)=>{
        if(wallet.status==="connected"&&txDatas.completedTransaction["Transfer"]){
            txDatas.completedTransaction[transferType].map((pendingTx,index)=>{
                //pending
                if(pendingTx.from===wallet.account){
                    let pending = "completed";
                    let pendingData = pendingTx;
                    setPending(pending);
                    setPendingData(pendingData);
                }
            })

            txDatas.conformedTransaction[transferType].map((pendingTx,index)=>{
                //pending
                if(pendingTx.from===wallet.account){
                    let pending = "conformed";
                    let pendingData = pendingTx;
                    setPending(pending);
                    setPendingData(pendingData);
                }
            })
        }
    }

    useEffect(()=>{
        if(pending!==""){
            setAlertInfos(
                {
                title:pending,
                info:(<PendingCard 
                    fromhash = {pendingData.fromhash}
                    tohash = {pendingData.tohash}
                    />)
                })
        }
    },[pending])

    useEffect(()=>{
        checkTxs("Transfer");
    },[txDatas])

    useEffect(()=>{
        getUserData();
        getICICBbalance();
        getLockedbalance();
    },[wallet.status, txDatas])
    /* -------- input -------- */
    /////////////////////////////

    const handleAmount = (e)=>{
        setFromAmount(e.target.value);
        let toAmount = Number(e.target.value) *price[token] * stakeTerm.stakingRate[step]/1000000;
        if(toAmount<0) toAmount = 0;
        setToAmount(toAmount);
    }

    const handleAmount2 = (e)=>{
        setToAmount(e.target.value);
        let fromAmount = Number(e.target.value)/(price[token]* stakeTerm.stakingRate[step]/1000000);
        setFromAmount(fromAmount);
    }

    const handleStep = (e,v) =>{
        setStep(v);
    }

    useEffect(()=>{
        let toAmount = Number(fromAmount) *price[token] * stakeTerm.stakingRate[step]/1000000;
        if(toAmount<0) toAmount = 0;
        setToAmount(toAmount);
    },[step])

    useEffect(()=>{
        var tokenBalance = balance;
        if(token === "USDT") tokenBalance = usdtBalance;
        if(Number(tokenBalance) < Number(fromAmount)){
            setError(true)
        }
        else{
            setError(false)
        }
    },[fromAmount])


    /* -------- actions -------- */
    ///////////////////////////////

    const handleExchange =async ()=>{
        if(wallet.status ==="connected"){
            setLoading(true);
            try {
                if(token === "ETH"){
                    buyETH();
                }
                else {
                    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
                    const signer =await provider.getSigner();
                    var userAddress =await signer.getAddress();
                    let presaleContractAddress = (presaleContract).address
        
                    let signedUsdtContract = (usdtContract).connect(signer);
                    var allowance = (await presaleContractAddress.allowance(userAddress,presaleContractAddress)).toString();
        
                    if(allowance<fromAmount){
                        var tx = await signedUsdtContract.approve(presaleContractAddress,fromAmount*10)
                        await tx.wait();
                        buyUSDT();
                    }
                    else {
                        buyUSDT();
                    }
                }
            }catch(err){
                setLoading(false);
                handleErr(err);
            }
        }
    }

    const buyUSDT =async ()=>{
        
        try {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const signer =await provider.getSigner();
            let signedPresaleContract =presaleContract.connect(signer);

            var usdtValue = toBigNum(fromAmount.toString(),6);

            var tx = await signedPresaleContract.depositUSDT(usdtValue,step)
            
            await tx.wait();
            setLoading(false);
            alertInfos.title  = "pending Transaction";
            alertInfos.info = PendingCard;
            setAlertOpen(false);
        }catch(err){
            setLoading(false);
            handleErr(err);
        }

    }
    
    const buyETH =async ()=>{
        try {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum);
            const signer =await provider.getSigner();
            let signedPresaleContract =presaleContract.connect(signer);

            var ethValue = toBigNum(fromAmount.toString(),18);
            var tx = await signedPresaleContract.depositETH(step,{value:ethValue})
            await tx.wait();
            setLoading(false);
            alertInfos.title  = "pending Transaction";
            alertInfos.info = PendingCard;
            setAlertOpen(false);
        }catch(err){
            setLoading(false);
            handleErr(err);
        }

    }

    const handleClose = ()=>{
        setAlertOpen(false);
    }

    const handleChangeToken = (buyToken)=>{
        setToken(buyToken.value);
    }

    return (
        <div className = "bridgeCard">
        {pending!==""?<AlertCard />
        :""}
        <AlertModal title = {alertInfos.title} info = {alertInfos.info} open = {alertOpen} handleClose = {handleClose}/>
        <span className = "x-font3"> ICICB Presale</span>    
        <div className = "spacer"></div>
        <Grid container>
            <Grid item xs = {12} sm = {12} md = {3} >
            </Grid>
            <Grid item xs = {12} sm = {12} md = {6}>
                <Swapform token = {token} amount = {fromAmount} handleAmount = {handleAmount} handleTokenChange = {handleChangeToken}  active = {true}></Swapform>
            </Grid> 
            <Grid item xs = {12} sm = {12} md = {3} >
            </Grid>
            <div className = "spacer"></div>
            <Grid item xs = {12} sm = {12} md = {3} >
            </Grid>
            <Grid item xs = {12} sm = {12} md = {6} className = "x-font5" style={{textAlign: "left", paddingLeft:20}}>
                <Grid container>
                    <Grid item xs = {6} sm = {6} md = {3} >
                        {"Balance "} {token === "ETH"?stlyedNum(balance) + " ETH": stlyedNum(usdtBalance) + " USDT"} {}
                    </Grid>
                    <Grid item xs = {6} sm = {6} md = {3} >
                        {"PRICE "} {stlyedNum(price[token])} ICICB
                    </Grid>
                    <Grid item xs = {6} sm = {6} md = {3} >
                        {"Balance "}{stlyedNum(icicbBalance)} {"ICICB"} 
                    </Grid>
                    <Grid item xs = {6} sm = {6} md = {3} >
                        {"Locked "} {stlyedNum(lockedBalance)} {"ICICB"} 
                    </Grid>
                </Grid>
            </Grid> 
            <Grid item xs = {12} sm = {12} md = {3} >
            </Grid>
            <div className = "spacer"></div>
            <Grid item xs = {12} sm = {12} md = {3} >
            </Grid>
            <Grid item xs = {12} sm = {12} md = {6} >
                <Swapform token = {"ICICB"} amount = {toAmount} handleAmount = {handleAmount2} active = {false} ></Swapform>
            </Grid> 
            <Grid item xs = {12} sm = {12} md = {3} >
            </Grid>
        </Grid>
        
        <div className="box_rect" style={{marginTop:30, textAlign:'center'}}>
                    <span className = "x-font7 locked-title">Select the locking period
                    </span>
                            <Grid container spacing = {3}>
                                <Grid item xs = {0} sm = {1} md = {3}></Grid>
                                <Grid item xs = {12} sm = {10} md = {6}>
                                    {
                                        stakeTerm.stakePeriod.map((s,index)=>{
                                            return (
                                            <div style={{paddingTop:10}}>
                                                <Radio
                                                    checked={Number(step) == index}
                                                    onChange={(e)=>handleStep(e, index)}
                                                    name="radio-button-demo"
                                                    color = "primary"
                                                    inputProps={{ 'aria-label': 'A' }}
                                                />
                                                {
                                                index == 0 ?<span className = "x-font1">Buy</span>:
                                                <span className = "x-font1">{stakeTerm.stakePeriod[index]/30} month: <span className="x-font1" > {stakeTerm.stakingRate[index]/1000000} </span> return</span>
                                                }
                                                
                                            </div>
                                            )
                                        })
                                    }
                                </Grid>
                                <Grid item xs = {0} sm = {1} md = {3}></Grid>
                            </Grid>
                    </div>
        <div className = "spacer-1"></div>
        <button className = "swap-button" onClick = {handleExchange}>{loading?<img src ={loadingScreen}  width = "40px" alt= "loading"/>:error===true?"Insufficient balance":"Exchange"}</button>
        </div>
    )
}

export default BridgeCard;