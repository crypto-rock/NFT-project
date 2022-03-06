import React, {useState, useRef} from "react";

import { TextInput, TouchableOpacity, Text, View } from "react-native"; 
import useWallet, {hmac256, getError, validateEmail, validateUsername, showToast} from '../../useWallet';
import { Colors } from '../Theme';
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
		if (validateEmail(email) === false && validateUsername(email) === false) {
			updateStatus({errmsg : getError(1001)})
			refEmail?.current?.focus();
			return;
		}
		if (password.length<6 || password.length>32) {
			updateStatus({errmsg : 'Invalid password length, expected 6 ~ 32 characters'})
			refPassword?.current?.focus();
			return;
		}
		password = await hmac256(status.password); 
		update({loading:true});  
		updateStatus({errmsg : ''})
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
			updateStatus({errmsg : 'Network disconnected, please check network connection.'})
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
					<Text style = {styles.title}>Login</Text>
					<TextInput
						ref = {refEmail}
						style = {styles.input}
						onChangeText = {(email)=>updateStatus({email})}
						value = {status.email}
						placeholder="Username" 
						placeholderTextColor = {Colors.DarkPrimary}
					/>
					<TextInput
						ref = {refPassword}
						style = {styles.input}
						onChangeText = {(password)=>updateStatus({password})}
						value = {status.password}
						placeholder="Password"
						secureTextEntry
						placeholderTextColor = {Colors.DarkPrimary}
						autoCorrect = {false}
					/>
					<View style = {{display : (status.errmsg===''?"none":'flex')}}>
						<Text style = {styles.error}>{status.errmsg}</Text>
					</View>
					<TouchableOpacity onPress = {submit} style = {styles.submit}>
						<Text style = {styles.text}>LOGIN</Text>
					</TouchableOpacity>
					<View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', padding:10}}>
						<TouchableOpacity onPress = {onReset} >
							<Text style = {styles.link}>
								Forget password?
							</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress = {onRegister} >
							<Text style = {styles.link}>
								Signup
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View> 
		</Layout>
	)
};

export default Login;
