import React from 'react';
import withRouter from '../../withRouter';
import { useNavigate } from "react-router-dom";
import './featured-product.styles.scss';

const FeaturedProduct = (props) => {
  const navigate = useNavigate();
  const { title, image_url, book_price, author_name, id, description } = props;

  return (
    <div className='col-md-3 col-sm-6 col-xs-12'>
      <div className="featured-product">
        <div className='featured-image' onClick={() => navigate(`/product/${id}`)}>
          <img src={image_url} alt='product' />
        </div>
        <div className='featured-body'>
          <div className="item-title">{title}</div>
          <p className="item-author">By {author_name}</p>
          
          <div className="buybook-area">
            <span className="bookprice-tag">${book_price}</span>
            <button type="button" className="btn btn-buybook">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(FeaturedProduct);