import React from "react";
import withRouter from "../../withRouter";
import { useNavigate } from "react-router-dom";
import "./auctionhouse.styles.scss";

const AuctionhouseItem = (props) => {
  const navigate = useNavigate();

  const { tokenname, tokenaddress } = props;

  return (
    <div className="col-md-3 col-sm-6 col-xs-12">
      <div className="auctionhouseitem-product">
        <div
          className="auctionhouseitem-image"
          onClick={() => navigate(`/auctionhouse/collection/${tokenaddress}`)}
        >
          <img src="../../assets/img/bookmark.png" alt="product" />
        </div>
        <div className="auctionhouseitem-body">
          <div className="item-title">{tokenname}</div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(AuctionhouseItem);
