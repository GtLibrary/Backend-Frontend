import { Routes, Route } from "react-router-dom";
import HomePage from "./components/home-page";
import NotFound from "./components/not-found";
import Books from "./components/pages/books/books";
import Swap from "./components/pages/swap/swap";
import Auctionhouse from "./components/pages/auctionhouse/auctionhouse";
import AuctionItem from "./components/pages/auctionItem/auctionItem";
import Nftdetail from "./components/pages/nftdetail/nftdetail";
import Terms from "./components/pages/terms/terms";
import SingleProduct from "./components/single-product/single-product";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/books" element={<Books />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/auctionhouse" element={<Auctionhouse />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/auctionhouse/collection/:view/:tokenaddress" element={<AuctionItem />} />
          <Route path="/auctionhouse/detail/:tokenaddress/:tokenid" element={<Nftdetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
