import React from "react";
import { StyleSheet, Text  } from "react-native"; 
import Layout from '../Layout' 
import theme from '../Theme' 

const Nft = ({navigation}:any) => { 
	return (
		<Layout>
			<Text style={{color:'#afa730', 	...theme.t2, ...styles.text, marginTop: 100}}>WELCOME TO THE</Text>
			<Text style={{color:'white', 	...theme.t1, ...styles.text}}>ICICB NFT Universe</Text>
			<Text style={{color:'grey', 	...theme.t, ...styles.text}}>Buy, store and sell your NFTs</Text>
			<Text style={{color:'white', 	...theme.t3, ...styles.text}}>(Coming Soon)</Text>
		</Layout>
	)
};

const styles = StyleSheet.create({
	text: { textAlign:'center', margin:15 }, 
});

export default Nft;