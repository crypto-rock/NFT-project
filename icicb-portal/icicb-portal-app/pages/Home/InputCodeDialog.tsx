import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View ,Modal, Text} from "react-native";  
import theme from '../Theme'; 
import useWallet, { getError, showToast } from '../../useWallet'; 

interface InputCodeProps {
    modal?: boolean
    onClose?: Function
}

interface InputCodeStatus {
    code: string
	error: string
}

const InputCodeDialog = ({modal, onClose}:InputCodeProps) => {
	const {updated, update, prices, balances,  user, call} = useWallet();  
    const [status, setStatus] = React.useState<InputCodeStatus>({
        code:'',
		error: ''
    })
	const refPresale = React.useRef<TextInput>(null);
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});

    const submit= async () => {
		if (status.code.trim().length!=32) {
			/* showToast("Invalid presale code"); */
			updateStatus({error: 'invalid presale code format'})
			return;
		}
		update({loading:true})
		updateStatus({error: ''})
		const result = await call("/set-presale-code", {code: status.code})
		if (result !== null) {
			console.log('result', result)
			if(result.error !== undefined) {
				updateStatus({error: getError(result.error)})
				// showToast(getError(result.error));
				refPresale?.current?.focus()
			} else {
				showToast('Presale code sent successfully.', "success"); 
				update({user:{...user, presale:true}, loading:false})
				if (onClose) onClose()
				return;
			}
		} else {
			updateStatus({error: getError(0)})
		}
		update({loading:false})
	}
	const Content = (<View style={styles.modal}>
		<View style={styles.modalContent}>
			{onClose ? <Text style={styles.closeBtn} onPress={() => onClose()}>&times;</Text> : null}
			<Text style={styles.h1}>Please input your presale code.</Text>
			<TextInput ref={refPresale} value={status.code} style={styles.inputPassword} onChangeText = {(val)=>updateStatus({code:val})}/>
			{status.error ? <Text style={{color: 'red'}}>{status.error}</Text> : null}
			<TouchableOpacity>
				<Text style={styles.button} onPress = {submit}>
					Submit
				</Text>
			</TouchableOpacity>
		</View>
	</View>)
	
    return modal ? (
		<Modal
			style = {{height : '100%'}}
			animationType="fade"
			visible={true}
			transparent={true}
			onRequestClose={() => onClose && onClose()}
			>
			{Content}
		</Modal>
	): (
		Content
	)
}

const styles = StyleSheet.create({ 
	h1: {
		color:'#e6be66',
		...theme.m3,
		...theme.t3
	},
	
	modal: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalContent: {
		/* position:'absolute',
		zIndex:102, */
		...theme.w90,
		...theme.borderradius5,
		...theme.p2,
		...theme.whitecolor,
		backgroundColor: '#000',
		borderColor:'#888',
		borderStyle:'solid',
		borderWidth:0.2,
	},
	inputPassword: {
		borderColor:'#888',
		borderStyle:'solid',
		borderWidth:0.2,
		color:"#e6be88",
		fontSize:12,
		...theme.p1,
		...theme.pl4,
		...theme.borderradius2,
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
		...theme.primarycolor,
		...theme.borderradius5,
		...theme.p1,
		...theme.mt2,
		backgroundColor:'#342b1c'
	}
});
export default InputCodeDialog;