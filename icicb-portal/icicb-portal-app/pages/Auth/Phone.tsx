import React from "react";
import { TextInput, TouchableOpacity, StyleSheet,View, Text } from "react-native";
import { Colors } from '../Theme';
import Layout from '../Layout' 
import useWallet, {getError} from '../../useWallet';


const Reset = ({navigation}:any) => {
	const {call} = useWallet(); 
	const [status, setStatus] = React.useState({
		phonenumber: '', 
		errmsg: '', 
		loading: false
	}); 
	const refPhone = React.useRef<TextInput>(null); 
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
 
	const goLogin = () => {
		navigation.navigate('AuthLogin', { name: 'AuthLogin' })
	}

	const submit = async () => { 
		const phonenumber= status.phonenumber;
		if(phonenumber.length<7&&phonenumber.length>15){ updateStatus({errmsg:'invalid Phonenumber!'}); refPhone?.current?.focus(); return; } 
		updateStatus({loading:true});
	 	const result = await call("/reset-phonenumber", {phonenumber})
		setTimeout(() => {
			updateStatus({loading:false});
		}, 1000);
		if (result !== null) {
			if(result.error !== undefined){
				updateStatus({errmsg:getError(result.error)})
			} else {  
				updateStatus({errmsg:'Inited password'})
			}
		} else {
			updateStatus({errmsg:'Network disconnected, please check network connection.'})
			refPhone?.current?.focus();
			return;
		} 
	}
	const onChangeText = (text:string) => { 
		let newText = '';
		let numbers = '0123456789.'; 
		for (var i=0; i < text.length; i++) {
			if(numbers.indexOf(text[i]) > -1 ) {
		 		newText = newText + text[i];
			} 
		} 
		if(text=="")newText=""; 
		updateStatus({phonenumber:newText}); 
	}; 
	return (
		<Layout>
			<View style = {styles.middle}> 
				<View style = {styles.backpanel}> 
					<Text style = {styles.text}>Enter a 6 digit code</Text>
					<TextInput
							ref = {refPhone}
							style = {styles.input}
							onChangeText = {(val)=>onChangeText(val)}
							value = {status.phonenumber}
							placeholder="0123 456 789" 
							keyboardType="numeric"
							placeholderTextColor = {Colors.DarkPrimary} 
							maxLength = {15}
					/>   
					<View>
						<Text style = {styles.error}>{status.errmsg}</Text>
					</View> 
					<TouchableOpacity style = {styles.submit} onPress = {submit}>
						<Text style = {{color:'white'}}>OK</Text>
					</TouchableOpacity>  
				</View> 
			</View> 
		</Layout>
	)
};

const styles = StyleSheet.create({ 
	input: {
		height: 38, 
		width: 38,
		borderWidth: 0.2, 
		borderRadius:2,
		textAlign:'center',
		borderColor:"#e6e1a5",
		color:"#e6e1a5", 
	}, 
	submit: {
		alignItems: "center",
		borderColor:'#a48957',
		borderWidth:1,
		backgroundColor: "#010101",
		padding:9,
		borderRadius:5, 
		color: 'white', 
		width:'90%',
		marginLeft:'auto',
		marginRight:'auto',
		marginBottom:10
	},
	submit1: {
		alignItems: "center",
		borderColor:'white',
		borderWidth:1,
		backgroundColor: "#010101",
		padding:9,
		borderRadius:5, 
		color: 'white', 
		width:'90%',
		marginLeft:'auto',
		marginRight:'auto',
		marginBottom:10
	},
	middle:{
		flex:1,
		flexDirection:"column",
		justifyContent:"center",
		transform: [{ translateY: -50 }],

	},
	backpanel:{
		borderRadius:5,
		margin:20, 
		padding:12,
		backgroundColor:'rgba(0,0,0,0.5)'
	},
	text: {
		color: "white",
		fontSize: 18,
		lineHeight: 40,
		textAlign: "center"
	},
	error: {
		color:'red',
		padding: 7, 
		borderRadius: 5, 
		textAlign:"center",
	}
});

export default Reset;