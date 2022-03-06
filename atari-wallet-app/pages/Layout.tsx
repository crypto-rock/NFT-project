import React from "react";
import { ImageBackground, View, Text } from "react-native"; 
import Spinner from 'react-native-loading-spinner-overlay';
import Assets from "./Assets";
import theme, { Colors} from './Theme'; 
import useWallet from '../useWallet';

const Layout = (props:any) => {
	
	const {loading} = useWallet();
	return (
		<View style={{...theme.flex1, ...theme.flexdirectioncolumn}}>
			<ImageBackground source={Assets.background} resizeMode="cover" style={{...theme.h100, ...theme.w100}}>
				<View style={{...theme.flexdirectionrow, ...theme.justifycenter, ...theme.relative, height:80, backgroundColor:'black'}}>
					<View style={{...theme.darkprimarycolor, opacity:0.5, ...theme.w100, ...theme.h100, ...theme.absolute}}></View>
					<View style={{...theme.flexdirectionrow, ...theme.alignitemcenter, ...theme.justifycenter}}>
						<Assets.ATARI width={50} height={50} color={'#e31b22'} />
						<Text style={{color:'#e31b22', fontSize:45}}>ATARI</Text>
					</View>
				</View>
				<Spinner visible = {loading} />  
				
                {props.children}
			</ImageBackground>
		</View>
	)
};

export default Layout;