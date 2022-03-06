import React from "react";
import { StyleSheet, Text, View,TouchableOpacity , ScrollView, Dimensions, Modal} from "react-native"; 
import { LineChart } from 'react-native-chart-kit'
import { QRCode } from 'react-native-custom-qr-codes-expo';
import theme, { chartColors, Colors, h, w } from '../Theme';  
import Layout from '../Layout' 
import Icons from '../Assets'; 
import useWallet, {showToast, getError, copyToClipboard, N, isPrivate} from '../../useWallet';
import Networks from '../../config/networks.json'	
import Coins from '../../config/coins.json'
import InputCodeDialog from "./InputCodeDialog";

const networks = Networks as NetworkType;
const coins = Coins as {[coin:string]:{title:string, chain:string, symbol:string}}

const icons = {
	icicb:		<Icons.ICICB 		width={w(5)} height={w(5)} color={chartColors.icicb}/>,
	eth:		<Icons.ETH 			width={w(5)} height={w(5)} color={chartColors.eth}/>,
	usdt:		<Icons.USDT 		width={w(5)} height={w(5)} color={chartColors.usdt}/>,
	btc:		<Icons.BTC  		width={w(5)} height={w(5)} color={chartColors.btc}/>,
	bnb:		<Icons.BNB 			width={w(5)} height={w(5)} color={chartColors.bnb}/>,
	ltc:		<Icons.LTC 			width={w(5)} height={w(5)} color={chartColors.ltc}/>,
	deposit: 	<Icons.deposit 		width={w(6)} height={w(6)} color="#111"/>,
	arrowBottom:<Icons.arrowBottom 	width={w(6)} height={w(6)} color="#eee"/>,
	pending: 	<Icons.pending 		width={w(5)} height={w(5)} color="#eee"/>,
	copy: 		<Icons.copy 		width={w(5)} height={w(5)} color="white"/>,
} as {[key:string]:JSX.Element}

const Graph = ({navigation}:any) => {
	const [chart, setChart] = React.useState([0])
	const screenWidth=Dimensions.get('window').width-65;

	const {user, updated, update, prices, balances,  txs, logs, wallets,  call} = useWallet();  
	const updateStatus = (params: {[key: string] :any}) => setStatus({...status, ...params})
	const [status, setStatus] = React.useState({
		coin: 'icicb', 
		chartType: 'date',
		showModal: false,
		walletAddress: '',
		prePrice:0
	});

	const showDepositModal = async ()=>{
		const chain = coins[status.coin].chain;
		const net = networks[chain]
		const evm = net && net.evm
		if (!isPrivate || user && user.presale) {
			const address = evm ? wallets?.evm: wallets?.[chain]
			if(address){
				updateStatus({ walletAddress: wallets[chain], showModal: true}) 
			}else{
	
				update({loading: true})
				const result = await call("/get-user-wallet", {chain: evm ? 'evm': chain});
				if (result !== null) {
					if(result.error !== undefined) {
						showToast(getError(result.error), "error")
						updateStatus({showModal: false})
					} else {
						if(result.result===false){
							showToast('Cannot get wallet address', "error")
							updateStatus({walletAddress:'', showModal: false})
						} else{
							updateStatus({walletAddress:result.result.address,  showModal:true});
						}
					}
				} else {
					showToast(getError(0))
				}
				update({loading: false})
			}
		} else {
			updateStatus({showModal:true})
		}
	}
	const onChart = (coin?:string, chartType?:string) => {
		try {
			const s = {} as {[key:string]:any}
			if (coin) {
				s.coin = coin
			} else {
				coin = status.coin
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
	const [pending, setPending] = React.useState<TxType[]>([]);
	React.useEffect(()=>{  
		setPending(txs)
		onChart(undefined, undefined)
	}, [updated])
	const balance = balances[status.coin] ? balances[status.coin].balance + balances[status.coin].locked : 0
	const price = prices[status.coin] || 0
	const changes = price ? N((1 - status.prePrice / price) * 100, 2) : 0;
	const symbol = coins[status.coin] && coins[status.coin].symbol
	const amount = N(balance * price)

	const qricon = {
		icicb:	require(`../../assets/qr-icicb.png`)
	} as {[key:string]:JSX.Element}

	return (
		<Layout>
			{status.showModal ? (
				(!isPrivate || !!user?.presale) ? (
					<Modal animationType="fade" 
						transparent visible={true} 
						presentationStyle="overFullScreen" 
						onDismiss={()=>{updateStatus({showModal: false})}}>
						<View style={styles.viewWrapper}>
							<View style={styles.modalView}>
								<Text style={styles.closebtn} onPress={()=>{updateStatus({showModal: false})}}>&times;</Text>  
								<View style={{...theme.backgroundwhite, marginTop:h(3), marginBottom:h(3)}}>
									<QRCode value={status.walletAddress} codeStyle='square' outerEyeStyle='square' innerEyeStyle='square' size={180} backgroundColor="white" logo={qricon.icicb}  logoSize = {40} />
								</View>
								<View style={{...theme.flex, ...theme.alignitemcenter, ...theme.flexdirectionrow, ...theme.mb4}}>
									{icons[status.coin]}
									<Text style={{...theme.whitecolor, ...theme.ml4, ...theme.t}}>{coins[status.coin].title}</Text>
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
				): (
					<InputCodeDialog modal={true} onClose={()=>{updateStatus({showModal: false})}} />
				)
			): null}
			
			<ScrollView> 
				<View style={styles.row}>
					{Object.keys(coins).map((i,k)=>(
						<View style={{flex:2}} key={k}> 
							<TouchableOpacity style={{...(status.coin !== i? styles.iconmenu: styles.iconactivemenu), ...theme.p2}} onPress={() => {onChart(i)}}> 
								{icons[i]}
							</TouchableOpacity>
						</View>
					))}
				</View>
				<View style={styles.chartpanel}>  
					<TouchableOpacity onPress={()=>{showDepositModal()}} style={{ ...theme.absolute,  top:15, left:-16, backgroundColor:"#a5985c", ...theme.p1, ...theme.alignitemcenter, ...theme.flex, ...theme.flexdirectionrow, ...theme.justifycenter,  zIndex:10, borderTopLeftRadius:0, borderTopRightRadius:5, borderBottomRightRadius:5, borderBottomLeftRadius:0}}> 
						{icons.deposit} 
						<Text> Receive</Text>
					</TouchableOpacity>
					<Text style={{...theme.primarycolor, ...theme.textcenter, ...theme.t}}>Current Balance</Text>
					<Text style={{...theme.whitecolor, ...theme.textcenter,  ...theme.t3}}>{balance + ' ' + symbol}</Text>	
					<Text style={{...theme.lightcolor, ...theme.textcenter, ...theme.t}}>$ {amount}</Text>
					<View style={{ ...theme.flex, ...theme.flexdirectionrow, ...theme.justifycenter, ...theme.alignitemcenter,  ...theme.mt2 }}> 
							<View><Text style={{...theme.primarycolor, ...theme.textcenter,  ...theme.t}}>{symbol} $ {Math.round(price * 100)/100}</Text></View>
							<View style={{...theme.borderwidth5, backgroundColor:"#7f8043", padding:3, paddingLeft:10, paddingRight:10, marginLeft:10}}>
								<Text style={{color:"black", ...theme.t}}>
									{changes ? changes + ' %' : '-'}
								</Text>
							</View> 
					</View>  
					<LineChart
						data={{
							labels: [],
							datasets: [{ data:chart.length?chart : [0], strokeWidth: 1 }]
						}}
						fromZero={chart[0] == chart[chart.length-1]? true:false}
						width={screenWidth}
						height={h(30)}
						yAxisLabel={''}
						chartConfig={{
							backgroundColor: 'white', 
							backgroundGradientFromOpacity: 0,
							backgroundGradientToOpacity: 0,
							decimalPlaces: 2,
							strokeWidth: 0, 
							
							color: (opacity = 0) => chartColors[status.coin],
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
						<TouchableOpacity onPress={() => {onChart(undefined, 'date')}}>
							<Text style={status.chartType==='date'? styles.graphactivebutton: styles.graphbutton}>1D</Text> 
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {onChart(undefined, 'week')}}>
							<Text style={status.chartType==='week'? styles.graphactivebutton: styles.graphbutton}>7D</Text> 
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {onChart(undefined, 'month')}}>
							<Text style={status.chartType==='month'? styles.graphactivebutton: styles.graphbutton}>1M</Text> 
						</TouchableOpacity> 
					</View>
				</View>
				{pending.length ? (
					<View style={styles.historypanel}>
						<Text style={{ color:"#888", ...theme.t}}>Recent transactions: {pending.length}</Text>
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
										{i.confirmed ? <Text style={{ color:"#949494", ...theme.t0}}>{new Date(i.created * 1000).toLocaleString()}</Text> : null}
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
		 borderColor:"white", borderWidth:1, 
	},
	row:{
		...theme.flex,
		...theme.flexdirectionrow,
		...theme.justifybetween,
		...theme.alignitemcenter,
		...theme.relative,
		...theme.flexwrap
	}, 
	historyrow:{
		...theme.t,
		...theme.p1,
		borderColor:Colors.DarkPrimary, 
		borderBottomWidth:0.3,   
	},
	chartpanel:{
		backgroundColor:'#00000067', 
		...theme.borderradius15,
		...theme.m2,
		...theme.pt1
	},
	historypanel:{
		backgroundColor:'#00000078', 
		...theme.borderradius10,
		...theme.m2,
		...theme.p2
	}, 
	col1:{
		...theme.flex1,
		...theme.alignitemstart,
		borderRightWidth:0.4,
		borderColor:Colors.DarkPrimary 
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
		...theme.borderwidth5,
		...theme.p3,
        backgroundColor: "#111",
		borderColor:'#333',
		top: "30%",
        height: 'auto',
	},
	closebtn: {
		...theme.absolute,
		...theme.whitecolor,
		...theme.t2,
		right:5,
		top:0,
		paddingRight:5,
	}
}); 

export default Graph;