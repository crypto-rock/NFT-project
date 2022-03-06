import React from "react";
import { StyleSheet, Text, View,TouchableOpacity, ScrollView, Dimensions,TextInput, Modal } from "react-native"; 
import CheckBox from 'expo-checkbox';

import {LineChart} from 'react-native-chart-kit'
import { QRCode } from 'react-native-custom-qr-codes-expo';
import theme, {chartColors, Colors, h, w } from '../Theme';  
import Layout from '../Layout' 
import Icons from '../Assets'; 
import useWallet, {showToast, getError, copyToClipboard, N} from '../../useWallet';
import Networks from '../../networks.json'	
import Coins from '../../config/coins.json'
import PincodeDialog from './PincodeDialog'

/* const WAValidator = require('../../modules/address-validators'); */

const networks = Networks as NetworkType;
const coins = Coins as {
	[coin:string]:{
		title:				string,
		chain:				string,
		symbol:				string,
		chains: {
			[chain:string]:{
				title:		string,
				native:		string,
				address?: 	string,
				decimals:	18
			}
		}
	}
}

const icons = {
	atri:		<Icons.ATARI 		width={w(5)} height={w(5)} color={chartColors.atri}/>,
	eth:		<Icons.ETH 			width={w(5)} height={w(5)} color={chartColors.eth}/>,
	usdt:		<Icons.USDT 		width={w(5)} height={w(5)} color={chartColors.usdt}/>,
	btc:		<Icons.BTC  		width={w(5)} height={w(5)} color={chartColors.btc}/>,
	bnb:		<Icons.BNB 			width={w(5)} height={w(5)} color={chartColors.bnb}/>,
	ltc:		<Icons.LTC 			width={w(5)} height={w(5)} color={chartColors.ltc}/>,
	deposit: 	<Icons.deposit 		width={w(6)} height={w(6)} color="#111"/>,
	send: 		<Icons.send 		width={w(6)} height={w(6)} color="#111"/>,
	arrowBottom:<Icons.arrowBottom 	width={w(6)} height={w(6)} color="#eee"/>,
	pending: 	<Icons.pending 		width={w(5)} height={w(5)} color="#eee"/>,
	copy: 		<Icons.copy 		width={w(5)} height={w(5)} color="white"/>,
} as {[key:string]:JSX.Element}

const Graph = ({navigation}:any) => {
	const [ chart, setChart ] = React.useState([0])
	const screenWidth = Dimensions.get('window').width-65;

	const { updated, update, prices, balances,  txs, logs, fees, wallets, call } = useWallet();  
	const updateStatus = (params: {[key: string] :any}) => setStatus({ ...status, ...params })
	const [ status, setStatus ] = React.useState({
		coin: 'atri',
		chain: 'eth',
		chartType: 'date',
		showDepositModal: false,
		showSendModal: false,
		showPincodeModal: false,
		showConfirmModal: false,
		walletAddress: '',
		prePrice:0,

		targetAddress : '',
		targetAmount : '',
		fee: 0,
		payAsAtari: false,

		txNumber : '',
		txStatus : '',
		errmsg : ''
	});
	const refTargetAddress = React.useRef<TextInput>(null);
	const refAmount = React.useRef<TextInput>(null);
	
	const calculateFee = (payAsAtari:boolean, chain:string) => {
		let feeValue = fees[chain]
		console.log('feeValue', feeValue)
		const coin = coins[status.coin].chains[chain].native
		if (payAsAtari || status.coin==='atri') {
			feeValue = Math.ceil((feeValue * prices[coin] / prices.atri) / 2)
		} else {
			feeValue = N(feeValue * prices[coin] / prices[status.coin], 6)
		}
		return feeValue
	}

	const changeAmount = (text:string) => {  
		let newText = '';
		let numbers = '0123456789.'; 
		for (var i=0; i < text.length; i++) {
			if(numbers.indexOf(text[i]) > -1 ) {
		 		newText = newText + text[i];
			}  
		} 
		if(text==="") newText="";
		updateStatus({targetAmount:newText/* ,fee */})
	};

	const onChangeFeeMode = (payAsAtari:boolean) => {
		updateStatus({ payAsAtari })
	}
	const onChangeChain = (chain:string) => {
		updateStatus({ chain })
	}
	const showDepositModal = async ()=>{
		const chain = coins[status.coin].chain;
		const net = networks[chain]
		const evm = net && net.evm
		const address = evm ? wallets?.evm: wallets?.[chain]
		if(address){
			updateStatus({ walletAddress: wallets[chain], showDepositModal: true}) 
		}else{
			update({loading: true})
			const result = await call("/get-user-wallet", { chain: evm ? 'evm': chain });
			if (result !== null) {
				if(result.error !== undefined) {
					showToast(getError(result.error), "error")
					updateStatus({showDepositModal: false})
				} else {
					if(result.result===false){
						showToast('Cannot found wallet address', "error")
						updateStatus({walletAddress:'', showDepositModal: false});
					} else{
						updateStatus({walletAddress:result.result.address,  showDepositModal:true});
					}
				}
			} else {
				showToast(getError(0));
				updateStatus({showDepositModal:true});
			}
			update({loading: false})
		}
	}
	const onChart = (coin?:string, chartType?:string) => {
		try {
			const s = {} as {[key:string]:any}
			/* let chain = '' */
			if (coin) {
				s.coin = coin
				const chains = Object.keys(coins[coin].chains)
				s.chain = chains[0]
				s.fee = "";
			} else {
				coin = status.coin
				/* chain = status.chain */
			}
			if (chartType) {
				s.chartType = chartType
			} else {
				chartType = status.chartType
			}
			const as = [] as number[];
			const ls = logs[chartType] as LogsType[]
			if (chartType && coin && ls) {
				for(let v of ls) {
					if (v.coin===coin) {
						as.push(v.usd)
					}
				}
				if (prices[coin]) {
					as.push(prices[coin])
				}	

				if(as.length<6){
					const end= as[as.length -1] || 0;
					const len= as.length;
					for(var i=0; i< 6 -len; i++){
						as.push(end)
					}
				}
				setChart(as || [0])
			}
			let sum = 0, count = 0
			for(let i of logs.prev) {
				if (i.coin===coin) {
					sum += i.usd
					count++
				}
			}
			const prePrice = N(sum / count, 2)
			s.prePrice = prePrice
			if (Object.keys(s).length) setStatus({...status, ...s})
		} catch (error) {
			console.error(error)
		}
	}

	const checkCoin = async () => {
		const { coin, chain, targetAddress, targetAmount, payAsAtari } = status
		if (!targetAddress) {
			updateStatus({errmsg : 'please input destination address.'})
			refTargetAddress?.current?.focus();
			return;
		}
	
		let valid = false;
		if (chain==='eth' || chain==='bsc') {
			valid = /^0x[a-fA-F0-9]{40}$/.test(targetAddress)
		} else if (chain==='btc') {
			valid = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(targetAddress)
		} else if (chain==='ltc') {
			valid = /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(targetAddress)
		}
		if(!valid) {
			updateStatus({errmsg : 'Invalid destination address format.'})
			return
		}
		
		const quantity = Number(targetAmount)

		if (!quantity || isNaN(quantity)) {
			updateStatus({errmsg : 'Enter the amount to be transferred'})
			refAmount?.current?.focus();
			return;
		}
		let fee = 0
		if (quantity) {
			fee = N(calculateFee(payAsAtari, status.chain), 6)
		}

		const balance = balances[coin] ? balances[coin].balance : 0
		if (balance < quantity + (payAsAtari ? 0 : fee)) {
			updateStatus({errmsg : 'The amount exceeds the balance.'})
			refAmount?.current?.focus();
			return
		}
		if (payAsAtari) {
			const balance = balances.atri ? balances.atri.balance : 0
			if (balance < fee) {
				updateStatus({errmsg : 'The Txfee exceeds your ATRI balance.'})
				refAmount?.current?.focus();
				return
			}
		}
		
		updateStatus({showSendModal : false, showPincodeModal : true});
	}

	const sendCoin = async () => {
		const { coin, chain, targetAddress, targetAmount, payAsAtari } = status
	 	const response = await call("/transfer", {coin, chain, to:targetAddress, quantity:targetAmount, payAsAtari });
		if (response !== null) {
			if(response.error !== undefined){
				updateStatus({txStatus : getError(response.error), txNumber:'', showPincodeModal:false, showConfirmModal : true});
			} else {  
				updateStatus({ txStatus : 'success', txNumber:response.result, showPincodeModal:false, showConfirmModal : true});
			}
		} else {
			updateStatus({txStatus : getError(0), txNumber:'', showPincodeModal:false, showConfirmModal : true});
		} 
		update({loading : false});
	}

	const [pending, setPending] = React.useState<TxType[]>([]);
	React.useEffect(()=>{  
		setPending(txs)
		onChart(null, null)
	}, [updated])

	const balance = balances[status.coin] ? N(balances[status.coin].balance + balances[status.coin].locked, 6) : 0
	const price = prices[status.coin] || 0
	const changes = price ? N((1 - status.prePrice / price) * 100, 2) : 0;
	const symbol = coins[status.coin] && coins[status.coin].symbol
	const amount = N(balance * price, 4)

	const targetAmount = Number(status.targetAmount);
	let fee = ""
	if (targetAmount) {
		fee = String(N(calculateFee(status.payAsAtari, status.chain), 6))
	}
	
	

	const qricon = {
		atri:	require(`../../assets/qr-atari.png`)
	} as {[key:string]:JSX.Element}
	const vcoin = coins[status.coin];
	const vchains = Object.keys(vcoin.chains)

	return (
		<Layout>
			{status.showDepositModal ? (
				<Modal animationType="fade" 
					transparent visible={true} 
					presentationStyle="overFullScreen" 
					onDismiss={()=>{updateStatus({showDepositModal: false})}}>
					<View style={styles.viewWrapper}>
						<View style={styles.modalView}>
							<Text style={styles.closebtn} onPress={()=>{updateStatus({showDepositModal: false})}}>&times;</Text>
							{ vchains.length===1 ? null : (
								<View style={{...theme.flex, ...theme.alignitemcenter, ...theme.flexdirectionrow, ...theme.mb4}}>
									{vchains.map(i=>(
										<TouchableOpacity key={i} onPress={() =>{ updateStatus({chain:i}) }}> 
											<Text style={{...( status.chain===i ? theme.primarycolor : theme.whitecolor ), ...theme.ml4}}>{ vcoin.chains[i].title }</Text>
										</TouchableOpacity>
									))}
								</View>
							) }
							
							<View style={{...theme.flex, ...theme.alignitemcenter, ...theme.flexdirectionrow, ...theme.mb4}}>
								{icons[status.coin]}
								<Text style={{...theme.whitecolor, ...theme.ml4, ...theme.t}}>{vcoin.title + (vcoin.chains[status.chain].title ? ' (' + vcoin.chains[status.chain].title + ')' : '')}</Text>
							</View>
								
							<View style={{...theme.backgroundwhite, marginTop:h(3), marginBottom:h(3)}}>
								<QRCode value={status.walletAddress} codeStyle='square' outerEyeStyle='square' innerEyeStyle='square' size={180} backgroundColor="white" logo={qricon.atri}  logoSize = {40} />
							</View>
							
							<View style={{...theme.flex, ...theme.flexdirectionrow, ...theme.justifybetween}}>
								<Text style={{color:'white', fontSize:14}}>{ status.walletAddress } </Text>
								<TouchableOpacity onPress={() =>{ copyToClipboard(status.walletAddress||'') }}> 
									{icons.copy}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			): null}
			{status.showSendModal ? (
				<Modal animationType="fade" 
					transparent visible={true} 
					presentationStyle="overFullScreen" 
					onDismiss={()=>{updateStatus({showSendModal: false})}}>
					<View style={styles.viewWrapper}>
						<View style={styles.modalView}>
							<Text style={styles.closebtn} onPress={()=>{updateStatus({showSendModal: false})}}>&times;</Text>  
							<Text style={{...theme.t3, ...theme.lightcolor, ...theme.mb2}}>Send coin</Text>
							{ vchains.length===1 ? null : (
								<View style={{...theme.flex, ...theme.alignitemcenter, ...theme.flexdirectionrow, ...theme.mb2}}>
									{ vchains.map(i=>(
										<TouchableOpacity key={i} onPress={() =>{ onChangeChain(i) }}> 
											<Text style={{...( status.chain===i ? theme.primarycolor : theme.whitecolor ), ...theme.ml4}}>{ vcoin.chains[i].title }</Text>
										</TouchableOpacity>
									)) }
								</View>
							) }
							
							<View style={{...theme.flex, ...theme.alignitemcenter, ...theme.flexdirectionrow, ...theme.mb4}}>
								{icons[status.coin]}
								<Text style={{...theme.whitecolor, ...theme.ml4, ...theme.t}}>{vcoin.title + (vcoin.chains[status.chain].title ? ' (' + vcoin.chains[status.chain].title + ')' : '')}</Text>
							</View>
								
								
							<Text style={{...theme.t, ...theme.darkcolor,  alignSelf:'flex-start'}}>Destination Address</Text>
							<TextInput ref = {refTargetAddress} style = {styles.input} onChangeText = {(val)=>updateStatus({targetAddress : val})} value = {status.targetAddress}/>  
							<Text style={{...theme.t, ...theme.darkcolor,  alignSelf:'flex-start'}}>Amount</Text>
							<View style={styles.row}>
								<TextInput maxLength={10} ref = {refAmount} style = {styles.input} onChangeText = {(val)=>changeAmount(val)} value = {status.targetAmount} />
								<Text style={{...theme.darkcolor, ...theme.absolute,  marginTop:'auto', marginBottom:'auto',  marginLeft:'auto', marginRight:'auto', right:10}}>{coins[status.coin].symbol}</Text>	
							</View>
							<View style={{...styles.row, ...theme.mb4}}>
								<CheckBox
									value={status.payAsAtari}
									onValueChange={onChangeFeeMode}
								/>
								<Text style={{marginLeft:10, ...theme.whitecolor}}>Pay fee with ATRI</Text>
							</View>
							<Text style={{...theme.t, ...theme.darkcolor,  alignSelf:'flex-start'}}>Expected Transaction Fee: { fee ? (fee + (status.payAsAtari ? 'ATRI' : coins[status.coin].symbol)) : '-' }</Text>
							{status.errmsg ? (<Text style={{...theme.redcolor, ...theme.textcenter}}>{status.errmsg}</Text> ):null}
							<TouchableOpacity style={styles.button} onPress = {()=>{checkCoin()}}>
								<Text style={{...theme.lightcolor, ...theme.textcenter}}>
									Send
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			): null}
			{status.showPincodeModal ? (
				 <PincodeDialog onClose={()=>{updateStatus({showPincodeModal : false})}} onSuccess={()=>{sendCoin()}}/>
			):null}

			{status.showConfirmModal ? (
				<Modal animationType="fade" 
						transparent visible={true} 
						presentationStyle="overFullScreen" 
						onDismiss={()=>{updateStatus({showConfirmModal: false})}}>
						<View style={styles.viewWrapper}>
							<View style={{...styles.modalView, alignItems:'flex-start'}}>
								<Text style={styles.closebtn} onPress={()=>{updateStatus({showConfirmModal: false})}}>&times;</Text>  
								<Text style={{...theme.t, ...theme.p1,  ...theme.darkcolor}}>Target address:</Text>
								<Text style={{...theme.t, ...theme.p1, ...theme.pl5, ...theme.lightcolor}}> {status.targetAddress}</Text>
								<View style={styles.row}>
									<Text style={{...theme.t, ...theme.p1, ...theme.darkcolor}}>Amount:</Text>
									<Text style={{...theme.t, ...theme.p1, ...theme.lightcolor}}>{status.targetAmount} {status.coin.toUpperCase()}</Text>									
								</View>
								<View style={styles.row}>
									<Text style={{...theme.t, ...theme.p1, ...theme.darkcolor}}>Transaction status:</Text>
									<Text style={{...theme.t, ...theme.p1, ...theme.lightcolor}}>{status.txStatus}</Text>									
								</View>
							</View>
						</View>
				</Modal>
			): null}

			<ScrollView> 
				<View style={{...styles.row, backgroundColor:'black'}}>
					{Object.keys(coins).map((i,k)=>(
						<TouchableOpacity key={k} style={{...(status.coin !== i? styles.iconmenu: styles.iconactivemenu), ...theme.p2}} onPress={() => {onChart(i)}}> 
							{icons[i]}
						</TouchableOpacity>
					))}
				</View>
				<View style={styles.chartpanel}>  
					<TouchableOpacity onPress={()=>updateStatus({showSendModal : true, showPincodeModal:false, showConfirmModal:false, targetAddress:'',  txStatus:'', targetAmount:'', errmsg:''})} style={{ ...theme.absolute,  top:15, left:-27, backgroundColor:"#ff2219", ...theme.p1, ...theme.pl3, ...theme.pr3, ...theme.alignitemcenter, ...theme.flex, ...theme.flexdirectionrow, ...theme.justifycenter,  zIndex:10, borderTopLeftRadius:0, borderTopRightRadius:12, borderBottomRightRadius:12, borderBottomLeftRadius:0}}> 
						{icons.deposit} 
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>showDepositModal()} style={{ ...theme.absolute,  top:15, right:-27, backgroundColor:"#ff2219", ...theme.p1, ...theme.pl3, ...theme.pr3, ...theme.alignitemcenter, ...theme.flex, ...theme.flexdirectionrow, ...theme.justifycenter,  zIndex:10, borderTopLeftRadius:12, borderTopRightRadius:0, borderBottomRightRadius:0, borderBottomLeftRadius:12}}> 
						{icons.send} 
					</TouchableOpacity>
					<Text style={{...theme.darkcolor, ...theme.textcenter, ...theme.t}}>Current Balance</Text>
					<Text style={{...theme.whitecolor, ...theme.textcenter,  ...theme.t2}}>{balance + ' ' + symbol}</Text>	
					<Text style={{...theme.darkcolor, ...theme.textcenter, ...theme.t2}}>$ {amount}</Text>
					<View style={{ ...theme.flex, ...theme.flexdirectionrow, ...theme.justifycenter, ...theme.alignitemcenter,  ...theme.mt2 }}> 
							<View><Text style={{...theme.primarycolor, ...theme.textcenter,  ...theme.t}}>{symbol} $ {N(price, 4)}</Text></View>
							<View style={{ backgroundColor:Colors.Primary,  padding:3, paddingLeft:10, paddingRight:10, marginLeft:10, ...theme.borderradius15}}>
								<Text style={{...theme.blackcolor, ...theme.t}}>
									{changes ? changes + ' %' : '-'}
								</Text>
							</View> 
					</View>  
					<LineChart
						data={{
							labels: [],
							datasets: [{ data:chart.length?chart : [0], strokeWidth: 1 }]
						}}
						fromZero={chart[0] === chart[chart.length-1]? true:false}
						width={screenWidth}
						height={h(30)}
						yAxisLabel={''}

						chartConfig={{
							backgroundGradientFromOpacity: 0,
							backgroundGradientToOpacity: 0,
							decimalPlaces: 2,
							strokeWidth: 1, 
							color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							fillShadowGradient:chartColors[status.coin],
							fillShadowGradientOpacity : 0.8,
							//color: (opacity = 1) => chartColors[status.coin],//`rgba(164, 137, 86, 0.8)`,
							style: {
								borderRadius: 25,
							},
							propsForDots: {
								r: "0",
							}
						}}
						bezier
						withInnerLines={false}
						style={{
							marginHorizontal:10,
						}}
						segments = {3}
					/> 
					<View style={{...theme.flex, ...theme.flexdirectionrow, ...theme.alignitemcenter, ...theme.justifycenter, ...theme.mb2}}> 
						<TouchableOpacity onPress={() => {onChart(null, 'date')}}>
							<Text style={status.chartType==='date'? styles.graphactivebutton: styles.graphbutton}>1D</Text> 
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {onChart(null, 'week')}}>
							<Text style={status.chartType==='week'? styles.graphactivebutton: styles.graphbutton}>7D</Text> 
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {onChart(null, 'month')}}>
							<Text style={status.chartType==='month'? styles.graphactivebutton: styles.graphbutton}>1M</Text> 
						</TouchableOpacity> 
					</View>
				</View>
				{pending.length ? (
					<View style={styles.historypanel}>
						<Text style={{...theme.lightcolor, ...theme.t}}>Recent transactions: {pending.length}</Text>
						{
							pending.map((i, index) =>(
								<View style={[styles.row, styles.historyrow]} key={index}>  
									<View style={styles.col1}> 
										{i.confirmed ? icons.arrowBottom: icons.pending}
									</View>   
									<View style={styles.col2}> 
										<Text style={{ color:"#fff", ...theme.t}}>
											{i.confirmed?'Received': `Pending: (${i.confirms} / ${networks[i.chain].confirmations})`}
										</Text>
										{i.confirmed ? <Text style={{ color:"#949494", fontSize:w(2.5)}}>{new Date(i.created * 1000).toLocaleString()}</Text> : null}
									</View>
									<View style={styles.col3}> 	
										<Text style={{ color:"#eee", ...theme.t}}>{i.amount || 0} {i.coin.toUpperCase()}</Text>
									</View>    
								</View>
							)) 
						}
					</View>
				) : null}
			</ScrollView>
		</Layout>
	)
}; 
const styles = StyleSheet.create({
	input : {
		...theme.w100,
		...theme.borderstylesolid,
		...theme.borderwidth3,
		...theme.t,
		...theme.m2,
		...theme.p1,
		borderColor:Colors.Dark,
		color:Colors.Light,
		paddingLeft : 20,
		borderRadius : 5,
	},
	button:{
		...theme.mt1,
		...theme.borderradius10, 
		...theme.w100,
		...theme.p1,
		...theme.t,
		backgroundColor:Colors.DarkPrimary,
	},
	iconmenu:{
		...theme.mlauto,
		...theme.mrauto,
		...theme.pb2,
		...theme.pt3
	}, 
	iconactivemenu:{
		...theme.mlauto,
		...theme.mrauto,
		...theme.pb2,
		...theme.pt3,
		borderColor:'#eee', 
		borderBottomWidth:1
	}, 
	graphbutton:{
		...theme.greycolor,
		...theme.borderradius10,
		...theme.ml3,
		...theme.t, 
		...theme.p1,
	},
	graphactivebutton:{
		...theme.whitecolor,
		...theme.borderradius10,
		...theme.ml3,
		 ...theme.t , 
		 ...theme.p1,
		 borderColor:"white", 
		 borderWidth:1, 
	},
	row:{
		...theme.flex,
		...theme.flexdirectionrow,
		...theme.justifycenter,
		...theme.alignitemcenter,
		...theme.relative,
		...theme.flexwrap
	}, 
	historyrow:{
		...theme.t,
		...theme.pt2,
		...theme.pb2,
		borderColor:Colors.Dark, 
		borderBottomWidth:0.4,   
	},
	chartpanel:{
		backgroundColor:'#00000091', 
		...theme.borderradius15,
		...theme.m3,
		...theme.pt1
	},
	historypanel:{
		backgroundColor:'#00000099', 
		...theme.borderradius10,
		...theme.m3,
		...theme.p2
	}, 
	col1:{
		...theme.flex1,
		justifyContent:'center',
		borderRightWidth:0.2,
		borderColor:Colors.Dark 
	},
	col2:{
		...theme.flex6,
		...theme.pl3
	},
	col3:{
		...theme.flex5,
		...theme.pl3,
		...theme.flexdirectionrowreverse
	},

    viewWrapper: {
        ...theme.flex1,
        ...theme.alignitemcenter,
        ...theme.justifycenter,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalView: {
        ...theme.alignitemcenter,
        ...theme.justifycenter,
		...theme.absolute,
		...theme.mlauto,
		...theme.mrauto,
        ...theme.w90,
		...theme.borderradius15,
		...theme.borderwidth3,
		...theme.p3,
        backgroundColor: "#000000",
		borderColor:'#990000',
		top: "30%",
        height: 'auto',
	},
	closebtn: {
		...theme.absolute,
		...theme.darkcolor,
		...theme.t2,
		right:5,
		top:0,
		paddingRight:5,
	}
}); 

export default Graph;