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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    latitude: null,
    longitude: null,
    plan: "",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const details = location?.state?.plan?.el;
  const [searchAdd, setSearchAdd] = useState("");
  const [position, setPosition] = useState();
  const [showMap, setShowMap] = useState(false);
  const [adminDetails, setAdminDetails] = useState({});
  const { setIsLoading } = useLoading();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [tc, setTc] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setFormData((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  }, []);

  useEffect(() => {
    if (position) {
      setFormData((prev) => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng,
      }));
    }
  }, [position]);

  useEffect(() => {
    if (searchAdd && searchAdd.length > 0) {
      const { lat, lng } = searchAdd[0].geometry.location;
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    }
  }, [searchAdd]);

  const searchCity = () => {
    if (!formData.address.trim()) {
      setErrors((prev) => ({ ...prev, address: "Address is required" }));
      return;
    }

    setShowMap(true);
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          formData.address
        )}&key=${API_key}`
      )
      .then((response) => {
        const result = response?.data?.results;
        if (result && result.length > 0) {
          setFormData((prev) => ({
            ...prev,
            latitude: result[0]?.geometry?.location?.lat,
            longitude: result[0]?.geometry?.location?.lng,
          }));
          setErrors((prev) => ({ ...prev, address: "" }));
        } else {
          setErrors((prev) => ({ ...prev, address: "Address not found" }));
        }
      })
      .catch((error) => {
        setErrors((prev) => ({ ...prev, address: "Error searching address" }));
      });
  };

  useEffect(() => {
    if (formData.latitude !== null && formData.longitude !== null) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${formData.latitude},${formData.longitude}&key=${API_key}`
        )
        .then((res) => {
          if (res.data.results && res.data.results.length > 5) {
            setFormData((prev) => ({
              ...prev,
              address: res.data.results[5].formatted_address,
            }));
          }
        })
        .catch((error) => {
          console.error("Error getting address from coordinates:", error);
        });
    }
  }, [formData.latitude, formData.longitude]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }

      // Validate email format in real-time
      if (name === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Invalid email format",
          }));
        }
      }

      // Validate password in real-time
      if (name === "password") {
        validatePassword(value);
      }

      // ✅ FIX: Check passwords match using updatedForm (not old formData)
      if (updatedForm.password && updatedForm.confirmPassword) {
        if (updatedForm.password !== updatedForm.confirmPassword) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: "Passwords do not match",
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
        }
      }

      return updatedForm;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    )
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.latitude || !formData.longitude)
      newErrors.address = "Please select a valid address";

    if (!tc) newErrors.tc = "You must agree to the terms and conditions";
    if (!emailVerified) newErrors.email = "Email must be verified";

    // Password rules
    const passwordValidation = validatePassword(formData.password || "");
    if (!Object.values(passwordValidation).every(Boolean)) {
      newErrors.password = "Password does not meet requirements";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (password) => {
    const validation = {
      length: password?.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return validation;
  };

  useEffect(() => {
    const admin = {
      ...formData,
      plan: details?.id,
      price: details?.name,
    };
    setAdminDetails(admin);
  }, [formData, details]);

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // ✅ Map `confirmPassword` -> `password_confirmation`
    const { confirmPassword, ...rest } = formData;
    const adminData = {
      ...rest,
      password_confirmation: confirmPassword, // <-- backend expects this
      plan: details?.id,
      price: details?.name,
    };

    axios
      .post("https://bp.quotrprint.com/api/addStoreOwner", adminData)
      .then((res) => {
        if (res?.data?.success === true) {
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
        let errorMessage = "An error occurred during registration";

        // ✅ Field-wise server errors ko UI par set karo
        if (err?.response?.data?.errors) {
          const serverErrors = err.response.data.errors;

          setErrors((prev) => ({
            ...prev,
            // Laravel may send: errors.password, errors.password_confirmation, etc.
            password: serverErrors.password?.[0] || prev.password || "",
            confirmPassword:
              serverErrors.password_confirmation?.[0] ||
              prev.confirmPassword ||
              "",
            email: serverErrors.email?.[0] || prev.email || "",
            name: serverErrors.name?.[0] || prev.name || "",
            phone: serverErrors.phone?.[0] || prev.phone || "",
            address: serverErrors.address?.[0] || prev.address || "",
          }));

          // Optional: combine all messages for the toast
          errorMessage = Object.values(serverErrors).flat().join(", ");
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        }

        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "ok",
        });
      });
  };

  const verifyEmail = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrors({
        name: !formData.name.trim() ? "Name is required" : "",
        email: !formData.email.trim() ? "Email is required" : "",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    setIsLoading(true);

    axios
      .post(`https://bp.quotrprint.com/api/sendOTP`, {
        name: formData.name,
        email: formData.email,
      })
      .then((res) => {
        if (res?.data?.success) {
          Swal.fire({
            text: res?.data?.message,
            icon: "success",
            confirmButtonText: "ok",
          });
          setIsLoading(false);
          setOtpSent(true);
          setErrors((prev) => ({ ...prev, email: "" }));
        } else {
          // Handle case where email is already verified/registered
          if (res?.data?.message?.includes("Email already verification done")) {
            Swal.fire({
              title: "Already Registered",
              text: "Your email is already verified. Please login to access your account.",
              icon: "info",
              confirmButtonText: "Go to Login",
            }).then(() => {
              navigate("/log-in");
            });
          } else {
            Swal.fire({
              text: res?.data?.message,
              icon: "error",
              confirmButtonText: "ok",
            });
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        // Handle case where email is already verified/registered
        if (
          err?.response?.data?.message?.includes(
            "Email already verification done"
          )
        ) {
          Swal.fire({
            title: "Already Registered",
            text: "Your email is already verified. Please login to access your account.",
            icon: "info",
            confirmButtonText: "Go to Login",
          }).then(() => {
            navigate("/log-in");
          });
        } else {
          Swal.fire({
            text:
              err?.response?.data?.message ||
              "Error sending verification email",
            icon: "error",
            confirmButtonText: "ok",
          });
        }
        setIsLoading(false);
      });
  };

  const verifyOtp = () => {
    if (!otp.trim()) {
      Swal.fire({
        text: "Please enter the OTP",
        icon: "error",
        confirmButtonText: "ok",
      });
      return;
    }

    setIsLoading(true);
    axios
      .post(`https://bp.quotrprint.com/api/verificationOTP`, {
        otp: otp,
        email: formData.email,
      })
      .then((res) => {
        if (res?.data?.success) {
          setIsLoading(false);
          setOtpVerified(true);
          setEmailVerified(true);
          setShowAllFields(true); // Show all fields after verification
          setErrors((prev) => ({ ...prev, email: "" }));
          Swal.fire({
            text: "Email verified successfully!",
            icon: "success",
            confirmButtonText: "ok",
          });
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
        Swal.fire({
          text: err?.response?.data?.message || "Error verifying OTP",
          icon: "error",
          confirmButtonText: "ok",
        });
      });
  };

  const passwordValidation = validatePassword(formData.password);
  const allValid = Object.values(passwordValidation).every(Boolean);

  // Check if form is valid for submit button
  const isFormValid = () => {
    const result =
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone &&
      formData.address.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      allValid &&
      emailVerified &&
      tc &&
      formData.latitude &&
      formData.longitude;

    return result;
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Registration Process</title>
      </Helmet>

      <div className="my-5">
        <div className="col-lg-6 col-md-8 col-11 m-auto text-start ">
          <div className="border p-2 border-primary rounded-4 mt-4">
            <div className="col-11 m-auto">
              <p className="fs-2 fw-bold text-center my-2">
                Registration Process
              </p>
              <p className="fs-4 fw-bold my-2">
                Admin Setup{" "}
                <span>
                  <MdAdminPanelSettings />
                </span>
              </p>

              <p className="mt-2">Name</p>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                type="text"
                value={formData.name}
                placeholder="Name"
                name="name"
                onChange={handleInputChange}
              />
              {errors.name && (
                <div className="text-danger small">{errors.name}</div>
              )}

              <p className="mt-2">Email</p>
              <p className="text-secondary" style={{ fontSize: "12px" }}>
                (Store owner's email is for billing and admin access. Do not use
                store email address until setting up "My Store")
              </p>
              <div className="d-flex gap-3 align-items-start">
                <div className="flex-grow-1">
                  <input
                    className={`form-control mt-1 ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    type="text"
                    placeholder="Email"
                    value={formData.email}
                    name="email"
                    onChange={handleInputChange}
                    disabled={emailVerified}
                  />
                  {errors.email && (
                    <div className="text-danger small">{errors.email}</div>
                  )}
                </div>
                <button
                  className="btn btn-primary p-1 px-2"
                  onClick={verifyEmail}
                  disabled={emailVerified}
                >
                  {emailVerified ? "Verified" : "Verify"}
                </button>
              </div>

              {otpSent && !emailVerified && (
                <div className="mt-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    name="otp"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-primary mt-2"
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {/* Show other fields only after email verification */}
              {showAllFields && (
                <>
                  <p className="mt-2">Phone</p>
                  <div className={errors.phone ? "is-invalid" : ""}>
                    <PhoneInput
                      country={"us"}
                      value={formData.phone}
                      onChange={(phone) =>
                        setFormData((prev) => ({ ...prev, phone }))
                      }
                      inputStyle={{ width: "100%" }}
                    />
                  </div>
                  {errors.phone && (
                    <div className="text-danger small">{errors.phone}</div>
                  )}

                  <p className="mt-2">Full Address</p>
                  <p className="text-secondary" style={{ fontSize: "12px" }}>
                    (Address, City, State, Zip)
                  </p>

                  <div className="input-group mb-3 mt-1 ">
                    <input
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      type="text"
                      name="address"
                      placeholder="Address, City, State, Zip"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    <span
                      className="input-group-text"
                      style={{ cursor: "pointer" }}
                      onClick={searchCity}
                    >
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                  {errors.address && (
                    <div className="text-danger small">{errors.address}</div>
                  )}

                  {showMap && (
                    <div>
                      <p
                        className="text-end fs-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowMap(false)}
                      >
                        <i className="bi bi-x-circle"></i>
                      </p>
                      <MapContainer
                        data={setPosition}
                        lat={formData.latitude}
                        lng={formData.longitude}
                      />
                    </div>
                  )}

                  <p className="mt-2">Password</p>
                  <div className="input-group mb-3">
                    <input
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      name="password"
                      onChange={handleInputChange}
                    />
                    <span
                      className="input-group-text"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <i className="bi bi-eye-slash-fill"></i>
                      ) : (
                        <i className="bi bi-eye-fill"></i>
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <div className="text-danger small">{errors.password}</div>
                  )}

                  <ul className="list-unstyled d-flex gap-2 flex-wrap">
                    {Object.entries(passwordValidation).map(
                      ([key, isValid]) => (
                        <li
                          key={key}
                          style={{
                            color: isValid ? "green" : "red",
                            fontSize: "0.85rem",
                          }}
                        >
                          {isValid ? "✔" : "✖"}{" "}
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </li>
                      )
                    )}
                  </ul>

                  <p className="mt-2">Confirm Password</p>
                  <div className="input-group mb-3">
                    <input
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      onChange={handleInputChange}
                    />
                    <span
                      className="input-group-text"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {showConfirmPassword ? (
                        <i className="bi bi-eye-slash-fill"></i>
                      ) : (
                        <i className="bi bi-eye-fill"></i>
                      )}
                    </span>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-danger small">
                      {errors.confirmPassword}
                    </div>
                  )}

                  <div className="form-check">
                    <input
                      className={`form-check-input ${
                        errors.tc ? "is-invalid" : ""
                      }`}
                      type="checkbox"
                      checked={tc}
                      id="t&c"
                      onChange={() => setTc(!tc)}
                    />
                    <label className="form-check-label" htmlFor="t&c">
                      AGREE Terms & Conditions{" "}
                      <a
                        href="/terms-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Check T&C
                      </a>
                    </label>
                  </div>
                  {errors.tc && (
                    <div className="text-danger small">{errors.tc}</div>
                  )}

                  <button
                    className="btn btn-primary form-control mt-2"
                    disabled={!isFormValid()}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
