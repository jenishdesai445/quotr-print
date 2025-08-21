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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    store_no: "",
    password: "",
    password_confirmation: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchAdd, setSearchAdd] = useState("");
  const [position, setPosition] = useState();
  const [showMap, setShowMap] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [tc, setTc] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);
  const { setIsLoading } = useLoading();

  let token = localStorage.getItem("quotrUserToken");
  let customerId = localStorage.getItem("quotrCustomerId");
  const navigate = useNavigate();
  const notAdmin = localStorage.getItem("quotrUserControl");

  // Check if user is admin
  useEffect(() => {
    if (notAdmin == "true") {
      Swal.fire({
        title: "Error!",
        text: "Please Contact us Admin!",
        icon: "error",
        confirmButtonText: "ok",
      });
      navigate("/dashboard");
    }
  }, [notAdmin, navigate]);

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setFormData((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  }, []);

  // Update position when map marker is moved
  useEffect(() => {
    if (position) {
      setFormData((prev) => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng,
      }));
    }
  }, [position]);

  // Update coordinates when search address changes
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

  // Search for address using Google Maps API
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

  // Get address from coordinates
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

  // Handle input changes
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

      // Check passwords match
      if (updatedForm.password && updatedForm.password_confirmation) {
        if (updatedForm.password !== updatedForm.password_confirmation) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password_confirmation: "Passwords do not match",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password_confirmation: "",
          }));
        }
      }

      return updatedForm;
    });
  };

  // Validate the entire form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.company_name.trim())
      newErrors.company_name = "Company name is required";
    if (!formData.store_no.trim())
      newErrors.store_no = "Store number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.password_confirmation)
      newErrors.password_confirmation = "Please confirm your password";
    if (
      formData.password &&
      formData.password_confirmation &&
      formData.password !== formData.password_confirmation
    )
      newErrors.password_confirmation = "Passwords do not match";

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

  // Validate password strength
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

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const userData = {
      ...formData,
      customer_id: customerId,
    };

    axios
      .post("https://bp.quotrprint.com/api/register", userData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res?.data?.success === true) {
          setIsLoading(false);
          Swal.fire({
            title: "Success!",
            text: res?.data?.message,
            icon: "success",
            confirmButtonText: "ok",
          });
          navigate("/my-store");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        let errorMessage = "An error occurred during registration";

        // Handle server validation errors
        if (err?.response?.data?.errors) {
          const serverErrors = err.response.data.errors;

          setErrors((prev) => ({
            ...prev,
            password: serverErrors.password?.[0] || prev.password || "",
            password_confirmation:
              serverErrors.password_confirmation?.[0] ||
              prev.password_confirmation ||
              "",
            email: serverErrors.email?.[0] || prev.email || "",
            name: serverErrors.name?.[0] || prev.name || "",
            phone: serverErrors.phone?.[0] || prev.phone || "",
            address: serverErrors.address?.[0] || prev.address || "",
            company_name:
              serverErrors.company_name?.[0] || prev.company_name || "",
            store_no: serverErrors.store_no?.[0] || prev.store_no || "",
          }));

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

  // Verify email with OTP
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
          text:
            err?.response?.data?.message || "Error sending verification email",
          icon: "error",
          confirmButtonText: "ok",
        });
        setIsLoading(false);
      });
  };

  // Verify OTP
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

  // Check if form is valid for submission
  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone &&
      formData.company_name.trim() &&
      formData.store_no.trim() &&
      formData.address.trim() &&
      formData.password &&
      formData.password_confirmation &&
      formData.password === formData.password_confirmation &&
      allValid &&
      emailVerified &&
      tc &&
      formData.latitude &&
      formData.longitude
    );
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Add User/Store</title>
      </Helmet>

      <div className="my-5">
        <div className="col-lg-6 col-md-8 col-11 m-auto text-start ">
          <div className="border p-2 border-primary rounded-4 mt-4">
            <div className="col-11 m-auto">
              <p className="fs-2 fw-bold text-center my-2">Add User/Store</p>

              <p className="mt-2">User/Employee Name</p>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                type="text"
                placeholder="Enter Name"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
              />
              {errors.name && (
                <div className="text-danger small">{errors.name}</div>
              )}

              <p className="mt-2">Company/Store Name</p>
              <input
                className={`form-control ${
                  errors.company_name ? "is-invalid" : ""
                }`}
                type="text"
                placeholder="Enter Name"
                value={formData.company_name}
                name="company_name"
                onChange={handleInputChange}
              />
              {errors.company_name && (
                <div className="text-danger small">{errors.company_name}</div>
              )}

              <p className="mt-2">Store No.</p>
              <input
                className={`form-control ${
                  errors.store_no ? "is-invalid" : ""
                }`}
                type="text"
                placeholder="Enter No."
                value={formData.store_no}
                name="store_no"
                onChange={handleInputChange}
              />
              {errors.store_no && (
                <div className="text-danger small">{errors.store_no}</div>
              )}

              <p className="mt-2">Store Email (User name)</p>
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
                      placeholder="Location"
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
                      placeholder="Enter Password"
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
                        errors.password_confirmation ? "is-invalid" : ""
                      }`}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter Confirm Password"
                      value={formData.password_confirmation}
                      name="password_confirmation"
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
                  {errors.password_confirmation && (
                    <div className="text-danger small">
                      {errors.password_confirmation}
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

export default AddUser;
