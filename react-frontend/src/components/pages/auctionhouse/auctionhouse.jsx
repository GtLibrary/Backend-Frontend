import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../shared/layout";
import AuctionhouseItem from "../../shared/auctionhouseitem";
import "./auctionhouse.styles.scss";

const Auctionhouse = () => {
  const auctionhouseItems = [
    {
      tokenname: "Dracula's Relics",
      tokenaddress: "0x02819086274690fb27b940bec1268deD9D4DCC10"
    },
    {
      tokenname: "DraculaHeroes",
      tokenaddress: "0xD83EF3eDb656DB9502eB658dBc5831d2C345edAA"
    },
  ]

  const allProducts = auctionhouseItems.map((item, index) => (
    <AuctionhouseItem {...item} key={index} />
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
