
function Items() {
	return (
		<div className="d-item">
			<div className="nft__item style-2">

				<div className="nft__item_wrap">
					<img
						src="/images/icicb-landing/nft1.png"
						className="load-thumb tiny lazy nft__item_preview"
						alt="thumb"
					/>
				</div>
				<div className="nft__item_info">
					<div>
						<h4>ATARI CASINO NFT</h4>
					</div>
					<div className="nft__item_click">
						<span></span>
					</div>
					<div className="nft__item_price">{0} IVX</div>
					<div className="nft__item_action">
						<div>Place a bid</div>
					</div>
					<div className="nft__item_like">
						<i className="fa fa-heart"></i>
						<span>{30}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Items;
