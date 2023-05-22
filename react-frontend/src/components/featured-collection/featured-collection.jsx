import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import FeaturedProduct from '../shared/featured-product';
import './featured-collection.styles.scss'

const FeaturedCollection = (props) => {
  const navigate = useNavigate();
  const { products } = props;
  const [dexrate, setDexrate] = useState(0);
  const web3 = new Web3(window.ethereum);
  
  useEffect(() => {
    const getDexrate = async () => {
      const ccrateurl = {
        method: "get",
        url: process.env.REACT_APP_API + "getccrate",
      };
      await axios(ccrateurl).then((res) => {
        console.log(web3.utils.fromWei(String(res.data.cc_rate)))
        setDexrate(web3.utils.fromWei(String(res.data.cc_rate)))
      });
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
