import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UseWalletProvider } from "use-wallet";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";

import ContextProvider from "./contexts";

ReactDOM.render(
	<React.StrictMode>
		<UseWalletProvider
			chainId={26}
			connectors={{ portis: { dAppId: "login" } }}
		>
			<ContextProvider>
				<App />
				<NotificationContainer />
			</ContextProvider>
		</UseWalletProvider>
	</React.StrictMode>,
	document.getElementById("wrapper")
);

reportWebVitals();
