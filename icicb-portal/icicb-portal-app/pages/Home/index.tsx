import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Colors, w } from '../Theme';
import Icons from '../Assets';   
import Balance from './Balance'
import Graph from './Graph'
import Voucher from './Voucher'
import Presale from './Presale'
import Settings from './Settings'
import { isPrivate } from '../../useWallet';

const Tab = createMaterialBottomTabNavigator();

function HomeIndex() {
	return (
		<Tab.Navigator initialRouteName='Balance' labeled={false}  activeColor= {Colors.Primary} inactiveColor= {Colors.DarkPrimary} barStyle={{ backgroundColor: "black"}} > 
			 <Tab.Screen
				name="Balance"
				component={Balance}
				options={{   
					tabBarIcon: ({color}) => (
						<Icons.dashboard color={color} width={w(8)} height={w(8)} />  
					) 
				}}
			/>
			<Tab.Screen
				name="Graph"
				component={Graph}
				options={{ 
					tabBarIcon: ({ color}) => (
						<Icons.graph color={color} width={w(6)} height={w(6)} />  
					),
				}}
			/>
			<Tab.Screen
				name="Presale"
				component={Presale}
				options={{
					tabBarIcon: ({ color}) => (
						<Icons.exchange color={color} width={w(6)} height={w(6)} />  
					),
				}}
			/>
			{/* <Tab.Screen
				name="Nft"
				component={Nft}
				options={{
				tabBarIcon: ({ color}) => (
					<Icons.list color={color} width={w(6)} height={w(6)} />  
				),
				}}
			/> */}
			{isPrivate ? (
				<Tab.Screen
					name="Voucher"
					component={Voucher}
					options={{
					tabBarIcon: ({ color}) => (
						<Icons.voucher color={color} width={w(6)} height={w(6)} />  
					),
					}}
				/>
			) : null}
			<Tab.Screen
				name="Settings"
				component={Settings}
				options={{
					tabBarIcon: ({ color}) => (
						<Icons.setting color={color} width={w(6)} height={w(6)} />  
					),
				}}
			/> 
		</Tab.Navigator>
	);
}

export default HomeIndex