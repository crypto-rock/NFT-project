import React from 'react'; 
/* import './success.scss' */
import Svg, { Path, Circle } from "react-native-svg"

const Success = () => {
	return (
        <Svg stroke="#4bb71b" viewBox="0 0 52 52" width={60} height={60}>
            <Circle cx="26" cy="26" r="25" fill="none" strokeWidth={2} strokeMiterlimit={0} />
            <Path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" strokeWidth={2} strokeDasharray={48} transform-origin='50% 50%' />
        </Svg>
	)
}

export default Success