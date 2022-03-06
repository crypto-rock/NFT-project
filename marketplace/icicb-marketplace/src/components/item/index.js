/** @format */

import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

import { useBlockchainContext } from "../../contexts";
import BlankItem from "./blankItem";

function Items(props) {
	const history = useHistory();
	const { NFTaddress, tokenid } = props;
	const [state] = useBlockchainContext();

	var NFTDATAS = state.NFTDATAS[NFTaddress];
	const [status, setStatus] = useState({ tokenURI: {} });

	useEffect(() => {
		var tokenURI = !NFTDATAS || !NFTDATAS[tokenid] ? "" : JSON.parse(NFTDATAS[tokenid].tokenURI);
		setStatus({ ...status, tokenURI: tokenURI });
	}, [NFTDATAS,tokenid])

	const handleClick = () => {
		console.log("handleClick :",tokenid);
		history.push(`/${tokenid}`);
	}

	return (
		<div>
			{!NFTDATAS || !NFTDATAS[tokenid] ? <BlankItem /> :
				(<div className="d-item">
					<div className="nft__item style-2" onClick={handleClick}>

						<div className="nft__item_wrap">
							<img
								src={status.tokenURI.image}
								className="lazy nft__item_preview"
								alt=""
							/>
						</div>
						<div className="nft__item_info">
							<div>
								<h4>{status.tokenURI.name}</h4>
							</div>
							<div className="nft__item_click">
								<span></span>
							</div>
							<div className="nft__item_price">{NFTDATAS[tokenid].price} IVX</div>
							<div className="nft__item_action">
								<div>Place a bid</div>
							</div>
							<div className="nft__item_like">
								<i className="fa fa-heart"></i>
								<span>{30}</span>
							</div>
						</div>
					</div>
				</div>)
			}
		</div>
	);
}

export default Items;
