import React from 'react'
import { useSelector, useDispatch}	from 'react-redux';
import abiIrc20 					from './config/abis/IRC20.json'
import abiBridge 					from './config/abis/Bridge.json'
import networks 					from './config/networks.json'
import Slice 						from './reducer'
/* import Web3 						from 'web3' */

export const DISCONNECTED= 'disconnected';
export const CONNECTING = 'connecting';
export const CONNECTED 	= 'connected';
/* export const getWeb3 = ()=>window.Web3; */
export const ZERO = "0x0000000000000000000000000000000000000000"
export const toHex = (val: string | number): string => new window.Web3().utils.toHex(val)
export const validAddress = (address: string): boolean => new window.Web3().isAddress(address)
export const fromEther = (v:number, p?:number) => '0x'+(BigInt(Math.round(v*1e6)) * BigInt(10 ** ((p || 18)-6))).toString(16)
export const toEther = (v:number|string, p?:number) => Number(BigInt(v) / BigInt(10 ** ((p || 18)-6)))/1e6

const AppKey = process.env.REACT_APP_GTAG || ''
const proxy = process.env.REACT_APP_ENDPOINT || ''
const ERR_INSTALL 		= '🦊 You must install Metamask into your browser: https://metamask.io/download.html'
const ERR_DISCONNECTED 	= '🦊 walllet disconnected'
const ERR_NOACCOUNTS 	= '🦊 No selected address.'
const ERR_UNKNOWN 		= '🦊 Unknown error'
const ERR_ASKCONNECT 	= '🦊 Connect to Metamask using the button on the top right.'
const ERR_CANCELLED 	= '🦊 You cancelled requested operation.'
const ERR_CHAINID 		= '🦊 Invalid chain id #:chainId'


export const request = async (url:string, params?:any):Promise<ServerResponse|null> => { 
	try {
		const result = await fetch(proxy + url, { method: 'POST', headers:{'content-type':'application/json'}, body:params ? JSON.stringify(params) : null });
		return await result.json();
	} catch (error) {
		console.log(error)
	}
	return null
}

const useWallet = ():UseWalletTypes => {
	const G = useSelector((state:BridgeTypes)=>state)
	const L = G.L
	const dispatch = useDispatch()
	const update = (payload:{[key:string]:any}) => dispatch(Slice.actions.update(payload))
	const connected = G.status===CONNECTED;

	React.useEffect(() => {
		if (connected) {
			getChainId().then(chainId=>{
				if (chainId===G.chainId) {
					update({status:CONNECTED})
				} else {
					update({status:DISCONNECTED, err:ERR_DISCONNECTED})
				}
			});
		}
	}, [G.chainId, connected])

	React.useEffect(() => {
		const { ethereum } = window
		if (ethereum && connected) {
			ethereum.on('accountsChanged', accountChanged)
			ethereum.on('chainChanged', chainChanged)
		}
	})

	const getPending = ():{pending:PendingTypes, txs:TxTypes} => {
		let pending:PendingTypes = {}
		let txs:TxTypes = {}
		try {
			let buf = window.localStorage.getItem(AppKey)
			if (buf) pending = JSON.parse(buf)
			buf = window.localStorage.getItem(AppKey + '-txs')
			if (buf) txs = JSON.parse(buf)
			
		} catch (err) {
			console.log(err)
		}
		return {pending, txs}
	}

	const setPending = (key:string, tx:PendingType) => {
		const pending:PendingTypes = {...G.pending, [key]:tx}
		window.localStorage.setItem(AppKey, JSON.stringify(pending))
		update({pending})
	}
	const setTxs = (txs:TxTypes) => {
		window.localStorage.setItem(AppKey + '-txs', JSON.stringify(txs))
		update({txs})
	}

	const check = async (network:string, txs:Array<string>):Promise<{[txId:string]:number}> =>  {
		const results:{[txId:string]:number} = {}
		const net = networks[network]
		const web3 = new window.Web3(net.rpc)
		const height = await web3.eth.getBlockNumber()
		const limit = 20
		const count = txs.length
		for(let i=0; i<count; i+=limit) {
			const json:Array<{jsonrpc:string, method:string, params:Array<string>, id:number}> = []
			let iEnd = i + limit
			if (iEnd>count) iEnd = count
			for (let k=i; k<iEnd; k++) {
				json.push({jsonrpc: '2.0', method: 'eth_getTransactionReceipt', params: [txs[k]], id: k++})
			}
			const response = await fetch(net.rpc, {
				body:JSON.stringify(json),
				headers: {Accept: "application/json","Content-Type": "application/json"},
				method: "POST"
			})
			const result = await response.json();
			if (result!==null && Array.isArray(result)) {
				for(let v of result) {
					results[txs[v.id]] = v.result && v.result.status === '0x1' ? height - Number(v.result.blockNumber) + 1 : -1
				}
			}
		}
		return results
	}
	const removePending = (txId:string) => {
		try {
			let pending = getPending()
			delete pending[txId]
			window.localStorage.setItem(AppKey, JSON.stringify(pending))
		} catch (err) {
			console.log(err)
		}
	}

	const _connect = async (accounts?:Array<string>)=>{
		let err = '';
		try {
			const { ethereum } = window
			update({status:CONNECTING, err:''})
			if (ethereum) {
				if (accounts===undefined) accounts = await ethereum.request({method: 'eth_requestAccounts'})
				
				if (accounts && accounts.length) {
					const chainId = await getChainId();
					if (chainId===G.chainId) {
						update({status:CONNECTED, address:accounts[0], err:''})
						return 
					} else {
						err = ERR_CHAINID.replace(':chainId', String(chainId))	
					}
				} else {
					err = ERR_NOACCOUNTS
				}
			} else {
				err = ERR_INSTALL
			}
		} catch (error:any) {
			err = '🦊 ' + error.message
		}
		update({status:DISCONNECTED, address:'', err})
    }
    const getChainId = async () => {
		const { ethereum } = window
		if (ethereum) {
			return Number(await ethereum.request({ method: 'eth_chainId' }));
		}
		return 0
	}
	const accountChanged = async (accounts: any) => {
		if (connected) {
			_connect(accounts);
		}
	}

	const chainChanged = async (newChainId) => {
		if (connected) {
			_connect();
		}
	}

    const connect = async (): Promise<void> =>{
		_connect();
    }
    const addNetwork = async () => {
		const { ethereum } = window
		if (ethereum) {
			ethereum.request({
				method: 'wallet_addEthereumChain',
				params: [{
					chainId: toHex(networks.ICICB.chainId),
					chainName: L['chain.icicb'],
					nativeCurrency: {
						name: 'ICICB Coin',
						symbol: 'ICICB',
						decimals: 18
					},
					rpcUrls: [networks.ICICB.rpc],
					blockExplorerUrls: [networks.ICICB.explorer]
				}]
			}).catch((error) => {
				console.log(error)
			}) 
		}
		
	}
	
	const call = async (to:string, abi:any, method:string, args:Array<string|number|boolean>, rpc?:string): Promise<any> => {
		const web3 = new window.Web3(rpc || G.rpc)
		const contract = new web3.eth.Contract(abi, to)
		return await contract.methods[method](...args).call()
	}

    const send = async (to:string, abi:any, value:string, method:string, args:Array<string|number|boolean>): Promise<string|undefined> => {
		let err = '';
		try {
			const { ethereum } = window
			if (ethereum && ethereum.isConnected) {
				const web3 = new window.Web3(ethereum)
				const contract = new web3.eth.Contract(abi, to)
				const data = contract.methods[method](...args).encodeABI()
				const json = {from:G.address, to, value, data}
				const res = await ethereum.request({method: 'eth_sendTransaction', params: [json]})
				if (res) return res
                err = ERR_UNKNOWN
			} else {
                err = ERR_ASKCONNECT
			}
		} catch (error:any) {
			if (error.code===4001) {
				err = ERR_CANCELLED
			} else if (error.code===-32603) {
				const matches = error.message.match(/'(\{[^']*\})'/)
				if (matches.length===2) {
					let json:any;
					try {
						json = JSON.parse(matches[1])
						if (json.value && json.value.data) {
							const {code, message} = json.value.data
							err = '🦊 ' + message + ' (' + code + ')'
						} else {
							err = '🦊 ' + error.message	
						}
					} catch (err1) {
						err = '🦊 ' + error.message		
					}
					
				} else {
					err = '🦊 ' + error.message	
				}
			} else {
				err = '🦊 ' + error.message
			}
		}
		throw new Error(err)
	}
	
    const waitTransaction = async (txId:string): Promise<boolean> => {
		const web3 = new window.Web3(G.rpc)
		let repeat = 100
		while (--repeat > 0) {
			const receipt = await web3.eth.getTransactionReceipt(txId)
			if (receipt) {
				const resolvedReceipt = await receipt
				if (resolvedReceipt && resolvedReceipt.blockNumber) {
					return true;
				}
			}
			await new Promise((resolve) => setTimeout(resolve, 3000))
		}
		return false;
	}
	
	const balance = async (token:string): Promise<string|undefined> => {
		const web3 = new window.Web3(G.rpc)
		if (token==='-') {
			return await web3.eth.getBalance(G.address)
		} else {
			return await call(token, abiIrc20, 'balanceOf', [G.address])
		}
	}
	const bridgebalance = async (chain:string, token:string): Promise<string|undefined> => {
		const net = networks[chain]
		
		if (token==='-') {
			const web3 = new window.Web3(net.rpc)
			return await web3.eth.getBalance(net.bridge)
		} else {
			return await call(token, abiIrc20, 'balanceOf', [net.bridge], net.rpc)
		}
	}

	const approval = async (token:string): Promise<string|undefined> => {
		return await call(token, abiIrc20, 'allowance', [G.address, networks[G.chain].bridge])
	}

    const approve = async (token:string, value:string): Promise<string|undefined> => {
		return await send(token, abiIrc20, '0x0', 'approve', [networks[G.chain].bridge, value])
	}

	const deposit = async (token:string, value:string, targetChain:number): Promise<string|undefined> => {
		return await send(networks[G.chain].bridge, abiBridge, token===ZERO ? value : '0x0', 'deposit', [token, value, targetChain])
	}
	return {...G, update, check, addNetwork, getPending, setPending, removePending, setTxs, connect, balance, bridgebalance, waitTransaction, approval, approve, /* depositToIcicb,  */deposit};
}

export default useWallet
