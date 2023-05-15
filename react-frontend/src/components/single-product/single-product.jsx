import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { ethers } from "ethers";
import LoadingOverlay from "react-loading-overlay";
import axios from "axios";
import { toast } from "react-toastify";
import { useSpeechSynthesis } from "react-speech-kit";
import withRouter from "../../withRouter";
import Layout from "../shared/layout";
import BMdetailModal from "../BMmodal";
import SavebookModal from "../SBmodal";
import printingpress_abi from "../../utils/contract/PrintingPress.json";
import cc_abi from "../../utils/contract/CultureCoin.json";
import NBT_abi from "../../utils/contract/BookTradable.json";
import "./single-product.styles.scss";

LoadingOverlay.propTypes = undefined;

const SingleProduct = ({ match }) => {
  const { account } = useWeb3React();
  const { speak } = useSpeechSynthesis();
  const { ethereum } = window;

  const web3 = new Web3(window.ethereum);

  const printpress_abi = printingpress_abi;
  const bt_abi = NBT_abi;
  const printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
  const cc_address = process.env.REACT_APP_CULTURECOINADDRESS;
  const current_symbol = process.env.REACT_APP_NATIVECURRENCYSYMBOL;
  const _cCA = process.env.REACT_APP_CCA;

  const navigate = useNavigate();
  const [bookmarkinfo, setBookmarkinfo] = useState(null);
  const [booktypes, setBooktypes] = useState([]);
  const [pdftext, setPdftext] = useState("");
  const [dexrate, setDexrate] = useState(0);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [sbmodalshow, setSbmodalshow] = useState(false);
  const [curserialnum, setCurserialnum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagecontent, setPagecontent] = useState(null);

  useEffect(() => {
    const bookurl = process.env.REACT_APP_API + `bookdata/${id}`;
    const booktypeurl = process.env.REACT_APP_API + `booktype/list`;

    const getBook = async () => {
      const typeconfig = {
        method: "get",
        url: booktypeurl,
      };
      await axios(typeconfig).then((res) => {
        let booktypearr = [];
        res.data.map((item, key) => {
          if (!booktypearr[item.id]) booktypearr[item.id] = item.booktype;
        });
        setBooktypes(booktypearr);
      });
      const config = {
        method: "get",
        url: bookurl,
      };
      await axios(config)
        .then((res) => {
          if (res.status !== 200) {
            return navigate("/books");
          } else {
            setProduct(res.data[0]);
            window.product = res.data[0];
          }
        })
        .catch((error) => console.log(error));
    };

    getBook();
  }, [id, navigate]);

  useEffect(() => {
    const getDexrate = async () => {
      if (ethereum) {
        const ccoin_contract = new web3.eth.Contract(
          cc_abi,
          cc_address
        );
        const curdexrate = await ccoin_contract.methods.dexCCRate().call();
        setDexrate(web3.utils.fromWei(curdexrate));
      }
    }
    getDexrate();
  }, [])

  useEffect(() => {
    const handleValueChange = () => {
      myReaction();
    };

    window.addEventListener("myValueChange", handleValueChange);
    return () => {
      window.removeEventListener("myValueChange", handleValueChange);
    };


    async function myReaction() {
      var index = window.myValue;
      var product = window.product;
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const bookTradable = new ethers.Contract(
          product.bm_listdata[0].item_bmcontract_address,
          bt_abi,
          signer
      );
      const curtotalsupply = await bookTradable.totalSupply();

      var bmcontent = {};
      if (Number(curtotalsupply) > index) {
        bmcontent.bm_id = index;
        bmcontent.token_id = index;
        bmcontent.tokenname = product.title;
        bmcontent.tokenprice = product.bm_listdata[0].bookmarkprice; // "Caluclate this inside the modal.";//getPriceOfToken(); // product.bm_listdata.
        bmcontent.contract_address = product.bm_listdata[0].item_bmcontract_address;
        bmcontent.product = product;
        bmcontent.curdexrate = dexrate;
      } else {
        bmcontent.bm_id = index;
        bmcontent.token_id = Number(curtotalsupply);
        bmcontent.tokenname = product.title;
        bmcontent.tokenprice = product.bm_listdata[0].bookmarkprice; // "Caluclate this inside the modal.";//getPriceOfToken(); // product.bm_listdata.
        bmcontent.contract_address = product.bm_listdata[0].item_bmcontract_address;
        bmcontent.product = product;
        bmcontent.curdexrate = dexrate;
      }
      
      setCurserialnum(index);
      setBookmarkinfo(bmcontent);
      setModalShow(true);
    }

  }, []);

  // while we check for product
  if (!product) {
    return false;
  }

  const {
    image_url,
    title,
    datamine,
    author_name,
    book_price,
    hardbound_price,
    introduction,
    bt_contract_address,
    hb_contract_address,
    book_type_id,
    bm_listdata,
    book_description,
    hardbound_description,
  } = product;

  const onBuyBook = async () => {
    if (!account) {
      return;
    }
    setLoading(true);
    if (!bt_contract_address) {
      return;
    }
    try {
      const printpress_contract = new web3.eth.Contract(
        printpress_abi,
        printpress_address
      );

      await printpress_contract.methods
        .buyBook(bt_contract_address)
        .send({ from: account, value: web3.utils.toWei(String(book_price)) });

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
      const printpress_contract = new web3.eth.Contract(
        printpress_abi,
        printpress_address
      );
      const ccoin_contract = new web3.eth.Contract(
        cc_abi,
        cc_address
      );

      var price = book_price / dexrate + 0.00001;

      await ccoin_contract.methods.approve(printpress_address, web3.utils.toWei(String(price))).send({ from: account });
      await printpress_contract.methods
        .buyBookCC(bt_contract_address,  web3.utils.toWei(String(price)))
        .send({ from: account });

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

  const onBuyHardbound = async () => {
    if (!account) {
      return;
    }
    setLoading(true);
    if (!hb_contract_address) {
      return;
    }
    try {
      const printpress_contract = new web3.eth.Contract(
        printpress_abi,
        printpress_address
      );

      await printpress_contract.methods
        .buyBook(hb_contract_address)
        .send({ from: account, value: web3.utils.toWei(String(hardbound_price)) });

      // await ccoin_contract.methods.approve(printpress_address, web3.utils.toWei(String(book_price))).send({ from: account });
      // await printpress_contract.methods
      //   .buyBook(bt_contract_address, web3.utils.toWei(String(book_price)))
      //   .send({ from: account });

      setLoading(false);
      toast.success("successfully buy Hardbound!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setLoading(false);
      toast.error("failed buy hardbound!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onBuyHardboundCC = async () => {
    if (!account) {
      return;
    }
    setLoading(true);
    if (!hb_contract_address) {
      return;
    }
    try {
      const printpress_contract = new web3.eth.Contract(
        printpress_abi,
        printpress_address
      );

      const ccoin_contract = new web3.eth.Contract(
        cc_abi,
        cc_address
      );

      var price = hardbound_price / dexrate + 0.00001;

      await ccoin_contract.methods.approve(printpress_address, web3.utils.toWei(String(price))).send({ from: account });
      await printpress_contract.methods
        .buyBookCC(hb_contract_address,  web3.utils.toWei(String(price)))
        .send({ from: account });

      setLoading(false);
      toast.success("successfully buy Hardbound!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setLoading(false);
      toast.error("failed buy hardbound!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onBuyBookmark = async () => {
    if (!account) {
      return;
    }
    setLoading(true);
    if (!bm_listdata[0]['item_bmcontract_address']) {
      return;
    }
    try {
      const printpress_contract = new web3.eth.Contract(
        printpress_abi,
        printpress_address
      );

      await printpress_contract.methods
        .buyBook(bm_listdata[0]['item_bmcontract_address'])
        .send({ from: account, value: web3.utils.toWei(String(bm_listdata[0]['bookmarkprice'])) });

      setLoading(false);
      toast.success("successfully buy bookmark!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setLoading(false);
      toast.error("failed buy bookmark!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onBuyBookmarkCC = async () => {
    if (!account) {
      return;
    }
    setLoading(true);
    if (!bm_listdata[0]['item_bmcontract_address']) {
      return;
    }
    try {
      const printpress_contract = new web3.eth.Contract(
        printpress_abi,
        printpress_address
      );
      const ccoin_contract = new web3.eth.Contract(
        cc_abi,
        cc_address
      );

      var price = bm_listdata[0]['bookmarkprice'] / dexrate + 0.00001;

      await ccoin_contract.methods.approve(printpress_address, web3.utils.toWei(String(price))).send({ from: account });
      await printpress_contract.methods
        .buyBookCC(bm_listdata[0]['item_bmcontract_address'],  web3.utils.toWei(String(price)))
        .send({ from: account });

      setLoading(false);
      toast.success("successfully buy bookmark!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setLoading(false);
      toast.error("failed buy bookmark!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getPdfData = async () => {
    
    const cur_address = account;

    const libraryNonce = await web3.eth.getTransactionCount(_cCA);
    const signingMessage = "" + libraryNonce + " Great Library \n" + datamine + ": Connect to begin your journey"
    const signature = await web3.eth.personal.sign(signingMessage, cur_address);
    const testurl = process.env.REACT_APP_API + `art/${id}`;

    const config = {
      method: "post",
      url: testurl,
      data: {
        msg: signingMessage,
        signature: signature
      }
    };
    
    try {
      await axios(config).then((res) => {
        if (res.data.content === "You are not token owner!!") {
          toast.error(res.data.content, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
  
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(res.data.content, "text/html");
        const html = htmlDoc.body.innerHTML;
  
        if (html === "You are not token owner!!") {
          setPdftext(html);
        } else {
          var bookHtml = addOnClicks(html);
          document.getElementById("reader-body").innerHTML = bookHtml;
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  function addOnClicks(html) {
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    var spans = [];
    var pTags = tempDiv.getElementsByTagName("p");
    for (var i = 0; i < pTags.length; i++) {
      var spanTags = pTags[i].getElementsByTagName("span");
      for (var j = 0; j < spanTags.length; j++) {
        spans.push(spanTags[j]);
      }
    }
    var spanAmount = Number(product.byteperbookmark) > 0 ? Number(product.byteperbookmark) : 2048;
    var bookmarkId = 0;
    var currentIndex = 0;
    while (currentIndex < spans.length) {
      var span = spans[currentIndex];
      var text = span.innerText;
      var start = 0;

      var newSpans = [];
      while (start < text.length) {
        var end = Math.min(start + spanAmount, text.length);
        var remainingChars = spanAmount - (end - start);

        var newSpan = document.createElement("span");
        newSpan.innerText = text.substring(start, end);

        var nextStyle = span.getAttribute("style");
        newSpan.setAttribute("style", nextStyle);

        newSpan.setAttribute(
          "onclick",
          "window.myValue =" +
            bookmarkId +
            '; window.dispatchEvent(new Event("myValueChange"));'
        );

        newSpans.push(newSpan);
        start = end;
        if (remainingChars === 0) {
          bookmarkId++;
        }
      }

      for (let j = newSpans.length - 1; j >= 0; j--) {
        let newSpan = newSpans[j];
        span.parentNode.insertBefore(newSpan, span.nextSibling);
      }

      currentIndex++;
    }

    for (let i = 0; i < spans.length; i++) {
      let span = spans[i];
      span.parentNode.removeChild(span);
    }

    return tempDiv.innerHTML;
  }

  const onReadBook = async () => {
    if (!account) {
      toast.error("Please Connect Wallet!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    if (!bt_contract_address) {
      return;
    }
    setLoading(true);
    await getPdfData();
    setLoading(false);
  };

  const onSaveBook = () => {
    if (!account) {
      return;
    }
    const pageHTML = document.querySelector(".pdf-content").outerHTML;
    setPagecontent(pageHTML)
    setSbmodalshow(true);
    
  };

  const onAudioBook = () => {
    if (!account) {
      return;
    }
    speak({ text: pdftext });
  };

  const onRefresh = () => {
    window.location.reload();
  };

  return (
    <Layout>
      {loading && (
        <div
          style={{
            background: "#00000055",
            width: "100%",
            height: "100%",
            zIndex: "1000",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <LoadingOverlay
            active={true}
            spinner={true}
            text="Loading ..."
            styles={{
              overlay: (base) => ({
                ...base,
                background: "rgba(255, 255, 255)",
                position: "absolute",
                marginTop: "300px",
              }),
            }}
            fadeSpeed={9000}
          ></LoadingOverlay>
        </div>
      )}
      <div className="single-product-container container">
        <div className="row">
          <div className="top-hr">
            <img src="/assets/img/top-hr.png" alt="top hr" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="product-brandimage">
              <img
                className="img-responsive"
                src={image_url}
                alt="product brand "
              ></img>
            </div>
          </div>
          <div className="col-md-8 detail-area">
            <div className="product-detailinfo">
              <h4 className="book-title">{title}</h4>
              <h6 className="book-authorname">By {author_name}</h6>
              {book_type_id ? (
                <span className="book-category">{booktypes[book_type_id]}</span>
              ) : (
                <></>
              )}
              <div className="book-introduction">{introduction}</div>
              <div className="buybook-area">
                <span className="bookprice-tag">{Number(book_price)} {current_symbol}</span>
                <button
                  type="button"
                  className="btn btn-buybook"
                  onClick={() => onBuyBook()}
                >
                  Buy Now
                </button>
              </div>
              <div className="buybook-area">
                <span className="bookprice-tag">{(Number(book_price) / dexrate).toFixed(4)} CC</span>
                <button
                  type="button"
                  className="btn btn-buybook"
                  onClick={() => onBuyBookCC()}
                >
                  Buy with CC
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row additional-area">
          <div className="left-decorader img-responsive">
            <img
              src="/assets/img/left-decorader.png"
              alt="left decorader"
            ></img>
          </div>
          <div className="additional-title">Additional</div>
          <div className="right-decorader img-responsive">
            <img
              src="/assets/img/right-decorader.png"
              alt="right decorader"
            ></img>
          </div>
        </div>
        <div className="addtional-content">
          <div className="additional-itemarea">
            <div className="row">
              <div className="col-md-4">
                <div className="addtional-item">
                  <div className="img-area">
                    <img
                      src={image_url}
                      alt="bookmark brand"
                    ></img>
                  </div>
                  <h4 className="item-title">Book</h4>
                  <p className="item-description">{book_description}</p>
                  <div className="buyaction-area">
                    <span className="price-area">{Number(book_price)} {current_symbol}</span>
                    <button
                      className="btn btn-item"
                      onClick={() => onBuyBook()}
                    >
                      Buy Now
                    </button>
                  </div>
                  <div className="buyaction-area">
                    <span className="price-area">{(Number(book_price) / dexrate).toFixed(4)} CC</span>
                    <button
                      type="button"
                      className="btn btn-item"
                      onClick={() => onBuyBookCC()}
                    >
                      Buy with CC
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="addtional-item">
                  <div className="img-area">
                    <img
                      src={image_url}
                      alt="bookmark brand"
                    ></img>
                  </div>
                  <h4 className="item-title">Hardbound</h4>
                  <p className="item-description">{hardbound_description}</p>
                  <div className="buyaction-area">
                    <span className="price-area">
                      {Number(hardbound_price)} {current_symbol}
                    </span>
                    <button className="btn btn-item" onClick={() => onBuyHardbound()}>Buy Now</button>
                  </div>
                  <div className="buyaction-area">
                    <span className="price-area">
                      {(Number(hardbound_price) / dexrate).toFixed(4)} CC
                    </span>
                    <button className="btn btn-item" onClick={() => onBuyHardboundCC()}>Buy with CC</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="addtional-item">
                  <div className="img-area">
                    <img
                      src={image_url}
                      alt="bookmark brand"
                    ></img>
                  </div>
                  <h4 className="item-title">Bookmark</h4>
                  <p className="item-description">
                    {
                      "By owning a bookmark, you not only gain special access and control over a piece of the book, but you also gain access to special parts of the book's game(s). As a bookmark owner, you can participate in the book's success and share in the rewards. Don't miss out on this unique opportunity to own a piece of your favorite book!"
                    }
                  </p>
                  <div className="buyaction-area">
                    <span className="price-area">
                      {bm_listdata[0]["bookmarkprice"]} {current_symbol}
                    </span>
                    <button className="btn btn-item" onClick={() => onBuyBookmark()}>Buy Now</button>
                  </div>
                  <div className="buyaction-area">
                    <span className="price-area">
                      {(Number(bm_listdata[0]["bookmarkprice"]) / dexrate).toFixed(4)} CC
                    </span>
                    <button className="btn btn-item" onClick={() => onBuyBookmarkCC()}>Buy with CC</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="bottom-hr">
              <img src="/assets/img/bottom-hr.png" alt="bottom hr"></img>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <div className="include-head">
              <span className="head-title">Book May Also Include:</span>
              <img
                src="/assets/img/owl.png"
                className="owl-tip"
                alt="owl"
              ></img>
            </div>
          </div>
          <div className="col-md-3"></div>
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <p className="include-content">{introduction}</p>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row bookdetail-area">
          <div className="col-md-6">
            <div className="detail-item">
              <div className="icon-area">
                <img
                  src="/assets/img/headphone.png"
                  className="img-responsive"
                  alt="headphone"
                ></img>
              </div>
              <div className="content-area">
                <div className="detail-title">Free Audio Book Code</div>
                <div className="detail-content"></div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="detail-item">
              <div className="icon-area">
                <img
                  src="/assets/img/tip.png"
                  className="img-responsive"
                  alt="tip"
                ></img>
              </div>
              <div className="content-area">
                <div className="detail-title">Ticket for the Movie</div>
                <div className="detail-content">
                  Each book is also a one time movie ticket.
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="detail-item">
              <div className="icon-area">
                <img
                  src="/assets/img/footprint.png"
                  className="img-responsive"
                  alt="footprint"
                ></img>
              </div>
              <div className="content-area">
                <div className="detail-title">BENJI, the AI cat</div>
                <div className="detail-content">
                  Chat about the book with Benji, the AI cat!
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="detail-item">
              <div className="icon-area">
                <img
                  src="/assets/img/brain.png"
                  className="img-responsive"
                  alt="brand"
                ></img>
              </div>
              <div className="content-area">
                <div className="detail-title">Author's Brain-In-A-Jar</div>
                <div className="detail-content">
                  Propose changes to the author even if they are dead!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row product-main-content">
          <div className="angel-with-bowl">
            <img src="/assets/img/angel-with-bowl.png" alt=""></img>
          </div>
          <div className="product-content">
            <div className="action-area">
              <button className="btn btn-action" onClick={() => onRefresh()}>
                <i className="fa fa-refresh"></i> Refresh
              </button>
              <button className="btn btn-action" onClick={() => onSaveBook()}>
                <i className="fa fa-download"></i> Save Book
              </button>
              <button className="btn btn-action" onClick={() => onReadBook()}>
                <i className="fa fa-book"></i> Read Book
              </button>
              <button className="btn btn-action" onClick={() => onAudioBook()}>
                <i className="fa fa-headphones"></i> Audio Book
              </button>
            </div>
            <div className="pdf-maincontent">
              {/* <div
                className="pdf-image"
                dangerouslySetInnerHTML={{ __html: pdfimage }}
              /> */}
              <div className="pdf-content" id="reader-body"  dangerouslySetInnerHTML={{ __html: pdftext }}>
                {/* {paragraph &&
                  paragraph.map((item, i) => {
                    return item;
                  })} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BMdetailModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        bookmarkinfo={bookmarkinfo}
        id={id}
        curserial_num={curserialnum}
      />
      <SavebookModal 
        show={sbmodalshow}
        onHide={() => {setSbmodalshow(false)}}
        pagecontent={pagecontent}
        title={title}
      ></SavebookModal>
    </Layout>
  );
};

export default withRouter(SingleProduct);
