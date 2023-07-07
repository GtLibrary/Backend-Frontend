import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../shared/layout";
import AuctionhouseItem from "../../shared/auctionhouseitem";
import "./auctionhouse.styles.scss";

const Auctionhouse = () => {
  const [products, setProducts] = useState([]);

  const getBooklists = async () => {
    const { data } = await axios.get(process.env.REACT_APP_API + "getbooklist");
    setProducts(data);
  };

  useEffect(() => {
    getBooklists();
  }, []);

  const allProducts = products.map((product) => (
    <AuctionhouseItem {...product} key={product.id} />
  ));

  return (
    <Layout>
      <div className="product-list-container container">
        <h2 className="product-list-title">Auction House</h2>
        <div className="product-list row">{allProducts}</div>
      </div>
    </Layout>
  );
};

export default Auctionhouse;
