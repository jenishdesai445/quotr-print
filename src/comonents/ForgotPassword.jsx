import React, { useEffect, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { IoArrowBackSharp, IoMail } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./style.css";
import axios from "axios";

const ForgotPassword = () => {
  const [forgot, setForgot] = useState({});
  const [sentMail, setSentMail] = useState(false);
  const [otpBox, setOtpBox] = useState(false);
  const [otp, setOtp] = useState(null);
  const [newPasswordBox, setNewPasswordBox] = useState(false);
  const [newPassword, setNewPassword] = useState();
  // const [sendNewPassword, setSendNewPassword] = useState( )

  const navigate = useNavigate();

  const forgotInfo = (e) => {
    const { name, value } = e.target;
    setForgot({ ...forgot, [name]: value });
  };

  const confirmPassword = (e) => {
    const { name, value } = e.target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  useEffect(() => {
    const updatePassword = { ...newPassword };
    updatePassword.email = forgot?.email;
    setNewPassword(updatePassword);
  }, [forgot]);

  useEffect(() => {
    const mailVBox = document.querySelector(".mailSenderMain");
    const mail = document.querySelector(".mailSender");
    if (sentMail) {
      mailVBox.classList.add("active");
      setTimeout(() => {
        mail.classList.add("active");
      }, 100);
    } else {
      mailVBox.classList.remove("active");
      mail.classList.remove("active");
    }
  }, [sentMail]);

  const sendEmailCheck = () => {
    if (forgot?.email && forgot?.email != "") {
      axios
        .post(`https://bp.quotrprint.com/api/forgotPassword`, {
          email: forgot?.email,
        })
        .then((res) => {
          // console.log(res.data);
          if (res?.data?.success == true) {
            Swal.fire({
              title: "Success!",
              text: res?.data?.message,
              icon: "success",
              confirmButtonText: "ok",
            });
            setSentMail(false);
            setOtpBox(true);
          } else {
            Swal.fire({
              title: "Error!",
              text: res?.data?.message,
              icon: "error",
              confirmButtonText: "ok",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: err?.response?.data?.message,
            icon: "error",
            confirmButtonText: "ok",
          });
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Enter Your Mail!",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  const checkOtp = () => {
    if (forgot?.email && forgot?.email != "" && otp && otp != "") {
      axios
        .post(`https://bp.quotrprint.com/api/checkOTP`, {
          email: forgot?.email,
          otp: otp,
        })
        .then((res) => {
          // console.log(res.data);
          if (res?.data?.success == true) {
            Swal.fire({
              title: "Success!",
              text: res?.data?.message,
              icon: "success",
              confirmButtonText: "ok",
            });
            setOtpBox(false);
            setNewPasswordBox(true);
          } else {
            Swal.fire({
              title: "Error!",
              text: res?.data?.message,
              icon: "error",
              confirmButtonText: "ok",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: err?.response?.data?.message,
            icon: "error",
            confirmButtonText: "ok",
          });
        });
    }
  };

  const submitConfirmPasword = () => {
    if (newPassword?.password == newPassword?.password_confirmation) {
      axios
        .post(`https://bp.quotrprint.com/api/updatePassword`, newPassword)
        .then((res) => {
          // console.log(res.data);
          Swal.fire({
            title: "Success!",
            text: res?.data?.message,
            icon: "success",
            confirmButtonText: "ok",
          });
          navigate("/log-in");
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: err?.response?.data?.message,
            icon: "error",
            confirmButtonText: "ok",
          });
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Passwords are not same",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  return (
    <div>
      <div
        className="d-flex align-items-center justify-content-center position-relative"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <div
          className="col-lg-4 col-md-6 col-10 text-start"
          style={{ height: "60%" }}
        >
          <p
            className="fs-5"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <IoArrowBackSharp />
          </p>
          <p className="fs-1">Please Enter Your Email</p>
          <p className="my-2" style={{ fontSize: "12px", color: "gray" }}>
            Enter your Email and get a link <br /> to reset your password
          </p>
          <br />
          <div className="input-group flex-nowrap my-3">
            <span className="input-group-text" id="addon-wrapping">
              <HiOutlineMail />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              name="email" // Change 'username' to 'email'
              onChange={forgotInfo}
            />
          </div>
          <div className="mt-5 w-100">
            <button
              className="btn btn-primary w-100"
              disabled={forgot?.email && forgot?.email !== "" ? false : true}
              onClick={() => setSentMail(true)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* {sentMail && ( */}
      <div class="mailSenderMain">
        <div
          className="d-flex align-items-center justify-content-center position-absolute "
          style={{
            height: "100vh",
            top: "0",
            bottom: "0",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            className="position-relative"
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.6)",
            }}
          >
            <div className="col-12 position-absolute bottom-0 mailSender">
              <div
                className="col-lg-5 col-md-6 col-11 m-auto bg-white "
                style={{ borderRadius: "15px 15px 0 0", transition: "1s" }}
              >
                <div className="col-11 m-auto">
                  <p className="display-3 text-primary">
                    <IoMail />
                  </p>
                  <p className="fs-1 fw-bold">E-mail has been sent</p>
                  <p className="text-secondary my-2 col-lg-10 col-12 m-auto">
                    We’ve sent an email link to{" "}
                    <span class="fw-semibold text-black">{forgot?.email}</span>{" "}
                    to reset your password{" "}
                    <span
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSentMail(false)}
                    >
                      {" "}
                      Change Email?
                    </span>
                  </p>
                  {/* <p className="text-secondary my-2">Resend Email in <span className="text-danger">02:00</span></p> */}
                  <button
                    className="btn btn-primary my-4 w-100"
                    onClick={sendEmailCheck}
                  >
                    Done
                  </button>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {otpBox && (
        <div
          class="d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            zIndex: "5",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div class="col-lg-5 col-md-7  col-11 bg-light rounded-4 p-2">
            <div class="col-11 m-auto my-3">
              <p class="fs-1 fw-bold">Enter Your OTP</p>
              <div class="form__group field">
                <input
                  type="input"
                  class="form__field"
                  maxlength="6"
                  value={otp}
                  placeholder="Name"
                  name="name"
                  onChange={(e) => setOtp(e?.target?.value)}
                />
                <label for="name" class="form__label">
                  OTP
                </label>
              </div>
              <div class="d-flex my-3 gap-2">
                <button className="btn btn-primary  " onClick={checkOtp}>
                  Submit
                </button>
                <button className="btn btn-primary   " onClick={sendEmailCheck}>
                  Resend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {newPasswordBox && (
        <div
          class="d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            zIndex: "5",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div class="col-lg-5 col-md-7  col-11 bg-light rounded-4 p-2">
            <div class="col-11 m-auto my-3">
              <p class="fs-1 fw-bold">Enter Your New Password</p>
              <div class="form__group field">
                <input
                  type="input"
                  class="form__field"
                  value={newPassword?.password}
                  placeholder="Name"
                  name="password"
                  onChange={confirmPassword}
                />
                <label for="name" class="form__label">
                  Password
                </label>
              </div>
              <div class="form__group field">
                <input
                  type="input"
                  class="form__field"
                  value={newPassword?.password_confirmation}
                  placeholder="Name"
                  name="password_confirmation"
                  onChange={confirmPassword}
                />
                <label for="name" class="form__label">
                  Confirm Password
                </label>
              </div>
              <div class="d-flex my-3 gap-2">
                <button
                  className="btn btn-primary  "
                  onClick={submitConfirmPasword}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* )} */}
    </div>
  );
};

export default ForgotPassword;
