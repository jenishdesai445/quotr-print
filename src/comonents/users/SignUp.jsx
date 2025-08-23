import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  let token = localStorage.getItem("quotrUserToken");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    latitude: null,
    longitude: null,
    plan: "", // Plan ID yahan store hogi
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchAdd, setSearchAdd] = useState("");
  const [position, setPosition] = useState();
  const [showMap, setShowMap] = useState(false);
  const { setIsLoading } = useLoading();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [tc, setTc] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);

  // NEW: States for subscription plans and OTP timer
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Fetch plans on component mount
  useEffect(() => {
    const getSubscriptionPlan = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://bp.quotrprint.com/api/subscriptionPlan`
        );
        const plans = response.data?.data;
        setSubscriptionPlans(plans);

        // If there's only one plan, pre-select it
        if (plans && plans.length === 1) {
          setFormData((prev) => ({
            ...prev,
            plan: plans[0].id,
          }));
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: "Could not fetch subscription plans.",
          icon: "error",
          confirmButtonText: "ok",
        });
      }
    };
    getSubscriptionPlan();
  }, [setIsLoading]); // Run only once

  // OTP Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, otpSent]);

  const startTimer = () => {
    setTimer(60); // 60 seconds
    setCanResend(false);
  };

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
          // ✅ Handle case where email is already verified/registered
          if (res?.data?.message?.includes("Email already verification done")) {
            Swal.fire({
              title: "Already Registered",
              text: "Your email is already verified.",
              icon: "info",
              confirmButtonText: "ok",
            }).then(() => {
              // 🔥 Instead of navigate, update your states
              setOtpVerified(true);
              setEmailVerified(true);
              setShowAllFields(true);
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
        if (
          err?.response?.data?.message?.includes(
            "Email already verification done"
          )
        ) {
          Swal.fire({
            title: "Already Registered",
            text: "Your email is already verified.",
            icon: "info",
            confirmButtonText: "ok",
          }).then(() => {
            // 🔥 Same logic in catch
            setOtpVerified(true);
            setEmailVerified(true);
            setShowAllFields(true);
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
      if (errors[name]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
      if (name === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Invalid email format",
          }));
        }
      }
      if (name === "password") {
        validatePassword(value);
      }
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

  const validatePassword = (password) => {
    return {
      length: password?.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
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
    if (formData.password && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.latitude || !formData.longitude)
      newErrors.address = "Please select a valid address";
    if (!tc) newErrors.tc = "You must agree to the terms and conditions";
    if (!emailVerified) newErrors.email = "Email must be verified";
    if (!formData.plan) newErrors.plan = "Please select a subscription plan"; // Plan validation
    const passwordValidation = validatePassword(formData.password || "");
    if (!Object.values(passwordValidation).every(Boolean))
      newErrors.password = "Password does not meet requirements";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (!validateForm()) return;
    setIsLoading(true);
    const { confirmPassword, ...rest } = formData;
    const selectedPlan = subscriptionPlans.find((p) => p.id === formData.plan);
    const adminData = {
      ...rest,
      password_confirmation: confirmPassword,
      plan: selectedPlan ? selectedPlan.name : "",
      price: selectedPlan ? selectedPlan.price : "",
    };

    axios
      .post("https://bp.quotrprint.com/api/addStoreOwner", adminData)
      .then((res) => {
        if (res?.data?.success === true) {
          // ✅ Register success
          Swal.fire({
            title: "Success!",
            text: res?.data?.message,
            icon: "success",
            confirmButtonText: "ok",
          });

          // ✅ अब register होने के बाद login call करो
          const loginPayload = {
            email: formData.email,
            password: formData.password, // वही password जो user ने register में डाला था
          };

          axios
            .post("https://bp.quotrprint.com/api/login", loginPayload)
            .then((loginRes) => {
              if (loginRes?.data?.success === true) {
                localStorage.setItem("quotrUserToken", loginRes.data?.token);
                localStorage.setItem("quotrUserId", loginRes.data?.UserId);

                navigate("/dashboard", { state: loginRes?.data?.UserId });
              } else {
                Swal.fire({
                  title: "Login Failed!",
                  text:
                    loginRes?.data?.message ||
                    "Something went wrong during login",
                  icon: "error",
                  confirmButtonText: "ok",
                });
              }
            })
            .catch((loginErr) => {
              Swal.fire({
                title: "Login Error!",
                text:
                  loginErr.response?.data?.message ||
                  "Unable to login after registration",
                icon: "error",
                confirmButtonText: "ok",
              });
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        let errorMessage = "An error occurred during registration";

        if (err?.response?.data?.message) {
          const serverMessage = err.response.data.message;
          if (typeof serverMessage === "object") {
            errorMessage = Object.values(serverMessage).flat().join(", ");
            setErrors((prev) => ({ ...prev, ...serverMessage }));
          } else {
            errorMessage = serverMessage;
          }
        }

        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "ok",
        });
      });
  };

  const handleResendOtp = () => {
    if (canResend) {
      verifyEmail(); // Reuse the verifyEmail function
    }
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
        setIsLoading(false);
        if (res?.data?.success) {
          setOtpVerified(true);
          setEmailVerified(true);
          setShowAllFields(true);
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
  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone &&
      formData.address.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      Object.values(passwordValidation).every(Boolean) &&
      emailVerified &&
      tc &&
      formData.plan && // Check if plan is selected
      formData.latitude &&
      formData.longitude
    );
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
                {" "}
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
                  disabled={emailVerified || timer > 0}
                >
                  {emailVerified ? "Verified" : "Verify"}
                </button>
              </div>

              {/* UPDATED: OTP Section with Timer and Resend button */}
           
              {otpSent && !emailVerified && (
                <div className="mt-3 border p-3 rounded">
                  <p>We've sent an OTP to your email. Please enter it below.</p>
                  <div className="d-flex gap-2 m-2 justify-content-start">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, ""); // केवल number
                          if (!val) return;

                          let newOtp = otp.split("");
                          newOtp[index] = val;
                          setOtp(newOtp.join(""));

                          // अगला box focus
                          const next = document.getElementById(
                            `otp-${index + 1}`
                          );
                          if (next) next.focus();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            let newOtp = otp.split("");
                            newOtp[index] = "";
                            setOtp(newOtp.join(""));

                            // पिछला box focus
                            if (index > 0) {
                              const prev = document.getElementById(
                                `otp-${index - 1}`
                              );
                              if (prev) prev.focus();
                            }
                          }
                        }}
                        id={`otp-${index}`}
                        className="form-control text-center"
                        style={{ width: "40px", fontSize: "18px" }}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-outline-primary"
                      onClick={verifyOtp}
                      disabled={otp.length !== 6}
                    >
                      Verify OTP
                    </button>
                  </div>
                  <div className="mt-2 text-center">
                    {timer > 0 ? (
                      <p className="text-secondary">
                        Resend OTP in {timer} seconds
                      </p>
                    ) : (
                      <button
                        className="btn btn-link p-0"
                        onClick={handleResendOtp}
                        disabled={!canResend}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {showAllFields && (
                <>
                  {/* NEW: Subscription Plan Dropdown */}
                  <p className="mt-2">Subscription Plan</p>
                  <select
                    className={`form-select ${errors.plan ? "is-invalid" : ""}`}
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    disabled={subscriptionPlans.length === 1}
                  >
                    {subscriptionPlans.length > 1 && (
                      <option value="">-- Select a Plan --</option>
                    )}
                    {subscriptionPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.price}
                      </option>
                    ))}
                  </select>
                  {errors.plan && (
                    <div className="text-danger small">{errors.plan}</div>
                  )}

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

                  {/* Rest of the form fields */}
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
                      {" "}
                      AGREE Terms & Conditions{" "}
                      <a
                        href="/terms-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
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
