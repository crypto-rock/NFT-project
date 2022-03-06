import React from 'react';
import {Grid} from '@material-ui/core';
import BridgeCard from "../components/bridge"
import Nav from '../components/nav';
import {useApplicationContext} from '../contexts'

function Home(){
    const {chainId} = useApplicationContext();
    //console.log(chainId);
    return(
        <div>
        <Nav />
        <Grid container >
            <Grid item xs = {12} sm = {1} md = {1}>
            </ Grid>
            <Grid item xs = {12} sm = {10} md = {10}>
                <BridgeCard />
            </Grid>
            <Grid item xs = {12} sm = {1} md = {1}>
            </ Grid>
        </Grid>
        </div>
    )
}

export default Home;