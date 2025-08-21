import React, { useEffect, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";

import { MdLockOutline } from "react-icons/md";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import "../style.css";
import { Helmet } from "react-helmet";
import { useLoading } from "../LoadingContext ";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [login, setLogin] = useState({});

  const { setIsLoading } = useLoading();
  let token = localStorage.getItem("quotrUserToken");
  let userId = localStorage.getItem("quotrUserId");

  const logInInfo = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  useEffect(() => {
    if (token && userId) {
      navigate("/dashboard");
    }
  }, [token, userId]);

  const navigate = useNavigate();

  const loginFunction = () => {
    if (login.email && login.email != "" && login.password && login.password) {
      setIsLoading(true);
      axios
        .post(`https://bp.quotrprint.com/api/login`, login)
        .then((res) => {
          if (res?.data?.success == true) setIsLoading(false);
          localStorage.setItem("quotrUserToken", res.data?.token);
          localStorage.setItem("quotrUserId", res.data?.UserId);

          navigate("/dashboard", { state: res?.data?.UserId });
        })
        .catch((err) => {
          setIsLoading(false);
          Swal.fire({
            title: "Error!",
            text: err.response?.data?.message,
            icon: "error",
            confirmButtonText: "ok",
          });
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "The email & password field is required !",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Log-In</title>
      </Helmet>
      <div
        class="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <div
          class="col-lg-4 col-md-6 col-10 text-start"
          style={{ height: "60%" }}
        >
          <p class="fs-1">Enter Your Login Details</p>
          <p class="my-2" style={{ fontSize: "12px", color: "gray" }}>
            Signin to your account by adding <br />
            your email address and password
          </p>
          <br />

          <div class="input-group flex-nowrap my-3">
            <span class="input-group-text" id="addon-wrapping">
              <HiOutlineMail />
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Email"
              name="email"
              onChange={logInInfo}
            />
          </div>

          <div class="input-group flex-nowrap my-3">
            <span class="input-group-text fw-bold" id="addon-wrapping">
              <MdLockOutline />
            </span>
            <input
              type={showPass ? "text" : "password"}
              class="form-control"
              placeholder="Password"
              name="password"
              onChange={logInInfo}
            />
            <span
              class="input-group-text"
              id="addon-wrapping"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <GoEye /> : <GoEyeClosed />}
            </span>
          </div>

          <div class="d-flex align-items-center justify-content-between mt-2">
            <div class="d-flex align-items-center gap-2">
              <input type="checkbox" />{" "}
              <p style={{ fontSize: "12px" }}>Remember me</p>
            </div>
            <div>
              {" "}
              <p
                class="text-primary"
                style={{ fontSize: "12px", cursor: "pointer" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            </div>
          </div>

          <div class="mt-5 w-100">
            <button
              class="btn btn-primary  w-100"
              disabled={
                login?.email &&
                login?.eamil != "" &&
                login?.password &&
                login?.password != ""
                  ? false
                  : true
              }
              onClick={loginFunction}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
