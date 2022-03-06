import React, { useState, useEffect } from "react";
import { Grid } from '@material-ui/core';
import Item from "../item";
import BlankItem from "../item/blankItem";

import Bider from "./TabItem";
import { useBlockchainContext } from "../../contexts";

const bids = [
    {
        imgUrl: "images/author/author-1.jpg",
        state: "Bid accepted",
        price: "0.005 ETH",
        author: "Monica Lucas",
        time: "6/15/2021, 3:20 AM",
    },
];

const historys = [
    {
        imgUrl: "images/author/author-5.jpg",
        state: "Bid",
        price: "0.005 ETH",
        author: "Jimmy Wright",
        time: "6/14/2021, 6:40 AM",
    },
];

function ItemDetail(props) {

    return (
        <div className="no-bottom no-top" id="content">
            <div id="top"></div>

            <section aria-label="section" className="mt90 sm-mt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 text-center">
                            <img
                                src="images/items/static-7.jpg"
                                className="img-fluid img-rounded mb-sm-30"
                                alt=""
                            />
                        </div>
                        <div className="col-md-6">
                            <div className="item_info">
                                <h2>Atari Casino NFT</h2>
                                <div className="item_info_counts">
                                    <div className="item_info_type">
                                        <i className="fa fa-image"></i>Art
                                    </div>
                                    <div className="item_info_views">
                                        <i className="fa fa-eye"></i>250
                                    </div>
                                    <div className="item_info_like">
                                        <i className="fa fa-heart"></i>18
                                    </div>
                                </div>
                                <p>
                                    Sed ut perspiciatis unde omnis iste natus
                                    error sit voluptatem accusantium doloremque
                                    laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi
                                    architecto beatae vitae dicta sunt
                                    explicabo.
                                </p>
                                <h6>Creator</h6>
                                <div className="item_author">
                                    <div className="author_list_pp">
                                        <img
                                            className="lazy"
                                            src="images/icicb-landing/atariLogo.png"
                                            alt=""
                                        />
                                        <i className="fa fa-check"></i>
                                    </div>
                                    <div className="author_list_info">
                                        <a href="03_grey-author.html">
                                            Atari Casino World
                                        </a>
                                    </div>
                                </div>
                                <div className="spacer-40"></div>
                                <div className="de_tab tab_simple">
                                    <ul className="de_nav">
                                        <li className="active">
                                            <span>Bids</span>
                                        </li>
                                        <li>
                                            <span>History</span>
                                        </li>
                                    </ul>
                                    <div className="de_tab_content">
                                        <div className="tab-1">
                                            <div className="scroll-tab">
                                                {bids.map((v, index) => {
                                                    return (
                                                        <Bider
                                                            key={index}
                                                            imgUrl={v.imgUrl}
                                                            state={v.state}
                                                            price={v.price}
                                                            author={v.author}
                                                            time={v.time}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="tab-2">
                                            <div className="scroll-tab">
                                                {historys.map((v, index) => {
                                                    return (
                                                        <Bider
                                                            key={index}
                                                            imgUrl={v.imgUrl}
                                                            state={v.state}
                                                            price={v.price}
                                                            author={v.author}
                                                            time={v.time}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="spacer-10"></div>
                                    <button className="btn-main btn-lg btn-dark">
                                        Buy Now
                                    </button>
                                    &nbsp; &nbsp; &nbsp;
                                    <button className="btn-main btn-lg btn-dark">
                                        Place a Bid
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="spacer-single"></div>
                        <h2 className="style-2">Related Items</h2>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ItemDetail;
