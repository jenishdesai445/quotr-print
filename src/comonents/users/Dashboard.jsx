import React, { useEffect, useState } from "react";
import { PiClockCountdownBold } from "react-icons/pi";
import { BsListCheck } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TiShoppingCart } from "react-icons/ti";
import { ImProfile } from "react-icons/im";
import axios from "axios";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import "../style.css";

import { FaDollarSign, FaTrophy } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useLoading } from "../LoadingContext ";
import Swal from "sweetalert2";
const Dashboard = () => {
  const [company, setCompany] = useState();
  const [customerId, setCustomerId] = useState();
  const [companyId, setCompanyId] = useState();
  const [companyoptions, setCompanyOptions] = useState(false);

  const { setIsLoading } = useLoading();

  const [data, setData] = useState();
  const location = useLocation();
  let token = localStorage.getItem("quotrUserToken");
  let userId = localStorage.getItem("quotrUserId");

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .post(
        `https://bp.quotrprint.com/api/dashboard`,
        { userId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // console.log(res.data);
        setData(res?.data?.data);
        setIsLoading(false);
      })

      .catch((err) => {
        setIsLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message,
          icon: "error",
          confirmButtonText: "ok",
        });
        navigate("/log-in");
      });
  }, [userId, token]);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`https://bp.quotrprint.com/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // console.log(res.data);
        setCustomerId(res?.data?.data?.customer_id);
        localStorage.setItem("quotrCustomerId", res?.data?.data?.customer_id);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);

        // console.log(err);
      });
  }, [token]);

  useEffect(() => {
    setIsLoading(true);
    if (customerId) {
      axios
        .post(
          `https://bp.quotrprint.com/api/companyList`,
          { customerId: customerId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setCompany(res?.data?.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          // console.log(err);
        });
    }
  }, [customerId, token]);

  const CallCompanyIdAdmin = (el) => {
    setIsLoading(true);
    localStorage.setItem("quotrCompanyId", el);
    axios
      .post(
        `https://bp.quotrprint.com/api/checkPriceAndShippingMarkup`,
        { companyId: el },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res?.data?.success) {
          setIsLoading(false);
          navigate("/category-cards");
          setCompanyOptions(false);
        } else {
          setIsLoading(false);
          if (res?.data?.message == "Price & Shipping Markup is Missing!") {
            Swal.fire({
              title: "Error!",
              text: res?.data?.message,
              icon: "error",
              confirmButtonText: "ok",
            });
            navigate("/pricing-markup");
            setCompanyOptions(false);
          } else if (res?.data?.message == "Price Markup is Missing!") {
            Swal.fire({
              title: "Error!",
              text: res?.data?.message,
              icon: "error",
              confirmButtonText: "ok",
            });
            navigate("/pricing-markup");
            setCompanyOptions(false);
          } else if (res?.data?.message == "Shipping Markup is Missing!") {
            Swal.fire({
              title: "Error!",
              text: res?.data?.message,
              icon: "error",
              confirmButtonText: "ok",
            });
            navigate("/shipping-pricing-markup");
            setCompanyOptions(false);
          }
        }
        // console.log("responce", res.data);
      })
      .catch((err) => {
        setIsLoading(false);

        // console.log(err);
      });
  };

  const CallCompanyIdUser = (el) => {
    setIsLoading(true);

    localStorage.setItem("quotrCompanyId", el);
    axios
      .post(
        `https://bp.quotrprint.com/api/checkPriceAndShippingMarkup`,
        { companyId: el },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res?.data?.success) {
          setIsLoading(false);
          navigate("/category-cards");
          setCompanyOptions(false);
        } else {
          setIsLoading(false);

          if (res?.data?.message == "Price & Shipping Markup is Missing!") {
            Swal.fire({
              title: "Error!",
              text: "Price & Shipping Markup is Missing Please Contact us Admin!",
              icon: "error",
              confirmButtonText: "ok",
            });
          } else if (res?.data?.message == "Price Markup is Missing!") {
            Swal.fire({
              title: "Error!",
              text: "Price Markup is Missing Please Contact us Admin !",
              icon: "error",
              confirmButtonText: "ok",
            });
          } else if (res?.data?.message == "Shipping Markup is Missing!") {
            Swal.fire({
              title: "Error!",
              text: "Shipping Markup is Missing Please Contact us Admin!",
              icon: "error",
              confirmButtonText: "ok",
            });
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);

        // console.log(err);
      });
  };

  useEffect(() => {
    if (data?.cust_type == "User") {
      setCompanyId(userId);
      localStorage.setItem("quotrUserControl", true);
    } else {
      localStorage.setItem("quotrUserControl", false);
    }
  }, [data, userId]);

  const driverObj = driver({
    animate: false,
    showProgress: false,
    showButtons: ["next", "previous", "close"],
    steps: [
      {
        element: ".myStore",
        popover: {
          title: "Setup Your Stores",
          description:
            "Establish where you'll sell your products or services, whether your store locations.",
          side: "top",
          align: "start",
        },
      },
      {
        element: ".pricingMarkup",
        popover: {
          title: "Setup Your Pricing Markup",
          description:
            "Decide how much you'll increase prices to cover costs and make a profit.",
          side: "top",
          align: "start",
        },
      },
      {
        element: ".shippingMarkup",
        popover: {
          title: "Setup Your Shipping Markup",
          description:
            "Set rates to cover shipping expenses, ensuring they're competitive yet sustainable.",
          side: "top",
          align: "start",
        },
      },
    ],
  });

  const userVisiting = () => {
    axios
      .post(
        `https://bp.quotrprint.com/api/followStep`,
        { companyId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (data?.cust_type === "Store Owner" && data?.follow_step == null) {
      driverObj.drive();
      userVisiting();
    }
  }, [data]);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dashboard</title>
      </Helmet>

      {data?.cust_type === "Store Owner" && (
        <div class="mt-5 ">
          <p class="fs-1 fw-bold"> My Plan </p>
          <p class="display-1" style={{ color: "#FFD700" }}>
            {" "}
            <FaTrophy />{" "}
          </p>
          <p class="fs-5 fw-semibold">Plan : {data?.plan_details?.name}</p>
          {/* <p class="fs-5 fw-semibold">
            No. of Store : {data?.plan_details?.allow_login}
          </p> */}
        </div>
      )}

      <div class="mt-5 col-11 m-auto row ">
        <div
          class="col-lg-3 col-md-4 col-sm-6 mt-4 "
          onClick={() => navigate("/total-order")}
        >
          <div class="col-11 mx-auto border rounded-4 p-2 h-100 dashboardCart">
            <div class="m-auto text-center mt-2">
              <p class="display-2 fw-bold">
                <BsListCheck />
              </p>
            </div>
            <div class="mt-3 col-11 m-auto">
              <p class="fs-5 fw-bold"> All Orders : {data?.tot_order}</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-4 col-sm-6 mt-4 ">
          <div class="col-11 mx-auto border rounded-4 p-2 h-100 dashboardCart">
            <div class="m-auto text-center mt-2">
              <p class="display-2 fw-bold">
                <PiClockCountdownBold />
              </p>
            </div>
            <div class="mt-3 col-11 m-auto">
              <p class="fs-5 fw-bold">
                {" "}
                Pending Orders : {data?.tot_pending_order}
              </p>
            </div>
          </div>
        </div>

        {data?.cust_type === "Store Owner" && (
          <div class="col-lg-3 col-md-4 col-sm-6 mt-4 myStore ">
            <div
              class="col-11 mx-auto border rounded-4 p-2 h-100 dashboardCart"
              onClick={() => navigate("/my-store")}
            >
              <div class="m-auto text-center mt-2">
                <p class="display-2 fw-bold">
                  <FaStore />
                </p>
              </div>
              <div class="mt-3 col-11 m-auto">
                <p class="fs-5 fw-bold"> Store Profile : {data?.tot_users} </p>
              </div>
            </div>
          </div>
        )}

        {data?.cust_type === "Store Owner" && (
          <div class="col-lg-3 col-md-4 col-sm-6 mt-4 pricingMarkup">
            <div
              class="col-11 mx-auto border rounded-4 p-2 h-100 dashboardCart"
              onClick={() => navigate("/pricing-markup")}
            >
              <div class="m-auto text-center mt-2">
                <p class="display-2 fw-bold">
                  <FaDollarSign />
                </p>
              </div>
              <div class="mt-3 col-11 m-auto">
                <p class="fs-5 fw-bold">Pricing Markup</p>
              </div>
            </div>
          </div>
        )}
        {data?.cust_type === "Store Owner" && (
          <div class="col-lg-3 col-md-4 col-sm-6 mt-4 shippingMarkup ">
            <div
              class="col-11 mx-auto border rounded-4 p-2 h-100 dashboardCart"
              onClick={() => navigate("/shipping-pricing-markup")}
            >
              <div class="m-auto text-center mt-2">
                <p class="display-2 fw-bold">
                  <LiaShippingFastSolid />
                </p>
              </div>
              <div class="mt-3 col-11 m-auto">
                <p class="fs-5 fw-bold"> Shipping Markup</p>
              </div>
            </div>
          </div>
        )}
        {data?.cust_type === "Store Owner" ? (
          <div class="col-lg-3 col-md-4 col-sm-6 mt-4 ">
            <div
              class="col-11 mx-auto border rounded-4 p-2 h-100 dashboardCart"
              onClick={() => setCompanyOptions(true)}
            >
              <div class="m-auto text-center mt-2">
                <p class="display-2 fw-bold">
                  <TiShoppingCart />
                </p>
              </div>
              <div class="mt-3 col-11 m-auto">
                <p class="fs-5 fw-bold">Store View</p>
              </div>
            </div>
          </div>
        ) : (
          <div class="col-lg-3 col-md-4 col-sm-6 mt-4 ">
            <div
              class="col-11 mx-auto border rounded-4 p-2 h-100 dashboardCart"
              onClick={() => CallCompanyIdUser(companyId && companyId)}
            >
              <div class="m-auto text-center mt-2">
                <p class="display-2 fw-bold">
                  <TiShoppingCart />
                </p>
              </div>
              <div class="mt-3 col-11 m-auto">
                <p class="fs-5 fw-bold">New Order</p>
              </div>
            </div>
          </div>
        )}

        <div class="col-lg-3 col-md-4 col-sm-6 mt-4 ">
          <div
            class="col-11 mx-auto border rounded-4 p-2 h-100 dashboardCart"
            onClick={() => navigate("/profile")}
          >
            <div class="m-auto text-center mt-2">
              <p class="display-2 fw-bold">
                <ImProfile />
              </p>
            </div>
            <div class="mt-3 col-11 m-auto">
              <p class="fs-5 fw-bold">Admin Profile</p>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />

      {companyoptions && (
        <div
          class="position-fixed top-0 d-flex align-items-center justify-content-center "
          style={{
            height: "100%",
            width: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: "5",
          }}
        >
          <div class="col-lg-5 col-md-8 col-sm-9 col-11 m-auto bg-light rounded-4 ">
            <div class="col-11 m-auto my-3 text-start">
              <p class="fs-5 fw-bold">Select Company</p>
              <hr />
              {company &&
                company?.map((el) => {
                  return (
                    <div
                      key={el?.id}
                      class="border-bottom p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => CallCompanyIdAdmin(el?.id)}
                    >
                      <p>{el?.company_name}</p>
                    </div>
                  );
                })}
              <button
                class="homeTopBtn form-control "
                onClick={() => setCompanyOptions(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
