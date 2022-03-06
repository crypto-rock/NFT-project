import React, { useState, useEffect } from "react";
import { useWallet } from "use-wallet";

import { davatar } from "davatar";
import { Grid } from '@material-ui/core';
import Item from "../item";
import BlankItem from "../item/blankItem";
import { useBlockchainContext } from "../../contexts";

function Collection(props) {
  const [state, { GetUserNFTs, GetOnsaledUserNFTs }] = useBlockchainContext();
  const [status, setStatus] = useState({ Loading: true, data: {} ,onsaled :{}, state:"own"})

  const wallet = useWallet();

  const imageDataUrl50 = davatar.generate({
    size: 200,
    text: "Atari Player",
    textColor: "White",
    backgroundColor: "Red"
  });

  // styled data
  useEffect(() => {
    if (!state.Loading) {
      setStatus(
        {
          ...status,
          data: GetUserNFTs(),
          onsaled: GetOnsaledUserNFTs()
        })
    }
  }, [state.NFTDATAS, state.Loading])

  // avatar
  const [username, setUsername] = useState("Atari Player");
  const [avataImage, setAvataImage] = useState(imageDataUrl50)

  useEffect(() => {
    if (wallet.status === "connected") {
      var userStyledAddress = wallet.account.slice(0, 5) + " " + wallet.account.slice(-5);
      setUsername(userStyledAddress);

      const avataImage = davatar.generate({
        size: 200,
        text: wallet.account.slice(0, 5) + " " + wallet.account.slice(-5),
        textColor: "White",
        backgroundColor: "Red"
      });
      setAvataImage(avataImage)
    }
  }, [wallet.status])


  return (
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>

      <section
        id="profile_banner"
        aria-label="section"
        className="text-light"
      ></section>

      <section aria-label="section" className="d_coll no-top">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="d_profile">
                <div className="profile_avatar">
                  <div className="d_profile_img">
                    <img src={avataImage} alt="" />
                    <i className="fa fa-check"></i>
                  </div>

                  <div className="profile_name">
                    <h4>
                      {username}
                      <div className="clearfix"></div>
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="de_tab tab_simple">
                <ul className="de_nav">
                  <li className={status.state=="own"?"active":""} onClick = {()=>{setStatus({...status, state : "own"})}}>
                    <span>Owned</span>
                  </li>
                  <li className={status.state!="own"?"active":""} onClick = {()=>{setStatus({...status, state : "onSaled"})}}>
                    <span>On Sale</span>
                  </li>
                </ul>

                <div className="row wow fadeIn">
                  <div className="de_tab_content">
                    <Grid container>
                      {
                        state.Loading ? (
                          <Grid item xs={12} sm={6} md={3}>
                            <BlankItem />
                          </Grid>
                        ) : (Object.keys(status.state == "own"? status.data:status.onsaled).length === 0) ?
                          (
                            <Grid item xs={12} sm={12} md={12}>
                              <div className="text-center">
                                <h3>No items</h3>
                              </div>
                            </Grid>
                          ) :
                          Object.keys(status.state == "own"? status.data:status.onsaled).map((tokenid, index) => {
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Collection;
