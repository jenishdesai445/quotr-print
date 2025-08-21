import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapContainer from "./Maps";
import axios from "axios";

import { Helmet } from "react-helmet";
import "../style.css";
import { useLoading } from "../LoadingContext ";
import { MdAdminPanelSettings } from "react-icons/md";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const API_key = `AIzaSyAvzHK00m3gO1-hBanLOTHn9wNE_BUgdMw`;

const SignUp = () => {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const details = location?.state?.plan?.el;
  const [address, setAddress] = useState("");
  const [searchAdd, setSearchAdd] = useState(address);
  const [position, setPosition] = useState();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [phone, setPhone] = useState("");
  const [adminDetails, setAdminDetails] = useState();
  const { setIsLoading } = useLoading();
  const [otp, setOtp] = useState();
  const [otpfild, setOtpfild] = useState(false);
  const [tc, setTc] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    setLatitude(position?.lat);
    setLongitude(position?.lng);
  }, [position]);

  useEffect(() => {
    if (searchAdd && searchAdd.length > 0) {
      const { lat, lng } = searchAdd[0].geometry.location;
      setLatitude(lat);
      setLongitude(lng);
    }
  }, [searchAdd]);

  const searchCity = () => {
    setShowMap(true);
    if (address.trim() !== "") {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${API_key}`
        )
        .then((response) => {
          const result = response?.data?.results;
          setLatitude(result?.[0]?.geometry?.location?.lat);
          setLongitude(result?.[0]?.geometry?.location?.lng);
        })
        .catch((error) => {
          // console.log(error);
        });
    }
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_key}`
        )
        .then((res) => {
          setAddress(res.data.results[5].formatted_address);
        })
        .catch((error) => {});
    }
  }, [latitude, longitude]);

  const sendAdminDetails = (e) => {
    const { name, value } = e.target;
    setAdminDetails({ ...adminDetails, [name]: value });
  };

  useEffect(() => {
    const admin = { ...adminDetails };
    admin.latitude = latitude;
    admin.longitude = longitude;
    admin.plan = details?.id;
    admin.price = details?.name;
    admin.phone = phone;
    admin.password = password;
    admin.password_confirmation = confirmPassword;

    setAdminDetails(admin);
  }, [latitude, longitude, details, phone, password, confirmPassword]);

  const handelAdminDetails = () => {
    if (
      adminDetails?.name &&
      adminDetails?.name !== "" &&
      adminDetails?.email &&
      adminDetails?.email !== "" &&
      adminDetails?.phone &&
      adminDetails?.phone !== "" &&
      adminDetails?.plan &&
      adminDetails?.plan !== "" &&
      adminDetails?.price &&
      adminDetails?.price !== "" &&
      adminDetails?.latitude &&
      adminDetails?.latitude !== "" &&
      adminDetails?.longitude &&
      adminDetails?.longitude !== "" &&
      adminDetails?.password &&
      adminDetails?.password !== "" &&
      adminDetails?.password_confirmation &&
      adminDetails?.password_confirmation !== ""
    ) {
      if (!allValid) {
        Swal.fire({
          title: "Error!",
          text: "Password must meet all requirements!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      if (password !== confirmPassword) {
        Swal.fire({
          title: "Error!",
          text: "Passwords do not match!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      setIsLoading(true);

      // 'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),

      axios
        .post("https://bp.quotrprint.com/api/addStoreOwner", adminDetails)
        .then((res) => {
          if (res?.data?.success == true) {
            setIsLoading(false);
            Swal.fire({
              title: "Success!",
              text: res?.data?.message,
              icon: "success",
              confirmButtonText: "ok",
            });
            navigate("/log-in");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          Swal.fire({
            title: "Error!",
            text: err?.response?.data?.message?.email,
            icon: "error",
            confirmButtonText: "ok",
          });
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Password and Confirm Password not the same!",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  const validatePassword = (password) => {
    return {
      length: password?.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidation = validatePassword(password);
  const allValid = Object.values(passwordValidation).every(Boolean);

  const verifyEmail = () => {
    if (
      adminDetails?.name != undefined &&
      adminDetails?.name != "" &&
      adminDetails?.email != undefined &&
      adminDetails?.email != ""
    ) {
      setIsLoading(true);

      axios
        .post(`https://bp.quotrprint.com/api/sendOTP`, {
          name: adminDetails?.name,
          email: adminDetails?.email,
        })
        .then((res) => {
          if (res?.data?.success) {
            Swal.fire({
              text: res?.data?.message,
              icon: "success",
              confirmButtonText: "ok",
            });
            setIsLoading(false);
            setOtpfild(true);
          } else {
            Swal.fire({
              text: res?.data?.message,
              icon: "error",
              confirmButtonText: "ok",
            });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          Swal.fire({
            text: err?.response?.data?.message,
            icon: "error",
            confirmButtonText: "ok",
          });
          setIsLoading(false);
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please fill Name and Email",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  const verifyOtp = () => {
    if (otp != undefined && otp != "") {
      setIsLoading(true);
      axios
        .post(`https://bp.quotrprint.com/api/verificationOTP`, {
          otp: otp,
          email: adminDetails?.email,
        })
        .then((res) => {
          if (res?.data?.success) {
            setIsLoading(false);
            handelAdminDetails();
          } else {
            Swal.fire({
              text: res?.data?.message,
              icon: "error",
              confirmButtonText: "ok",
            });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } else {
      Swal.fire({
        text: "Please verify email & enter OTP",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Registration Process</title>
      </Helmet>

      <div class="my-5">
        <div class="col-lg-6 col-md-8 col-11 m-auto text-start ">
          <div class="border p-2 border-primary rounded-4 mt-4">
            <div class="col-11 m-auto">
              <p class="fs-2 fw-bold text-center my-2">Registration Process</p>
              <p class="fs-4 fw-bold my-2">
                Admin Setup{" "}
                <span>
                  <MdAdminPanelSettings />
                </span>
              </p>

              <p class="mt-2">Name</p>
              <input
                class="form-control"
                type="text"
                value={adminDetails?.name}
                placeholder="Name"
                name="name"
                onChange={sendAdminDetails}
              />

              <p class="mt-2">Email</p>
              <p class="text-secondary" style={{ fontSize: "12px" }}>
                (Store owner’s email is for billing and admin access. Do not use
                store email address until setting up “My Store”)
              </p>
              <div class="d-flex gap-3">
                <input
                  class="form-control mt-1"
                  type="text"
                  placeholder="Email"
                  value={adminDetails?.email}
                  name="email"
                  onChange={sendAdminDetails}
                />
                <button
                  class="btn btn-primary p-1 px-2"
                  onClick={() => verifyEmail()}
                >
                  Verify
                </button>
              </div>

              {otpfild && (
                <input
                  class="form-control mt-1"
                  type="text"
                  placeholder="Enter Otp"
                  value={otp}
                  name="otp"
                  onChange={(e) => setOtp(e.target?.value)}
                />
              )}

              <p class="mt-2">Phone</p>
              <PhoneInput
                country={"us"} // Default country
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputStyle={{ width: "100%" }}
              />
              <p class="mt-2">Full Address</p>
              <p class="text-secondary" style={{ fontSize: "12px" }}>
                {" "}
                (Address, City, State, Zip)
              </p>

              <div class="input-group mb-3 mt-1 ">
                <input
                  class="form-control "
                  type="text"
                  name="autoaddress"
                  placeholder="Address, City, State, Zip"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <span
                  class="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={searchCity}
                >
                  {" "}
                  <i class="bi bi-search"></i>{" "}
                </span>
              </div>

              {showMap && (
                <div>
                  <p
                    class="text-end fs-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowMap(false)}
                  >
                    <i class="bi bi-x-circle"></i>
                  </p>
                  <MapContainer
                    data={setPosition}
                    lat={latitude}
                    lng={longitude}
                  />
                </div>
              )}

              <p class="mt-2">Password</p>
              <div class="input-group mb-3">
                <input
                  class="form-control"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  class="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {password ? (
                    <i class="bi bi-eye-slash-fill"></i>
                  ) : (
                    <i class="bi bi-eye-fill"></i>
                  )}
                </span>
              </div>

              <ul className="list-unstyled d-flex gap-2 flex-wrap">
                {Object.entries(passwordValidation).map(([key, isValid]) => (
                  <li key={key} style={{ color: isValid ? "green" : "red" }}>
                    ✔ {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </li>
                ))}
              </ul>

              <p class="mt-2">Confirm Password</p>
              <div class="input-group mb-3">
                <input
                  class="form-control"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  name="password_confirmation"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  class="input-group-text"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {confirmPassword ? (
                    <i class="bi bi-eye-slash-fill"></i>
                  ) : (
                    <i class="bi bi-eye-fill"></i>
                  )}
                </span>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value={tc}
                  id="t&c"
                  onClick={() => setTc(!tc)}
                />
                <label class="form-check-label" for="t&c">
                  AGREE Terms & Conditions{" "}
                  <a href="/terms-conditions" target="_blanck">
                    Check T&C
                  </a>
                </label>
              </div>

              <button
                class="btn btn-primary form-control mt-2 "
                disabled={allValid && otp !== "" && tc ? false : true}
                onClick={verifyOtp}
              >
                Submit
              </button>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
