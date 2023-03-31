import React from "react";

const Swapto = (props) => {
  const { avaxval, ccval, setAvaxval, setCcval, maindata, swapflag, setSwapstate } = props;

  return (
    <div className="cc-box">
      <div className="convert-title">
        <p>To</p>
        <p>Balance: { swapflag ? maindata["cc_val"]: maindata['avax_val'] }</p>
      </div>
      <div className="convert-body">
        <input
          className="input-avax"
          type="number"
          placeholder="0.0"
          value={swapflag ? ccval : avaxval }
          readOnly={true}
          onChange={(e) => {
            if(swapflag) {
                setCcval(e.target.value);
                setAvaxval(Number(e.target.value * maindata["dex_ccrate"]));
            } else {
                setCcval(Number(e.target.value * maindata["dex_xmstrate"]));
                setAvaxval(e.target.value);
            }
          }}
        ></input>
        { swapflag ? (
            <>
                <img className="token-logo" src="c-coin-logo.png" alt="ccoin"></img>&nbsp;
                <p className="input-title">CC</p>
            </>
        ) : (
            <>
                <img className="token-logo" src="avax.png" alt="avax"></img>&nbsp;
                <p className="input-title">AVAX</p>
            </>
        )}
      </div>
    </div>
  );
};

export default Swapto;
