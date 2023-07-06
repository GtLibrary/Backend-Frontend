import React from "react";
import withRouter from "../../withRouter";
import { useNavigate } from "react-router-dom";
import "./auctionhouse.styles.scss";

const AuctionhouseItem = (props) => {
  const navigate = useNavigate();

  const { title, image_url, author_name, id } = props;

  return (
    <div className="col-md-3 col-sm-6 col-xs-12">
      <div className="featured-product">
        <div
          className="featured-image"
          onClick={() => navigate(`/auctionhouse/collection/${id}`)}
        >
          <img src={image_url} alt="product" />
        </div>
        <div className="featured-body">
          <div className="item-title">{title}</div>
          {/* <p className="item-author">By {author_name}</p> */}
        </div>
      </div>
    </div>
  );
};

export default withRouter(AuctionhouseItem);
