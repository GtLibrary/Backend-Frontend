import { Routes, Route } from "react-router-dom";
import HomePage from "./components/home-page";
import NotFound from "./components/not-found";
import Books from "./components/pages/books/books";
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
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
