import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../shared/layout";
import Nftitem from "../nftitem/nftitem";
import Web3 from "web3";
import draculaHero_abi from '../../../utils/contract/DraculaHero.json'
import "./auction.styles.scss";

const AuctionItem = () => {
  const { tokenaddress } = useParams();
  const provider_url = process.env.REACT_APP_PROVIDERURL;
  const web3 = new Web3(provider_url);

  const [name, setName] = useState('');
  const [totalsupply, setTotalsupply] = useState(0);
  const [nfts, setNfts] = useState([]);

  
  useEffect(() => {
    const getNftdata = async () => {
      const hero_contract = new web3.eth.Contract(draculaHero_abi, tokenaddress);
      const tokenname = await hero_contract.methods.name().call();
      const tokensupply = await hero_contract.methods.totalSupply().call();
      setName(tokenname);
      setTotalsupply(tokensupply);
      let temp = [];
      for (let i = 1; i <= tokensupply; i++) {
        const element = {
          tokenname: tokenname,
          tokenid: i,
          tokenaddress: tokenaddress
        };
        temp.push(element)
      }
      setNfts(temp);
    };
    getNftdata();
  }, []);

  useEffect(() => {
  }, []);

  return (
    <Layout>
      <div className="product-list-container container">
        <h2 className="product-list-title">Collection</h2>
        <div className="product-list row">
          {nfts.map((item) => {
            return <Nftitem data={item}></Nftitem>;
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionItem;
