import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View ,Modal, Text} from "react-native";  
import theme, { Colors } from '../Theme'; 
import useWallet, { getError, showToast} from '../../useWallet'; 

interface InputCodeProps {
    onClose?: Function
}

interface InputCodeStatus {
    code: string
	error: string
}

const InputCodeDialog = ({onClose}:InputCodeProps) => {
	const {updated, update, prices, balances,  user, call} = useWallet();  
    const [status, setStatus] = React.useState<InputCodeStatus>({
        code:'',
		error: ''
    })
	const refPresale = React.useRef<TextInput>(null);
	const refModal = React.useRef();
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});

    const submit= async () => {
		if (status.code.trim().length!=32) {
			updateStatus({error: 'invalid presale code format'})
			return;
		}
		update({loading:true})
		updateStatus({error: ''})
		const result = await call("/set-presale-code", {code: status.code})
		if (result !== null) {
			if(result.error !== undefined) {
				updateStatus({error: getError(result.error)})
				refPresale.current.focus()
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

    return (
		<Modal ref={refModal} style = {styles.modal} animationType="fade"  hardwareAccelerated={true}	transparent={true}	onRequestClose={() => {onClose()}}>
			<View style={styles.modalContent}>
				{onClose ? <Text style={styles.closeBtn} onPress={() => onClose()}>&times;</Text> : null}
				<Text style={styles.h1}>Please input your presale code.</Text>
				<TextInput ref={refPresale} value={status.code} style={styles.inputPassword} onChangeText = {(val)=>updateStatus({code:val})}/>
				{status.error ? <Text style={{color: 'red', ...theme.textcenter}}>{status.error}</Text> : null}
				<TouchableOpacity>
					<Text style={styles.button} onPress = {submit}>
						Submit
					</Text>
				</TouchableOpacity>
			</View>
		</Modal>
    )
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
		...theme.relative,
		...theme.mtauto,
		...theme.mbauto,
		...theme.p3,
		...theme.lightcolor,
		zIndex:101,
		backgroundColor : '#000',
		left:'5%',
		borderColor:Colors.Dark,
	},
	inputPassword: {
		borderColor:Colors.Dark,
		borderStyle:'solid',
		borderWidth:0.2,
		color:Colors.Light,
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
		...theme.borderradius5,
		...theme.p1,
		...theme.mt2,
		backgroundColor:Colors.DarkPrimary
	}
});
export default InputCodeDialog;