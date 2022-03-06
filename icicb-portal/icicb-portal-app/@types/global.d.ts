declare interface LogsType {
	coin: 	string
	usd: 	number
	updated:number 
}
 
declare interface NetworkType {
	[key:string]:{
        evm?: 			boolean,
		coin: 			string
		decimals: 		number
		confirmations: 	number
		blocktime: 		number
		rpc: 			string
		explorer: 		string
	}
}

declare interface TxType {
	txid:	 	string
	chain:	 	string
	coin:	 	string
	address:	string
	confirms:	number
	confirmed:	boolean
	input:	 	boolean
	amount:	 	number
	created:	number
}

declare interface ChartType {
	prev: 	Array<LogsType>
	date: 	Array<LogsType>
	week: 	Array<LogsType>
	month: Array<LogsType>
}

declare interface ServerResponse {
	result?: any
	error?: number
}

declare interface LoginReqeustType {
	username: string
	password: string
}

declare interface LoginResponseType {
	token: 		string
	username:	string
	email: 		string
	pinCode: 	boolean
	presale: 	boolean
	voucher: 	boolean
	lastSeen:	number
	created: 	number
}

declare interface RegisterReqeustType {
	username: string
	email: string
	password: string
}
declare interface ResetReqeustType {
	email: string
}

declare interface ResetResponseType {
	success: boolean
}

declare interface PincodeReqeustType {
	code: string
}

declare interface PresaleReqeustType {
	coin: string
	quantity: string
	target: string
}

declare interface NewtxsResponseType {
	balances:{[coin:string]:{balance:number, locked:number}}
	wallets: {[chain:string]:string}
	prices:  {[coin:string]:number}
	logs: 	 ChartType
	txs: 	 TxType[]
}

/* declare interface BridgeTypes extends WalletTypes, NewtxsResponseType {
    
} */

declare interface ResultType {
    err: string,
    result: string
}

interface WalletTypes extends NewtxsResponseType {
	lang: string
    L: {[lang:string]:any}
    user: LoginResponseType | null
	updated:number
	loading?:boolean
    currentPage: string
}
interface UseWalletTypes extends WalletTypes {
    T(key:string, args?:{[key:string]:string|number}|string|number):string
    update(payload:{[key:string]:any})
    call(url:string, params?:any):Promise<ServerResponse|null> 
}


declare module '@env' {
    export const REACT_APP_PROXY: string
    export const REACT_APP_GTAG: string
    export const REACT_APP_SECRET: string
}