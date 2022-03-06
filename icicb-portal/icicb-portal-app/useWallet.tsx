import React from 'react'
import { useSelector, useDispatch}	from 'react-redux';
import Slice from './reducer'
import errors from './config/errors.json' 
import { JSHmac, CONSTANTS } from "react-native-hash";
import Toast from 'react-native-root-toast';
import { REACT_APP_PROXY, REACT_APP_GTAG, REACT_APP_SECRET} from "@env"; 
import * as Clipboard from 'expo-clipboard';

export const now = () => Math.round(new Date().getTime()/1000) 
export const N = (val:string|number, p:number=6) => isNaN(Number(val)) ? 0 : Math.round(Number(val) * 10 ** p) / (10 ** p)

const proxy = REACT_APP_PROXY;// || "http://portal.icicbchain.com";
console.log('proxy', proxy)
export const isPrivate = true
export const NF = (num:number,p:number=2) => num.toLocaleString('en', {maximumFractionDigits:p});
export const hmac256 = async (plain:string):Promise<string> => {
	try {
		return await JSHmac( plain, REACT_APP_SECRET, CONSTANTS. HmacAlgorithms.HmacSHA256 );
	} catch (error) {
		console.log(error)
	}
	return "";
}
export const getError = (code:number) => errors[code] || 'Unknown error';
export const validateEmail = (email:string):boolean =>email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)!==null;
export const validateUsername = (username:string):boolean => /^[a-zA-Z0-9]{3,20}$/.test(username);

export const copyToClipboard = (text:string) => {
	Clipboard.setString(text);
	showToast('Copied')
};

export const showToast = (msg, type="error") => {
	let toast = Toast.show(msg, {
		duration: Toast.durations.LONG,
		position: 100,
		backgroundColor:"white",
		textColor : type==="error"?"red":"green",
		opacity:1,
		shadow: true,
		animation: true,
		hideOnPress: true,
		delay: 0,
	});
	setTimeout(function () {
		Toast.hide(toast);
	}, 1500);
}  


const useWallet = ():UseWalletTypes => {
	const G = useSelector((state:WalletTypes)=>state)
	const L = G.L
	const dispatch = useDispatch()
	const update = (payload:{[key:string]:any}) => dispatch(Slice.actions.update(payload))
	
	const T = (key:string, args?:{[key:string]:string|number}|string|number):string => {
		let text = L[key]
		if (text===undefined) throw new Error('Undefined lang key[' + key + ']')
		if (typeof args==='string' || typeof args==='number') {
			text = text.replace(/\{\w+\}/, String(args))
		} else {
			for(let k in args) text = text.replace(new RegExp('{'+k+'}', 'g'), String(args[k]))
		}
		return text
	}
	

	const call = async (url:string, params?:any):Promise<ServerResponse|null> => { 
		try { 
			const result = await fetch(proxy + url, { method: 'POST', headers:{'content-type':'application/json', 'x-token':G.user?.token || '', 'x-public': isPrivate ? "0" : "1"}, body:(params? JSON.stringify(params): null)});
			return await result.json();
		} catch (error) {
			console.log(error)
		}
		return null
	} 
	return {...G, T, call, update};
}

export default useWallet
