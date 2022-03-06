import { StyleSheet } from "react-native"; 
import theme from '../Theme';

const styles = StyleSheet.create({
	link : {
		...theme.underline,
		...theme.textcenter,
		...theme.t,
		...theme.m1,
		...theme.primarycolor
	},
	submit : {
		...theme.alignitemcenter,
		...theme.borderwidth10,		
		...theme.borderradius8,
		...theme.w90,
		...theme.mlauto,
		...theme.mrauto,
		...theme.textcenter,
		...theme.t,
		...theme.p2,
		...theme.m2,
		...theme.whitecolor,
		borderColor : '#a48957',
		backgroundColor : "#010101",
	},
	middle : {
		...theme.flex1,
		...theme.flexdirectioncolumn,
		...theme.justifycenter,
		transform : [{ translateY : -50 }],
	},
	backpanel : {
		...theme.borderradius9,
		...theme.p2,
		...theme.m2,
		backgroundColor : 'rgba(0,0,0,0.5)'
	},
	input : {
		...theme.w90,
		...theme.borderwidth3,
		...theme.pl5,
		...theme.borderradius6,
		...theme.mlauto,
		...theme.mrauto,
		...theme.mt3,
		...theme.t,
		...theme.h,
		...theme.p1,
		borderColor : "#e6e1a5",
		color : "#e6e1a5",
	}, 
	title : {
		...theme.whitecolor,
		...theme.textcenter,
		...theme.t3
	},
	text : {
		color : "white",
		textAlign : "center",
		...theme.t
	},
	error : {
		...theme.redcolor,
		...theme.p2,
		...theme.borderradius5,
		...theme.textcenter,
		...theme.t,
	}
});

export default styles;