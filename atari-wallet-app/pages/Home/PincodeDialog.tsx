import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View ,Modal, Text} from "react-native";  
import theme, { Colors } from '../Theme'; 
import useWallet, { getError} from '../../useWallet'; 

interface PincodeProps {
    onClose?: Function
	onSuccess?: Function
}

interface PincodeStatus {
		number1 :string
		number2 :string
		number3 :string
		number4 :string
		number5 :string
		number6 :string
		errmsg :string
}

const PinCodeDialog = ({onClose, onSuccess}:PincodeProps) => {
	const {call, update} = useWallet();  
    const [status, setStatus] = React.useState<PincodeStatus>({
		number1 : '',
		number2 : '',
		number3 : '',
		number4 : '',
		number5 : '',
		number6 : '',
		errmsg : '',
    })
	
	
	const refNumber1 = React.useRef<TextInput>(null);
	const refNumber2 = React.useRef<TextInput>(null);
	const refNumber3 = React.useRef<TextInput>(null);
	const refNumber4 = React.useRef<TextInput>(null);
	const refNumber5 = React.useRef<TextInput>(null);
	const refNumber6 = React.useRef<TextInput>(null);

	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});

    const submit= async () => {
		if(isNaN(parseInt(status.number1))){ updateStatus({errmsg : "invalid number 1"}); refNumber1.current.focus(); return; }
		if(isNaN(parseInt(status.number2))){ updateStatus({errmsg : 'invalid number 2'}); refNumber2.current.focus(); return; }
		if(isNaN(parseInt(status.number3))){ updateStatus({errmsg : 'invalid number 3'}); refNumber3.current.focus(); return; }
		if(isNaN(parseInt(status.number4))){ updateStatus({errmsg : 'invalid number 4'}); refNumber4.current.focus(); return; }
		if(isNaN(parseInt(status.number5))){ updateStatus({errmsg : 'invalid number 5'}); refNumber5.current.focus(); return; }
		if(isNaN(parseInt(status.number6))){ updateStatus({errmsg : 'invalid number 6'}); refNumber6.current.focus(); return; }
		const code=status.number1+status.number2+status.number3+status.number4+status.number5+status.number6;
		update({loading : true});
	 	const response = await call("/verify-pincode", {code});
		if (response !== null) {
			if(response.error !== undefined){
				updateStatus({errmsg: getError(response.error)});
				update({loading : false});
			} else if (response.result===true){  
				onSuccess()
			} else {
				updateStatus({errmsg: getError(2005)});
			}
		} else {
			updateStatus({errmsg : getError(0)});
			update({loading : false});
			refNumber1.current.focus(); 
			return;
		} 
	}

	const onChangeText = (text : string, key : number) => { 
		let newText = '';
		let numbers = '0123456789.'; 
		for (var i=0; i < text.length; i++) {
			if(numbers.indexOf(text[i]) > -1 ) {
		 		newText = newText + text[i];
			} 
		} 
		if(text === "")newText=""; 
		switch(key){
			case 1 : updateStatus({number1 : newText}); if(newText !== "") refNumber2.current.focus(); break;
			case 2 : updateStatus({number2 : newText}); if(newText !== "") refNumber3.current.focus(); break;
			case 3 : updateStatus({number3 : newText}); if(newText !== "") refNumber4.current.focus(); break;
			case 4 : updateStatus({number4 : newText}); if(newText !== "") refNumber5.current.focus(); break;
			case 5 : updateStatus({number5 : newText}); if(newText !== "") refNumber6.current.focus(); break;
			case 6 : updateStatus({number6 : newText}); break;
			default : break;
		}
	}

	const Content = (<View style={styles.modal}>
		<View style={styles.modalContent}>
			{onClose ? <Text style={styles.closeBtn} onPress={() => onClose()}>&times;</Text> : null}
			<Text style={styles.h1}>Please input your pincode.</Text>
			<View style = {styles.row}> 
				<TextInput
					ref = {refNumber1}
					style = {styles.input}
					onChangeText = {(val)=>onChangeText(val, 1)}
					value = {status.number1}
					placeholder="-" 
					keyboardType="numeric"
					placeholderTextColor = {Colors.DarkPrimary} 
					maxLength = {1}
				/>  
				<TextInput
					ref = {refNumber2}
					style = {styles.input}
					onChangeText = {(val)=>onChangeText(val, 2)}
					value = {status.number2}
					placeholder="-" 
					keyboardType="numeric"
					placeholderTextColor = {Colors.DarkPrimary} 
					maxLength = {1}
				/>  
				<TextInput
					ref = {refNumber3}
					style = {styles.input}
					onChangeText = {(val)=>onChangeText(val, 3)}
					value = {status.number3}
					placeholder="-" 
					keyboardType="numeric"
					placeholderTextColor = {Colors.DarkPrimary} 
					maxLength = {1}
				/>  
				<TextInput
					ref = {refNumber4}
					style = {styles.input}
					onChangeText = {(val)=>onChangeText(val, 4)}
					value = {status.number4}
					placeholder="-" 
					keyboardType="numeric"
					placeholderTextColor = {Colors.DarkPrimary} 
					maxLength = {1}
				/>  
				<TextInput
					ref = {refNumber5}
					style = {styles.input}
					onChangeText = {(val)=>onChangeText(val, 5)}
					value = {status.number5}
					placeholder="-" 
					keyboardType="numeric"
					placeholderTextColor = {Colors.DarkPrimary} 
					maxLength = {1}
				/>  
				<TextInput
					ref = {refNumber6}
					style = {styles.input}
					onChangeText = {(val)=>onChangeText(val, 6)}
					value = {status.number6}
					placeholder="-" 
					keyboardType="numeric"
					placeholderTextColor = {Colors.DarkPrimary} 
					maxLength = {1}
				/>
			</View>
			<Text style={{...theme.textcenter, ...theme.redcolor}}>{status.errmsg}</Text>
			<TouchableOpacity>
				<Text style={styles.button} onPress = {submit}>
					Submit
				</Text>
			</TouchableOpacity>
		</View>
	</View>)
	
    return <Modal
				style = {{height : '100%'}}
				animationType="fade"
				visible={true}
				transparent={true}
				onRequestClose={() => {onClose && onClose()}}
			>
				{Content}
			</Modal>
}

const styles = StyleSheet.create({ 
	h1: {
		color:Colors.Light,
		...theme.m3,
		...theme.t3
	},
	modal: {
		position:'absolute',
		backgroundColor: '#00000088',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex:101,
	},
	modalContent: {
		...theme.w90,
		...theme.hauto,
		...theme.borderradius10,
		...theme.borderwidth3,
		...theme.relative,
		...theme.mtauto,
		...theme.mbauto,
		...theme.p3,
		...theme.lightcolor,
		...theme.mlauto,
		...theme.mrauto,
		zIndex:101,
		backgroundColor : '#000',
		borderColor:Colors.DarkPrimary,
	},
	closeBtn: {
		...theme.absolute,
		...theme.lightcolor,
		...theme.t2,
		right: 10,
		top: 5
	},
	button: {
		...theme.textcenter,
		...theme.whitecolor,
		...theme.borderwidth3,
		...theme.borderstylesolid,
		...theme.borderradius5,
		...theme.p1,
		...theme.mt2,
		backgroundColor:Colors.DarkPrimary
	},
	
	row : {
		...theme.flex,
		...theme.justifybetween,
		...theme.flexwrap,
		...theme.flexdirectionrow,
	},
	input : {
		...theme.borderwidth3, 
		...theme.borderradius4,
		...theme.textcenter,
		...theme.t,
		...theme.h,
		width: '13%',
		borderColor : Colors.Primary,
		color:'#888',
	}, 
});
export default PinCodeDialog;