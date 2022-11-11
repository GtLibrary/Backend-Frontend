import React from 'react';
import withRouter from '../../withRouter';
import { useNavigate } from "react-router-dom";
import './featured-product.styles.scss';

const FeaturedProduct = (props) => {
  const navigate = useNavigate();
  const { title, image_url, price, id, description } = props;

  return (
    <div className='col-md-3 col-sm-6 col-xs-12'>
      <div className="featured-product">
        <div className='featured-image' onClick={() => navigate(`/product/${id}`)}>
          <img src={image_url} alt='product' />
        </div>
        <div className='name-price'>
          <h4>{title}</h4>
          {/* <p>$ {price}</p> */}
          {/* { 
            <button 
              className='button is-black nomad-btn'
              onClick={() => addProduct(product)}>
                ADD TO CART</button>
          }
          {
            <button 
              className='button is-white nomad-btn'
              id='btn-white-outline'
              onClick={()=> increase(product)}>
                ADD MORE</button>
          } */}
          
        </div>
      </div>
    </div>
  );
}

export default withRouter(FeaturedProduct);