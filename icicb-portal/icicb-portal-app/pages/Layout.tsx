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
					<View style={{...theme.flexdirectionrow, ...theme.alignitemcenter}}>
						<Assets.ICICB width={50} height={50} color={Colors.Primary} />
						<Text style={{color:Colors.Primary, fontSize:30, marginTop:15}}>ICICB</Text>
					</View>
				</View>
				<Spinner visible = {loading} />
                {props.children}
			</ImageBackground>
		</View>
	)
};

export default Layout;