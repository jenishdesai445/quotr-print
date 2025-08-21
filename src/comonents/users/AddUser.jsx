import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapContainer from "./Maps";
import axios from "axios";
import { Helmet } from "react-helmet";
import "../style.css";
import Swal from "sweetalert2";
import { useLoading } from "../LoadingContext ";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const API_key = `AIzaSyAvzHK00m3gO1-hBanLOTHn9wNE_BUgdMw`;

const AddUser = () => {
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [address, setAddress] = useState("");
  const [searchAdd, setSearchAdd] = useState(address);
  const [position, setPosition] = useState();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [otp, setOtp] = useState();
  const [otpfild, setOtpfild] = useState(false);
  const { setIsLoading } = useLoading();
  const [phone, setPhone] = useState("");
  const [tc, setTc] = useState(false);

  const [userDetails, setUserDetails] = useState();

  let token = localStorage.getItem("quotrUserToken");
  let customerId = localStorage.getItem("quotrCustomerId");

  const navigate = useNavigate();
  const notAdmin = localStorage.getItem("quotrUserControl");

  if (notAdmin == "true") {
    Swal.fire({
      title: "Error!",
      text: "Please Contact us Admin !",
      icon: "error",
      confirmButtonText: "ok",
    });
    navigate("/dashboard");
  }

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

  const addUserDetails = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  useEffect(() => {
    const admin = { ...userDetails };
    admin.latitude = latitude;
    admin.longitude = longitude;
    admin.address = address;
    admin.customer_id = customerId;
    admin.phone = phone;
    setUserDetails(admin);
  }, [latitude, longitude, customerId, address, phone]);

  const handeluserDetails = () => {
    if (
      userDetails?.name &&
      userDetails?.name !== "" &&
      userDetails?.email &&
      userDetails?.email !== "" &&
      userDetails?.phone &&
      userDetails?.phone !== "" &&
      userDetails?.company_name &&
      userDetails?.company_name !== "" &&
      userDetails?.store_no &&
      userDetails?.store_no !== "" &&
      userDetails?.customer_id &&
      userDetails?.customer_id !== "" &&
      userDetails?.latitude &&
      userDetails?.latitude !== "" &&
      userDetails?.longitude &&
      userDetails?.longitude !== "" &&
      userDetails?.password &&
      userDetails?.password !== "" &&
      userDetails?.password_confirmation &&
      userDetails?.password_confirmation !== ""
    ) {
      if (userDetails?.password === userDetails?.password_confirmation) {
        axios
          .post("https://bp.quotrprint.com/api/register", userDetails, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            // console.log(res.data);
            if (res?.data?.success == true) {
              navigate("/my-store");
            }
          })
          .catch((err) => {
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
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please fill all fields!",
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

  const passwordValidation = validatePassword(userDetails?.password);
  const allValid = Object.values(passwordValidation).every(Boolean);

  const verifyEmail = () => {
    if (
      userDetails?.name != undefined &&
      userDetails?.name != "" &&
      userDetails?.email != undefined &&
      userDetails?.email != ""
    ) {
      setIsLoading(true);

      axios
        .post(`https://bp.quotrprint.com/api/sendOTP`, {
          name: userDetails?.name,
          email: userDetails?.email,
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
          email: userDetails?.email,
        })
        .then((res) => {
          if (res?.data?.success) {
            setIsLoading(false);
            handeluserDetails();
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
        <title>Add-User/Store</title>
      </Helmet>

      <div class="my-5">
        <div class="col-lg-6 col-md-8 col-11 m-auto text-start ">
          <div class="border p-2 border-primary rounded-4 mt-4">
            <div class="col-11 m-auto">
              <p class="fs-2 fw-bold text-center my-2"> Add User/Store</p>
              <p class="mt-2">User/Employee Name</p>
              <input
                class="form-control"
                type="text"
                placeholder="Enter Name"
                name="name"
                onChange={addUserDetails}
              />

              <p class="mt-2">Company/Store Name</p>
              <input
                class="form-control"
                type="text"
                placeholder="Enter Name"
                name="company_name"
                onChange={addUserDetails}
              />

              <p class="mt-2">Store No.</p>
              <input
                class="form-control"
                type="text"
                placeholder="Enter No."
                name="store_no"
                onChange={addUserDetails}
              />

              <p class="mt-2">Store Email (User name)</p>
              <div class="d-flex gap-3">
                <input
                  class="form-control mt-1"
                  type="text"
                  placeholder="Email"
                  value={userDetails?.email}
                  name="email"
                  onChange={addUserDetails}
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

              {/* <p class='mt-2'>Phone</p>
                            <input class='form-control' type="text" placeholder='Enter Phone No.' name='phone' onChange={addUserDetails} /> */}

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
                  placeholder="Location"
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
                  type={password ? "text" : "password"}
                  placeholder="Enter Password"
                  name="password"
                  onChange={addUserDetails}
                />
                <span
                  class="input-group-text"
                  onClick={() => setPassword(!password)}
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
                  type={confirmPassword ? "text" : "password"}
                  placeholder="Enter Confirm Password"
                  name="password_confirmation"
                  onChange={addUserDetails}
                />
                <span
                  class="input-group-text"
                  onClick={() => setConfirmPassword(!confirmPassword)}
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

export default AddUser;
