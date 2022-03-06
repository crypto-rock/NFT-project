/** @format */

import React, { useState, useEffect } from "react";
import { Grid } from '@material-ui/core';
import Item from "../item";
import BlankItem from "../item/blankItem";

import { useBlockchainContext } from "../../contexts";

function Explore() {
	const [state, { GetMarketNFTs }] = useBlockchainContext();

	const [status, setStatus] = useState({ Loading: true, data: {}, searchKey: "", styledData: {} })

	// styled data
	useEffect(() => {
		if (!state.Loading) {
			setStatus(
				{
					...status,
					data: GetMarketNFTs(),
					styledData: GetMarketNFTs(),
				})
		}
	}, [state.NFTDATAS, state.Loading])

	useEffect(() => {
		if (status.searchKey !== "") {
			var styledData = Object.fromEntries(
				Object.entries(status.data).filter(([key, NFTdata]) =>
					NFTdata.tokenURI.includes(status.searchKey)
				)
			)

			setStatus({ ...status, styledData: styledData });
		}
	}, [status.data, status.searchKey])

	const handleSearch = (e) => {
		setStatus({ ...status, searchKey: e.target.value });
	}
	return (
		<div className="no-bottom no-top" id="content">
			<div id="top"></div>

			<section id="subheader" >
				<h1>Market Place</h1>
			</section>

			<section aria-label="section">
				<div className="container">
					<div className="row wow fadeIn">
						<div className="col-lg-12">
							<div className="items_filter">
								<form
									action="blank.php"
									className="row form-dark"
									id="form_quick_search"
									name="form_quick_search">
									<div className="col text-center">
										<input
											className="form-control"
											id="name_1"
											name="name_1"
											placeholder="search item here..."
											type="text"
											onChange={handleSearch}
										/>{" "}
										<a href="#" id="btn-submit">
											<i className="fa fa-search bg-color-secondary"></i>
										</a>
										<div className="clearfix"></div>
									</div>
								</form>

								<div id="item_category" className="dropdown">
									<a href="#" className="btn-selector">
										All categories
									</a>
									{/* <ul>
										<li className="active">
											<span>All categories</span>
										</li>
										<li>
											<span>Art</span>
										</li>
										<li>
											<span>Music</span>
										</li>
										<li>
											<span>Domain Names</span>
										</li>
										<li>
											<span>Virtual World</span>
										</li>
										<li>
											<span>Trading Cards</span>
										</li>
										<li>
											<span>Collectibles</span>
										</li>
										<li>
											<span>Sports</span>
										</li>
										<li>
											<span>Utility</span>
										</li>
									</ul> */}
								</div>

								<div id="buy_category" className="dropdown">
									<a href="#" className="btn-selector">
										Buy Now
									</a>
									{/* <ul>
										<li className="active">
											<span>Buy Now</span>
										</li>
										<li>
											<span>On Auction</span>
										</li>
										<li>
											<span>Has Offers</span>
										</li>
									</ul> */}
								</div>

								<div id="items_type" className="dropdown">
									<a href="#" className="btn-selector">
										All Items
									</a>
									{/* <ul>
										<li className="active">
											<span>All Items</span>
										</li>
										<li>
											<span>Single Items</span>
										</li>
										<li>
											<span>Bundles</span>
										</li>
									</ul> */}
								</div>
							</div>
						</div>
						<Grid container>
							{
								state.Loading ? (
									<Grid item xs={12} sm={6} md={3}>
										<BlankItem />
									</Grid>
								) : Object.keys(status.styledData).length == 0 ?
									(
										<Grid item xs={12} sm={12} md={12}>
											<div className="text-center" style = {{height:"200px"}}>
												<h3>No items</h3>
											</div>
										</Grid>
									) :
									Object.keys(status.styledData).map((tokenid, index) => {
										return (
											<Grid item xs={12} sm={6} md={3} key={index}>
												<Item
													NFTaddress={state.supportedNFTs[0]}
													tokenid={tokenid}
												/>
											</Grid>
										);
									})}

						</Grid>

						{/* <div className="col-md-12 text-center">
							<a
								href="#"
								id="loadmore"
								className="btn-main wow fadeInUp lead">
								Load more
							</a>
						</div> */}
					</div>
				</div>
			</section>
		</div>
	);
}

export default Explore;
