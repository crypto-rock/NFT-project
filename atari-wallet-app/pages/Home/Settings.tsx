import React  from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Modal, TextInput, Linking} from 'react-native';
import Icons from '../Assets'
import theme, { Colors, w } from '../Theme'; 
import useWallet, {getError, hmac256, showToast} from '../../useWallet';
import Layout from '../Layout';

const Settings = ({ navigation }:any) => {  
	const { call,  update, loading} = useWallet();
	const [status, setStatus] = React.useState({
		showPasswordModal :  false,
		showPincodeModal :  false,
		currentPassword : '',
		newPassword1 : '',
		newPassword2 : '',
		number1 : '',
		number2 : '',
		number3 : '',
		number4 : '',
		number5 : '',
		number6 : '',
		errmsg : '',
		success : ''
	})

	const refNumber1 = React.useRef<TextInput>(null);
	const refNumber2 = React.useRef<TextInput>(null);
	const refNumber3 = React.useRef<TextInput>(null);
	const refNumber4 = React.useRef<TextInput>(null);
	const refNumber5 = React.useRef<TextInput>(null);
	const refNumber6 = React.useRef<TextInput>(null);

	const refPassword1 = React.useRef<TextInput>(null);
	const refPassword2 = React.useRef<TextInput>(null);
	const refPassword3 = React.useRef<TextInput>(null);

	const updateStatus = (params : {[key : string] : string|number|boolean}) => setStatus({...status, ...params});
	
	const goSupport = () => {
		try {
			Linking.openURL('mailto:tech@atarichain.com')
		} catch (error) {
			console.log(error)
		}
	}
	const goPincode = () => {
		updateStatus({showPincodeModal : true});
	}
	const goPassword = () => {
		updateStatus({showPasswordModal : true});
	}
	const onLogout = async () => {
		update({user : null});
		await call("/logout", {});
		navigation.navigate('AuthLogin', { name: 'AuthLogin' });
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

	const submitPassword = async () => {
		if (loading) return;
		if (status.currentPassword.length<1) {
			showToast("current password length is 0", "error");
			refPassword1?.current?.focus();
			return;
		}
		if (status.newPassword1.length<6) {
			showToast("new password length is 6", "error");
			updateStatus({errmsg : '', success : ''})
			refPassword2?.current?.focus();
			return;
		}	
		if (status.newPassword2.length<6) {
			showToast("confirm password length is 6", "error");
			refPassword3?.current?.focus();
			return;
		}
		if(status.newPassword1!=status.newPassword2){ 
			showToast("Invalid confirm password", "error");
			refPassword3?.current?.focus();
			return;
		}
		update({loading:true})
		const oldpass = await hmac256(status.currentPassword);
		const newpass = await hmac256(status.newPassword1);
		await new Promise(resolve=>setTimeout(resolve, 1000))
		const result = await call("/change-password", {oldpass, newpass})
		if (result !== null) {
			if(result.error !== undefined) {
				showToast( getError(result.error), "error");
				refPassword1?.current?.focus();
			} else {
				showToast("New password changed successfuly.", "success");
			}
		} else {
			showToast( getError(0), "error");
		}
		update({loading:false})
	}

	const submitPincode = async () => {
		if(isNaN(parseInt(status.number1))){ showToast("invalid number 1", "error"); refNumber1.current.focus(); return; }
		if(isNaN(parseInt(status.number2))){ showToast('invalid number 2', "error"); refNumber2.current.focus(); return; }
		if(isNaN(parseInt(status.number3))){ showToast('invalid number 3', "error"); refNumber3.current.focus(); return; }
		if(isNaN(parseInt(status.number4))){ showToast('invalid number 4', "error"); refNumber4.current.focus(); return; }
		if(isNaN(parseInt(status.number5))){ showToast('invalid number 5', "error"); refNumber5.current.focus(); return; }
		if(isNaN(parseInt(status.number6))){ showToast('invalid number 6', "error"); refNumber6.current.focus(); return; }
		const code=status.number1+status.number2+status.number3+status.number4+status.number5+status.number6;
		update({loading : true});
	 	const result = await call("/set-pincode", { code })
		update({loading : false});
		if (result !== null) {
			if(result.error !== undefined){
				showToast( getError(result.error), "error");
			} else {  
				showToast( "Your pincode is changed", "success");
			}
		} else {
			showToast( getError(0), "error");
			refNumber1.current.focus(); 
		} 
	}

	return (
		<Layout>
			<Modal
				style = {{height : '100%'}}
				animationType="fade"
				visible={status.showPasswordModal}
				transparent={true}
				onRequestClose={() => {
					updateStatus({showPasswordModal : false});
				}}>
				<View style={styles.modalContent}>
					<Text style={styles.closeBtn} onPress={() => updateStatus({showPasswordModal : false})}>&times;</Text>
					<Text style={styles.h1}>Update Password</Text>
					<Text style={styles.label}>Current password</Text>
					<TextInput ref={refPassword1} 
						secureTextEntry
						style={styles.inputPassword}  onChangeText = {(val)=>updateStatus({currentPassword:val})}
					/>
					<Text style={styles.label}>New password</Text>
					<TextInput ref={refPassword2}
						secureTextEntry
						style={styles.inputPassword}    onChangeText = {(val)=>updateStatus({newPassword1:val})}
					/>
					<Text style={styles.label}>Confirm password</Text>
					<TextInput ref={refPassword3}
						secureTextEntry
						style={styles.inputPassword}   onChangeText = {(val)=>updateStatus({newPassword2:val})}
					/>
					<TouchableOpacity>
						<Text style={styles.button} onPress = {submitPassword}>
							Update
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
	
			<Modal 
				animationType="fade"
				visible={status.showPincodeModal}
				transparent={true}
				onRequestClose={() => {
					updateStatus({showPincodeModal : false});
				}}>
				<View style={styles.modalContent}>
					<Text style={styles.closeBtn} onPress={() => updateStatus({showPincodeModal : false})}>&times;</Text>
					<Text style={styles.h1}>Set Pincode</Text>
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
					<TouchableOpacity>
						<Text style={styles.button} onPress = {submitPincode}>
							Update
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<View >
				<View style = {styles.backpanel}> 
					<TouchableOpacity onPress={goSupport}  style={styles.settingrow}> 
						<View style={{flex:2}}> 
							<Icons.support width={w(6)} height={w(6)} color={Colors.Light} />
						</View>
						<View style={{flex:7}}> 
							<Text style={{color:Colors.Light, ...theme.t3}}>Support</Text> 
						</View> 
						<View style={{flex:3}}>  
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={goPincode} style={styles.settingrow}> 
						<View style={{flex:2}}> 
							<Icons.resetPincode width={w(6)} height={w(6)} color={Colors.Light}/>
						</View>
						<View style={{flex:7}}> 
							<Text style={{color:Colors.Light, ...theme.t3}}>Reset Pincode</Text> 
						</View> 
						<View style={{flex:3}}>  
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={goPassword} style={styles.settingrow}> 
						<View style={{flex:2}}> 
							<Icons.resetPassword width={w(6)} height={w(6)} color={Colors.Light}/>
						</View>
						<View style={{flex:7}}> 
							<Text style={{color:Colors.Light, ...theme.t3}}>Reset Passwod</Text> 
						</View> 
						<View style={{flex:3}}>  
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={onLogout} style={styles.settingrow}> 
						<View style={{flex:2}}> 
							<Icons.logout width={w(6)} height={w(6)} color={Colors.Light}/>
						</View>
						<View style={{flex:7}}> 
							<Text style={{color:Colors.Light, ...theme.t3}}>Logout</Text> 
						</View> 
						<View style={{flex:3}}>  
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</Layout>
  	);
}

const styles = StyleSheet.create({
	settingrow : {
		...theme.flexdirectionrow,
		...theme.justifycenter,
		...theme.alignitemcenter,
		...theme.relative,
		...theme.m2
	},
	middle : {
		...theme.flex1,
		...theme.flexdirectioncolumn,
		...theme.justifycenter,
		transform : [{ translateY : -50 }],
	},
	
	backpanel : {
		top:40,
		...theme.borderradius15,
		...theme.p2,
		...theme.m4,
		backgroundColor : 'rgba(0,0,0,0.7)'
	},

	modalContent : {
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
	closeBtn : {
		right : 10,
		top : 5,
		...theme.greycolor,
		...theme.t2,
		...theme.absolute,
	},
	h1 : {
		color:Colors.Light,
		...theme.m2,
		...theme.t3,
		...theme.mb4
	},
	label : {
		color:Colors.Primary,
		...theme.m1,
		...theme.t
	},
	inputPassword : {
		...theme.borderstylesolid,
		...theme.borderwidth3,
		...theme.t,
		...theme.h,
		borderColor:Colors.Dark,
		color:'#888',
		paddingLeft : 20,
		borderRadius : 2,
	},
	button:{
		...theme.mt2,
		...theme.textcenter,
		...theme.whitecolor, 
		...theme.borderradius10, 
		...theme.w100,
		...theme.p2,
		...theme.t,
		backgroundColor:Colors.DarkPrimary,
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
})
export default Settings