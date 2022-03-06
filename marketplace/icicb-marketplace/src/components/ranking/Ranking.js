import React from "react";

function Ranking(props) {
  return (
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>

      <section id="subheader">
        <div className="center-y relative text-center">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>Top NFTs</h1>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="items_filter text-center">
                <div id="filter_by_duration" className="dropdown">
                  <a href="#" className="btn-selector">
                    Last 7 days
                  </a>
                  <ul>
                    <li>
                      <span>Last 24 hours</span>
                    </li>
                    <li className="active">
                      <span>Last 7 days</span>
                    </li>
                    <li>
                      <span>Last 30 days</span>
                    </li>
                    <li>
                      <span>All time</span>
                    </li>
                  </ul>
                </div>

                <div id="filter_by_category" className="dropdown">
                  <a href="#" className="btn-selector">
                    All categories
                  </a>
                  <ul>
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
                  </ul>
                </div>
              </div>

              <table className="table de-table table-rank">
                <thead>
                  <tr>
                    <th scope="col">Collection</th>
                    <th scope="col">Volume</th>
                    <th scope="col">24h %</th>
                    <th scope="col">7d %</th>
                    <th scope="col">Floor Price</th>
                    <th scope="col">Owners</th>
                    <th scope="col">Assets</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-1.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      Abstraction
                    </th>
                    <td>15,225.87</td>
                    <td className="d-plus">+87.54%</td>
                    <td className="d-plus">+309.49%</td>
                    <td>5.9</td>
                    <td>2.8k</td>
                    <td>58.5k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-2.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      Sketchify
                    </th>
                    <td>14,304.78</td>
                    <td className="d-plus">+35.11%</td>
                    <td className="d-plus">+239.83%</td>
                    <td>2.9</td>
                    <td>2.3k</td>
                    <td>28.4k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-3.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      Cartoonism
                    </th>
                    <td>13,705.58</td>
                    <td className="d-min">-33.56%</td>
                    <td className="d-plus">+307.97%</td>
                    <td>4.5</td>
                    <td>2.2k</td>
                    <td>48.8k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-4.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      Papercut
                    </th>
                    <td>12,516.75</td>
                    <td className="d-plus">+23.45%</td>
                    <td className="d-plus">+171.25%</td>
                    <td>6.3</td>
                    <td>5.3k</td>
                    <td>54.2k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-5.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      Virtuland
                    </th>
                    <td>11,586.26</td>
                    <td className="d-plus">+80.91%</td>
                    <td className="d-plus">+241.18%</td>
                    <td>2.2</td>
                    <td>1.8k</td>
                    <td>23.9k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-6.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      CoolThings
                    </th>
                    <td>10,645.96</td>
                    <td className="d-plus">+51.99%</td>
                    <td className="d-min">-29.82%</td>
                    <td>6.6</td>
                    <td>1.8k</td>
                    <td>23.6k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-7.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      DigiPunks
                    </th>
                    <td>9,219.13</td>
                    <td className="d-plus">+42.24%</td>
                    <td className="d-plus">+95.45%</td>
                    <td>1.2</td>
                    <td>3.8k</td>
                    <td>58.4k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-8.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      RockToonz
                    </th>
                    <td>8,436.15</td>
                    <td className="d-plus">+61.31%</td>
                    <td className="d-plus">+347.19%</td>
                    <td>2.4</td>
                    <td>1.4k</td>
                    <td>63.3k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-9.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      BeeFriends
                    </th>
                    <td>7,505.16</td>
                    <td className="d-plus">+64.46%</td>
                    <td className="d-plus">+240.94%</td>
                    <td>2.3</td>
                    <td>5.2k</td>
                    <td>70.3k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-10.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      Patternlicious
                    </th>
                    <td>6,593.91</td>
                    <td className="d-min">-33.78%</td>
                    <td className="d-plus">+82.32%</td>
                    <td>4.5</td>
                    <td>6.5k</td>
                    <td>53.3k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-11.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      FlyingFox
                    </th>
                    <td>5,605.97</td>
                    <td className="d-plus">+48.67%</td>
                    <td className="d-plus">+101.33%</td>
                    <td>4.6</td>
                    <td>5.1k</td>
                    <td>36.2k</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div className="coll_list_pp">
                        <img
                          className="lazy"
                          src="images/author/author-12.jpg"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </div>
                      Autoglyphs
                    </th>
                    <td>4,904.27</td>
                    <td className="d-plus">+86.15%</td>
                    <td className="d-plus">+391.49%</td>
                    <td>4.5</td>
                    <td>6.2k</td>
                    <td>21.1k</td>
                  </tr>
                </tbody>
              </table>

              <div className="spacer-double"></div>

              <ul className="pagination justify-content-center">
                <li className="active">
                  <a href="#">1 - 20</a>
                </li>
                <li>
                  <a href="#">21 - 40</a>
                </li>
                <li>
                  <a href="#">41 - 60</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Ranking;
