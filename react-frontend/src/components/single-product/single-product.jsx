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
  const { image_url, title, book_price, introduction, bookmark_price, bt_contract_address, bm_contract_address, hb_contract_address } = product;

  // const fetchNFTsForContract = async () => {
  //   const options = {
  //     chain: chainName,
  //     address: user.get("ethAddress"),
  //     token_address: bt_contract_address,
  //   };
  //   const bookTokens = await Web3Api.account.getNFTsForContract(options);
  //   if(bookTokens.total) {
  //     return bookTokens.result[0].token_id
  //   } else {
  //     return '';
  //   }
  // };
  const showBMModal = (i) => {
    setModalShow(true)
  }

  return (
    <Layout>
      <div className='single-product-container'>
        <div className="product-content">
          {/* <div className='pdf-maincontent' dangerouslySetInnerHTML={{__html: pdfcontent}}  /> */}
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
      <BMdetailModal show={modalShow} onHide={() => setModalShow(false)} bookmark_price={bookmark_price} contract_address={bt_contract_address} />
    </Layout>
  );
}

export default withRouter(SingleProduct);