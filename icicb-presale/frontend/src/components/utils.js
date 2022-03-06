
import { ethers } from "ethers"
import { store } from 'react-notifications-component';
/**
 * set delay for delayTimes
 * @param {Number} delayTimes - timePeriod for delay
 */
function delay(delayTimes) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayTimes);
  });
}

/**
 * change data type from Number to BigNum 
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
function toBigNum(value,d) {
    return ethers.utils.parseUnits(value, d);
}

/**
 * change data type from BigNum to Number
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
function fromBigNum(value,d) {
    return parseFloat(ethers.utils.formatUnits(value, d));
}

function handleErr(err){
  store.addNotification({  
    title: "ERROR",
    message: "OOPs Something wrong",
    type: "warning",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
}

export {delay,handleErr, toBigNum, fromBigNum};