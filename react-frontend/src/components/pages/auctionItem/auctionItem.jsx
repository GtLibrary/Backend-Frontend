import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Form from 'react-bootstrap/Form';
import LoadingOverlay from "react-loading-overlay";
import Layout from "../../shared/layout";
import Nftitem from "../nftitem/nftitem";
import Accordion from "../../shared/accordion";
import draculaHero_abi from '../../../utils/contract/DraculaHero.json';
import draculaRelics_abi from '../../../utils/contract/Relics.json';
import AuctionHouse_abi from '../../../utils/contract/AuctionHouse.json';
import "./auction.styles.scss";

LoadingOverlay.propTypes = undefined;

const AuctionItem = () => {
  const { tokenaddress } = useParams();
	const { account } = useWeb3React();
  const provider_url = process.env.REACT_APP_PROVIDERURL;
  const web3 = new Web3(provider_url);
	const auctionhouse_address = process.env.REACT_APP_AUCTIONHOUSEADDRESS;

  const [name, setName] = useState('');
  const [ownertype, setOwnertype] = useState('all');
  const [saletype, setSaletype] = useState('all');
  const [nfts, setNfts] = useState([]);
  const [list, setList] = useState([]);
  const [myDictionaryOfPrices, setMyDictionaryOfPrices] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getNftdata = async () => {
      setLoading(true);
      let contract_abi = '';
      if(tokenaddress == "0x02819086274690fb27b940bec1268deD9D4DCC10"){
        contract_abi = draculaRelics_abi;
      } else if(tokenaddress == "0xD83EF3eDb656DB9502eB658dBc5831d2C345edAA") {
        contract_abi = draculaHero_abi;
      }
      const nft_contract = new web3.eth.Contract(contract_abi, tokenaddress);
			// const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
      const tokenname = await nft_contract.methods.name().call();
      const tokensupply = await nft_contract.methods.totalSupply().call();
      setName(tokenname);
      let temp = [];
      for (let i = 1; i <= tokensupply; i++) {
        let token_owner = await nft_contract.methods.ownerOf(i).call();
        // let token_price = await auctionhouse_contract.methods.price(tokenaddress, i).call();
        const element = {
          tokenname: tokenname,
          tokenid: i,
          tokenaddress: tokenaddress,
          token_owner: token_owner,
          // token_price: token_price,
        };
        temp.push(element)
      }
      console.log("nft data: ", temp);
      setNfts(temp);
      setList(temp);
      setLoading(false);
    };
    getNftdata();
  }, []);

  const fetchPrices = async () => {
    let contract_abi = '';
    if(tokenaddress == "0x02819086274690fb27b940bec1268deD9D4DCC10"){
      contract_abi = draculaRelics_abi;
    } else if(tokenaddress == "0xD83EF3eDb656DB9502eB658dBc5831d2C345edAA") {
      contract_abi = draculaHero_abi;
    }
    const nft_contract = new web3.eth.Contract(contract_abi, tokenaddress);
    const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
    const totalSupply = await nft_contract.methods.totalSupply().call();

    for (let i = 0; i < totalSupply; i++) {
      const price = await auctionhouse_contract.methods.price(tokenaddress, i).call();
      setMyDictionaryOfPrices(prevPrices => ({ ...prevPrices, [i]: price }));
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const showItems = (ownership_type, sale_type) => {
    if(ownership_type == 'owner' && sale_type == 'onsale') {
      const filterdata = nfts.filter((item) => {
        return item.token_owner == account && myDictionaryOfPrices[item.tokenid] > 0;
      });
      setList(filterdata)
    } else if(ownership_type == 'owner') {
      const filterdata = nfts.filter((item) => {
        return item.token_owner == account;
      });
      setList(filterdata)
    } else if(sale_type == 'onsale') {
      const filterdata = nfts.filter((item) => {
        return myDictionaryOfPrices[item.tokenid] > 0;
      });
      setList(filterdata)
    } else {
      setList(nfts)
    }
  }

  return (
    <Layout>
      {loading && (
        <div
          style={{
            background: "#00000055",
            width: "100%",
            height: "100%",
            zIndex: "1000",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <LoadingOverlay
            active={true}
            spinner={true}
            text="Loading ..."
            styles={{
              overlay: (base) => ({
                ...base,
                background: "rgba(255, 255, 255)",
                position: "absolute",
                marginTop: "300px",
              }),
            }}
            fadeSpeed={9000}
          ></LoadingOverlay>
        </div>
      )}
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
                    checked={ownertype == 'all' ? true: false}
                    onChange={() =>{
                      setOwnertype('all');
                      showItems('all', saletype);
                    }}
                  />
        
                  <Form.Check
                    type="radio"
                    id={`disabled $"radio"`}
                    label={`Only Own Items`}
                    name="ownerable"
                    onChange={() =>{
                      setOwnertype('owner');
                      showItems('owner', saletype);
                    }}
                    checked={ownertype == 'owner' ? true: false}
                  />
                </div>
              }
              // isOpened={true}
            />
            <div className="filter-divider"></div>
            <Accordion 
              title="List"
              content={
                <div className="list-filter">
                  <Form.Check
                    type="radio"
                    label={`All List`}
                    id={`saleall-$"radio"`}
                    name="saleable"
                    onChange={() =>{
                      setSaletype('all');
                      showItems(ownertype, 'all');
                    }}
                    checked={saletype == 'all' ? true: false}
                  />
        
                  <Form.Check
                    type="radio"
                    label={`On Sales`}
                    id={`sale-$"radio"`}
                    name="saleable"
                    onChange={() =>{
                      setSaletype('onsale');
                      showItems(ownertype, 'onsale');
                    }}
                    checked={saletype == 'onsale' ? true: false}
                  />
                </div>
              }
              // isOpened={true}
            />
          </div>
          <div className="col-md-9">
            <div className="product-list row">
              {list.map((item, index) => {
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
