import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import axios from "axios"
import Layout from "../../shared/layout";
import Accordion from "../../shared/accordion";
import MakeOfferModal from "./makeoffermodal";
import BuyModal from "./buymodal";
import draculaHero_abi from '../../../utils/contract/DraculaHero.json';
import draculaRelics_abi from '../../../utils/contract/Relics.json';
import "./nftdetail.styles.scss";
import ListModal from "./listmodal";
import SendModal from "./sendmodal";
import AuctionHouse_abi from '../../../utils/contract/AuctionHouse.json';

const Nftdetail = () => {
  const { tokenaddress, tokenid } = useParams();
	const { account } = useWeb3React();

  const navigate = useNavigate();
  const provider_url = process.env.REACT_APP_PROVIDERURL;
	const auctionhouse_address = process.env.REACT_APP_AUCTIONHOUSEADDRESS;

  const [tokenname, setTokenname] = useState('');
  const [tokenowner, setTokenowner] = useState('');
  const [nftowner, setNftowner] = useState('');
  const [isshowoffer, setIshowoffer] = useState(false);
  const [isshowbuy, setIsshowbuy] = useState(false);
  const [isshowlist, setIsshowlist] = useState(false);
  const [isshowsend, setIsshowsend] = useState(false);
  const [lists, setLists] = useState([]);
  const [offers, setoffers] = useState([]);
	const [nftprice, setNftprice] = useState(0);
  
  const web3 = new Web3(provider_url);

  const getDetailData = async () => {
    let contract_abi = '';
    if(tokenaddress == "0x02819086274690fb27b940bec1268deD9D4DCC10"){
      contract_abi = draculaRelics_abi;
    } else if(tokenaddress == "0xD83EF3eDb656DB9502eB658dBc5831d2C345edAA") {
      contract_abi = draculaHero_abi;
    }
    const nft_contract = new web3.eth.Contract(contract_abi, tokenaddress);
    const token_name = await nft_contract.methods.name().call();
    const contractowner = await nft_contract.methods.owner().call();
    const token_Owner = await nft_contract.methods.ownerOf(tokenid).call();
    const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
    const price = await auctionhouse_contract.methods.price(tokenaddress, tokenid).call();
    setNftprice(price);
    setTokenname(token_name);
    setNftowner(contractowner);
    setTokenowner(String(token_Owner));
  }

  const getlistingdata = async () => {
    // let url = process.env.REACT_APP_API + '';
    // const listdata = await axios.get(url)
    // setLists(listdata);
  }

  const getofferdata = async () => {
    // let url = process.env.REACT_APP_API + '';
    // const offerdata = await axios.get(url)
    // setoffers(offerdata);
  }

  useEffect(() => {
    getDetailData();
    getlistingdata();
    getofferdata();
  }, [isshowbuy, isshowlist, isshowsend]);

  return (
    <Layout>
      <div className="nftdetail-list-container container">
        <h2 className="nftdetail-list-title">NFT Detail</h2>
        <div className="nftdetail-list row">
          <div className="col-md-5">
            <div className="nft-detail-img">
              <img src="./../../../assets/img/bookmark.png" alt="nftimage"></img>
            </div>
            <br></br>
            <Accordion
              title="Description"
              preIcon={<i className="fa fa-book" />}
              content={<p>By <b>{nftowner}</b></p>}
              isOpened={true}
            />
            <br></br>
            <Accordion
              title="Details"
              preIcon={<i className="fa fa-file-text-o" />}
              content={
                <div></div>
              }
            />
          </div>
          <div className="col-md-7">
            <div className="detail-header">
              <h5 className="item-collection" onClick={() => navigate(`/auctionhouse/collection/${tokenaddress}`)}>{tokenname}</h5>
              <h1 className="item-title">{tokenname} #{tokenid}</h1>
              <div className="item-owner">Owned By &nbsp;<b>{tokenowner == account? 'you': tokenowner}</b></div>
            </div>
            <div className="action-area">
              <div className="action-title">Actions</div>
              <div className="action-content">
                {nftprice == 0 ? (
                  <p className="action-price">Current Token is not listed.</p>
                ): (
                  <p className="action-price">Current Token Price: {nftprice} CC</p>
                )}
                <div className="btn-area">
                { tokenowner == account ? (
                    <>
                      <button className="list-nft" onClick={() => setIsshowlist(true)}>List Now</button>
                      <button className="list-nft" onClick={() => setIsshowsend(true)}><i className="fa fa-paper-plane"></i>&nbsp;Send</button>
                    </> 
                  ): (
                    <>
                      {/* {lists.length > 0 ? (
                        <button className="buy-nft" onClick={() => setIsshowbuy(true)}><i className="fa fa-shopping-cart"></i>&nbsp;Buy Now</button>
                      ): null}
                      <button className="make-offer" onClick={() => setIshowoffer(true)}><i className="fa fa-tag"></i>&nbsp; Make offer</button> */}
                        <button className="buy-nft" disabled={nftprice == 0 ? true: false} onClick={() => setIsshowbuy(true)}><i className="fa fa-shopping-cart"></i>&nbsp;Buy Now</button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <br></br>
            {/* <Accordion
              title="Listings"
              preIcon={<i className="fa fa-list" />}
              content={
                <>
                  {lists.length > 0 ? (
                      <></>
                    ):(
                      <div className="empty-list">
                        <div style={{display: 'flex'}}>
                          <span className="empty-img">
                            <img src="../../../assets/img/empty-asks.svg" alt="empty"></img>
                          </span>
                        </div>
                        <div>No listing yet</div>
                      </div>
                    )}
                </>
              }
            /> */}
            {/* <br />
            <Accordion 
              title="Offers" 
              preIcon={<i className="fa fa-tag" />}
              content={
                <>
                  {offers.length > 0 ? (
                      <></>
                    ):(
                      <div className="empty-list">
                        <div style={{display: 'flex'}}>
                          <span className="empty-img">
                            <img src="../../../assets/img/empty-asks.svg" alt="empty"></img>
                          </span>
                        </div>
                        <div>No listing yet</div>
                      </div>
                    )}
                </>
              }
            /> */}
          </div>
        </div>
      </div>
      <MakeOfferModal
        show={isshowoffer}
        onHide={() => setIshowoffer(false)}
      ></MakeOfferModal>
      <BuyModal
        show={isshowbuy}
        onHide={() => setIsshowbuy(false)}
        tokenaddress={tokenaddress}
        tokenid={tokenid}
      ></BuyModal>
      <ListModal
        show={isshowlist}
        onHide={() => setIsshowlist(false)}
        tokenaddress={tokenaddress}
        tokenid={tokenid}
      ></ListModal>
      <SendModal
        show={isshowsend}
        onHide={() => setIsshowsend(false)}
        tokenaddress={tokenaddress}
        tokenid={tokenid}
      ></SendModal>
    </Layout>
  );
};

export default Nftdetail;
