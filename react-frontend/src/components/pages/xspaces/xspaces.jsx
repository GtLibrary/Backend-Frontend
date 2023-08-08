import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import axios from "axios"
import Layout from "../../shared/layout";
import Accordion from "../../shared/accordion";
import XSpaces_abi from '../../../utils/contract/XSpaces.json';
import AuthorProfile from "./AuthorProfile";
import "./xspaces.styles.scss";
import CC_abi from "../../../utils/contract/CultureCoin.json";
import { ethers } from "ethers";

const XSpaces = () => {
  const { insearchterm } = useParams();
  console.log("insearchterm: " , insearchterm);
  const navigate = useNavigate();
  const { account } = useWeb3React();

  const provider_url = process.env.REACT_APP_PROVIDERURL;
  const web3 = new Web3(provider_url);
  const xspaces_address = process.env.REACT_APP_XSPACESADDRESS;
  console.log("xspaces_address: ", xspaces_address);
  const contract = new web3.eth.Contract(XSpaces_abi, xspaces_address);

  const [searchterm, setSearchterm] = useState('');
  const [posts, setPosts] = useState([]);
  const [initsearch, setInitsearch] = useState(0);

useEffect(() => {
  if (typeof insearchterm !== 'undefined') {
    console.log("Setting seach term!");
    if(insearchterm.startsWith('0x')) {
      setSearchterm(insearchterm);
    } else {
      setSearchterm('#' + insearchterm);
    }
    //doSearch();
  }
  setInitsearch(1);
  
}, [insearchterm]); // Only re-run the effect if insearchterm changes

useEffect(() => {
  console.log("searching.........................");
  if(searchterm != "") {
    doSearch();
  }
  if(typeof insearchterm === 'undefined' ) {
    doSearch();
  }
}, [initsearch]); // Only re-run the effect if insearchterm changes

  const getXSpaceData = async () => {
    var xspaces_index = -1;	// No x-post yet
    try {
      xspaces_index = await contract.methods.getLatestXSpaceIndex().call();
      console.log("xs index: ", xspaces_index);
    } catch (exception) {
      console.log("No xspace post yet.");
    }
  }

  useEffect(() => {
    getXSpaceData();
  }, []);

const doSearch = async () => {
  try {
    let postsData = [];
    if (searchterm.startsWith('#')) {
      const postIndex = await contract.methods.getLatestXSpaceIndexByHashtag(searchterm).call();
      for (let i = postIndex; i > postIndex - 50 && i >= 0; i--) {
        const postDataIndex = await contract.methods.getXSpaceByHashtag(searchterm, i).call();
        const postData = await contract.methods.getXSpace(postDataIndex).call();
        postData[3] = i;
        postsData.push(postData);
      }
    } else if (searchterm.startsWith('0x')) {
      const postIndex = await contract.methods.getLatestXSpaceIndexByAuthor(searchterm).call();
      for (let i = postIndex; i > postIndex - 50 && i >= 0; i--) {
        const postDataIndex = await contract.methods.getXSpaceByAuthor(searchterm, i).call();
        const postData = await contract.methods.getXSpace(postDataIndex).call();
        postData[3] = i;
        postsData.push(postData);
      }
    } else {
      //if (searchcount === 1) return;
      //searchcount++;

      const postIndex = await contract.methods.getLatestXSpaceIndex().call();
      for (let i = postIndex; i > postIndex - 50 && i >= 0; i--) {
        const postData = await contract.methods.getXSpace(i).call();
        postData[3] = i;
        postsData.push(postData);
      }
    }
    setPosts(postsData);
  } catch (exception) {
    console.log("failed to get post data: ", exception);
    setPosts([{
      message: 'No Posts found',
      hashtags: [``]
    }]);
  }
}

  const myJoin = (mymap)  => {
    try {
      return mymap.join(' ');
    } catch (exception) {
      return "";
    }
  };

  return (
    <Layout>
      <div className="xspaces-list-container container">
        <h2 className="xspaces-list-title">𝕏Spaces</h2>
        <div className="xspaces-list row">

          <div className="col-md-4">
	     <AuthorProfile />
          </div>

          <div className="col-md-4" style={{ backgroundColor: '#FFEDD9', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>

	    <input type="text" value={searchterm} style={{ width: '100%', marginBottom: '10px' }} onChange={e => setSearchterm(e.target.value)} 
	           placeholder="#hashtag or author address" 
	           onKeyPress={e => { if (e.key === 'Enter') doSearch(); }}/>
            <button  style={{ backgroundColor: '#4CAF50', color: 'white', borderRadius: '12px', padding: '10px 20px' }} onClick={doSearch}>𝕏Search</button>
<p></p>
	    {posts.map((post, index) => (
              <div key={index} style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '5px', marginBottom: '10px' }} >
                <p>Message {post[3]}</p>
                <p>By Account: {post[0]}</p>
                <p>Message: {post[1]}</p>
                <p>Hashtags: {myJoin(post[2])}</p>
              </div>
            ))}
          </div>
	  <div className="col-md-4">
	    <p>Welcome to 𝕏Spaces where you and authors can chat.</p>
	    <p>Promoted Content:</p>
	    <p>DRACULA</p>
	    <p>More coming soon!</p>

	  </div>

        </div>
      </div>

    </Layout>
  );
};

export default XSpaces;
