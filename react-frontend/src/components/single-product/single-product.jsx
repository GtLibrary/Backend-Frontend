import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import withRouter from '../../withRouter';
import Layout from '../shared/layout';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './single-product.styles.scss';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import BMdetailModal from "../BMmodal"
import printingpress_abi from "../../utils/contract/PrintingPress.json"
import BT_abi from "../../utils/contract/BookTradable.json"
import Web3 from 'web3';


const SingleProduct = ({ match }) => {
  
  const { user } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const providerUrl = process.env.REACT_APP_PROVIDERURL;

  const web3 = new Web3(window.ethereum);

  const printpress_abi = printingpress_abi;
  const bt_abi = BT_abi;
  const printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
  const cCA = process.env.REACT_APP_CCA;
  const cCAPrivateKey = process.env.REACT_APP_CCAPRIVATEKEY;

  const premiumGas = process.env.REACT_APP_PREMIUMGAS;
  const gw100 = web3.utils.toWei('25.01', 'gwei');

  const navigate = useNavigate();
  const [pdfcontent, setPdfcontent] = useState([]);
  const [pdfimage, setPdfimage] = useState('');
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [curserialnum, setCurserialnum] = useState(0)


  useEffect(() => {
    const bookurl = process.env.REACT_APP_API + `bookdata/${id}`
    
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

  useEffect(() => {

  }, []);

  // while we check for product
  if (!product) { return null }
  const { image_url, title, author_name, book_price, datamine, introduction, bookmark_price, bt_contract_address, bm_contract_address, hb_contract_address, booktype } = product;

  const onBuyBook = async () => {
      const printpress_contract = new web3.eth.Contract(printpress_abi, printpress_address);
      const bt_contract = new web3.eth.Contract(bt_abi, bt_contract_address);
      const account = web3.eth.accounts.privateKeyToAccount(cCAPrivateKey).address;   
      const transaction = await bt_contract.methods.setAddon(printpress_address, true);
      const options = {
          from    : account,
          to      : transaction._parent._address,
          data    : transaction.encodeABI(),
          gas     : premiumGas
      };
      const signed  = await web3.eth.accounts.signTransaction(options, cCAPrivateKey);
      const result = await web3.eth.sendSignedTransaction(signed.rawTransaction);

      await printpress_contract.methods.buyBook(bt_contract_address).send({from: user.get("ethAddress"), value: web3.utils.toWei(String(book_price))});
  }

  const getPdfData = async (testurl) => {
    const config = {
      method: 'get',
      url: testurl,
    }
    await axios(config)
    .then(res => {
      setPdfimage(res.data.book_image);

      var chunks = [];
      for (let i = 0, charsLength = (res.data.content)?.length; i < charsLength; i += (charsLength/(2000))) {
          chunks.push(res.data.content.substring(i, i + (charsLength/(2000))));
      }
      setPdfcontent(chunks);
    })
  }

  const onReadBook = async () => {
    const cur_address = user.get("ethAddress")
    const options = {
      address: cur_address,
      token_address: bt_contract_address,
    };
    const bookTokens = await Web3Api.account.getNFTsForContract(options);
  
    let testurl;
    var sender;
    if(user) {
      sender = cur_address
    } else {
      sender = "";
    }
    if (bookTokens.total == 0) {
      testurl = process.env.REACT_APP_API + `art/${id}?sender=` + sender;
    } else {
      let tokenId = bookTokens.result[0].token_id;
      testurl = process.env.REACT_APP_API + `art/${id}?sender=` + sender + `&tokenid=` + tokenId;
    }
  
    getPdfData(testurl);

  }

  const onSaveBook = () => {
    const pageHTML = document.querySelector(".pdf-content").outerHTML;
    const blob = new Blob([pageHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const tempEl = document.createElement("a");
    document.body.appendChild(tempEl);
    tempEl.href = url;
    tempEl.download = title + ".download.html";
    tempEl.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      tempEl.parentNode.removeChild(tempEl);
    }, 2000);
  }

  const onRefresh = () => {
    window.location.reload();
  }

  const showBMModal = (index) => {
    setCurserialnum(index)
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
              <h6>By {author_name}</h6>
              <div className="product-category">Sci/Fi Fantasy</div>
              <p>{introduction}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="product-content">
            <div className="action-area">
              <button className="btn btn-action" onClick={() => onRefresh()}><i className="fa fa-refresh"></i> Refresh</button>
              <button className="btn btn-action" onClick={() => onSaveBook()}><i className="fa fa-download"></i> Save Book</button>
              <button className="btn btn-action" onClick={() => onReadBook()}><i className="fa fa-book"></i> Read Book</button>
              <button className="btn btn-action"><i className="fa fa-headphones"></i> Audio Book</button>
              <button className="btn btn-action" onClick={() => onBuyBook()}><i className="fa fa-money"></i> Buy Book</button>
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
                      <img className="img-responsive" src="/assets/bookmark.png" alt="bookmark image"></img>
                    </div>
                </div>
                <div className="bookmark-description">
                  <p>Purchasing the bookmark will progress the story for others, and you will be able to read the full book free. Currently BETA.</p>
                  <p><b>Book May Also Include:</b></p>
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
      <BMdetailModal show={modalShow} onHide={() => setModalShow(false)} product={product} curserial_num={curserialnum} />
    </Layout>
  );
}

export default withRouter(SingleProduct);