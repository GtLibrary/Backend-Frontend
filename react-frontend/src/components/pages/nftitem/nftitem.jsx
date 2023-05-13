import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './nftitem.styles.scss';

const Nftitem = () => {
  
    const [products, setProducts] = useState([])

    const getBooklists = async () => {
        // const { data } = await axios
        //     .get(process.env.REACT_APP_API + 'getbooklist')
        // setProducts(data)
    }

    useEffect(() => {
        getBooklists()
    }, [])


    return (
        <div>
            <div className='product-list-container container'>
                <h2 className='product-list-title'>Nftitem</h2>
            </div>
        </div>
    );
}

export default Nftitem;