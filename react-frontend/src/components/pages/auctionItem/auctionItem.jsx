import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import Form from 'react-bootstrap/Form';
import Layout from "../../shared/layout";
import Nftitem from "../nftitem/nftitem";
import Accordion from "../../shared/accordion";
import draculaHero_abi from '../../../utils/contract/DraculaHero.json';
import draculaRelics_abi from '../../../utils/contract/Relics.json';
import AuctionHouse_abi from '../../../utils/contract/AuctionHouse.json';
import "./auction.styles.scss";

const AuctionItem = () => {
  const { tokenaddress } = useParams();
  const provider_url = process.env.REACT_APP_PROVIDERURL;
  const web3 = new Web3(provider_url);
	const auctionhouse_address = process.env.REACT_APP_AUCTIONHOUSEADDRESS;

  const [name, setName] = useState('');
  const [ownertype, setOwnertype] = useState('all');
  const [nfts, setNfts] = useState([]);

  
  useEffect(() => {
    const getNftdata = async () => {
      let contract_abi = '';
      if(tokenaddress == "0x02819086274690fb27b940bec1268deD9D4DCC10"){
        contract_abi = draculaRelics_abi;
      } else if(tokenaddress == "0xD83EF3eDb656DB9502eB658dBc5831d2C345edAA") {
        contract_abi = draculaHero_abi;
      }
      const nft_contract = new web3.eth.Contract(contract_abi, tokenaddress);
			const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
      const tokenname = await nft_contract.methods.name().call();
      const tokensupply = await nft_contract.methods.totalSupply().call();
      setName(tokenname);
      let temp = [];
      for (let i = 1; i <= tokensupply; i++) {
        let token_owner = await nft_contract.methods.ownerOf(i).call();
        let token_price = await auctionhouse_contract.methods.price(tokenaddress, i).call();
        const element = {
          tokenname: tokenname,
          tokenid: i,
          tokenaddress: tokenaddress,
          token_owner: token_owner,
          token_price: token_price,
        };
        temp.push(element)
      }
      console.log("nft data: ", temp);
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
              content={
                <div className="owner-filter">
                  <Form.Check
                    type="radio"
                    id={`default-$"radio"`}
                    label={`All Items`}
                    name="ownerable"
                    checked={true}
                    onChange={() =>{setOwnertype('all')}}
                  />
        
                  <Form.Check
                    type="radio"
                    id={`disabled $"radio"`}
                    label={`Only Own Items`}
                    name="ownerable"
                    onChange={() =>{setOwnertype('owner')}}
                  />
                </div>
              }
              // isOpened={true}
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
