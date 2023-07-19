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
  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [tokenSupply, setTokenSupply] = useState(1);

  const { view, tokenaddress } = useParams();

  const { account } = useWeb3React();
  const provider_url = process.env.REACT_APP_PROVIDERURL;
  const web3 = new Web3(provider_url);
  const auctionhouse_address = process.env.REACT_APP_AUCTIONHOUSEADDRESS;
  const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
  let contract_abi = '';
  if(tokenaddress == "0x02819086274690fb27b940bec1268deD9D4DCC10"){
    contract_abi = draculaRelics_abi;
  } else if(tokenaddress == "0xD83EF3eDb656DB9502eB658dBc5831d2C345edAA") {
    contract_abi = draculaHero_abi;
  }
  const nft_contract = new web3.eth.Contract(contract_abi, tokenaddress);

  const [name, setName] = useState('');
  const [ownertype, setOwnertype] = useState('all');
  const [saletype, setSaletype] = useState('all');
  const [nfts, setNfts] = useState([]);
  const [list, setList] = useState([]);
  const [myDictionaryOfPrices, setMyDictionaryOfPrices] = useState({});
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const getIdsAndPriceAll = async (tokenid)  => {
    const price = await auctionhouse_contract.methods.price(tokenaddress, tokenid).call();
    return [price, tokenid];
  };
  const getOwnerIdsAndPrice = async (indexId) => {
    const tokenId = await nft_contract.methods.tokenOfOwnerByIndex(account, indexId).call();
    const price = await auctionhouse_contract.methods.price(tokenaddress, tokenId).call();
    return [price, tokenId];
  };
  const getOwnerAsync = async (account) => {
    return account;
  };


  const getNftdata = async () => {
    setLoading(true);

    const tokenname = await nft_contract.methods.name().call();

    let temp = [];
    const promises = [];

    // Only fetch data for current page
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = start + ITEMS_PER_PAGE - 1;
    var tokensupply = 0;

    if(view === "all") {
      tokensupply = await nft_contract.methods.totalSupply().call();
      console.log("Viewing all items.");

      for (let i = start; i < end && i < tokensupply; i++) {
        promises.push(
          nft_contract.methods.ownerOf(i).call(),
          getIdsAndPriceAll(i)
        );
      }

    } else if(view === "owner") {
      console.log("Account: ", account);
      tokensupply = await nft_contract.methods.balanceOf(account).call();
      for (let i = start; i < end && i < tokensupply; i++) {
        promises.push(
	  getOwnerAsync(account),
          getOwnerIdsAndPrice(i),
        );
      }
      console.log("Viewing owner items.");
    } else if(view == "sale") {
      // FIXME: Need to call ah.totalOnSale();
      // FIXME: Need to call getIdsAndPriceOnSale() which needs to call ah.tokenOnSaleByIndex() and price();
    } else if(view = "myonsale") {
      // FIXME: Need to call ah.totalOnSaleByOwner();
      // FIXME: Need to call getIdsAndPriceOnSaleByOwner() which needs to call ah.tokenOnSaleByOwnerAndIndex()
      //         and price();
    }

    setTokenSupply(tokensupply);

    const results = await Promise.all(promises);
    for (let i = 0; i <results.length; i += 2) {
      const element = {
        tokenname: tokenname,
        //tokenid: i / 2 + 1 + start,
        tokenaddress: tokenaddress,
        token_owner: results[i],
        token_price: results[i + 1][0],
        tokenid: results[i + 1][1],
      };
      temp.push(element);
    }
    console.log("nft data: ", temp);
    setNfts(temp);
    setList(temp);
    setLoading(false);
  };
  getNftdata();
}, [currentPage]);

  const handlePageChange = (newPage) => {
    console.log("In Handle page change: ", newPage);
    setCurrentPage(newPage);
  };


/*
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
      setList(temp);
      setLoading(false);
    };
    getNftdata();
  }, []);
*/



  // const fetchPrices = async () => {
  //   let contract_abi = '';
  //   if(tokenaddress == "0x02819086274690fb27b940bec1268deD9D4DCC10"){
  //     contract_abi = draculaRelics_abi;
  //   } else if(tokenaddress == "0xD83EF3eDb656DB9502eB658dBc5831d2C345edAA") {
  //     contract_abi = draculaHero_abi;
  //   }
  //   const nft_contract = new web3.eth.Contract(contract_abi, tokenaddress);
  //   const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
  //   const totalSupply = await nft_contract.methods.totalSupply().call();

  //   for (let i = 0; i < totalSupply; i++) {
  //     const price = await auctionhouse_contract.methods.price(tokenaddress, i).call();
  //     setMyDictionaryOfPrices(prevPrices => ({ ...prevPrices, [i]: price }));
  //   }
  // };

  // useEffect(() => {
  //   fetchPrices();
  // }, []);

  const showItems = (ownership_type, sale_type) => {
    if(ownership_type == 'owner' && sale_type == 'onsale') {
      const filterdata = nfts.filter((item) => {
        return item.token_owner == account && item.token_price > 0;
      });
      setList(filterdata)
    } else if(ownership_type == 'owner') {
      const filterdata = nfts.filter((item) => {
        return item.token_owner == account;
      });
      setList(filterdata)
    } else if(sale_type == 'onsale') {
      const filterdata = nfts.filter((item) => {
        return item.token_price > 0;
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
      <Pagination currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={tokenSupply} onPageChange={handlePageChange} />
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

const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} onClick={() => onPageChange(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
};

/*
const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => {
  const tokensupply = await nft_contract.methods.totalSupply().call();
  const totalPages = Math.ceil(tokensupply / itemsPerPage);
  console.log("totalPages: ", totalPages);

  return (
    <div>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} onClick={() => onPageChange(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
};
*/

export default AuctionItem;
