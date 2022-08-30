import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";

const appId = "gmDA8QccmPHQvtnZcEiGemyCcZi7Sgr1meq9GgPz";
const serverUrl = "https://qzzj9cxkd0zd.usemoralis.com:2053/server";

render(
  <React.StrictMode>
    <MoralisProvider
      serverUrl={serverUrl}
      appId={appId}
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

