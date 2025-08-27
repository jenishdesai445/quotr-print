import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import MapContainer from "./Maps";
import "../style.css";
import { Helmet } from "react-helmet";
import { useLoading } from "../LoadingContext ";
import Swal from "sweetalert2";

const API_key = `AIzaSyAvzHK00m3gO1-hBanLOTHn9wNE_BUgdMw`;

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [address, setAddress] = useState();
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState();
  const [showModal, setShowModal] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  let token = localStorage.getItem("quotrUserToken");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (profile?.latitude && profile?.longitude) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${profile.latitude},${profile.longitude}&key=${API_key}`
        )
        .then((res) => {
          setAddress(res?.data?.results?.[4]?.formatted_address);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [profile]);

  useEffect(() => {
    if (position) {
      setUpdatedProfile((prev) => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng,
      }));
    }
  }, [position]);

  const fetchProfile = () => {
    setIsLoading(true);
    axios
      .get(`https://bp.quotrprint.com/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res?.data?.data);
        setUpdatedProfile(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message,
          icon: "error",
          confirmButtonText: "ok",
        });
        navigate("/log-in");
      });
  };

  const searchCity = () => {
    if (!updatedProfile.address?.trim()) {
      setErrors((prev) => ({ ...prev, address: "Address is required" }));
      return;
    }

    setShowMap(true);
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          updatedProfile.address
        )}&key=${API_key}`
      )
      .then((response) => {
        const result = response?.data?.results;
        if (result && result.length > 0) {
          setUpdatedProfile((prev) => ({
            ...prev,
            latitude: result[0]?.geometry?.location?.lat,
            longitude: result[0]?.geometry?.location?.lng,
          }));
          setErrors((prev) => ({ ...prev, address: "" }));
        } else {
          setErrors((prev) => ({ ...prev, address: "Address not found" }));
        }
      })
      .catch(() => {
        setErrors((prev) => ({ ...prev, address: "Error searching address" }));
      });
  };

  const handleUpdateClick = () => {
    setUpdatedProfile(profile);
    setShowModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      phone: updatedProfile.phone,
      store_no: updatedProfile.store_no,
      company_name: updatedProfile.company_name,
      address: updatedProfile.address,
      latitude: updatedProfile.latitude,
      longitude: updatedProfile.longitude,
    };

    axios
      .post(`https://bp.quotrprint.com/api/updateStoreUser`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        Swal.fire("Success", "Profile updated successfully", "success");
        setShowModal(false);
        fetchProfile();
      })
      .catch(() => Swal.fire("Error", "Failed to update", "error"));
  };

  const handleChange = (e) => {
    setUpdatedProfile({
      ...updatedProfile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Profile</title>
      </Helmet>

      <div className="mt-3 col-11 m-auto text-start">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="fs-1 fw-bold my-3">Profile</p>
          </div>
          <div>
            <p
              onClick={() => navigate("/dashboard")}
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-arrow-left-circle fs-2 fw-bold"></i>
            </p>
          </div>
        </div>
        <hr />

        <div className="row my-4 justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div
              className="card border-0 shadow-lg rounded-4 position-relative"
              style={{ maxWidth: "420px", margin: "0 auto" }}
            >
              {/* Update Button */}
              <button
                className="btn btn-sm d-flex align-items-center justify-content-center border-0 position-absolute rounded-circle shadow-lg"
                style={{
                  top: "12px",
                  right: "12px",
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  transition: "all 0.3s ease-in-out",
                }}
                onClick={handleUpdateClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 3px 6px rgba(0,0,0,0.15)";
                }}
              >
                <i
                  className="bi bi-pencil-square"
                  style={{ color: "#0d6efd", fontSize: "18px" }}
                ></i>
              </button>

              <div className="card-body text-center p-4">
                {/* Profile Icon */}
                <div className="d-flex justify-content-center mb-3">
                  <FaCircleUser className="text-primary" size={80} />
                </div>

                {/* Company Name */}
                <h5 className="fw-bold text-primary mb-4">
                  {profile.company_name}
                </h5>

                {/* Divider */}
                <hr className="mb-4 mt-0" />

                {/* Info Rows */}
                <div
                  className="text-start mx-auto"
                  style={{ maxWidth: "320px", fontSize: "15px" }}
                >
                  <p className="mb-2">
                    <span className="fw-semibold me-2"> Name:</span>
                    {profile.name}
                    <span className="badge bg-light text-dark ms-2">
                      {profile.cust_type}
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="fw-semibold me-2"> Email:</span>
                    {profile.email}
                  </p>
                  <p className="mb-2">
                    <span className="fw-semibold me-2"> Phone:</span>
                    {profile.phone}
                  </p>
                  <p className="mb-2">
                    <span className="fw-semibold me-2"> Store No:</span>
                    {profile.store_no}
                  </p>
                  <p className="mb-0">
                    <span className="fw-semibold me-2"> Address:</span>
                    {address || profile.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && updatedProfile && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" style={{ marginTop: "100px" }}>
            <div className="modal-content border-0 shadow-lg rounded-4">
              {/* Header */}
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-primary">
                  Update Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">
                  <div className="row g-4 text-start">
                    {/* Store ID */}
                    {/* <div className="col-md-6 ">
                      <label className="form-label fw-semibold">
                        Store ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="id"
                        value={updatedProfile.id || ""}
                        onChange={handleChange}
                        placeholder="Enter store ID"
                      />
                    </div> */}

                    {/* Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={updatedProfile.name || ""}
                        onChange={handleChange}
                        placeholder="Enter name"
                      />
                    </div>

                    {/* Email */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold d-flex align-items-center">
                        Email <span className="text-danger ms-1">*</span>
                        <span
                          className="ms-2 text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          (Not editable)
                        </span>
                      </label>
                      <input
                        type="email"
                        className="form-control bg-light"
                        value={updatedProfile.email || ""}
                        name="email"
                        readOnly
                      />
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={updatedProfile.phone || ""}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>

                    {/* Store No */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Store No <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="store_no"
                        value={updatedProfile.store_no || ""}
                        onChange={handleChange}
                        placeholder="Enter store no"
                      />
                    </div>

                    {/* Company Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Company Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="company_name"
                        value={updatedProfile.company_name || ""}
                        onChange={handleChange}
                        placeholder="Enter company name"
                      />
                    </div>

                    {/* Address full row */}
                    <p
                      className="form-label fw-semibold"
                      style={{ marginBottom: "2px" }}
                    >
                      Full Address
                    </p>

                    <p
                      className="text-secondary"
                      style={{ fontSize: "12px", marginBottom: "4px" }}
                    >
                      (Address, City, State, Zip)
                    </p>

                    <div className="input-group mt-1">
                      <input
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        type="text"
                        name="address"
                        placeholder="Location"
                        value={updatedProfile.address || ""}
                        onChange={handleChange}
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
                          lat={updatedProfile.latitude}
                          lng={updatedProfile.longitude}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer border-0 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-danger px-4"
                    onClick={() => setShowModal(false)}
                  >
                    Discard
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
