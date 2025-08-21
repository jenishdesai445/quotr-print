import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import "./App.css";
import Navbar from "./comonents/Navbar";
import NewFooter from "./comonents/NewFooter";
import ScrollToTop from "./ScrollToTop";
import { PrivateRoute } from "./comonents/PrivateRoute";
import ProductAttribute from "./comonents/ProductAttribute";
import { useLoading } from "./comonents/LoadingContext ";
import OrderList from "./comonents/users/OrderList";

const Quotr = React.lazy(() => import("./comonents/Quotr"));
const Contact = React.lazy(() => import("./comonents/Contact"));
const Support = React.lazy(() => import("./comonents/Support"));

const Login = React.lazy(() => import("./comonents/users/Login"));
const AddStoreOwner = React.lazy(() => import("./comonents/users/SignUp"));
const ForgotPassword = React.lazy(() => import("./comonents/ForgotPassword"));

const Dashboard = React.lazy(() => import("./comonents/users/Dashboard"));
const MyStore = React.lazy(() => import("./comonents/users/MyStore"));
const AddUser = React.lazy(() => import("./comonents/users/AddUser"));
const PricingMarkup = React.lazy(() =>
  import("./comonents/users/PricingMarkup")
);
const ShippingPricingMarkup = React.lazy(() =>
  import("./comonents/users/ShippingPricingMarkup")
);
const Profile = React.lazy(() => import("./comonents/users/Profile"));

const CardCategory = React.lazy(() => import("./comonents/CardCategory"));
const ProductList = React.lazy(() => import("./comonents/ProductList"));
const ProductDetails = React.lazy(() => import("./comonents/ProductDetails"));
const TermCondition = React.lazy(() => import("./comonents/TermsConditions"));

function App() {
  const location = useLocation();

  const { isLoading } = useLoading();
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash === "") {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            zIndex: "5",
          }}
        >
          {" "}
          <div class="col-lg-3 col-md-4 col-4">
            <img src={require("./images/quotr-loader.gif")} />
          </div>{" "}
        </div>
      )}
      <div style={{ height: "75px" }}></div>
      <Suspense
        fallback={
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.5)",
              zIndex: "5",
            }}
          >
            {" "}
            <div class="col-lg-3 col-md-4 col-4">
              <img src={require("./images/quotr-loader.gif")} />
            </div>{" "}
          </div>
        }
      >
        <div class="" style={{ minHeight: "60vh" }}>
          <Routes>
            <Route path="/sign-up" element={<AddStoreOwner />} />
            <Route path="/log-in" element={<Login />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-store"
              element={
                <PrivateRoute>
                  <MyStore />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-users"
              element={
                <PrivateRoute>
                  <AddUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/pricing-markup"
              element={
                <PrivateRoute>
                  <PricingMarkup />
                </PrivateRoute>
              }
            />
            <Route
              path="/shipping-pricing-markup"
              element={
                <PrivateRoute>
                  <ShippingPricingMarkup />
                </PrivateRoute>
              }
            />
            <Route
              path="/total-order"
              element={
                <PrivateRoute>
                  <OrderList />
                </PrivateRoute>
              }
            />

            <Route path="/" element={<Quotr />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />

            <Route
              path="/category-cards"
              element={
                <PrivateRoute>
                  <CardCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/product-list"
              element={
                <PrivateRoute>
                  <ProductList />
                </PrivateRoute>
              }
            />
            <Route
              path="/product-details"
              element={
                <PrivateRoute>
                  <ProductDetails />
                </PrivateRoute>
              }
            />
            <Route path="/terms-conditions" element={<TermCondition />} />
          </Routes>
        </div>
      </Suspense>

      <NewFooter />
    </div>
  );
}

export default App;
