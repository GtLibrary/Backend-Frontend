import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../shared/layout';
import Collection from '../../shared/collection';
import './marketplace.styles.scss';

const Marketplace = () => {
  
    const [products, setProducts] = useState([])

    const getBooklists = async () => {
        const { data } = await axios
            .get(process.env.REACT_APP_API + 'getbooklist')
        setProducts(data)
    }

    useEffect(() => {
        getBooklists()
    }, [])

    const allProducts = products.map(product => (
        <Collection { ...product } key={product.id} />
    ));

    return (
        <Layout>
            <div className='product-list-container container'>
                <h2 className='product-list-title'>Marketplace</h2>
                <div className='product-list row'>
                {
                    allProducts
                }
                </div>
            </div>
        </Layout>
    );
}

export default Marketplace;