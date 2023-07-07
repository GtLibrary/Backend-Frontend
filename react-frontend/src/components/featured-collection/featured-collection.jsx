import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import FeaturedProduct from '../shared/featured-product';
import CC_abi from "../../utils/contract/CultureCoin.json";
import './featured-collection.styles.scss'

const FeaturedCollection = (props) => {
  const provider_url = process.env.REACT_APP_PROVIDERURL;
	const cultureCoinAddress = process.env.REACT_APP_CULTURECOINADDRESS;
  const navigate = useNavigate();
  const { products } = props;
  const [dexrate, setDexrate] = useState(0);
  const web3 = new Web3(provider_url);
  
  useEffect(() => {
    const getDexrate = async () => {
      const ccoin_contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
      const curdexrate = await ccoin_contract.methods.getDexCCRate().call();
      setDexrate(web3.utils.fromWei(String(curdexrate)));
    };
    getDexrate();
  }, [])

  const productItems = products.filter((product, i) => i < 4).map(product => (
    <FeaturedProduct {...product} cc_rate={dexrate} key={product.id} />
  ));

  return (
    <div className='featured-collection container'>
      <h2 className='featured-section-title'>Fascinating Favorites</h2>
      <div className='products row'>
        {
          productItems
        }
      </div>
      <div className="row">
        <div className="col-md-12 viewmore-area">
          <button className="btn btn-viewmore" onClick={() => navigate(`/books`)}>View More</button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCollection;
