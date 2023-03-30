import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../shared/layout';
import { ethers } from "ethers";
import './swap.styles.scss';
import ccoin_abi from "../../utils/contract/CultureCoin.json";

const Swap = () => {
  
  const [products, setProducts] = useState([])
  const cultureCoinAddress = process.env.REACT_APP_CULTURECOINADDRESS;


  const swapToAvax = async (amount) => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CCOINPortal = new ethers.Contract(cultureCoinAddress, ccoin_abi, signer);
      let swaptoavax = await CCOINPortal.dexCCIn({
        value: ethers.utils.parseEther(String(amount)),
      });
      await swaptoavax.wait();
    }
  };

  const swapToCC = async (amount) => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CCOINPortal = new ethers.Contract(cultureCoinAddress, ccoin_abi, signer);
      let swaptocc = await CCOINPortal.dexXMTSPIn({
        value: ethers.utils.parseEther(String(amount)),
      });
      await swaptocc.wait();
    }
  };


  return (
    <Layout>
      <div className='product-list-container container'>
        <h2 className='product-list-title'>Books</h2>
        <div className='product-list row'>
        </div>
      </div>
    </Layout>
  );
}

export default Swap;