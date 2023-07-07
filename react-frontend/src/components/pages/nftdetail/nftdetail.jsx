import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import Layout from "../../shared/layout";
import Accordion from "../../shared/accordion";
import draculaHero_abi from '../../../utils/contract/DraculaHero.json'
import "./nftdetail.styles.scss";

const Nftdetail = () => {
  const { tokenaddress, tokenid } = useParams();
  const provider_url = process.env.REACT_APP_PROVIDERURL;

  const [tokenname, setTokenname] = useState('');
  const [tokenowner, setTokenowner] = useState('');
  
  const web3 = new Web3(provider_url);

  useEffect(() => {
    const getDetailData = async () => {
      const draculaHero_contract = new web3.eth.Contract(draculaHero_abi, tokenaddress);
      const token_name = await draculaHero_contract.methods.name().call();
      const tokenOwner = await draculaHero_contract.methods.ownerOf(tokenid).call();
      console.log("tokenowner ===", tokenowner)
      setTokenname(token_name);
      setTokenowner(String(tokenOwner[0]).slice(0, 6).toUpperCase())
    }
    getDetailData()
  }, []);

  return (
    <Layout>
      <div className="nftdetail-list-container container">
        <h2 className="nftdetail-list-title">NFT Detail</h2>
        <div className="nftdetail-list row">
          <div className="col-md-5">
            <div className="nft-detail-img"></div>
          </div>
          <div className="col-md-7">
            <div className="detail-header">
              <h1 className="item-title">{tokenname} #{tokenid}</h1>
              <div className="item-owner">Owned By {tokenowner}</div>
            </div>
            <Accordion
              title="Listings"
              preIcon={<i className="fa fa-list" />}
            />
            <br />
            <Accordion title="Offers" preIcon={<i className="fa fa-tag" />} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Nftdetail;
