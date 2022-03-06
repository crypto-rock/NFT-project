import { StyleSheet } from "react-native"; 
import theme, { Colors } from '../Theme';

const styles = StyleSheet.create({
	link : {
		...theme.underline,
		...theme.textcenter,
		...theme.t,
		...theme.m1,
		...theme.lightcolor
	},
	submit : {
		...theme.alignitemcenter,
		...theme.borderwidth5,		
		...theme.borderradius30,
		...theme.w50,
		...theme.mlauto,
		...theme.mrauto,
		...theme.textcenter,
		...theme.t,
		...theme.p2,
		...theme.m2,
		...theme.mt3,
		...theme.whitecolor,
		borderColor : '#333',
		backgroundColor : "#ff1119",
		textShadowOffset: {
			width: 12,
			height :2
		}
	},
	middle : {
		...theme.flex1,
		...theme.flexdirectioncolumn,
		...theme.justifycenter,
		transform : [{ translateY : -20 }],
	},
	backpanel : {
		...theme.borderradius15,
		...theme.p2,
		...theme.m4,
		backgroundColor : 'rgba(0,0,0,0.7)'
	},
	input : {
		...theme.w90,
		...theme.borderwidth4,
		...theme.pl5,
		...theme.borderradius20,
		...theme.mlauto,
		...theme.mrauto,
		...theme.mt3,
		...theme.t,
		...theme.h,
		...theme.p1,
		borderColor : Colors.Light,
		color : Colors.Light
	}, 
	title : {
		...theme.whitecolor,
		...theme.textcenter,
		...theme.t2
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