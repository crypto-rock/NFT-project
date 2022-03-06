import React from "react";
import { StyleSheet, Text,TextInput, View, TouchableOpacity} from "react-native"; 
import useWallet, {getError,  showToast} from '../../useWallet';
import Layout from '../Layout' 
import theme, { Colors, h } from '../Theme'
const Voucher = ({navigation}:any) => { 
	
	const { call,  update, loading} = useWallet();
	const refCode = React.useRef<TextInput>(null);
	const updateStatus = (params : {[key : string] : string|number|boolean}) => setStatus({...status, ...params});
	
	const [status, setStatus] = React.useState({
		code : ''
	});

	const submit = async () => {
		if (status.code==="") {
			showToast("Please input voucher code", "error")
			refCode.current?.focus();
			return
		}
		update({loading:true})
		const result = await call("/set-voucher", {code:status.code})
		if (result !== null) {
			if(result.error !== undefined) {
				showToast(getError(result.error), "error")
			} else {
				showToast('Voucher code sent successfuly.', "success")
				updateStatus({code : ''})
			}
		} else {
			showToast(getError(0), "error")
		}
		update({loading:false})
	}
	return (
		<Layout>
			<View style={styles.panel}>
				<Text style={styles.h1}>Voucher code</Text>
				<TextInput ref={refCode} 
					style={styles.input}  onChangeText = {(val)=>updateStatus({code:val})}
				/>	
				
				<TouchableOpacity>
					<Text style={styles.button} onPress = {submit}>
						Update
					</Text>
				</TouchableOpacity>
			</View>
		</Layout>
	)
};

const styles = StyleSheet.create({
	panel: {
		top: h(20),
		...theme.w90,
		...theme.mlauto,
		...theme.mrauto,
		...theme.p4,
		...theme.borderradius15,
		backgroundColor : 'rgba(0,0,0,0.7)'
	}, 
	h1 : {
		color:Colors.Light,
		...theme.m1,
		...theme.textcenter,
		...theme.t3,
		...theme.mb4
	},
	input : {
		color:Colors.Primary,
		borderColor:Colors.Primary,
		...theme.borderstylesolid,
		...theme.borderwidth3,
		...theme.w100,
		...theme.pl5,
		...theme.borderradius10,
		...theme.t,
		...theme.h

	},
	button:{
		...theme.mt2,
		...theme.textcenter,
		...theme.whitecolor,
		...theme.borderradius10,
		...theme.p2,
		...theme.w100,
		...theme.t,
		backgroundColor:Colors.DarkPrimary,
	},
});

export default Voucher;