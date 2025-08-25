import React from "react";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import "./style.css";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { FaCcVisa } from "react-icons/fa";
import { FaCcDiscover, FaCcMastercard } from "react-icons/fa6";
import { SiAmericanexpress } from "react-icons/si";

const NewFooter = () => {
  let token = localStorage.getItem("quotrUserToken");
  const navigate = useNavigate();

  return (
    <div class="m-0 p-0">
      <div class="footerColour"></div>

      <div class="col-11 m-auto mt-4 ">
        <div class="my-3 row align-items-center gap-md-0 gap-4">
          <div class="col-md-6  text-md-start ">
            <img
              src={require("../images/footerLogo.png")}
              style={{ height: "60px", cursor: "pointer" }}
              alt=""
              onClick={() => navigate("/")}
            />
            {/* <p class='mt-3' >Copyrights © 2024 <b>Quotr</b>. All Rights Reserved.</p> */}
          </div>
          <div class="col-md-6  d-flex justify-content-md-end justify-content-center ">
            <div>
              <div class="d-flex gap-3  text-end">
                {token ? (
                  <p
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                    class="fw-semibold"
                    onClick={() => navigate("./dashboard")}
                  >
                    Dashboard
                  </p>
                ) : (
                  <p
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                    class="fw-semibold"
                    onClick={() => navigate("./")}
                  >
                    Home
                  </p>
                )}

                {!token && (
                  <Link
                    activeClass="active"
                    to="Features"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    <p class="fw-semibold">Features</p>
                  </Link>
                )}
                {!token && (
                  <Link
                    activeClass="active"
                    to="pricing"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    <p class="fw-semibold">Pricing</p>
                  </Link>
                )}
                <p
                  style={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                  }}
                  class="fw-semibold "
                  onClick={() => navigate("./support")}
                >
                  Support
                </p>
                <p
                  style={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                  }}
                  class="fw-semibold"
                  onClick={() => navigate("./contact")}
                >
                  Contact Us
                </p>
              </div>
              {/* <div class='d-flex gap-3 align-items-center mt-2'>
                            <p class='fw-bold'>Follow On</p> */}
              <div class="d-flex gap-3 align-items-center mt-3 justify-content-md-end justify-content-center">
                {/* <a href='http://fb.com/quotrprint' target='_balnk' class='socialIcon' >
                                    <FaFacebook />
                                </a>
                                <a href='http://instagram.com/quotrprint' target='_balnk' class='socialIcon' >
                                    <AiFillInstagram />
                                </a> */}
                {/* <a href='http://youtube.com/quotrprint' target='_balnk' class='socialIcon' >
                                    <IoLogoYoutube />
                                </a> */}
                {/* <a href='' target='_balnk' class='socialIcon' >
                                    <FaTwitter />
                                </a> */}
              </div>

              {/* </div>  */}
            </div>
          </div>
        </div>
        <hr />
      </div>
      <div class="col-11 m-auto bg-dark text-white rounded-3 row p-2 fw-semibold">
        {/* <div className="col-md-6 d-flex align-items-center justify-content-md-start justify-content-center">
          <a
            href="tel:5122228360"
            className="p-md-2 text-decoration-none cursor-pointer text-white"
          >
            Call us on : 512-222-8360
          </a>
        </div> */}

        <div className="col-md-12 d-flex align-items-center justify-content-md-end justify-content-center">
          <a
            href="mailto:info@quotrprint.com"
            className="p-md-2 text-decoration-none text-white"
          >
            For Support : info@quotrprint.com
          </a>
        </div>
      </div>
      <div class="col-11 m-auto    row p-2 fw-semibold">
        <div class="col-md-6 d-flex align-items-center justify-content-md-start justify-content-center">
          <p class="p-md-2">@ 2024 Quotr, LLc</p>
        </div>
        <div class="col-md-6 d-flex align-items-center justify-content-md-end justify-content-center">
          <div class="d-flex gap-3 align-items-center">
            <FaCcVisa class="fs-1" style={{ height: "30px" }} />
            <FaCcMastercard class="fs-1" style={{ height: "30px" }} />
            <FaCcDiscover class="fs-1" style={{ height: "30px" }} />
            <SiAmericanexpress class="fs-1" style={{ height: "30px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFooter;
