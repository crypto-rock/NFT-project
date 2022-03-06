import React from "react";

function CreateSingleCollection(props) {
  return (
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>

      <section id="subheader">
        <div className="center-y relative text-center">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>Create Single Collectible</h1>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="section">
        <div className="container">
          <div className="row wow fadeIn">
            <div className="col-lg-7 offset-lg-1">
              <form
                id="form-create-item"
                className="form-border"
                method="post"
                action="email.php"
              >
                <div className="field-set">
                  <h5>Upload file</h5>

                  <div className="d-create-file">
                    <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                    <input
                      type="button"
                      id="get_file"
                      className="btn-main"
                      value="Browse"
                    />
                    <input type="file" id="upload_file" />
                  </div>

                  <div className="spacer-40"></div>

                  <h5>Select method</h5>
                  <div className="de_tab tab_methods">
                    <ul className="de_nav">
                      <li className="active">
                        <span>
                          <i className="fa fa-tag"></i>Fixed price
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa fa-hourglass-1"></i>Timed auction
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa fa-users"></i>Open for bids
                        </span>
                      </li>
                    </ul>

                    <div className="de_tab_content">
                      <div id="tab_opt_1">
                        <h5>Price</h5>
                        <input
                          type="text"
                          name="item_price"
                          id="item_price"
                          className="form-control"
                          placeholder="enter price for one item (ETH)"
                        />
                      </div>

                      <div id="tab_opt_2">
                        <h5>Minimum bid</h5>
                        <input
                          type="text"
                          name="item_price_bid"
                          id="item_price_bid"
                          className="form-control"
                          placeholder="enter minimum bid"
                        />

                        <div className="spacer-20"></div>

                        <div className="row">
                          <div className="col-md-6">
                            <h5>Starting date</h5>
                            <input
                              type="date"
                              name="bid_starting_date"
                              id="bid_starting_date"
                              className="form-control"
                              min="1997-01-01"
                            />
                          </div>
                          <div className="col-md-6">
                            <h5>Expiration date</h5>
                            <input
                              type="date"
                              name="bid_expiration_date"
                              id="bid_expiration_date"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div id="tab_opt_3"></div>
                    </div>
                  </div>

                  <div className="spacer-20"></div>

                  <div className="switch-with-title">
                    <h5>
                      <i className="fa fa- fa-unlock-alt id-color-2 mr10"></i>
                      Unlock once purchased
                    </h5>
                    <div className="de-switch">
                      <input
                        type="checkbox"
                        id="switch-unlock"
                        className="checkbox"
                      />
                      <label for="switch-unlock"></label>
                    </div>
                    <div className="clearfix"></div>
                    <p className="p-info">
                      Unlock content after successful transaction.
                    </p>

                    <div className="hide-content">
                      <input
                        type="text"
                        name="item_unlock"
                        id="item_unlock"
                        className="form-control"
                        placeholder="Access key, code to redeem or link to a file..."
                      />
                    </div>
                  </div>

                  <div className="spacer-20"></div>

                  <h5>Choose collection</h5>
                  <p className="p-info">
                    This is the collection where your item will appear.
                  </p>

                  <div id="item_collection" className="dropdown fullwidth mb20">
                    <a href="#" className="btn-selector">
                      Select Collection
                    </a>
                    <ul>
                      <li>
                        <span>Abstraction</span>
                      </li>
                      <li>
                        <span>Patternlicious</span>
                      </li>
                      <li>
                        <span>Skecthify</span>
                      </li>
                      <li>
                        <span>Cartoonism</span>
                      </li>
                      <li>
                        <span>Virtuland</span>
                      </li>
                      <li>
                        <span>Papercut</span>
                      </li>
                    </ul>
                  </div>

                  <div className="spacer-20"></div>

                  <h5>Title</h5>
                  <input
                    type="text"
                    name="item_title"
                    id="item_title"
                    className="form-control"
                    placeholder="e.g. 'Crypto Funk"
                  />

                  <div className="spacer-20"></div>

                  <h5>Description</h5>
                  <textarea
                    data-autoresize
                    name="item_desc"
                    id="item_desc"
                    className="form-control"
                    placeholder="e.g. 'This is very limited item'"
                  ></textarea>

                  <div className="spacer-20"></div>

                  <h5>Royalties</h5>
                  <input
                    type="text"
                    name="item_royalties"
                    id="item_royalties"
                    className="form-control"
                    placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%"
                  />

                  <div className="spacer-single"></div>

                  <input
                    type="button"
                    id="submit"
                    className="btn-main"
                    value="Create Item"
                  />
                  <div className="spacer-single"></div>
                </div>
              </form>
            </div>

            <div className="col-lg-3 col-sm-6 col-xs-12">
              <h5>Preview item</h5>
              <div className="nft__item style-2">
                <div
                  className="de_countdown"
                  data-year="2021"
                  data-month="11"
                  data-day="16"
                  data-hour="8"
                ></div>
                <div className="author_list_pp">
                  <a href="#">
                    <img
                      className="lazy"
                      src="images/author/author-1.jpg"
                      alt=""
                    />
                    <i className="fa fa-check"></i>
                  </a>
                </div>
                <div className="nft__item_wrap">
                  <a href="#">
                    <img
                      src="images/collections/coll-item-3.jpg"
                      id="get_file_2"
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </a>
                </div>
                <div className="nft__item_info">
                  <a href="#">
                    <h4>Pinky Ocean</h4>
                  </a>
                  <div className="nft__item_click">
                    <span></span>
                  </div>
                  <div className="nft__item_price">
                    0.08 ETH<span>1/20</span>
                  </div>
                  <div className="nft__item_action">
                    <a href="#">Place a bid</a>
                  </div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>50</span>
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

export default CreateSingleCollection;
