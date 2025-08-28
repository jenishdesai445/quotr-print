import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

import "./style.css";

const Navbar = () => {
  let token = localStorage.getItem("quotrUserToken");
  const location = useLocation();
  const isHashActive = (hash) => location.hash === hash;

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
            style={{ height: "100%", cursor: "pointer" }}
            alt=""
          />
        </div>
        <div class="pcNav">
          <div class="d-flex align-items-center gap-5 fw-semibold fs-5 ">
            {token ? (
              // <p
              //   style={{ cursor: "pointer" }}
              //   onClick={() => navigate("./dashboard")}
              // >
              //   Dashboard
              // </p>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Dashboard
              </NavLink>
            ) : (
              // <p style={{ cursor: "pointer" }} onClick={() => navigate("./")}>
              //   Home
              // </p>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive && location.hash === ""
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Home
              </NavLink>
            )}
            {!token && (
              <Link
                to="/#features"
                className={
                  isHashActive("#features") ? "nav-link active" : "nav-link"
                }
              >
                Features
              </Link>
            )}
            {!token && (
              <Link
                to="/#pricing"
                className={
                  isHashActive("#pricing") ? "nav-link active" : "nav-link"
                }
              >
                Pricing
              </Link>
            )}
            <NavLink
              to="/support"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Support
            </NavLink>
            {/* 
            <p
              style={{ cursor: "pointer" }}
              onClick={() => navigate("./contact")}
            >
              Contact Us
            </p> */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Contact Us
            </NavLink>
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
            <div class="mt-4 d-flex flex-column gap-1">
              {token ? (
                <p
                  class="menu-item"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => navigate("./dashboard")}
                >
                  Dashboard
                </p>
              ) : (
                <p
                  class="menu-item"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => navigate("./")}
                >
                  Home
                </p>
              )}

              <p
                class="menu-item"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={() => navigate("./support")}
              >
                Support
              </p>

              <p
                class="menu-item"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={() => navigate("./contact")}
              >
                Contact Us
              </p>

              {token ? (
                //                 <>
                //   <div className="d-flex align-items-center justify-content-center gap-2">
                //     <p className="display-6 m-0">
                //       <FaStore />
                //     </p>

                //     <button
                //       type="button"
                //       className="btn btn-dark menu-btn fw-bold"
                //       data-bs-dismiss="offcanvas"
                //       aria-label="Close"
                //       onClick={logout}
                //     >
                //       Log-Out
                //     </button>
                //   </div>
                // </>
                <button
                  type="button"
                  class="btn btn-dark menu-btn fw-bold"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={logout}
                >
                  Log-Out
                </button>
              ) : (
                <button
                  type="button"
                  class="btn btn-dark menu-btn fw-bold"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => navigate("/log-in")}
                >
                  Log-In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
