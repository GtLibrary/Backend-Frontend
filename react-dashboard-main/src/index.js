import React from 'react';
import ReactDOM from 'react-dom';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project imports
import { store, persister } from './store';
import * as serviceWorker from './serviceWorker';
import App from './App';
import config from './config';

// style + assets
import './assets/scss/style.scss';
import { MoralisProvider } from "react-moralis";

const appId = "gmDA8QccmPHQvtnZcEiGemyCcZi7Sgr1meq9GgPz";
const serverUrl = "https://qzzj9cxkd0zd.usemoralis.com:2053/server";
//-----------------------|| REACT DOM RENDER  ||-----------------------//

ReactDOM.render(

        <Provider store={store}>
            <PersistGate loading={null} persistor={persister}>
                <BrowserRouter basename={config.basename}>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
