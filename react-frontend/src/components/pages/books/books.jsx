import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../shared/layout';
import FeaturedProduct from '../../shared/featured-product';
import './books.styles.scss';

const Books = () => {
  
  const [products, setProducts] = useState([])

  const getBooklists = async () => {
    const { data } = await axios
        .get('http://localhost:5000/api/getbooklist')
    setProducts(data)
  }

  useEffect(() => {
      getBooklists()
  }, [])

  const allProducts = products.map(product => (
    <FeaturedProduct { ...product } key={product.id} />
  ));

  return (
    <Layout>
      <div className='product-list-container'>
        <h2 className='product-list-title'>Books</h2>
        <div className='product-list'>
          {
            allProducts
          }
        </div>
      </div>
    </Layout>
  );
}

export default Books;