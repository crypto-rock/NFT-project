/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { useWallet } from "use-wallet";
import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";


function Header(props) {
	const wallet = useWallet();

	//check connection
	const handleChainChanged = (chainId) => {
		let { ethereum } = window;
		if (ethereum && ethereum.isConnected() && Number(chainId) === 4002) {
			onConnect();
		}
	};

	React.useEffect(() => {
		checkConnection();
	}, []);

	const checkConnection = async () => {
		let { ethereum } = window;
		if (ethereum !== undefined) {
			const chainId = await ethereum.request({ method: "eth_chainId" });
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const accounts = await provider.listAccounts();
			if (accounts.length !== 0 && Number(chainId) === 4002) {
				onConnect();
			}
			ethereum.on("chainChanged", handleChainChanged);
		}
	};

	const onConnect = () => {
		if (wallet.status !== "connected") {
			wallet.connect().catch((err) => {
				NotificationManager.error("please check metamask!");
			});
		}
	};

	const disconnect = () => {
		if (wallet.status === "connected") {
			wallet.reset();
		}
	};


	return (
		<header className="transparent scroll-dark">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="de-flex sm-pt10">
							<div className="de-flex-col">
								<div className="de-flex-col">
									<div id="logo">
										<Link to="/">
											<img
												alt=""
												src="images/icicb-landing/logo.png"
												style={{
													paddingBottom: "10px",
													transform: "scale(1.2)",
												}}
											/>
										</Link>
									</div>
								</div>
								<div className="de-flex-col">
									{/* <ul id="mainmenu">
										<li>
											<Link to="/">
												EN<span></span>
											</Link>
											<ul>
												<li>
													<Link to="/">RU</Link>
												</li>
												<li>
													<Link to="/">EN</Link>
												</li>
											</ul>
										</li>
									</ul> */}
								</div>
							</div>
							<div className="de-flex-col header-col-mid">
								<ul id="mainmenu">
									<li>
										<Link to="/marketplace">
											Explore<span></span>
										</Link>
									</li>
									<li>
										<Link to="/collections">
											My Collections<span></span>
										</Link>
									</li>
									<li>
										<Link to="/">
											Developers<span></span>
										</Link>
									</li>
									<li>
										<Link to="/">
											Community<span></span>
										</Link>
									</li>
								</ul>
								<div className="menu_side_area">
									<div className="btn-main wallet-connectBtn">
										{wallet.status === "connected" ? (
											<div
												style={{
													textTransform: "none",
												}}
												onClick={disconnect}>

												Disconnect
											</div>
										) : (
											<div
												onClick={() => onConnect()}
												style={{
													textTransform: "none",
												}}>
												{wallet.status ===
													"connecting" ? (
													<div>
														<span
															className="spinner-border"
															role="status"
															style={{
																width: "1.5em",
																height: "1.5em",
																marginRight: 10,
															}}></span>
														<span className="sr-only ">
															Loading...
														</span>
													</div>
												) : (
													<div>

														Connect
													</div>
												)}
											</div>
										)}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;
