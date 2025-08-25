import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { Helmet } from "react-helmet";
import { useLoading } from "./LoadingContext ";
import Swal from "sweetalert2";

const ProductList = () => {
  const [productDetails, setProductDetails] = useState();
  const [categoryData, setCategoryData] = useState();
  const location = useLocation();
  let token = localStorage.getItem("quotrUserToken");
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);

    axios
      .post(
        `https://bp.quotrprint.com/api/categoryDetail`,
        { category_id: location?.state },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // console.log(res.data);
        setProductDetails(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        // Swal.fire({
        //     title: 'Error!',
        //     text: err.response?.data?.message,
        //     icon: 'error',
        //     confirmButtonText: 'ok'
        // })
        navigate("/dashboard");
      });
  }, [token, location]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .post(
        `https://bp.quotrprint.com/api/productList`,
        { category_id: location?.state },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // console.log(res.data);
        setCategoryData(res.data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        // Swal.fire({
        //     title: 'Error!',
        //     text: err.response?.data?.message,
        //     icon: 'error',
        //     confirmButtonText: 'ok'
        // })
        navigate("/dashboard");
      });
  }, [token, location]);

  function selectBgColor(colorNum, colors) {
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + ((colorNum * 37) % 360) + ",25%,90%)";
  }

  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Product List</title>
      </Helmet>

      <div class="   m-auto">
        <img src={productDetails?.slider} style={{ width: "100%" }} alt="" />
      </div>

      <div class="col-lg-6 col-md-8 col-11 m-auto my-2">
        <p class="fs-1 fw-semibold">{productDetails?.name}</p>
        <p class="text-secondary mt-2">{productDetails?.description} </p>
      </div>

      <div class="col-md-8 m-auto row mt-5 ">
        {categoryData?.map?.((el) => {
          return (
            <div class="col-lg-4 col-12 m-auto my-3 ">
              <Link
                to="/product-details"
                state={el.id}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div
                  class="m-auto col-sm-10 "
                  style={{
                    height: "280px",
                    borderRadius: "25px",
                    background: "white",
                    boxShadow: "0px 4px 4px 0px rgba(60, 65, 68, 0.09)",
                  }}
                >
                  <div
                    class="col-12 d-flex align-items-center"
                    style={{
                      height: "200px",
                      borderRadius: "25px 25px 0 0",
                      background: `${selectBgColor(
                        Math.floor(Math.random() * 999),
                        10
                      )}`,
                    }}
                  >
                    <div className="col-8 m-auto h-100 d-flex align-items-center justify-content-center">
                      <img
                        src={el.photo}
                        class="img-fluid p-1"
                        style={{ maxHeight: "180px" }}
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="h-100 text-center">
                    <h5 class=" py-3 fw-semibold">{el.name}</h5>
                    <p class="fs-14 py-2 text-secondary">{el.text}</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
