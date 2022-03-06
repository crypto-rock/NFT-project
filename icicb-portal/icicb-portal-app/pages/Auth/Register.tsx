import React from "react";
import { TextInput, TouchableOpacity, Text, View } from "react-native"; 
import Layout from '../Layout';
import useWallet, {validateEmail, validateUsername,  hmac256, getError} from '../../useWallet';
import { Colors } from '../Theme';
import styles from './styles'
import Success from "../../Components/Success";

interface SignupStatus {
	username :  string
	email :  string
	password :  string
	errmsg :  string
	success : boolean
}

const Register = ({navigation} : any) => {
	const { call, update, loading} = useWallet();
	const [status, setStatus] = React.useState<SignupStatus>({
		username :  '',
		password :  '',
		email :  '',
		errmsg :  '',
		success : false
	});
	const refUsername = React.useRef<TextInput>(null)
	const refEmail = React.useRef<TextInput>(null)
	const refPassword = React.useRef<TextInput>(null)
	const updateStatus = (params : {[key : string] : string|number|boolean}) => setStatus({...status, ...params}) 
	
	const goLogin = () => {
		navigation.navigate('AuthLogin', { name :  'AuthLogin' })
	} 

	const submit = async () => { 
		let username = status.username;
		let email = status.email; 
		let password = status.password;
		updateStatus({errmsg : '', success:''})
		if (!validateUsername(username)) {
			updateStatus({errmsg : getError(1001)})
			refUsername?.current?.focus();
			return;
		}
		if (!validateEmail(email)) {
			updateStatus({errmsg : getError(1002)})
			refEmail?.current?.focus();
			return;
		}
		if (password.length<6 || password.length>32) {
			updateStatus({errmsg : 'Invalid password length, expected 6 ~ 32 characters'})
			refPassword?.current?.focus();
			return;
		}
		password = await hmac256(password);
		updateStatus({errmsg : ''})
		update({loading: true});
		const result = await call("/register", {username, email, password})
		if (result !== null) { 
			if(result.error !== undefined){
				setTimeout(() => {
					if (typeof result.error==="number") {
						update({loading:false});
						updateStatus({errmsg : getError(result.error)})
					}
				}, 500);
			} else { 
				setTimeout(() => {
					update({loading:false});
					updateStatus({success : true, errmsg : '', username : '',  email : '', password : ''})
				}, 500);
			}
		} else {
			updateStatus({errmsg  :  getError(0)});
			setTimeout(() => {
				update({loading:false});
			}, 500);
			return;
		} 
	}   

	return (
		<Layout>
			<View style = {styles.middle}>  
				<View style = {styles.backpanel}>
					<Text style = {styles.text}>New member?</Text>
					<Text style = {styles.title}>Signup</Text>
					{status.success ? (
						<View>
							<View style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:40}}>
								<Success />
							</View>
							<Text style = {{ ...styles.error, color:'green' }}>Your account created successfully.</Text>
						</View> 
					) : (
						<>
							<TextInput
								style = {styles.input}
								onChangeText = {(username)=>updateStatus({username})}
								value = {status.username}
								placeholder="Name"
								textContentType="name"
								autoComplete="name"
								ref = {refUsername}
								placeholderTextColor = {Colors.DarkPrimary}
							/>
							<TextInput
								style = {styles.input}
								onChangeText = {(email)=>updateStatus({email})}
								value = {status.email}
								placeholder="Email"
								ref = {refEmail}
								textContentType="emailAddress"
								autoComplete="email"
								placeholderTextColor = {Colors.DarkPrimary}
							/>
							<TextInput
								style = {styles.input}
								onChangeText = {(password)=>updateStatus({password})}
								value = {status.password}
								placeholder="Password"
								ref = {refPassword}
								secureTextEntry
								placeholderTextColor = {Colors.DarkPrimary}
								autoCorrect = {false}
							/>
							<View style = {{display : (status.errmsg===''?"none":'flex')}}>
								<Text style = {styles.error}>{status.errmsg}</Text>
							</View>
							<TouchableOpacity onPress = {submit} style = {styles.submit}>
								<Text style = {{color : 'white'}}>SIGNUP</Text>
							</TouchableOpacity>
						</>
					)}
					<TouchableOpacity onPress = {goLogin}>
						<Text style = {styles.link}>
							Login	
						</Text>
					</TouchableOpacity> 
				</View>
			</View> 
	</Layout>)
};

export default Register;