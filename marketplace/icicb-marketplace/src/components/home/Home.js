/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";

import Card from "../card/card";

const Cards = [
  {
    url: "images/icicb-landing/nft1.png",
    title: "Apartments Houses/Land",
    token: "Sell items lorem ipsum",
  },
  {
    url: "images/icicb-landing/nft2.png",
    title: "Shops",
    token: "Sell items lorem ipsum",
  },
  {
    url: "images/icicb-landing/nft3.png",
    title: "Clothing",
    token: "Sell items lorem ipsum",
  },
  {
    url: "images/icicb-landing/nft4.png",
    title: "Vehicles",
    token: "Sell items lorem ipsum",
  },
  {
    url: "images/icicb-landing/nft1.png",
    title: "Apartments Houses/Land",
    token: "Sell items lorem ipsum",
  },
  {
    url: "images/icicb-landing/nft2.png",
    title: "Shops",
    token: "Sell items lorem ipsum",
  },
  {
    url: "images/icicb-landing/nft3.png",
    title: "Clothing",
    token: "Sell items lorem ipsum",
  },
  {
    url: "images/icicb-landing/nft4.png",
    title: "Vehicles",
    token: "Sell items lorem ipsum",
  },
];

function Home() {
  return (
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>
      <section
        id="section-hero"
        aria-label="section"
        className="pt20 pb20 vh-100"
        style={{
          background:
            "url(images/icicb-landing/background.jpg) bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}>
        <div id="particles-js"></div>
        <div className="v-center">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-12 text-center">
                <div className="spacer-single"></div>
                <h6
                  className="wow fadeInUp"
                  data-wow-delay=".5s">
                  {/* <span className="text-uppercase id-color-2">
                    Gigaland Market
                  </span> */}
                </h6>
                <div className="spacer-10"></div>
                <h1
                  className="wow fadeInUp"
                  data-wow-delay=".75s"
                  style={{ fontSize: "90px" }}>
                  Welcome to our virtual game
                </h1>

                <p
                  className="wow fadeInUp lead"
                  data-wow-delay="1s"
                  style={{ fontSize: "30px" }}>
                  ICICB VIRTUAL WORLD WITH ATARI CASINO
                </p>

                <div className="spacer-double"></div>

                <Link
                  to="/marketplace"
                  className="btn-main wow fadeInUp lead enterbtn"
                  data-wow-delay="1.25s">
                  Enter
                </Link>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-collections" className="pt30 pb30">
        <div className="container">

          <div className="spacer-double"></div>

          <div className="row wow fadeIn">
            <div className="col-lg-12 text-center">
              <h2 className="style-2">ICICB VIRTUAL WORLD MAP</h2>
            </div>
            <div
              id="collection-carousel-alt"
              className="owl-carousel wow fadeIn">
              {Cards.map((i,index) => {
                return (
                  <Card
                    key={index}
                    imgUrl={i.url}
                    title={i.title}
                    tokenName={i.token}
                  />
                );
              })}
            </div>
          </div>

          <div className="spacer-double"></div>

          <div className="row wow zoomIn align-items-center">
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="images/icicb-landing/landing_1.jpg"
                  alt=""
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="images/icicb-landing/landing_2.jpg"
                  alt=""
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="images/icicb-landing/landing_3.jpg"
                  alt=""
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="images/icicb-landing/landing_4.jpg"
                  alt=""
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="images/icicb-landing/landing_5.jpg"
                  alt=""
                />
              </Carousel.Item>
            </Carousel>
          </div>

          <div className="spacer-double"></div>

          <div
            className="row wow fadeInRight"
            style={{ position: "relative" }}>
            <img src="images/icicb-landing/world.png" alt="" />
            <div className="go-world">
              <h2>
                Experience a world of unlimited fun and
                potential
              </h2>
              <button>ENTER OUR WORLD</button>
            </div>
          </div>

          <div className="spacer-double"></div>
          <div className="spacer-double"></div>

          <div className="row wow fadeInDown align-items-center">
            <div className="col-lg-12 text-center">
              <h2 className="style-2">ICICB VIRTUAL WORLD MAP</h2>
            </div>

            <div className="spacer-single"></div>

            <div className="col-lg-12">
              <img
                src="images/icicb-landing/virtualworld.png"
                alt=""
                style={{
                  width: "100%",
                  boxShadow: "0 0 20px #ddd",
                  borderRadius: "20px",
                }}
              />
            </div>
          </div>

          <div className="spacer-double"></div>
        </div>
      </section>

      <div className="spacer-single"></div>

      <section id="section-text" className="no-top">
        <div className="container">
          <div className="row wow zoomIn">
            <div className="col-lg-12 text-center">
              <h2 className="style-2">ROADMAP</h2>
            </div>

            <div className="col-md-12">
              <img
                src="images/icicb-landing/roadmap.png"
                alt=""
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
