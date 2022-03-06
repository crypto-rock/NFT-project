import React from "react";
import { Link } from "react-router-dom";

function CreateCollection(props) {
  return (
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>

      <section id="subheader">
        <div className="center-y relative text-center">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>Create Collectible</h1>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="section">
        <div className="container">
          <div className="row wow fadeIn">
            <div className="col-md-6 offset-md-3">
              <p>
                Choose "Single" if you want your collectible to be one of a kind
                or "Multiple" if you want to sell one collectible times
              </p>
              <Link to="create-single-collection" className="opt-create">
                <img src="images/misc/retro-coll-single.png" alt="" />
                <h3>Single</h3>
              </Link>
              <Link to="create-multi-collection" className="opt-create">
                <img src="images/misc/retro-coll-multiple.png" alt="" />
                <h3>Multiple</h3>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreateCollection;
