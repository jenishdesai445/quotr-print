import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCcVisa, FaCcDiscover, FaCcMastercard } from "react-icons/fa6";
import { SiAmericanexpress } from "react-icons/si";
import "./style.css";

const NewFooter = () => {
  let token = localStorage.getItem("quotrUserToken");
  const navigate = useNavigate();

  return (
    <div className="m-0 p-0">
      <div className="footerColour"></div>

      {/* Logo & Navigation Links */}
      <div className="col-11 m-auto mt-4">
        <div className="my-3 row align-items-center gap-4 gap-md-0">
          <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
            <img
              src={require("../images/footerLogo.png")}
              style={{ height: "60px", cursor: "pointer" }}
              alt="logo"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-center justify-content-md-end text-center text-md-end">
            <div className="d-flex flex-wrap flex-md-nowrap justify-content-center justify-content-md-end gap-3">
              {token ? (
                <p
                  className="fw-semibold m-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </p>
              ) : (
                <p
                  className="fw-semibold m-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  Home
                </p>
              )}

              {!token && (
                <p
                  className="fw-semibold m-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/#features")}
                >
                  Features
                </p>
              )}

              {!token && (
                <p
                  className="fw-semibold m-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/#pricing")}
                >
                  Pricing
                </p>
              )}

              <p
                className="fw-semibold m-0"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/support")}
              >
                Support
              </p>

              <p
                className="fw-semibold m-0 nowrap-text"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </p>
            </div>
          </div>
        </div>
        <hr />
      </div>

      {/* Support Email */}
      <div className="col-11 m-auto bg-dark text-white rounded-3 row p-2 fw-semibold">
        <div className="col-md-12 d-flex align-items-center justify-content-md-end justify-content-center">
          <a
            href="mailto:info@quotrprint.com"
            className="p-md-2 text-decoration-none text-white"
          >
            For Support : info@quotrprint.com
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="col-11 m-auto row p-2 fw-semibold">
        <div className="col-md-6 d-flex align-items-center justify-content-md-start justify-content-center">
          <p className="p-md-2">@ 2024 Quotr, LLC</p>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-md-end justify-content-center">
          <div className="d-flex gap-3 align-items-center">
            <FaCcVisa className="fs-1" style={{ height: "30px" }} />
            <FaCcMastercard className="fs-1" style={{ height: "30px" }} />
            <FaCcDiscover className="fs-1" style={{ height: "30px" }} />
            <SiAmericanexpress className="fs-1" style={{ height: "30px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFooter;
