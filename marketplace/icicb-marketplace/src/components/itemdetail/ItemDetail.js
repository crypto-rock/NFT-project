import React, { useState, useEffect } from "react";
import { Grid } from '@material-ui/core';
import Item from "../item";
import BlankItem from "../item/blankItem";
import TempItemDetail from "./tempDetail";
import { useHistory } from 'react-router-dom';

import Bider from "./TabItem";
import { useBlockchainContext } from "../../contexts";
import { delay } from "../../utils/utils";
import AlertModal from "../alertModal";
import OnsaleCard from "./onsaleCard";
import { davatar } from "davatar";

const bids = [
    // {
    //     imgUrl: "images/author/author-1.jpg",
    //     state: "Bid accepted",
    //     price: "0.005 ETH",
    //     author: "Monica Lucas",
    //     time: "6/15/2021, 3:20 AM",
    // },
];

const historys = [
    // {
    //     imgUrl: "images/author/author-5.jpg",
    //     state: "Bid",
    //     price: "0.005 ETH",
    //     author: "Jimmy Wright",
    //     time: "6/14/2021, 6:40 AM",
    // },
];

const UserCard = (props) => {
    const { role, name } = props;
    var styledName = name ? name.slice(0, 5) + "..." + name.slice(-5) : "";
    return (
        <div>
            <h6>{role}</h6>
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
                    <a >
                        {styledName}
                    </a>
                </div>
            </div>
        </div>
    )
}
//action card
const ActionCard = (props) => {
    console.log("props", props)
    const { action1, action2 } = props;
    return (
        <Grid container>
            <Grid item xs={6} sm={6} md={6} >
                <button className="action_btn" onClick={action1.action} disabled={action1.disabled}>
                    {action1.name}
                </button>
            </Grid>
            <Grid item xs={6} sm={6} md={6} >
                <button className="action_btn" onClick={action2.action} disabled={action2.disabled}>
                    {action2.name}
                </button>
            </Grid>
        </Grid>
    )
}

const NFTSTATUS = {
    onPresale: "PRESALE",
    onMarket: "ONMARKET",
    onUser: "ONUSER",
    onOwn: "ONOWN"
}

function ItemDetail(props) {

    const history = useHistory();
    var { id } = props.match.params;

    const [state, {
        buyBaseNFT,
        buyNFT,
        bidNFT,
        approveNFT,
        onSaleNFT,
        cancelOrder,
        cancelBid,
        acceptBid,
        marketPlaceContract,
        approveAtari,

        checkNFTApproval
    }] = useBlockchainContext();
    const NFTaddress = state.supportedNFTs[0];

    const [status, setStatus] = useState({
        loading: true,
        marketData: false,
        bidflag: true,
        relatedItems: [0, 1, 2, 3],
        NFTtype: "presale",
        actionLoading: false,
        bids: []
    });

    // type : onOwn. check NFT allowance
    const [NFTApproval, setNFTApproval] = useState(false);
    useEffect(() => {
        checkNFTApproval(NFTaddress, id).then((res) => {
            setNFTApproval(res)
        })
    }, [])

    useEffect(() => {
        console.log("status :", status);
    }, [status])
    // initial info
    useEffect(() => {
        try {
            // console.log(state.NFTDATAS[NFTaddress][id]);
            var tokenInfo = state.NFTDATAS[NFTaddress][id];
            var tokenURI = JSON.parse(tokenInfo.tokenURI);
            console.log(tokenInfo, tokenURI.image);

            var marketInfo = state.MARKETDATAS && state.MARKETDATAS[NFTaddress] ? state.MARKETDATAS[NFTaddress][id] : null;

            // check status
            var nftStatus = NFTSTATUS.onPresale;
            switch (tokenInfo.owner.toUpperCase()) {
                case marketPlaceContract.address.toUpperCase():
                    nftStatus = NFTSTATUS.onMarket;
                    break;
                case state.user.toUpperCase():
                    nftStatus = NFTSTATUS.onOwn;
                    break;
                case NFTaddress.toUpperCase():
                    nftStatus = NFTSTATUS.onPresale;
                    break;
                default:
                    nftStatus = NFTSTATUS.onUser;
            }

            if (!!marketInfo)
                setStatus({
                    ...status,
                    ...tokenURI,
                    owner: marketInfo.orders.seller,
                    creator: tokenInfo.creator,
                    price: String(marketInfo.orders.price),
                    loading: false,
                    nftStatus: nftStatus,

                    bids: [marketInfo.bids],
                    orders: marketInfo.orders,
                });
            else
                setStatus({
                    ...status,
                    ...tokenURI,
                    owner: tokenInfo.owner,
                    creator: tokenInfo.creator,
                    price: tokenInfo.price,
                    loading: false,
                    nftStatus: nftStatus,
                    bids: [],
                    orders: []
                });


        } catch (err) {
            console.log(err);
            history.push(`/marketplace`);
        }
    }, [state, id]);

    const ActionHandler = () => {
        var Action1 = {};
        var Action2 = {};
        console.log("status.nftStatus", status.nftStatus);

        // presale card actions
        if (status.nftStatus == NFTSTATUS.onPresale) {
            var allowanceFlag = Number(status.price) <= Number(state.atariNFTallowance);
            Action1 = {
                name: "Approve IVEX",
                action: async () => {
                    setStatus({ ...status, actionLoading: true });
                    await approveAtari(NFTaddress, status.price * 10);
                    setStatus({ ...status, actionLoading: false });
                },
                disabled: allowanceFlag
            }
            Action2 = {
                name: "Buy now",
                action: async () => {
                    setStatus({ ...status, actionLoading: true });
                    await buyBaseNFT(NFTaddress, id);
                    setStatus({ ...status, actionLoading: false });
                    await delay(2000);
                    history.push(`/collections`);
                },
                disabled: !allowanceFlag
            }
        }

        //my collections actions
        if (status.nftStatus == NFTSTATUS.onOwn) {
            Action1 = {
                name: "Approve",
                action: async () => {
                    setStatus({ ...status, actionLoading: true });
                    await approveNFT(NFTaddress, id);
                    var res = await checkNFTApproval(NFTaddress, id)
                    setNFTApproval(res);
                    setStatus({ ...status, actionLoading: false });
                },
                disabled: NFTApproval
            };
            Action2 = {
                name: "Onsale",
                action: async () => {
                    setOnsaleAction({
                        name: "Onsale",
                        action: async (price, endTime) => {
                            await onSaleNFT(NFTaddress, id, String(price), endTime);
                            await delay(2000);
                            setOnsaleAlertOpen(false);
                            history.push(`/marketplace`);
                        }
                    })
                    setOnsaleAlertOpen(true);
                },
                disabled: !NFTApproval
            }
        }

        //marketplace actions
        if (status.nftStatus == NFTSTATUS.onMarket) {
            if (status.owner.toUpperCase() == state.user.toUpperCase()) {
                console.log("data compare", new Date().getTime() / 1000, Number(status.bids[0].expiresAt));
                var dataValidate = (new Date()).getTime() / 1000 < Number(status.bids[0].expiresAt);
                Action1 = {
                    name: "Accept Bid",
                    action: async () => {
                        setStatus({ ...status, actionLoading: true });
                        console.log(NFTaddress, status.bids[0].price);
                        await acceptBid(NFTaddress, id, status.bids[0].price);
                        setStatus({ ...status, actionLoading: false });
                    },
                    disabled: !dataValidate
                }
                Action2 = {
                    name: "Cancel Order",
                    action: async () => {
                        setStatus({ ...status, actionLoading: true });
                        await cancelOrder(NFTaddress, id);
                        setStatus({ ...status, actionLoading: false });
                        await delay(2000);
                        history.push(`/collections`);
                    },
                    disabled: false
                }
            }
            else {
                var allowanceFlag = Number(status.price) <= Number(state.marketallowance);
                Action1 = !allowanceFlag ? {
                    name: "Approve",
                    action: async () => {
                        setStatus({ ...status, actionLoading: true });
                        await approveAtari(marketPlaceContract.address, status.price * 10);
                        setStatus({ ...status, actionLoading: false });
                    },
                    disabled: NFTApproval
                } : {
                    name: "Buy",
                    action: async () => {
                        setStatus({ ...status, actionLoading: true });
                        await buyNFT(NFTaddress, id, status.price);
                        setStatus({ ...status, actionLoading: false });
                        await delay(2000);
                        history.push(`/collections`);
                    },
                    disabled: NFTApproval
                };

                Action2 = {
                    name: "Place Bid",
                    action: async () => {
                        setOnsaleAction({
                            name: "Place Bid",
                            action: async (price, endTime) => {
                                await bidNFT(NFTaddress, id, String(price), endTime);
                                await delay(2000);
                                setOnsaleAlertOpen(false);
                            }
                        })
                        setOnsaleAlertOpen(true);
                    },
                    disabled: !allowanceFlag
                }
            }
        }

        //my collections actions
        if (status.nftStatus == NFTSTATUS.onUser) {
            Action1 = {
                name: "Buy",
                action: async () => {
                },
                disabled: false
            };
            Action2 = {
                name: "Place Bid",
                action: async () => {
                },
                disabled: false
            }
        }

        return (
            <ActionCard action1={Action1} action2={Action2} />
        )
    };

    // alertCard data
    const [onsaleAlertOpen, setOnsaleAlertOpen] = useState(false);
    const [onsaleAction, setOnsaleAction] = useState({});

    const handleOnsaleClose = () => {
        setOnsaleAlertOpen(false);
    }

    return (
        <div>
            <AlertModal title={onsaleAction.name} info={<OnsaleCard action={onsaleAction} />} open={onsaleAlertOpen} handleClose={handleOnsaleClose} />
            {status.loading ? <TempItemDetail /> :
                <div className="no-bottom no-top" id="content">
                    <div id="top"></div>

                    <section aria-label="section" className="mt90 sm-mt-0">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 text-center">
                                    <img
                                        src={status.image}
                                        className="img-fluid img-rounded mb-sm-30"
                                        alt=""
                                    />
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-5">
                                    <div className="item_info">
                                        <h2>{status.name}</h2>
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
                                            {status.description}
                                        </p>
                                        <UserCard role="Owner" name={status.owner} />
                                        <div className="spacer-40"></div>
                                        <h3>price {status.price} IVX</h3>
                                         <div className="de_tab tab_simple">
                                            <ul className="de_nav">
                                                <li className={status.bidflag ? "active" : ""} onClick={() => { setStatus({ ...status, bidflag: true }) }}>
                                                    <span>Bids</span>
                                                </li>
                                                <li className={!status.bidflag ? "active" : ""} onClick={() => { setStatus({ ...status, bidflag: false }) }}>
                                                    <span>History</span>
                                                </li>
                                            </ul>
                                            <div className="de_tab_content">
                                                <div className="scrollable">
                                                    {status.bidflag ? status.bids.map((v, index) => {
                                                        var bidderName = v.bidder ? v.bidder.slice(0, 5) + " " + v.bidder.slice(-5) : "Atari Player";
                                                        const imageDataUrl50 = davatar.generate({
                                                            size: 200,
                                                            text: bidderName,
                                                            textColor: "White",
                                                            backgroundColor: "Red"
                                                        });
                                                        return (
                                                            <Bider
                                                                key={index}
                                                                imgUrl={imageDataUrl50}
                                                                price={String(v.price)}
                                                                author={bidderName}
                                                                time={String(v.expiresAt)}
                                                            />
                                                        );
                                                    }) : historys.map((v, index) => {
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
                                                    })
                                                    }
                                                </div>
                                            </div>
                                            <div className="spacer-10"></div>
                                        </div>
                                        <ActionHandler />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="spacer-single"></div>
                                <h2 className="style-2">Related Items</h2>
                            </div>

                            <Grid container>
                                {
                                    state.Loading ? (
                                        <Grid item xs={12} sm={6} md={3}>
                                            <BlankItem />
                                        </Grid>
                                    ) :
                                        (status.relatedItems).map((tokenid, index) => {
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
                        </div>
                    </section>
                </div>}
        </div>
    );
}

export default ItemDetail;
