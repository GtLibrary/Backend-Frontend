import { Routes, Route } from "react-router-dom";
import HomePage from "./components/home-page";
import NotFound from "./components/not-found";
import Books from "./components/pages/books/books";
import Swap from "./components/pages/swap/swap";
import Marketplace from "./components/pages/marketplace/marketplace";
import Terms from "./components/pages/terms/terms";
import SingleProduct from "./components/single-product/single-product";
import CollectionItem from "./components/pages/collection/collectionItem";
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
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/marketplace/collection/:id" element={<CollectionItem />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
