import React, {useState} from "react";
import { PieChart} from 'react-native-svg-charts';
import { StyleSheet, ScrollView,  View , Text,  Dimensions} from "react-native";  
import theme, {chartColors, Colors, w, h } from '../Theme'; 
import Layout from '../Layout';
import Icons from '../Assets';   
import useWallet, {N} from '../../useWallet';
import Networks from '../../networks.json'
import Coins from '../../config/coins.json'


interface PieType {
	name: string
	value: number
	key: string
	svg: any
}
interface DashboardStatus {
	total: number, 
	labelWidth:number,
	pie:  Array<PieType>
}

const networks = Networks as NetworkType;
const coins = Coins as {[coin:string]:{title:string, chain:string, symbol:string}}


let icons = {
	atri:	<Icons.ATARI 	width={w(4)} height={w(4)} color={chartColors.atri}/>,
	eth:	<Icons.ETH 		width={w(4)} height={w(4)} color={chartColors.eth}/>,
	usdt:	<Icons.USDT 	width={w(4)} height={w(4)} color={chartColors.usdt}/>,
	btc:	<Icons.BTC  	width={w(4)} height={w(4)} color={chartColors.btc}/>,
	bnb:	<Icons.BNB 		width={w(4)} height={w(4)} color={chartColors.bnb}/>,
	ltc:	<Icons.LTC 		width={w(4)} height={w(4)} color={chartColors.ltc}/>,
	eth2:	<Icons.ETH2 	width={w(5)} height={w(5)} color={chartColors.eth}/>,
	usdt2:	<Icons.USDT2 	width={w(5)} height={w(5)} color={chartColors.usdt}/>,
	btc2:	<Icons.BTC2  	width={w(5)} height={w(5)} color={chartColors.btc}/>,
	bnb2:	<Icons.BNB2 	width={w(5)} height={w(5)} color={chartColors.bnb}/>,
	ltc2:	<Icons.LTC2 	width={w(5)} height={w(5)} color={chartColors.ltc}/>,
	arrowTopRight:	<Icons.arrowTopRight width={w(4)} height={w(4)} color="red"/>,
	arrowBottomRight:	<Icons.arrowBottomRight width={w(4)} height={w(4)} color="green"/>,
}

const Dashboard = () => {  
	const {updated,  prices, balances,  txs} = useWallet();  
	
	const [status, setStatus] = React.useState<DashboardStatus>({
		total: 0, 
		labelWidth:0,
		pie: [],
	});
	const [pending, setPending] = React.useState<TxType[]>([]);
	
	const updateStatus = (params: {[key: string] :any}) => setStatus({...status, ...params})
	
	React.useEffect(()=>{  
		let pie = [] as Array<PieType> 
		let _total = 0
		if (balances) {
			for(let i in balances) {
				const v = balances[i]
				if (v) {
					const price = prices[i] || 0
					const value = price * ((v.balance || 0) + (v.locked || 0));
					pie.push({name: i, value,  key: String(i), svg: {fill: chartColors[i]}});
					_total += value;
				}
			}
			setPending(txs)
			updateStatus({ total:N(_total, 2),  pie }) 
		}
	}, [updated])
	

	var screenWidth=Dimensions.get('window').width;
		
	const zeroBalance = status.pie.length===0;
	return (
		<Layout> 	
			<ScrollView style={{ ...theme.m1, ...theme.p1 }}>
			<View style= {styles.backpanel}>
				<View style={{ ...theme.justifycenter, flex: 1, ...theme.p2, ...theme.relative }}> 
					<PieChart 
						style={{ ...theme.mlauto, ...theme.mrauto, width:w(40), height:w(40) }}
						data = {zeroBalance ? [{ value:100, key:'k1', name:'v1', svg:{fill: '#888' }}]: status.pie } 
						padAngle = {0.03}
						outerRadius={'100%'} 
						innerRadius={'93%'}
					/>
					<View style={{ ...theme.absolute, ...theme.left0, ...theme.right0, ...theme.top0, ...theme.bottom0, ...theme.flex, ...theme.alignitemcenter, ...theme.justifycenter}}>
						<Text style={{ ...theme.whitecolor, ...theme.textcenter,  ...theme.t}}>
								{`${'Total Balance \n' }`} 
							<Text style={{ ...theme.whitecolor, ...theme.textcenter,  ...theme.t3}}>
								{`${N(status.total, 2) }`}
							</Text>
						</Text>
					</View>
				</View>
				<View style={{ ...theme.flex, ...theme.flexdirectionrow, ...theme.flexwrap, ...theme.justifybetween, ...theme.p1 }}>
					{Object.keys(coins).map((i,k)=>(
						<View style={styles.balancePanel} key={k}>
							<View style={styles.balanceIcon}>
								{icons[i]}
							</View>
							<View style={styles.balanceAmount}>
								<Text style={styles.tokentext}>{N(balances[i]?.balance || 0 + balances[i]?.locked || 0, 3)} {coins[i].symbol}</Text>
							</View>
						</View>   
					))}
				</View>
			</View>
			{ pending.length ? (
				<View style= {{...styles.backpanel, marginTop:14}}> 
					{pending.map((i, k) =>(
						<View style={styles.historyrow} key={k}>  
							<View style={styles.col1}> 
								{icons[i.coin+"2"]}
							</View>   
							<View style={styles.col2}> 
								<Text style={{...theme.t, ...theme.whitecolor}}>
									{i.confirmed?'Received':('Pending: ('+i.confirms + ' / ' + networks[i.chain].confirmations+')')}
								</Text>
								{i.confirmed ? <Text style={{ color:"#949494", ...theme.t0}}>{new Date(i.created * 1000).toLocaleString()}</Text> : null}
							</View>    
							<View style={styles.col3}> 	
								<Text style={{...theme.t, ...theme.whitecolor}}>{N(i.amount || 0)} {coins[i.coin].symbol}</Text>
							</View>    
						</View>
					))}
				</View>
			) : null }
			</ScrollView>
		</Layout>
	)
};
 

const styles = StyleSheet.create({ 
	row:{
		...theme.flex,
		...theme.justifycenter,
	},
	
	backpanel : {
		...theme.borderradius15,
		...theme.m1,
		...theme.p1,
		backgroundColor : 'rgba(0,0,0,0.7)'
	},
	historyrow:{
		...theme.flex,
		...theme.flexdirectionrow,
		...theme.justifycenter, 
		...theme.alignitemcenter,
		...theme.relative,
		...theme.flexwrap,
		...theme.p2,
		borderBottomWidth: h(0.05),
		borderBottomColor:Colors.Dark,
		...theme.pt2,
		...theme.pb2,
	},
	balancePanel: {
		...theme.borderwidth2,
		...theme.borderradius20,
		...theme.flex,
		...theme.flexdirectionrow,
		...theme.mt1,
		borderColor:Colors.Light,
		width:'49%'
	},
	balanceIcon: {
		minWidth:w(4),
		...theme.pl1,
		...theme.pr1,
		borderRightWidth:w(0.1),
		borderColor: Colors.Dark,
		...theme.alignitemcenter,
		...theme.justifycenter,
		...theme.m1
	},
	balanceAmount: {
		...theme.flex1,
		...theme.flexdirectionrow,
		...theme.alignitemcenter
	},
	tokentext:{
		...theme.whitecolor,
		marginLeft:1,
		paddingLeft:3, 
		fontSize: h(2)
	},
	col1:{
		...theme.flex1,
		borderRightWidth:0.4,
		borderColor:Colors.Dark,
	},
	col2:{
		...theme.flex6,
		...theme.pl2, 
		...theme.t
	},
	col3:{
		...theme.flex5,
		...theme.pl2,
		...theme.textright,
		flexDirection:"row-reverse",
		...theme.t
	}
});
export default Dashboard;