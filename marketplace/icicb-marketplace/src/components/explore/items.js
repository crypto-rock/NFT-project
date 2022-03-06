/** @format */

import React from "react";
import { Link } from "react-router-dom";

import { useBlockchainContext } from "../../contexts";

function Items(props) {
    const { NFTaddress, tokenid } = props;
    const [state] = useBlockchainContext();

    var NFTDATAS = state.NFTDATAS[NFTaddress];

    var tokenURI =
        !NFTDATAS || !NFTDATAS[tokenid]
            ? ""
            : JSON.parse(NFTDATAS[tokenid].tokenURI);

    return (
        <div>
            {!NFTDATAS || !NFTDATAS[tokenid] ? (
                ""
            ) : (
                <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div className="nft__item style-2">
                        <div
                            className="de_countdown"
                            data-year="2021"
                            data-month="11"
                            data-day="26"
                            data-hour="20"
                        ></div>

                        <div className="nft__item_wrap">
                            <div className="nft__item_extra">
                                <div className="nft__item_buttons">
                                    <button>Buy Now</button>
                                    <div className="nft__item_share">
                                        <h4>Share</h4>
                                        <a href="#" target="_blank">
                                            <i className="fa fa-facebook fa-lg"></i>
                                        </a>
                                        <a href="#" target="_blank">
                                            <i className="fa fa-twitter fa-lg"></i>
                                        </a>
                                        <a href="mailto:?subject=I wanted you to see this site&amp;body=Check out this site https://gigaland.io">
                                            <i className="fa fa-envelope fa-lg"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <img
                                    src={tokenURI.image}
                                    className="lazy nft__item_preview"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="nft__item_info">
                            <div>
                                <h4>{tokenURI.name}</h4>
                            </div>
                            <div className="nft__item_click">
                                <span></span>
                            </div>
                            <div className="nft__item_price">
                                {NFTDATAS[tokenid].price} IVX
                            </div>
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
            )}
        </div>
    );
}

export default Items;
