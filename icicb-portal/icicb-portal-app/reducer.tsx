import { createSlice } from '@reduxjs/toolkit'; 
// import { AsyncStorage} from "react-native"; 
const appKey = 'icicb-1833c04'

const locales = {
    "en-US": require('./locales/en-US.json'),
    "zh-CN": require('./locales/zh-CN.json'),
};

const lang = 'en-US';

const initialState: WalletTypes = {
	lang,
    L: locales[lang],
	currentPage: '',
	updated: 0, 
	
	user: null,
	
	balances:{},
	wallets: {},
	prices:  {},
	logs: 	 {
		prev: 	[],
		date: 	[],
		week: 	[],
		month: 	[]
	},
	txs: 	 []
} 

export const storeData = async (value) => {
	// return AsyncStorage.setItem(
	// 	 appKey,
	// 	 JSON.stringify(value)
	// ) 
	
}

export const getData = async () => {
	try {
		// return JSON.parse(
		// 	// await AsyncStorage.getItem(appKey)
		// ) 
	} catch(e) {
		return null
	}
}
  
export default createSlice({
	name: 'bridge',
	initialState,
	reducers: {
		update: (state:any, action) => {
			for (const k in action.payload) {
				if (state[k] === undefined) new Error('🦊 undefined account item')
				state[k] = action.payload[k]
			}
			storeData(state)
		}
	}
})
