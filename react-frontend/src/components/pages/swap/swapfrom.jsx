import React from "react";

const Swapfrom = (props) => {
    const { avaxval, ccval, setAvaxval, setCcval, maindata, swapflag, setSwapstate } = props

  return (
    <div className="avax-box">
      <div className="convert-title">
        <p>From</p>
        <p>Available: {swapflag ? maindata["avax_val"] : maindata["cc_val"] }</p>
      </div>
      <div className="convert-body">
        <input
          className="input-avax"
          type="number"
          placeholder="0.0"
          value={swapflag ? avaxval: ccval}
          onChange={(e) => {
            if(swapflag) {
                setAvaxval(e.target.value);
                setCcval(Number(e.target.value * maindata["dex_xmstrate"]));
                if(Number(maindata['avax_val']) < e.target.value) {
                    setSwapstate(1)
                } else if(Number(maindata['max_ccout']) < Number(e.target.value * maindata["dex_xmstrate"])) {
                    setSwapstate(2)
                } else if(e.target.value <= 0) {
                    setSwapstate(3)
                } else {
                    setSwapstate(0)
                }
            } else {
                setAvaxval(Number(e.target.value * maindata["dex_ccrate"]));
                setCcval(e.target.value);
                if(Number(maindata['cc_val']) < e.target.value) {
                    setSwapstate(1)
                } else if(Number(maindata['max_xout']) < Number(e.target.value * maindata["dex_ccrate"])) {
                    setSwapstate(2)
                } else if(e.target.value <= 0) {
                    setSwapstate(3)
                } else {
                    setSwapstate(0)
                }
            }
          }}
        ></input>
        <button
          className="max-button"
          onClick={() => {
            if(swapflag) {
                let maxavax_val =
                  maindata["avax_val"] < maindata["max_xout"]
                    ? maindata["avax_val"]
                    : maindata["max_xout"];
                setCcval(Number(maxavax_val * maindata["dex_xmstrate"]));
                setAvaxval(maxavax_val);
            } else {
                let maxcc_val =
                  maindata["cc_val"] < maindata["max_ccout"]
                    ? maindata["cc_val"]
                    : maindata["max_ccout"];
                setAvaxval(Number(maxcc_val * maindata["dex_ccrate"]));
                setCcval(maxcc_val);
            }
          }}
        >
          MAX
        </button>
        &nbsp;
        { swapflag ? (
            <>
                <img className="token-logo" src="avax.png" alt="avax"></img>&nbsp;
                <p className="input-title">AVAX</p>
            </>
        ) : (
            <>
                <img className="token-logo" src="c-coin-logo.png" alt="ccoin"></img>&nbsp;
                <p className="input-title">CC</p>
            </>
        )}
      </div>
    </div>
  );
};

export default Swapfrom;
