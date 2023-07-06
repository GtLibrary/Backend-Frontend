import React, { useState, useEffect } from "react";
import axios from "axios";
import "./nftitem.styles.scss";

const Nftitem = (props) => {
  const [products, setProducts] = useState([]);
  const { uri, symbol } = props;

  console.log(symbol);

  const getBooklists = async () => {
    // const { data } = await axios
    //     .get(process.env.REACT_APP_API + 'getbooklist')
    // setProducts(data)
  };

  useEffect(() => {
    getBooklists();
  }, []);

  return (
    <div className="nft-item-wrapper col-md-3">
      <div className="nft-item">
        <div className="nft-card-img">
          <img src="../../../assets/img/bookmark.png" alt=""></img>
        </div>
        <div className="nft-card-content">
          <p>{symbol}</p>
          <p>lajdf aldsfjlkasjdfiasdjfoadf afaosdifjadf asdfoasdfa sdfiajo</p>
        </div>
        <div className="nft-card-button">
          <button>Buy now</button>
          <button>Make offer</button>
        </div>
      </div>
    </div>
  );
};

export default Nftitem;
