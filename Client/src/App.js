import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';
// conmponents start
import Header from './components/header';
import { Footer } from './components/footer';
import { Mainpage } from './components/mainpage';
import { About } from './components/about';
import { SellerRegistration, UserRegistration } from './components/Registrations';
import { SellerPanel } from './components/sellerPanel';
import ProductOrder from './components/ProductOrder';
import { CustomerOrders } from './components/CustomerOrders';
import SellerOrder from './components/SellerOrder';
import Search from './components/Search';
import Location from './components/Location';
//components end
export const serverLink = 'http://127.0.0.1:8080';

function App() {
  return (
    <>
      <Router>
        <Header title="Grocery-Store" />
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/about" element={<About />} />
          <Route path="/userregistration" element={<UserRegistration />} />
          <Route path="/sellerregistration" element={<SellerRegistration />} />
          <Route path="/sellerpanel" element={<SellerPanel />} />
          <Route path="/product-order/:pid" element={<ProductOrder />} />
          <Route path="/customer-orders" element={<CustomerOrders />} />
          <Route path='/seller-orders' element={<SellerOrder />} />
          <Route path='/search/:search_txt' element={<Search />} />
          <Route path='/seller/location' element={<Location />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
