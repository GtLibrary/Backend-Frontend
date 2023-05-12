import React, { useState, useEffect } from 'react';
import AdSense from 'react-adsense';
import axios from 'axios';
import Layout from './shared/layout';
import Hero from './hero/hero';
import MainSection from './main-section/main-section';
import FeaturedCollection from './featured-collection/featured-collection';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [googleads, setGoogleads] = useState([]);

  /* useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  }, []) */

  const getBooklists = async () => {
    const { data } = await axios
        .get(process.env.REACT_APP_API + 'getbooklist')
    setProducts(data)
    //const { googleads } = await axios.get(process.env.REACT_APP_API + 'getadslist')
    //setGoogleads(googleads)
  }

  useEffect(() => {
      getBooklists()
  }, [])
  return (
    <>
      <Layout>
        <Hero />
        <MainSection />
        {/* { googleads ? (
          googleads.map((item, index) => {
            <AdSense.Google
              client={item.adcontent?item.adcontent.client:''}
              slot={item.adcontent?item.adcontent.slot:''}
              style={{ display: 'block' }}
              layout={item.adcontent?item.adcontent.layout:''}
              format={item.adcontent?item.adcontent.format:''}
            />
          })
        ): (<></>)} */}
        <FeaturedCollection products={products} />
      </Layout>
    </>
  );
}

export default HomePage;
