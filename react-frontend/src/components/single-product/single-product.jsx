import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import withRouter from '../../withRouter';
import Layout from '../shared/layout';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './single-product.styles.scss';

const SingleProduct = ({ match }) => {
  const navigate = useNavigate();
  const [pdfcontent, setPdfcontent] = useState('');
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    const bookurl = `http://localhost:5000/api/bookdata/${id}`
    
    async function getBook() {
      const config = {
        method: 'get',
        url: bookurl,
      }
      let res = await axios(config)
      .then(res => {
        if (res.status !== 200) {
          return navigate('/books');
        }
        setProduct(res.data[0]);
      })
    }
    
    getBook();

  }, [id]);

  const url = `http://localhost:5000/api/bookcontent/${id}`;

  useEffect(() => {
    async function getPdfData() {
      const config = {
        method: 'get',
        url: url,
      }
      let res = await axios(config)
      .then(res => {
        setPdfcontent(res.data)
      })
    }
    
    getPdfData();
  }, []);


  const testurl = `http://localhost:5000/api/art/${id}`;

  useEffect(() => {
    async function getPdfData() {
      const config = {
        method: 'get',
        url: testurl,
      }
      let res = await axios(config)
      .then(res => {
        setPdfcontent(res.data)
      })
    }
    
    getPdfData();
  }, []);
  // while we check for product
  if (!product) { return null }
  const { image_url, title, book_price, introduction } = product;
  return (
    <Layout>
      <div className='single-product-container'>
        <div className="product-content">
          <div className='pdf-maincontent' dangerouslySetInnerHTML={{__html: pdfcontent}}  />
        </div>
        <div className='product-details'>
          <div className='name-price'>
            <h3>{title}</h3>
            {/* <strong><i>{author}</i></strong>  */}
            <h5>{introduction}</h5>
            <p><i>${book_price}</i></p>
          </div>

          <div className='add-to-cart-btns'>
            {/* {
              <button 
                className='button is-white nomad-btn' 
                id='btn-white-outline'
                onClick={() => addProduct(product)}>
                  ADD TO CART
              </button> 
            }
            {
              <button 
                className='button is-white nomad-btn' 
                id='btn-white-outline'
                onClick={()=> increase(product)}>
                  ADD MORE
              </button>
            }
            <Link to='/checkout'>
            <button className='button is-black nomad-btn' id='btn-white-outline'>
              PROCEED TO CHECKOUT
            </button>
            </Link> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withRouter(SingleProduct);