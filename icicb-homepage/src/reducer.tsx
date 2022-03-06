import { createSlice } from '@reduxjs/toolkit'; 

const appKey = process.env.REACT_APP_GTAG + '-config'

const locales = {
    "en-US": '',
    "zh-CN": ''
};

const lang = window.localStorage.getItem('lang') || 'en-US';
const DEFAULT_NET = 'ETH'
  
export default createSlice({
	name: 'bridge',
	initialState:  locales,
	reducers: {
		update: (state:any, action) => {
			for (const k in action.payload) {
				if (state[k] === undefined) new Error('🦊 undefined account item')
				state[k] = action.payload[k]
			} 
		}
	}
})
