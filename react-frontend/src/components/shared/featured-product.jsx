import React, { useState } from 'react';
import withRouter from '../../withRouter';
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { toast } from "react-toastify";
import './featured-product.styles.scss';
import printingpress_abi from "../../utils/contract/PrintingPress.json";
import cc_abi from "../../utils/contract/CultureCoin.json";

const FeaturedProduct = (props) => {
  const navigate = useNavigate();
  const { account } = useWeb3React();
  const web3 = new Web3(window.ethereum);
  const { ethereum } = window;

  const { title, image_url, book_price, author_name, id, bt_contract_address, cc_rate } = props;
  const [loading, setLoading] = useState(false);

  const printpress_abi = printingpress_abi;
  const printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
  const cc_address = process.env.REACT_APP_CULTURECOINADDRESS;
  const current_symbol = process.env.REACT_APP_NATIVECURRENCYSYMBOL;

  const onBuyBook = async () => {
    if (!account) {
      return;
    }
    setLoading(true);
    if (!bt_contract_address) {
      return;
    }
    try {
      
      if (ethereum) {
        const printpress_contract = new web3.eth.Contract(
          printpress_abi,
          printpress_address
        );

        await printpress_contract.methods
          .buyBook(bt_contract_address)
          .send({ from: account, value: web3.utils.toWei(String(book_price)) });
      }
      setLoading(false);
      toast.success("successfully buy book!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setLoading(false);
      toast.error("failed buy book!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onBuyBookCC = async () => {
    if (!account) {
      return;
    }
    setLoading(true);
    if (!bt_contract_address) {
      return;
    }
    try {
      if (ethereum) {
        const printpress_contract = new web3.eth.Contract(
          printpress_abi,
          printpress_address
        );
        const ccoin_contract = new web3.eth.Contract(
          cc_abi,
          cc_address
        );

        let price = book_price / cc_rate + 0.00001;
  
        await ccoin_contract.methods.approve(printpress_address, web3.utils.toWei(String(price))).send({ from: account });
        await printpress_contract.methods
          .buyBookCC(bt_contract_address,  web3.utils.toWei(String(price)))
          .send({ from: account });
      }
      setLoading(false);
      toast.success("successfully buy book!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setLoading(false);
      toast.error("failed buy book!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className='col-xs-12 col-sm-6 col-md-6 col-lg-3'>
      <div className="featured-product">
        <div className='featured-image' onClick={() => navigate(`/product/${id}`)}>
          <img src={image_url} alt='product' />
        </div>
        <div className='featured-body'>
          <div className="item-title">{title}</div>
          <p className="item-author">By {author_name}</p>
          
          <div className="buybook-area">
            <span className="bookprice-tag">{Number(book_price)} {current_symbol}</span>
            <button type="button" className="btn btn-buybook" onClick={() => onBuyBook()}>Buy Now</button>
          </div>
          <div className="buybook-area">
            <span className="bookprice-tag">{(Number(book_price / cc_rate)).toFixed(4)} CC</span>
            <button type="button" className="btn btn-buybook" onClick={() => onBuyBookCC()}>Buy with CC</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(FeaturedProduct);
