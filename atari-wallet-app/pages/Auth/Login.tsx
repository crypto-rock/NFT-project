import React, {useState, useRef} from "react";

import { TextInput, TouchableOpacity, Text, View } from "react-native"; 
import useWallet, {hmac256, getError, validateEmail, validateUsername} from '../../useWallet';
import theme, { Colors } from '../Theme';
import Layout from '../Layout';
import styles from './styles'

interface LoginStatus {
	email : string
	password : string
	errmsg : string
}

const Login = ({navigation} : any) => {
	const { call, update, loading} = useWallet();
	const [status, setStatus] = useState<LoginStatus>({
		email : '',
		password : '',
		errmsg : ''
	});
	const refEmail = useRef<TextInput>(null)
	const refPassword = useRef<TextInput>(null)
	const updateStatus = (params : {[key : string] : string|number|boolean}) => setStatus({...status, ...params})
	 
	const submit = async () => { 
		let email = status.email;
		let password = status.password;
		if (validateEmail(email) === false) {
			updateStatus({errmsg : getError(1002)})
			refEmail?.current?.focus();
			return;
		}
		if (password.length<6 || password.length>32) {
			updateStatus({errmsg : getError(1009)})
			refPassword?.current?.focus();
			return;
		}
		password = await hmac256(status.password); 
		update({loading:true});  
		const result = await call("/login", {username : email, password : password});
		if (result!==null) {
			if(result.error!==undefined){
				updateStatus({errmsg : getError(result.error)})
				update({loading:false});
			} else {
					updateStatus({errmsg : '', email : '', password : ''});
					const user = result.result;
					update({user, loading: false});
					navigation.navigate('HomeIndex', { name : 'Balance' });
			}
		} else { 
			updateStatus({errmsg : getError(0)})
			update({ loading: false});
			refPassword?.current?.focus();
			return;
		} 
	} 

	const onRegister = () => {
		navigation.navigate('Register', { name : 'Register' })
	}
	const onReset = () => {
		navigation.navigate('Reset', { name : 'Reset' })
	}

	return (
		<Layout>
			<View style = {styles.middle}> 
				<View style = {styles.backpanel}>
					<Text style = {styles.title}>LOGIN</Text>
					<TextInput
						ref = {refEmail}
						style = {styles.input}
						maxLength={64}
						onChangeText = {(email)=>updateStatus({email})}
						value = {status.email}
						placeholder="Email" 
						placeholderTextColor = {Colors.Dark}
					/>
					<TextInput
						ref = {refPassword}
						style = {styles.input}
						maxLength={32}
						onChangeText = {(password)=>updateStatus({password})}
						value = {status.password}
						placeholder="Password"
						secureTextEntry
						placeholderTextColor = {Colors.Dark}
						autoCorrect = {false}
					/>
					<View style = {{display : (status.errmsg===''?"none":'flex')}}>
						<Text style = {styles.error}>{status.errmsg}</Text>
					</View>
					<TouchableOpacity onPress = {submit} style = {styles.submit}>
						<Text style = {styles.text}>LOGIN</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress = {onReset} style={{...theme.mt5}}>
							<Text style = {styles.link}>
								FORGET PASSWORD?
							</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress = {onRegister}  style={{...theme.mt5}}>
						<Text style = {{...theme.t0, ...theme.whitecolor, ...theme.textcenter}}>
							NEW MEMBER?
						</Text>
						<Text style = {{...theme.t3, ...theme.whitecolor, ...theme.textcenter}}>
							SINGUP
						</Text>
					</TouchableOpacity>
				</View>
			</View> 
		</Layout>
	)
};

export default Login;
