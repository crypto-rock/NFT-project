import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text} from "react-native";  
import SelectDropdown from '../../modules/react-native-select-dropdown'; 
import theme, { chartColors, Colors, h, w } from '../Theme'; 
import Layout from '../Layout'; 
import Icons from '../Assets'; 
import useWallet, {N, getError, showToast, isPrivate } from '../../useWallet'; 
import Networks from '../../config/networks.json'
import Coins from '../../config/coins.json'
import InputCodeDialog from './InputCodeDialog'

const icons = {
	icicb:	<Icons.ICICB 	width={w(5)} height={w(5)} color={chartColors.icicb}/>,
	eth:	<Icons.ETH 		width={w(5)} height={w(5)} color={chartColors.eth}/>,
	usdt:	<Icons.USDT 	width={w(5)} height={w(5)} color={chartColors.usdt}/>,
	btc:	<Icons.BTC  	width={w(5)} height={w(5)} color={chartColors.btc}/>,
	bnb:	<Icons.BNB 		width={w(5)} height={w(5)} color={chartColors.bnb}/>,
	ltc:	<Icons.LTC 		width={w(5)} height={w(5)} color={chartColors.ltc}/>,
	eth2:	<Icons.ETH2 	width={w(5)} height={w(5)} color={chartColors.eth}/>,
	usdt2:	<Icons.USDT2 	width={w(5)} height={w(5)} color={chartColors.usdt}/>,
	btc2:	<Icons.BTC2  	width={w(5)} height={w(5)} color={chartColors.btc}/>,
	bnb2:	<Icons.BNB2 	width={w(5)} height={w(5)} color={chartColors.bnb}/>,
	ltc2:	<Icons.LTC2 	width={w(5)} height={w(5)} color={chartColors.ltc}/>,
	arrowTopRight:		<Icons.arrowTopRight 	width={w(5)} height={w(5)} color="red"/>,
	arrowDown:			<Icons.arrowDown 		width={w(5)} height={w(5)} color="white"/>,
	arrowBottomRight:	<Icons.arrowBottomRight width={w(5)} height={w(5)} color="green"/>,
} as {[key:string]:JSX.Element}


interface PresaleStatus {
	fromToken: string
	toToken: string
	buyAmount: string
	buyDolar: string
	receiveAmount: string
	receiveDolar: string 
	balanceFrom : string
	balanceTo : string
	code : string
	showPresaleModal:boolean
}

const networks = Networks as NetworkType;
const coins = Coins as {[coin:string]:{title:string, chain:string, symbol:string}}

const Presale = ({navigation}:any) => {
	/* const { lastScreen } = navigation.state; */

	const {updated, update, prices, balances,  user, call} = useWallet();  
	const [status, setStatus] = React.useState<PresaleStatus>({ 
		fromToken: "eth",
		toToken: "icicb",
		buyAmount: '0',
		buyDolar: '0',
		receiveAmount: '0',
		receiveDolar: '0',
		balanceFrom : '0',
		balanceTo : '0',
		code : '',
		showPresaleModal:true
	});
	
	const refAmount1 = React.useRef<TextInput>(null);
	const refAmount2 = React.useRef<TextInput>(null);
	const refDolar1 = React.useRef<TextInput>(null);
	const refDolar2 = React.useRef<TextInput>(null);
	const refPresale = React.useRef<TextInput>(null);

	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
 
	const changeText1 = (text:string) => {  
		let newText = '';
		let numbers = '0123456789.'; 
		for (var i=0; i < text.length; i++) {
			if(numbers.indexOf(text[i]) > -1 ) {
		 		newText = newText + text[i];
			}  
		} 
		if(text=="") newText="";
		const buyAmount = Number(newText)
		const buyDolar = N(buyAmount * prices[status.fromToken], 2)
		const rate = N(buyDolar / prices[status.toToken])
		updateStatus({buyAmount:newText, buyDolar:String(buyDolar), receiveAmount:String(rate), receiveDolar:String(buyDolar)})
	};  

	const changeText2 = (text:string) => {  
		let newText = '';
		let numbers = '0123456789.'; 
		for (var i=0; i < text.length; i++) {
			if(numbers.indexOf(text[i]) > -1 ) {
		 		newText = newText + text[i];
			}  
		} 
		if(text=="") newText=""; 
		const receiveAmount = N(newText) || 0
		const receiveDolar = N(receiveAmount * prices[status.toToken], 2)
		const rate = N(receiveDolar / prices[status.fromToken])
		updateStatus({receiveAmount:newText, buyDolar: String(receiveDolar), buyAmount:String(rate), receiveDolar:String(receiveDolar)})
	}
	
	React.useEffect(()=>{  
		changeText1(status.buyAmount);
	}, [status.fromToken])
	
	const getMaxBalance = () => {
		const balance = balances[status.fromToken]
		if (balance && balance.balance) {
			changeText1(String(balance.balance))
		}
	}
	const onSubmit = async () => { 
		const coin = status.fromToken
		const target = status.toToken
		const quantity = Number(status.buyAmount) || 0
		if (quantity === 0) {
			showToast(coins[coin]?.symbol+' balance is 0');
			return
		}
		if (!balances[coin] || quantity > balances[coin]?.balance) {
			showToast(coins[coin]?.symbol+' balance is exceed');
			return
		}
		update({loading:true})
		const result = await call("/presale", {coin, quantity, target})
		if (result !== null) {
			if(result.error !== undefined) {
				showToast(getError(result.error));
			} else {
				showToast("ICICB coin is presale from "+coins[coin]?.symbol+" coin successfully.", "success")
				changeText1("0");
			}
		} else {
			showToast(getError(0))
		}
		update({loading:false})
	}

	
	/* const onCloseDialog = (success?:boolean) => {
		updateStatus({showPresaleModal: false})
		navigation.navigate('HomeIndex', { name : 'Balance' });
	} */

	const balance = balances[status.fromToken] && balances[status.fromToken].balance || 0
	const price = prices[status.fromToken]
	const balance2 = balances[status.toToken] && (balances[status.toToken].balance + balances[status.toToken].locked) || 0
	const price2 = prices[status.toToken]
	return (
		<Layout> 	 
			{!isPrivate || user?.presale ? (
				<View style={styles.backPanel}>
					<View style={{...styles.row, margin:5}}> 
						<View style={{width:25}}>
							{icons[status.fromToken + "2"]}
						</View>
						<View style={{width:55, ...styles.row}}>
							<Icons.multiArrow width ={12} height = {15} color="white"/>
							<Icons.multiArrow width ={12} height = {15} color="white"/>
							<Icons.multiArrow width ={12} height = {15} color="white"/>
						</View>
						<View style={{width:21}}>
							<Icons.ICICB width={w(5)} height={w(5)} />
						</View>
					</View>
					<Text style={styles.label}>From:</Text>
					<View style={styles.borderRow}>
						<View style={styles.selectIcon}>
							{icons[status.fromToken]}
						</View>
						<View style={styles.selectLabel}>
							<Text style={{ color:'#999', ...theme.t }}>{coins[status.fromToken]?.symbol}</Text>
							<Text style={{ color:'#666', ...theme.t0}}>{balance+ " "+coins[status.fromToken]?.symbol || ''}  |  ${N(balance * price, 2)}</Text>
						</View>
						<View style={styles.selectArrowIcon}>
							{icons.arrowDown }
						</View>
						<SelectDropdown
							data={Object.keys(coins).filter(i=>(i!=="icicb"))} 
							onSelect={(item, index) => {
								updateStatus({fromToken:item}); 
							}}
							buttonTextAfterSelection={(item, index) => { 
								return coins[item].symbol
							}}
							rowTextForSelection={(item, index) => { 
								return coins[item].symbol
							}}
						/>
					</View>
					<Text style={styles.label}>To:</Text>
					<View style={styles.borderRow}>
						<View style={styles.selectIcon}>
							{icons.icicb}
						</View>
						<View style={styles.selectLabel}>
							<Text style={{color:'#999', ...theme.t}}>{coins[status.toToken]?.symbol}</Text>
							<Text style={{color:'#666', ...theme.t0}}>{balance2+ " "+coins[status.toToken]?.symbol || ''}  |  ${N(balance2 * price2, 2)}</Text>
						</View>
						<View style={styles.selectArrowIcon}>
							{icons.arrowDown}
						</View>
						<SelectDropdown
							data={[ "icicb"]}
							onSelect={(item, index) => {
								updateStatus({toToken:item}); 
							}}	
							buttonTextAfterSelection={(item, index) => { 
								return coins[item].symbol
							}}
							rowTextForSelection={(item, index) => { 
								return coins[item].symbol
							}}
						/>
					</View>
					<View style={{...styles.row, ...theme.justifybetween, ...theme.mt1, ...theme.mb1}}>
						<Text style={styles.label}>Buy now</Text>
						<TouchableOpacity style={{backgroundColor:'#342b1c', padding:5, ...theme.pl2, ...theme.pr2, borderRadius:4}} onPress={()=>{getMaxBalance()}}>
								<Text style={{color:'#eee'}}>
									Max
								</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.borderRow}>
						<View style={styles.inputCoin}>
							<TextInput
								style={styles.numberinput}  
								keyboardType = 'numeric'
								maxLength={10} 
								ref={refAmount1}
								value={status.buyAmount}  
								onChangeText={(value)=>{changeText1(value)}}
							/>
						</View>
						<View style={styles.inputIcon}>
							{icons[status.fromToken] }
						</View>
						<View style={styles.inputCoin}>
							<TextInput
								style={styles.numberinput}  
								keyboardType = 'numeric'
								maxLength={10} 
								ref={refDolar1}
								value={status.buyDolar}  
								editable = {false} 
							/>
						</View>
						<View style={styles.labelDolar}>
							<Text style={styles.grey}>$</Text>
						</View>
					</View>
					<Text style={styles.label}>Receive</Text>
					<View style={styles.borderRow}>
						<View style={styles.inputCoin}>
							<TextInput
								style={styles.numberinput}  
								keyboardType = 'numeric'
								maxLength={10} 
								ref={refAmount2}
								value={status.receiveAmount}  
								onChangeText={(value)=>{changeText2(value)}}
							/>
						</View>
						<View style={styles.inputIcon}>
							{icons[status.toToken] }
						</View>
						<View style={styles.inputCoin}>
							<TextInput
								style={styles.numberinput}  
								keyboardType = 'numeric'
								maxLength={10} 
								ref={refDolar2}
								value={status.receiveDolar}  
								editable = {false} 
							/>
						</View>
						<View style={styles.labelDolar}>
							<Text style={styles.grey}>$</Text>
						</View>
					</View>
					<TouchableOpacity>
						<Text style={styles.button} onPress={onSubmit}>
							BUY NOW
						</Text>
					</TouchableOpacity>
				</View>
			) : (
				<InputCodeDialog />
			)}
		</Layout>
	)
};

const styles = StyleSheet.create({
	h1 : {
		color:'#e6be66',
		...theme.m2,
		...theme.t3
	},
	label : {
		color:'#786244',
		...theme.m1,	
		...theme.t
	},
	inputPassword : {
		borderColor:'#888',
		...theme.borderstylesolid,
		...theme.borderwidth5,
		color:"#e6be88",
		...theme.p1,
		...theme.pl2,
		...theme.borderradius4,
		...theme.t
	},
	button:{
		...theme.mt2, 
		...theme.textcenter,
		...theme.whitecolor,
		...theme.borderradius10,
		...theme.p2,
		...theme.w100,
		backgroundColor:'#342b1c'
	},
	
	grey : {
		/* color: "#999", */
		...theme.greycolor,
		...theme.justifycenter,
		...theme.alignitemcenter
	},
	backPanel : {
		backgroundColor:'#00000099', 
		...theme.borderradius15,
		...theme.m2,
		...theme.p5,
		...theme.pl5,
		...theme.pr5
	},
	row : {
		...theme.flex,
		...theme.justifycenter,
		...theme.flexwrap,
		...theme.alignitemcenter,
		...theme.flexdirectionrow,
	},
	closeBtn : {
		...theme.absolute,
		...theme.greycolor,
		...theme.t1,
		right : 10,
		top : 5,
	},
	borderRow:{
		...theme.borderstylesolid,
		...theme.borderwidth5,
		...theme.borderradius10,
		...theme.p1,
		...theme.mb1,
		...theme.flex,
		...theme.flexdirectionrow,
		borderColor:'#777', 
		backgroundColor:'#00000022', 
	},
	selectIcon : {
		...theme.borderstylesolid,
		...theme.hauto,
		...theme.justifycenter,
		...theme.alignitemcenter,
		width:50,
		marginLeft:-10,
		borderRightWidth:0.4, 
		borderRightColor:Colors.Primary, 
	},
	selectArrowIcon : {
		width:30,
		...theme.justifycenter,
		...theme.alignitemcenter,
	},
	selectLabel : {
		...theme.flex1,
		...theme.justifystart,
		...theme.alignitemstart,
		paddingLeft:15
	},
	inputIcon : {
		width:30,
		...theme.borderstylesolid,
		borderRightWidth:0.4,
		borderRightColor:Colors.Primary, 
		height : 'auto',
		justifyContent:'center',
		alignItems:'center'
	},
	inputCoin : {
		flex:1,
		borderStyle:"solid", 
		borderRightWidth:0.5, 
		borderRightColor:Colors.Primary, 
		height : 'auto',
		justifyContent:'flex-start',
		paddingLeft:8
	},
	labelDolar : {
		width:25,
		height : 'auto',
		justifyContent:'center',
		alignItems:'center'
	},
	numberinput:{
		color:"#999",
		...theme.t,
	}
});
export default Presale;