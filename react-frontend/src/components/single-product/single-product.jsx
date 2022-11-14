import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import withRouter from '../../withRouter';
import Layout from '../shared/layout';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './single-product.styles.scss';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import BMdetailModal from "../BMmodal"
// import { chainName } from '../../default'

const SingleProduct = ({ match }) => {
  const { user } = useMoralis();
  const navigate = useNavigate();
  const [pdfcontent, setPdfcontent] = useState([]);
  const [pdfimage, setPdfimage] = useState('');
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const Web3Api = useMoralisWeb3Api();

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

  // const url = `http://localhost:5000/api/bookcontent/${id}`;

  // useEffect(() => {
  //   async function getPdfData() {
  //     const config = {
  //       method: 'get',
  //       url: url,
  //     }
  //     let res = await axios(config)
  //     .then(res => {
  //       setPdfcontent(res.data)
  //     })
  //   }
    
  //   getPdfData();
  // }, []);


  useEffect(() => {

    let testurl = `http://localhost:5000/api/art/${id}`;
    if(user) {
      // var signature = user.get("authData").moralisEth.signature;
      // var msg = btoa(user.get("authData").moralisEth.data)
      var sender = user.get("ethAddress")
      // testurl = `http://localhost:5000/api/art/${id}?msg=` + msg + `&sig=` + signature;
      // testurl = `http://localhost:5000/api/art/${id}?sender=` + sender;
    }
    
    async function getPdfData() {
      const config = {
        method: 'get',
        url: testurl,
      }
      await axios(config)
      .then(res => {
        setPdfimage(res.data.book_image);

        var chunks = [];
        for (let i = 0, charsLength = (res.data.content)?.length; i < charsLength; i += 400) {
            chunks.push(res.data.content.substring(i, i + 400));
        }
        setPdfcontent(chunks);
      })
    }
    
    getPdfData();
  }, []);
  // while we check for product
  if (!product) { return null }
  const { image_url, title, book_price, datamine, introduction, bookmark_price, bt_contract_address, bm_contract_address, hb_contract_address } = product;

  const showBMModal = (i) => {
    setModalShow(true)
  }

  return (
    <Layout>
      <div className='single-product-container container'>
        <div className="row">
          <div className='col-md-4'>
            <div className="product-brandimage">
              <img className="img-responsive" src={image_url}></img>
            </div>
          </div>
          <div className="col-md-8 detail-area">
            <div className="product-detailinfo">
              <h5>{title}</h5>
              <h6>By John R Raymond</h6>
              <div className="product-category">Sci/Fi Fantasy</div>
              <p>{introduction}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="product-content">
            <div className="action-area">
              <button className="btn btn-action"><i className="fa fa-refresh"></i> Refresh</button>
              <button className="btn btn-action"><i className="fa fa-download"></i> Save Book</button>
              <button className="btn btn-action"><i className="fa fa-book"></i> Read Book</button>
              <button className="btn btn-action"><i className="fa fa-headphones"></i> Audio Book</button>
              <button className="btn btn-action"><i className="fa fa-money"></i> Buy Book</button>
            </div>
            <div className="pdf-maincontent">
              <div className="pdf-image" dangerouslySetInnerHTML={{__html: pdfimage}} />
              <div className="pdf-content">
                { pdfcontent.map((item, i) => {
                  return (
                    <span className="" key={i} onClick={() => showBMModal(i)}>{item}</span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="bookmark-area">      
              <h3 className="bookmark-title">BookMark</h3>
              <div className="bookmark-content">
                <div className="bookmark-imagearea">
                    <div className="bookimage-area">
                      {/* <img className="img-responsive" src={}></img> */}
                    </div>
                </div>
                <div className="bookmark-description">
                  <p>Purchasing the bookmark will progress the story for others, and you will be able to read the full book free. Currently BETA.</p>
                  <p><bold>Book May Also Include:</bold></p>
                  <ul>
                    <li>Free Audio Book Code</li>
                    <li>BEN, the AI cat</li>
                    <li>Ticket for the Movie</li>
                    <li>Author's Brain-In-A-Jar</li>
                  </ul>  
                </div>
              </div> 
            </div>
          </div>
        </div>
      </div>
      <BMdetailModal show={modalShow} onHide={() => setModalShow(false)} product={product} />
    </Layout>
  );
}

export default withRouter(SingleProduct);