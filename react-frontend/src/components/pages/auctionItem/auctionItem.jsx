import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import Layout from "../../shared/layout";
import Nftitem from "../nftitem/nftitem";
import Accordion from "../../shared/accordion";
import draculaHero_abi from '../../../utils/contract/DraculaHero.json'
import "./auction.styles.scss";

const AuctionItem = () => {
  const { tokenaddress } = useParams();
  const provider_url = process.env.REACT_APP_PROVIDERURL;
  const web3 = new Web3(provider_url);

  const [name, setName] = useState('');
  const [nfts, setNfts] = useState([]);

  
  useEffect(() => {
    const getNftdata = async () => {
      const hero_contract = new web3.eth.Contract(draculaHero_abi, tokenaddress);
      const tokenname = await hero_contract.methods.name().call();
      const tokensupply = await hero_contract.methods.totalSupply().call();
      setName(tokenname);
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
      <div className="product-list-container container-fluid">
        <h2 className="product-list-title">Collection</h2>
        <div className="row">
          <div className="col-md-3">
            <h3 style={{fontFamily: "Crimson Text"}}>Filters</h3>
            <Accordion 
              title="Owner"
              content={""}
            />
          </div>
          <div className="col-md-9">
            <div className="product-list row">
              {nfts.map((item, index) => {
                return <Nftitem data={item} key={index}></Nftitem>;
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionItem;
