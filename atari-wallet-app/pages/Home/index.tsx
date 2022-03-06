import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Colors, w } from '../Theme';
import Icons from '../Assets';   
import Dashboard from './Dashboard'
import Graph from './Graph'
/* import Nft from './Nft' */
import Voucher from './Voucher'
import Presale from './Presale'
import Settings from './Settings'


const Tab = createMaterialBottomTabNavigator();

function HomeIndex() {
	return (
		<Tab.Navigator initialRouteName='Dashboard' labeled={false}  activeColor= {Colors.Primary} inactiveColor= {Colors.Dark} barStyle={{ backgroundColor: 'black'}}  > 
			 <Tab.Screen
				name="Dashboard"
				component={Dashboard}
				options={{   
					tabBarIcon: ({color}) => (
						<Icons.dashboard color={color} width={w(7)} height={w(7)} />  
					) 
				}}
			/>
			<Tab.Screen
				name="Graph"
				component={Graph}
				options={{ 
					tabBarIcon: ({ color}) => (
						<Icons.graph color={color} width={w(5)} height={w(5)} />  
					),
				}}
			/>
			<Tab.Screen
				name="Presale"
				component={Presale}
				options={{
					tabBarIcon: ({ color}) => (
						<Icons.exchange color={color} width={w(5)} height={w(5)} />  
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
			{/* <Tab.Screen
				name="Voucher"
				component={Voucher}
				options={{
				tabBarIcon: ({ color}) => (
					<Icons.voucher color={color} width={w(5)} height={w(5)} />  
				),
				}}
			/> */}
			<Tab.Screen
				name="Settings"
				component={Settings}
				options={{
					tabBarIcon: ({ color}) => (
						<Icons.setting color={color} width={w(5)} height={w(5)} />  
					),
				}}
			/> 
		</Tab.Navigator>
	);
}

export default HomeIndex