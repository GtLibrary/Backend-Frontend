import React from "react";
import { useNavigate } from "react-router-dom";
import "./nftitem.styles.scss";

const Nftitem = (props) => {
  const { data } = props;
  const navigate = useNavigate();

  return (
    <div className="nft-item-wrapper col-md-3">
      <div className="nft-item" onClick={() => {
        navigate(`/auctionhouse/detail/${data.tokenaddress}/${data.tokenid}`);
      }}
         style={{ border: data.token_price > 0 ? '5px solid green' : '' }}
	  >
        <div className="nft-card-img">
          <img src="../../../assets/img/bookmark.png" alt=""></img>
        </div>
        <div className="nft-card-content">
          {/* <p>{data.tokenname}</p> */}
          <div className="detail-info">
            <p>{data.tokenname} #{data.tokenid}</p>
            <p className="price">{data.token_price} CC</p>
          </div>
          <div className="owner-detail">
            <p>Owner: {data.token_owner}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nftitem;
