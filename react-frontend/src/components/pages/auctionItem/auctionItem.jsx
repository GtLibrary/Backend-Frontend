import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../shared/layout";
import Nftitem from "../nftitem/nftitem";
// import Collection from '../../shared/collection';
import "./auction.styles.scss";

const AuctionItem = () => {
  const { id } = useParams();
  const nfts = [
    {
      uri: "",
      nftsymbol: "111",
    },
    {
      uri: "",
      nftsymbol: "aaa",
    },
    {
      uri: "",
      nftsymbol: "bbb",
    },
    {
      uri: "",
      nftsymbol: "ccc",
    },
    {
      uri: "",
      nftsymbol: "ddd",
    },
    {
      uri: "",
      nftsymbol: "eee",
    },
    {
      uri: "",
      nftsymbol: "fff",
    },
  ];

  const getitemlists = async () => {
    if (id < 0) {
      return;
    }
    try {
      const getitemurl = process.env.REACT_APP_API + `nftitem/${id}`;
      const { data } = await axios.get(getitemurl);
      console.log("data:", data);
      const bookitemcount = data[0]["max_book_supply"];
      var bookmarkitemcount = 0;
      const bm_data = Number(data[0]["bm_listdata"]);
      const hardbounditemcount = Number(data[0]["max_hardbound_supply"]);
      for (let i = 0; i < bm_data.length; i++) {
        bookmarkitemcount += Number(bm_data[i]["maxbookmarksupply"]);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    getitemlists();
  }, []);

  return (
    <Layout>
      <div className="product-list-container container">
        <h2 className="product-list-title">Collection</h2>
        <div className="product-list row">
          {nfts.map((item) => {
            return <Nftitem uri={item.uri} symbol={item.nftsymbol}></Nftitem>;
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionItem;
