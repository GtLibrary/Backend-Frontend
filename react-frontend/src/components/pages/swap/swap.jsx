import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import Layout from "../../shared/layout";
import Swapfrom from "./swapfrom";
import Swapto from "./swapto";
import "./swap.styles.scss";
import ccoin_abi from "../../../utils/contract/CultureCoin.json";

const Swap = () => {
  const [maindata, setMaindata] = useState([]);
  const [avaxval, setAvaxval] = useState(0);
  const [ccval, setCcval] = useState(0);
  const [swapflag, setSwapflag] = useState(true);
  const [rate, setRate] = useState(0);
  const [swapstate, setSwapstate] = useState(3);
  const [btndisable, setBtndisable] = useState(true);
  const [btncontent, setBtncontent] = useState('');
  const cultureCoinAddress = process.env.REACT_APP_CULTURECOINADDRESS;
  const { account } = useWeb3React();

  const getdetailData = async () => {
    const { ethereum } = window;

    if (ethereum) {
      let balanceAvax = 0;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CCOINPortal = new ethers.Contract(
        cultureCoinAddress,
        ccoin_abi,
        signer
      );
      if (account) {
        provider.getBalance(account).then((balance) => {
          balanceAvax = ethers.utils.formatEther(balance);
        });
      }
      const promises = [];
      promises.push(await CCOINPortal.dexCCRate());
      promises.push(await CCOINPortal.dexXMTSPRate());
      promises.push(await CCOINPortal.maxCCOut());
      promises.push(await CCOINPortal.maxXOut());
      if(account) {
        promises.push(await CCOINPortal.balanceOf(account));
      }

      Promise.all(promises).then((responses) => {
        let promisedata = [];
        promisedata["avax_val"] = Number(balanceAvax).toFixed(3);
        promisedata["dex_ccrate"] = (Number(ethers.utils.formatEther(responses[0]))).toFixed(5);
        promisedata["dex_xmstrate"] = (Number(ethers.utils.formatEther(responses[1]))).toFixed(5);
        promisedata["max_ccout"] = (Number(ethers.utils.formatEther(responses[2]))).toFixed(3);
        promisedata["max_xout"] = (Number(ethers.utils.formatEther(responses[3]))).toFixed(3);
        if(account) {
          promisedata["cc_val"] = (Number(ethers.utils.formatEther(responses[4]))).toFixed(3);
        }
        setMaindata(promisedata);
      });
    }
  };

  useEffect(() => {
    getdetailData();
  }, [account]);

  useEffect(() => {
    switch (swapstate) {
      case 0:
        setBtndisable(false);
        if(swapflag) {
          setBtncontent('Swap Avax to CCoin')
        } else {
          setBtncontent('Swap CCoin to Avax')
        }
        break;
      case 1:
        setBtndisable(true);
        setBtncontent('Insufficiant Value')
        break;
      case 2:
        setBtndisable(true);
        setBtncontent('Max amount out')
        break;
      case 3:
        setBtndisable(true);
        setBtncontent('Input amount')
        break;
      default:
        break;
    }
  }, [swapstate])

  const swapToAvax = async (amount) => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CCOINPortal = new ethers.Contract(
        cultureCoinAddress,
        ccoin_abi,
        signer
      );
      try {
        await CCOINPortal.approve(account, ethers.utils.parseEther(String(amount)));
        let swaptoavax = await CCOINPortal.dexCCIn(ethers.utils.parseEther(String(amount)));
        await swaptoavax.wait();
      } catch (error) {
        console.log(error)
      }
    }
    await getdetailData();
  };

  const swapToCC = async (amount) => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CCOINPortal = new ethers.Contract(
        cultureCoinAddress,
        ccoin_abi,
        signer
      );
      try {
        let swaptocc = await CCOINPortal.dexXMTSPIn({
          value: ethers.utils.parseEther(String(amount)),
        });
        await swaptocc.wait();
      } catch (error) {
        
      }
    }
    await getdetailData();
  };

  return (
    <Layout>
      <div className="product-list-container container">
        <div className="swap-box">
          <Swapfrom
            avaxval={avaxval}
            ccval={ccval}
            setAvaxval={setAvaxval}
            setCcval={setCcval}
            maindata={maindata}
            swapflag={swapflag}
            setSwapstate={setSwapstate}
          ></Swapfrom>
          <div className="swap-area">
            <button
              className="btn-change"
              type="button"
              onClick={() => setSwapflag(!swapflag)}
            >
              <img src="/swap.png" alt="swap"></img>
            </button>
          </div>
          <Swapto
            avaxval={avaxval}
            ccval={ccval}
            setAvaxval={setAvaxval}
            setCcval={setCcval}
            maindata={maindata}
            swapflag={swapflag}
            setSwapstate={setSwapstate}
          ></Swapto>
          <div className="change-rate">
            <p>Price</p>
            <div className="rate-section">
              {rate === 0 ? (
                <p>1 CC per {maindata["dex_ccrate"]} AVAX</p>
              ) : (
                <p>1 AVAX per {maindata["dex_xmstrate"]} CC</p>
              )}
              &nbsp;
              <img
                alt="direction"
                className="two-direction-img"
                src="two-direction.png"
                onClick={() => {
                  if (rate === 1) setRate(0);
                  else setRate(1);
                }}
              />
            </div>
          </div>
          <div className="btn-box">
            {swapflag ? (
              <button
                className="btn btn-swap"
                type="button"
                onClick={(e) => {
                  swapToCC(avaxval);
                }}
                disabled={btndisable}
              >
                {btncontent}
              </button>
            ) : (
              <button
                className="btn btn-swap"
                type="button"
                onClick={(e) => {
                  swapToAvax(ccval);
                }}
                disabled={btndisable}
              >
                {btncontent}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Swap;
