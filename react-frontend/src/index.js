import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CartContextProvider from './context/cart-context';
import { MoralisProvider } from "react-moralis";

import {
  Web3ReactProvider,
} from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

const appId = "gmDA8QccmPHQvtnZcEiGemyCcZi7Sgr1meq9GgPz"
const serverUrl = "https://qzzj9cxkd0zd.usemoralis.com:2053/server"

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
    {/* <Web3ReactProvider getLibrary={getLibrary}> */}
        <CartContextProvider>
          <App />
        </CartContextProvider>
    {/* </Web3ReactProvider> */}
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

