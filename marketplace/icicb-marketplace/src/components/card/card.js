/** @format */

import React from "react";
import { Link } from "react-router-dom";

function Card(props) {
	const { imgUrl, title, tokenName } = props;
	return (
		<div className="nft_coll style-2">
			<div className="nft_wrap">
				<Link to="/collections">
					<img src={imgUrl} className="lazy img-fluid" alt="" />
				</Link>
			</div>

			<div className="spacer-single"></div>

			<div className="nft_coll_info">
				<Link to="/collections">
					<h4>{title}</h4>
				</Link>
				<span>{tokenName}</span>
			</div>
		</div>
	);
}

export default Card;
