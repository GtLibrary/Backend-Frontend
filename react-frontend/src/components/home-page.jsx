import React, { useState, useEffect } from 'react';
import AdSense from 'react-adsense';
import axios from 'axios';
import Layout from './shared/layout';
import Hero from './hero/hero';
import MainSection from './main-section/main-section';
import FeaturedCollection from './featured-collection/featured-collection';

const HomePage = () => {
  const [products, setProducts] = useState([])

  const getBooklists = async () => {
    const { data } = await axios
        .get('http://localhost:5000/api/getbooklist')
    setProducts(data)
  }

  useEffect(() => {
      getBooklists()
  }, [])
  return (
    <>
      <Layout>
        <Hero />
        <MainSection />
        <AdSense.Google
          client='ca-pub-7292810486004926'
          slot='7806394673'
          style={{ display: 'block' }}
          layout='in-article'
          format='fluid'
        />
        <FeaturedCollection products={products} />
      </Layout>
    </>
  );
}

export default HomePage;