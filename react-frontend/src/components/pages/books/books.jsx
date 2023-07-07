import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import Layout from '../../shared/layout';
import FeaturedProduct from '../../shared/featured-product';
import CC_abi from "../../../utils/contract/CultureCoin.json";
import './books.styles.scss';

const Books = () => {
  const cc_abi = CC_abi;
  const cc_address = process.env.REACT_APP_CULTURECOINADDRESS;
	const provider_url = process.env.REACT_APP_PROVIDERURL;
  
  const [products, setProducts] = useState([])
  const [dexrate, setDexrate] = useState(0);
  const web3 = new Web3(provider_url);

  const getBooklists = async () => {
    const { data } = await axios
        .get(process.env.REACT_APP_API + 'getbooklist')
    setProducts(data)
  }

  
  useEffect(() => {
    const getDexrate = async () => {
      const ccoin_contract = new web3.eth.Contract(cc_abi, cc_address);
      const dexrate = await ccoin_contract.methods.getDexCCRate().call();
      setDexrate(web3.utils.fromWei(String(dexrate)))
    };
    getDexrate();
  }, [])

  useEffect(() => {
      getBooklists()
  }, [])

  const allProducts = products.map(product => (
    <FeaturedProduct { ...product } cc_rate={dexrate} key={product.id} />
  ));

  return (
    <Layout>
      <div className='product-list-container container'>
        <h2 className='product-list-title'>Books</h2>
        <div className='product-list row'>
          {
            allProducts
          }
        </div>
      </div>
    </Layout>
  );
}

export default Books;