import React from "react";

function TabItem(props) {
    const { imgUrl, price, author, time } = props;

    return (
        <div className = "Bidder_list">
            <div className="p_list_pp">
                <img src={imgUrl} alt="" />
                <i className="fa fa-check"></i>
            </div>
            <div className="p_list_info">
                <b> {price} IVX</b>
                <span>
                    by <b>{author}</b> at {String(new Date(time * 1000).toLocaleDateString("en-US"))}
                </span>
            </div>
        </div>
    );
}

export default TabItem;
