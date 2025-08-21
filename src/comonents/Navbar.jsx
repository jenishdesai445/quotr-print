import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const Navbar = () => {
  let token = localStorage.getItem("quotrUserToken");

  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("./");
  };
  return (
    <div class="bg-black text-white header">
      <div
        class="col-11 m-auto d-flex justify-content-between align-items-center bg-black"
        style={{ height: "75px" }}
      >
        <div style={{ height: "48px" }}>
          <img
            src={require("../images/headerLogo.png")}
            onClick={() => navigate("/")}
            style={{ height: "100%" }}
            alt=""
          />
        </div>
        <div class="pcNav">
          <div class="d-flex align-items-center gap-5 fw-semibold fs-5 ">
            {token ? (
              <p
                style={{ cursor: "pointer" }}
                onClick={() => navigate("./dashboard")}
              >
                Dashboard
              </p>
            ) : (
              <p style={{ cursor: "pointer" }} onClick={() => navigate("./")}>
                Home
              </p>
            )}
            {!token && (
              <Link
                to="/#features"
                style={{
                  textDecoration: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <p style={{ cursor: "pointer" }}>Features</p>
              </Link>
            )}
            {!token && (
              <Link
                to="/#pricing"
                style={{
                  textDecoration: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <p style={{ cursor: "pointer" }}>Pricing</p>
              </Link>
            )}
            <p
              style={{ cursor: "pointer" }}
              onClick={() => navigate("./support")}
            >
              Support{" "}
            </p>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => navigate("./contact")}
            >
              Contact Us
            </p>
          </div>
        </div>
        <div class=" d-flex align-items-center gap-4">
          <div class="pcNav">
            {token ? (
              <button
                type="button"
                class="btn btn-light rounded-5 fw-bold mx-3"
                onClick={logout}
              >
                Log-Out
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-light rounded-5 fw-bold"
                onClick={() => navigate("/log-in")}
              >
                Log-In
              </button>
            )}
          </div>

          {/* <button type="button" class="btn btn-light rounded-5 fw-bold">Log-Out</button> */}

          <div class="mobileNav">
            <p
              class="fs-2 fw-bold"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#quotrNav"
              aria-controls="quotrNav"
            >
              {" "}
              <i class="bi bi-list"></i>
            </p>
          </div>
        </div>
        <div
          class="offcanvas offcanvas-end"
          data-bs-backdrop="static"
          tabindex="-1"
          id="quotrNav"
          aria-labelledby="quotrNavLabel"
        >
          <div class="offcanvas-header">
            <img
              src={require("../images/footerLogo.png")}
              style={{ height: "40px" }}
              alt=""
            />
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <div class="mt-5">
              {token ? (
                <p
                  class="fs-5 fw-bold mt-2"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => navigate("./dashboard")}
                >
                  Dashboard
                </p>
              ) : (
                <p
                  class="fs-5 fw-bold mt-2"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => navigate("./")}
                >
                  Home
                </p>
              )}
              {!token && (
                <Link
                  activeClass="active"
                  to="about"
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
                  <p
                    class="fs-5 fw-bold"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  >
                    About
                  </p>
                </Link>
              )}
              <p
                class="fs-5 fw-bold mt-2"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={() => navigate("./support")}
              >
                Support
              </p>

              <p
                class="fs-5 fw-bold mt-2"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={() => navigate("./contact")}
              >
                Contact Us
              </p>
              {token ? (
                <div class="mt-2">
                  <button
                    type="button"
                    class="btn btn-dark rounded-5 fw-bold"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    onClick={logout}
                  >
                    Log-Out
                  </button>
                </div>
              ) : (
                <div class="mt-2">
                  <button
                    type="button"
                    class="btn btn-dark rounded-5 fw-bold"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    onClick={() => navigate("/log-in")}
                  >
                    Log-In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
