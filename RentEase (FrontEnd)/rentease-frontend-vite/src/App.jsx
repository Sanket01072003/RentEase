import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import RenterDashboard from "./pages/RenterDashboard.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Renter Protected */}
          <Route
            path="/renter/dashboard"
            element={
              <ProtectedRoute role="RENTER">
                <RenterDashboard />
              </ProtectedRoute>
            }
          />

          {/* Owner Protected */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute role="OWNER">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/add-product"
            element={
              <ProtectedRoute role="OWNER">
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/edit-product/:id"
            element={
              <ProtectedRoute role="OWNER">
                <EditProduct />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#1a237e",
                    marginBottom: 8,
                  }}
                >
                  Page Not Found
                </div>
                <a
                  href="/"
                  style={{ color: "#1a237e", fontWeight: 600, fontSize: 16 }}
                >
                  ← Go Home
                </a>
              </div>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
