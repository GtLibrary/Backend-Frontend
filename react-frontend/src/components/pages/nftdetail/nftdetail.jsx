import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import axios from "axios"
import Layout from "../../shared/layout";
import Accordion from "../../shared/accordion";
import MakeOfferModal from "./makeoffermodal";
import BuyModal from "./buymodal";
import draculaHero_abi from '../../../utils/contract/DraculaHero.json'
import "./nftdetail.styles.scss";
import ListModal from "./listmodal";

const Nftdetail = () => {
  const { tokenaddress, tokenid } = useParams();
	const { account } = useWeb3React();

  const navigate = useNavigate();
  const provider_url = process.env.REACT_APP_PROVIDERURL;

  const [tokenname, setTokenname] = useState('');
  const [tokenowner, setTokenowner] = useState('');
  const [nftowner, setNftowner] = useState('');
  const [isshowoffer, setIshowoffer] = useState(false);
  const [isshowbuy, setIsshowbuy] = useState(false);
  const [isshowlist, setIsshowlist] = useState(false);
  const [lists, setLists] = useState([]);
  const [offers, setoffers] = useState([]);
  
  const web3 = new Web3(provider_url);

  const getDetailData = async () => {
    const draculaHero_contract = new web3.eth.Contract(draculaHero_abi, tokenaddress);
    const token_name = await draculaHero_contract.methods.name().call();
    const contractowner = await draculaHero_contract.methods.owner().call();
    const token_Owner = await draculaHero_contract.methods.ownerOf(tokenid).call();
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
  }, []);

  return (
    <Layout>
      <div className="nftdetail-list-container container">
        <h2 className="nftdetail-list-title">NFT Detail</h2>
        <div className="nftdetail-list row">
          <div className="col-md-5">
            <div className="nft-detail-img"></div>
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
                { tokenowner == account ? (
                    <>
                      <button className="list-nft" onClick={() => setIsshowlist(true)}>List Now</button>
                    </> 
                  ): (
                    <>
                      {lists.length > 0 ? (
                        <button className="buy-nft" onClick={() => setIsshowbuy(true)}><i className="fa fa-shopping-cart"></i>&nbsp;Buy Now</button>
                      ): null}
                      <button className="make-offer" onClick={() => setIshowoffer(true)}><i className="fa fa-tag"></i>&nbsp; Make offer</button>
                    </>
                  )}
              </div>
            </div>
            <br></br>
            <Accordion
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
            />
            <br />
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
            />
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
      ></BuyModal>
      <ListModal
        show={isshowlist}
        onHide={() => setIsshowlist(false)}
      ></ListModal>
    </Layout>
  );
};

export default Nftdetail;
