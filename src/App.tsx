import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Entry from './pages/Entry';
import ConsumerHome from './pages/ConsumerHome';
import B2BDashboard from './pages/B2BDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Sustainability from './pages/Sustainability';
import Recipes from './pages/Recipes';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import B2BOrderTracking from './pages/B2BOrderTracking';
import B2BBuyerDashboard from './pages/B2BBuyerDashboard';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import { ToastProvider } from './components/Toast';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/consumer" element={<ConsumerHome />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/b2b" element={<B2BDashboard />} />
          <Route path="/b2b/tracking/:orderId?" element={<B2BOrderTracking />} />
          <Route path="/b2b/dashboard" element={<B2BBuyerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
