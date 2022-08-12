import React, { useContext } from 'react';
import FeaturedProduct from '../shared/featured-product';

const FeaturedCollection = (props) => {
  const { products } = props;
  const productItems = products.filter((product, i) => i < 4).map(product => (
    <FeaturedProduct {...product} key={product.id} />
  ));

  return (
    <div className='featured-collection container'>
      <h2 className='featured-section-title'>Facinating Favorites</h2>
      <div className='products row'>
        {
          productItems
        }
      </div>
    </div>
  );
}

export default FeaturedCollection;