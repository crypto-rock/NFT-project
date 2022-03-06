import React from 'react'
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import {configureStore} from '@reduxjs/toolkit';
import AnimatedSplash from "react-native-animated-splash-screen";

import AuthLogin from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Reset from './pages/Auth/Reset'
import HomeIndex from './pages/Home' 
import Slice, { getData } from './reducer'
import useWallet, {now} from './useWallet'

const store = configureStore({reducer: Slice.reducer});
const Stack = createNativeStackNavigator();

const AppContainer = () => {
	const {update, user, updated, call} = useWallet();
	const getNewTxs = async () => { 
		if (user) {
			const result = await call("/new-txs")
			if (result!==null && result.result) {
				update({ ...result.result, updated:now() })
			}
		}
	}
	React.useEffect(() => {
		
		getData().then(state=>{
			if (state) {
				update(state)
			}
		})
	}, [])
	React.useEffect(() => {
		if (user!==null) {
			if (updated===0) {
				getNewTxs()
			} else {
				let timer = setTimeout(()=>{
					getNewTxs()
				}, 5000)
				return () => timer && clearTimeout(timer);
			}
		}
	})

	return (
		<NavigationContainer>
			<Stack.Navigator  initialRouteName={'AuthLogin'}  screenOptions={{headerShown: false}}>
				{/* {user===null ? (
					<> */}
						<Stack.Screen name="AuthLogin" component={AuthLogin} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="Reset" component={Reset} />
					{/* </>
				) : null} */}
				<Stack.Screen name="HomeIndex" component={HomeIndex} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}



function App() {
	return (
		<Provider store={store}>
			<AppContainer />
		</Provider>
	)
}
export default App