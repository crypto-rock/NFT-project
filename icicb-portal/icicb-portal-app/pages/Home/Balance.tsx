import React from "react";
import { PieChart} from 'react-native-svg-charts';
import { StyleSheet, ScrollView,  View , Text,  Dimensions } from "react-native";  
import theme, { chartColors, Colors, w, h } from '../Theme'; 
import Layout from '../Layout';
import Icons from '../Assets';   
import useWallet, {N} from '../../useWallet';
import Networks from '../../config/networks.json'
import Coins from '../../config/coins.json'


interface PieType {
	name: string
	value: number
	key: string
	svg: any
}
interface BalanceStatus {
	total: number, 
	labelWidth:number,
	pie:  Array<PieType>
}

const networks = Networks as NetworkType;
const coins = Coins as {[coin:string]:{title:string, chain:string, symbol:string}}

/* const chartColors = {bnb:'#F3BA2F', btc:'#F7931A', eth:'#00aaa1', icicb:'#e6be75', ltc:'#236bff', usdt:'#36f32d'}; */

let icons = {
	icicb:	<Icons.ICICB 	width={w(4)} height={w(4)} color={chartColors.icicb}/>,
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

const Balance = () => {  
	const {updated,  prices, balances,  txs} = useWallet();  
	
	const [status, setStatus] = React.useState<BalanceStatus>({
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
			<ScrollView style={{...theme.m1, ...theme.p1}}>
				<View style={{ ...theme.justifycenter, flex: 1, ...theme.p2, ...theme.relative }}> 
					<PieChart 
						style={{ ...theme.mlauto, ...theme.mrauto, width:w(40), height:w(40) }}
						data = {zeroBalance ? [{value:100, key:'k1', name:'v1', svg:{fill: '#888'}}]: status.pie } 
						padAngle = {0.03}
						outerRadius={'100%'} 
						innerRadius={'94%'}
					/>
					<View style={{ ...theme.absolute,  ...theme.left0, ...theme.right0, ...theme.top0, ...theme.bottom0, ...theme.flex, ...theme.alignitemcenter, ...theme.justifycenter}}>
						<Text style={{ ...theme.whitecolor, ...theme.textcenter,  ...theme.t3}}>
								{`${'Total Balance' }\n$${N(status.total, 2)}`}
						</Text> 
					</View>
				</View> 
				<View style={{...theme.flex, ...theme.flexdirectionrow,  ...theme.flexwrap, ...theme.justifybetween, ...theme.p1}}>
					{Object.keys(coins).map((i,k)=>(
						<View style={styles.balancePanel} key={k}>
							<View style={styles.balanceIcon}>
								{icons[i]}
							</View>
							<View style={styles.balanceAmount}>
								<Text style={styles.tokentext}>{N(balances[i]?.balance || 0 + balances[i]?.locked || 0, 4)} {coins[i].symbol}</Text>
							</View>
						</View>   
					))}
				</View>
				<View> 
					{pending.map((i, index) =>(
						<View style={styles.historyrow} key={index}>  
							<View style={styles.col1}> 
								{icons[i.coin+"2"]}
							</View>   
							<View style={styles.col2}> 
								<Text style={{ color:"#eee"}}>
									{i.confirmed?'Received':('Pending: ('+i.confirms + ' / ' + networks[i.chain].confirmations+')')}
								</Text>
								{i.confirmed ? <Text style={{ color:"#949494", ...theme.t0}}>{new Date(i.created * 1000).toLocaleString()}</Text> : null}
							</View>    
							<View style={styles.col3}> 	
								<Text style={{ color:"#eee"}}>{N(i.amount || 0)} {coins[i.coin].symbol}</Text>
							</View>    
						</View>
					))}
				</View> 
			</ScrollView>
		</Layout>
	)
};
 

const styles = StyleSheet.create({ 
	row:{
		...theme.flex,
		...theme.justifycenter,
	},
	historyrow:{
		...theme.flex,
		...theme.flexdirectionrow,
		...theme.justifycenter, 
		...theme.alignitemcenter,
		...theme.relative,
		...theme.flexwrap,
		...theme.borderradius7,
		...theme.borderwidth3,
		...theme.m1,
		...theme.p1,
		backgroundColor:"#02020299",
		borderColor:Colors.Primary,
	},
	balancePanel: {
		...theme.borderwidth5,
		...theme.borderradius20,
		...theme.flex,
		...theme.flexdirectionrow,
		...theme.mt1,
		...theme.h,
		borderColor:Colors.DarkPrimary,
		width:'49%'
	},
	balanceIcon: {
		minWidth:w(4),
		...theme.pl2,
		...theme.pr2,
		borderRightWidth:w(0.1),
		borderColor: Colors.DarkPrimary,
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
		...theme.pl2, 
		...theme.p1,
		...theme.t,
		borderRightWidth:0.4,
		borderColor:Colors.DarkPrimary,
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
export default Balance;