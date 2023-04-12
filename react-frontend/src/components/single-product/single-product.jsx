import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import LoadingOverlay from "react-loading-overlay";
import axios from "axios";
import { toast } from "react-toastify";
import { useSpeechSynthesis } from "react-speech-kit";
import withRouter from "../../withRouter";
import Layout from "../shared/layout";
import BMdetailModal from "../BMmodal";
import printingpress_abi from "../../utils/contract/PrintingPress.json";
import cc_abi from "../../utils/contract/CultureCoin.json";
import BT_abi from "../../utils/contract/BookTradable.json";
import "./single-product.styles.scss";

LoadingOverlay.propTypes = undefined;

const SingleProduct = ({ match }) => {
  const { account } = useWeb3React();
  const { speak } = useSpeechSynthesis();

  const web3 = new Web3(window.ethereum);

  const printpress_abi = printingpress_abi;
  const bt_abi = BT_abi;
  const printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
  const cc_address = process.env.REACT_APP_CULTURECOINADDRESS;

  const navigate = useNavigate();
  const [pdfcontent, setPdfcontent] = useState([]);
  const [bmcontent, setBmcontent] = useState([]);
  const [bookmarkinfo, setBookmarkinfo] = useState(null);
  const [booktypes, setBooktypes] = useState([]);
  const [pdftext, setPdftext] = useState("");
  const [pdfimage, setPdfimage] = useState("");
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [curserialnum, setCurserialnum] = useState(0);
  const [loading, setLoading] = useState(false);

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
          }
        })
        .catch((error) => console.log(error));
    }
    
    getBook();
  }, [id, navigate]);

  // while we check for product
  if (!product) {
    return false;
  }
  
  const {
    image_url,
    title,
    author_name,
    book_price,
    hardbound_price,
    introduction,
    bt_contract_address,
    book_type_id,
    bm_listdata,
    book_description,
    hardbound_description
  } = product;

  const onBuyBook = async () => {
    if (!account) {
      return;
    }
    setLoading(true);
    if(!bt_contract_address) {
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

      const bt_contract = new web3.eth.Contract(bt_abi, bt_contract_address);

      await printpress_contract.methods
        .buyBook(bt_contract_address)
        .send({ from: account, value: web3.utils.toWei(String(book_price)) });
      
      // await ccoin_contract.methods.approve(printpress_address, web3.utils.toWei(String(book_price))).send({ from: account });
      // await printpress_contract.methods
      //   .buyBook(bt_contract_address, web3.utils.toWei(String(book_price)))
      //   .send({ from: account });

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
      console.log("error => ", error)
      toast.error("failed buy book!", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getPdfData = async (testurl) => {
    const config = {
      method: "get",
      url: testurl,
    };
    await axios(config).then((res) => {
      if(res.data.content === "You are not token owner!!") {
        toast.error(res.data.content, {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setPdfimage(res.data.book_image);
      setPdftext(res.data.content);
      let bmcount = 0;
      if (bm_listdata.length > 0) {
        
        bm_listdata.map((item) => {
          bmcount += item.maxbookmarksupply;
          return bmcount;
        })
      } else {
        bmcount = 1;
      }
      var bookcontent = [];
      var bookmarks = [];
      
      if (bm_listdata.length > 0) {
        bm_listdata.map((item, index) => {
          for (let i = 0; i < item.maxbookmarksupply; i++) {
            bookmarks.push({
              tokenname: item.tokenname,
              tokenprice: item.bookmarkprice,
              contract_address: item.item_bmcontract_address,
              token_id: i
            })
          }
          // return bookmarks;
        });
        setBmcontent(bookmarks)
      } else {
        
      }

      for (
        let i = 0, charsLength = res.data.content?.length;
        i < charsLength;
        i += charsLength / bmcount
      ) {
        bookcontent.push(res.data.content.substring(i, i + charsLength / bmcount));
      }
      setPdfcontent(bookcontent);
    });
  };

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
    if(!bt_contract_address) {
      return;
    }
    setLoading(true);
    const cur_address = account;
    const bt_contract = new web3.eth.Contract(bt_abi, bt_contract_address);
    const booktoken_cnt = await bt_contract.methods.balanceOf(account).call();

    let testurl;
    var sender;
    if (account) {
      sender = cur_address;
    } else {
      sender = "";
    }
    if (booktoken_cnt === 0) {
      testurl = process.env.REACT_APP_API + `art/${id}?sender=` + sender;
    } else {
      testurl = process.env.REACT_APP_API + `art/${id}?sender=` + sender;
    }

    getPdfData(testurl);
    setLoading(false);
  };

  const onSaveBook = () => {
    if (!account) {
      return;
    }
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

  const showBMModal = (index) => {
    if (!account) {
      return;
    }
    setCurserialnum(index);
    setBookmarkinfo(bmcontent[index])
    setModalShow(true);
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
              ): (
                <></>
              )}
              <div className="book-introduction">{introduction}</div>
              <div className="buybook-area">
                <span className="bookprice-tag">{book_price}</span>
                <button
                  type="button"
                  className="btn btn-buybook"
                  onClick={() => onBuyBook()}
                >
                  Buy Now
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
                      src="/assets/img/bookmark.png"
                      alt="bookmark brand"
                    ></img>
                  </div>
                  <h4 className="item-title">Book</h4>
                  <p className="item-description">
                    {book_description}
                  </p>
                  <div className="buyaction-area">
                    <span className="price-area">{Number(book_price)}</span>
                    <button
                      className="btn btn-item"
                      onClick={() => onBuyBook()}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="addtional-item">
                  <div className="img-area">
                    <img
                      src="/assets/img/bookmark.png"
                      alt="bookmark brand"
                    ></img>
                  </div>
                  <h4 className="item-title">Hardbound</h4>
                  <p className="item-description">
                    {hardbound_description}
                  </p>
                  <div className="buyaction-area">
                    <span className="price-area">{Number(hardbound_price)}</span>
                    <button className="btn btn-item">Buy Now</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="addtional-item">
                  <div className="img-area">
                    <img
                      src="/assets/img/bookmark.png"
                      alt="bookmark brand"
                    ></img>
                  </div>
                  <h4 className="item-title">Bookmark</h4>
                  <p className="item-description">
                    {"Creating an effective description for a bookmark is important for SEO and usability."}
                  </p>
                  <div className="buyaction-area">
                    <span className="price-area">{bm_listdata[0]['bookmarkprice']}</span>
                    <button className="btn btn-item">Buy Now</button>
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
            <p className="include-content">
              {introduction}
            </p>
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
                <div className="detail-content">
                </div>
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
              <div
                className="pdf-image"
                dangerouslySetInnerHTML={{ __html: pdfimage }}
              />
              <div className="pdf-content" dangerouslySetInnerHTML={{__html: pdftext}}>
                {/* {pdfcontent.map((item, i) => {
                  return (
                    <span className="" key={i} onClick={() => showBMModal(i)}>
                      {item}
                    </span>
                  );
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
    </Layout>
  );
};

export default withRouter(SingleProduct);
