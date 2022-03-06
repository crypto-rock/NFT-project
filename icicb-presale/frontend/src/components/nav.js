import React, {useEffect, useState} from 'react';
import logoImg from '../assets/img/logo.png';
import metamaskimg from '../assets/img/metamask.png';
import { useWallet, UseWalletProvider } from 'use-wallet'
import {ethers} from "ethers"
import {useApplicationContext} from '../contexts';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import ftm_img from '../assets/img/2.png';
import ether_img from '../assets/img/ether.png';
import matic_img from '../assets/img/matic-bg.png';
import bsc_img from '../assets/img/BNB-bg.png';
import { Link } from 'react-router-dom';

function Nav(){
		const wallet = useWallet();
		
		const {chainId,updateChainId} = useApplicationContext();
		const [chainError, setChainError] = useState(false);
		const [MMConnected, setMMConnected] = useState(false);
		const [chainName,setChainName] = useState("ETHEREUM");

		var styledAddress =wallet.account? wallet.account.slice(0,4)+".."+wallet.account.slice(-4):"";

		const handleConnect =async ()=>{
			//console.log(wallet.status,chainId)
			if(wallet.status!=="connected"){
				wallet.connect();
			} 
		}
		
		useEffect (()=>{
			if(wallet.status==="error"){
				alert("Plase change chain to FANTOM Chain")
			}
		},[wallet.status])

		async function checkConnection(){
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const accounts = await provider.listAccounts();
			
			if(accounts.length!==0){
					wallet.connect();
			}
		}

		useEffect (()=>{
			if(window.ethereum !==undefined)
				checkConnection();
		},[chainId]);


		return(
			<div className = "x-navContainer">
				<img src = {logoImg} alt = "logo" width = "100px" height = "40px"/>
				<div className = "x-nav-buttons">
					<button className = "x-nav-connect" onClick={handleConnect} >
						<img src={metamaskimg} alt ="icon" width = "25px" height = "25px" className = "x-image-center" />
						<span style = {{marginLeft:"10px"}}> {wallet.status === 'connected' ?styledAddress:"CONNECT"}</span>
					</ button>
				</div>
				</div>
		)
}

export default Nav;