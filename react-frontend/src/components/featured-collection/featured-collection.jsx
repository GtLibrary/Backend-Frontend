import React from 'react';
import { useNavigate } from "react-router-dom";
import FeaturedProduct from '../shared/featured-product';
import './featured-collection.styles.scss'

const FeaturedCollection = (props) => {
  const navigate = useNavigate();
  const { products } = props;
  const productItems = products.filter((product, i) => i < 4).map(product => (
    <FeaturedProduct {...product} key={product.id} />
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
