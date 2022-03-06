import React from "react";
import { Image,TextInput, TouchableOpacity, View, Text } from "react-native";
import theme, { Colors } from '../Theme';
import Layout from '../Layout'
const imgPass = require('../../assets/password.png');
import useWallet, {validateEmail, getError} from '../../useWallet';
import styles from './styles'

const Reset = ({navigation} : any) => {
	const { call, update, loading } = useWallet(); 
	const [status, setStatus] = React.useState({
		email : '',
		errmsg :  '',
		success: false
	});
	const refEmail = React.useRef<TextInput>(null)
	const updateStatus = (params : {[key : string] : string|number|boolean}) => setStatus({...status, ...params});
 
	const goLogin = () => {
		navigation.navigate('AuthLogin', { name : 'AuthLogin' })
	}

	const submit = async () => {
		if (validateEmail(status.email) === false) {
			updateStatus({errmsg : 'Invalid email address'})
			refEmail?.current?.focus();
			return;
		} 
		update({loading : true});
	 	const result = await call("/reset-password", {email : status.email})
		setTimeout(() => {
			update({loading : false});
			if (result !== null) {
				if(result.error !== undefined){
					updateStatus({errmsg : getError(result.error)})
				} else {
					updateStatus({errmsg : '', success:true})
				}
			} else {
				updateStatus({errmsg : getError(0)})
				refEmail?.current?.focus();
			} 
		}, 500);
	}

	return (
		<Layout>
			<View style = {styles.middle}> 
				<View style = {styles.backpanel}>
				 	<Image source = {imgPass} style = {{ ...theme.mlauto, ...theme.mrauto, ...theme.mt1}}/> 
					<Text style = {styles.title}>Forget password</Text>
					<Text style = {{ ...theme.lightcolor, ...theme.textcenter,  ...theme.t0}}>We just need your registred email to send you password reset instruections</Text>
					
					
					{status.success ? (
						<View style={{marginTop:30}}>
							<Text style = {{color:'green', ...theme.t}}>Your request has been sent successfully.</Text>
							<Text style = {{color:'green', ...theme.t}}>Please check your email.</Text>
							<Text style = {{color:'green', ...theme.t}}>If you couldn't find it, please check in the [spam] inbox.</Text>
							<Text style = {{color:'green', ...theme.t}}>Don't forget to click [Looks safe] button.</Text>
						</View>
					) : (
						<>
							<TextInput
								ref = {refEmail}
								style = {styles.input}
								onChangeText = {(email)=>updateStatus({email})}
								value = {status.email}
								placeholder="Email"
								textContentType="emailAddress"
								autoComplete="email"
								placeholderTextColor = {Colors.DarkPrimary} 
							/>
							<View style = {{display : (status.errmsg===''?"none":'flex')}}>
								<Text style = {styles.error}>{status.errmsg}</Text>
							</View>
							<TouchableOpacity style = {styles.submit} onPress = {submit}>
								<Text style = {{color : 'white'}}>SEND EMAIL</Text>
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
		</Layout>
	)
};


export default Reset;