import {Provider} from 'react-redux';
import store from "./store";
import Routes from './router';
import {UseWalletProvider } from 'use-wallet'
import React, { useState, useEffect } from 'react'
import logoImg from './assets/img/logo.png';
import './assets/style/bootstrap.min.css';
import './App.css';
import LoadingScreen from "react-loading-screen";
import {useApplicationContext} from './contexts';
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component'

function App() {
    //console.log("context ",chainId)
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setTimeout(() => setLoading(false), 4000)
    }, [])

  return (
    <LoadingScreen
    loading={loading}
    bgColor='#3320FF'
    spinnerColor='#9ee5f8'
    textColor='#ffffff'
    logoSrc={logoImg}
    text='Loading Screen'
    > 
        <UseWalletProvider
          chainId={4002}   
          connectors={{
            // This is how connectors get configured
            portis: { dAppId: 'my-dapp-id-123-xyz' },
          }}
        > 
        <Provider store={store}>
			<ReactNotification />
			<Routes /> 
        </Provider>
        </UseWalletProvider>
    </LoadingScreen>
  );
}

export default App;
