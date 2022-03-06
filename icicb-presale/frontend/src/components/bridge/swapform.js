import React from 'react';
import {useState, useEffect} from "react"
import {Grid} from '@material-ui/core';

import Dropdown from 'react-dropdown';

function SwapForm (props) {
    
    const {token, amount, handleAmount, handleTokenChange, active} = props;

    const [styledAmount, setStyledAmount] = useState(0)

    useEffect(()=>{
        if(amount !==0)
            setStyledAmount(parseFloat(Number(amount).toFixed(8)));
        else 
            setStyledAmount(amount);

    },[amount]);

    const options = [
        { value: "ETH", label: <div>ETH</div> },
        { value: "USDT", label: <div>USDT</div>},
      ];

    return ( 
        <div className = "swapForm">
           
            <Grid container>
                <Grid item xs = {12} sm = {12} md = {5} style={{border:'1px solid gray', padding:10, position:'relative'}}>
                    <Dropdown  className = "x-font3 mr-3 bridge-dropdown" options={options} onChange={handleTokenChange} value={token} placeholder="Select an option" disabled={!active}/>
                </Grid>
                <Grid item xs = {12} sm = {12} md = {7} style={{border:'1px solid gray', padding:20}}>
                    <input type="number"  step = {0.1} className = "x-stakeCard-input" value={styledAmount} onChange = {handleAmount} />
                </Grid>
            </Grid>
            <span style={{color:'white', marginLeft:10}} >
                
            </span>
        </div>
    )
}

export default SwapForm;