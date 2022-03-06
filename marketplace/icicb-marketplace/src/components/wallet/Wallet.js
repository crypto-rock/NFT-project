import React from "react";

function Wallet(props) {
  return (
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>

      <section id="subheader" className="text-light">
        <div className="center-y relative text-center">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>Wallet</h1>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="section">
        <div className="container">
          <div className="row">
            <div className="spacer-double"></div>
            <div className="col-lg-3 mb30">
              <div className="box-url" >
                <span className="box-url-label">Most Popular</span>
                <img src="images/wallet/1.png" alt="" className="mb20" />
                <h4>Metamask</h4>
                <p>
                  Start exploring blockchain applications in seconds. Trusted by
                  over 1 million users worldwide.
                </p>
              </div>
            </div>

            <div className="col-lg-3 mb30">
              <div className="box-url" >
                <img src="images/wallet/2.png" alt="" className="mb20" />
                <h4>Bitski</h4>
                <p>
                  Bitski connects communities, creators and brands through
                  unique, ownable digital content.
                </p>
              </div>
            </div>

            <div className="col-lg-3 mb30">
              <div className="box-url" >
                <img src="images/wallet/3.png" alt="" className="mb20" />
                <h4>Fortmatic</h4>
                <p>
                  Let users access your Ethereum app from anywhere. No more
                  browser extensions.
                </p>
              </div>
            </div>

            <div className="col-lg-3 mb30">
              <div className="box-url" >
                <img src="images/wallet/4.png" alt="" className="mb20" />
                <h4>WalletConnect</h4>
                <p>
                  Open source protocol for connecting decentralised applications
                  to mobile wallets.
                </p>
              </div>
            </div>
{/* 
            <div className="col-lg-3 mb30">
              <div className="box-url" >
                <img src="images/wallet/5.png" alt="" className="mb20" />
                <h4>Coinbase Wallet</h4>
                <p>
                  The easiest and most secure crypto wallet. ... No Coinbase
                  account required.
                </p>
              </div>
            </div>

            <div className="col-lg-3 mb30">
              <div className="box-url" >
                <img src="images/wallet/6.png" alt="" className="mb20" />
                <h4>Arkane</h4>
                <p>
                  Make it easy to create blockchain applications with secure
                  wallets solutions.
                </p>
              </div>
            </div>

            <div className="col-lg-3 mb30">
              <div className="box-url" >
                <img src="images/wallet/7.png" alt="" className="mb20" />
                <h4>Authereum</h4>
                <p>
                  Your wallet where you want it. Log into your favorite dapps
                  with Authereum.
                </p>
              </div>
            </div>

            <div className="col-lg-3 mb30">
              <div className="box-url" >
                <span className="box-url-label">Most Simple</span>
                <img src="images/wallet/8.png" alt="" className="mb20" />
                <h4>Torus</h4>
                <p>
                  Open source protocol for connecting decentralised applications
                  to mobile wallets.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Wallet;
