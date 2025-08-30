import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapContainer from "./Maps";
import "../style.css";
import { Helmet } from "react-helmet";
import { useLoading } from "../LoadingContext ";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const MyStore = () => {
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState();

  const [myStoreData, setMyStoreData] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);

  let token = localStorage.getItem("quotrUserToken");
  let customerId = localStorage.getItem("quotrCustomerId");
  const notAdmin = localStorage.getItem("quotrUserControl");

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    if (notAdmin == "true") {
      Swal.fire({
        title: "Error!",
        text: "Please Contact us Admin !",
        icon: "error",
        confirmButtonText: "ok",
      });
      navigate("/dashboard");
    } else {
      fetchStores();
    }
  }, [customerId, token]);

  useEffect(() => {
    if (position) {
      setSelectedStore((prev) => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng,
      }));
    }
  }, [position]);

  const API_key = `AIzaSyAvzHK00m3gO1-hBanLOTHn9wNE_BUgdMw`;

  const searchCity = () => {
    if (!selectedStore.address?.trim()) {
      setErrors((prev) => ({ ...prev, address: "Address is required" }));
      return;
    }

    setShowMap(true);
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          selectedStore.address
        )}&key=${API_key}`
      )
      .then((response) => {
        const result = response?.data?.results;
        if (result && result.length > 0) {
          setSelectedStore((prev) => ({
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

  const fetchStores = () => {
    setIsLoading(true);
    if (customerId) {
      axios
        .post(
          `https://bp.quotrprint.com/api/companyList`,
          { customerId: customerId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setMyStoreData(res?.data?.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  const handleUpdateClick = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: selectedStore.id,
      name: selectedStore.name,
      email: selectedStore.email,
      phone: selectedStore.phone,
      store_no: selectedStore.store_no,
      company_name: selectedStore.company_name,
      address: selectedStore.address,
      latitude: selectedStore.latitude,
      longitude: selectedStore.longitude,
    };

    axios
      .post(`https://bp.quotrprint.com/api/updateStoreUser`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        Swal.fire("Success", "Store updated successfully", "success");
        setShowModal(false);
        fetchStores();
      })
      .catch(() => Swal.fire("Error", "Failed to update", "error"));
  };

  const handleChange = (e) => {
    setSelectedStore({
      ...selectedStore,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My-Store</title>
      </Helmet>

      <div className="mt-3 col-11 m-auto text-start">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="fs-1 fw-bold my-3">My Store</p>
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
        <button
          className="homeTopBtn px-4 p-2"
          onClick={() => navigate("/add-users")}
          disabled={myStoreData?.length >= 5}
        >
          Add User/Store
        </button>

        <div className="row my-4 g-4 justify-content-center">
          {myStoreData?.map((el) => (
            <div key={el.id} className="col-lg-4 col-md-6 col-sm-10">
              <div className="card border-2 shadow-sm rounded-4 h-100 position-relative hover-card">
                {/* Update Button (Top Right) */}
                <button
                  className="btn btn-sm border-0 position-absolute rounded-circle  d-flex align-items-center justify-content-center transition-all"
                  style={{
                    top: "12px",
                    right: "12px",
                    width: "38px",
                    height: "38px",
                    backgroundColor: "#f8f9fa",
                  }}
                  onClick={() => handleUpdateClick(el)}
                >
                  <i className="bi bi-pencil-square text-primary fs-5"></i>
                </button>

                <div className="card-body">
                  {/* Company Name */}
                  <h5 className="card-title fw-bold text-primary mb-3">
                    {el.company_name}
                  </h5>

                  {/* Info Rows */}
                  <p className="mb-2">
                    <span className="fw-bold me-2">Name:</span>
                    {el.name}{" "}
                    <span className="badge bg-light text-dark ms-2">
                      {el.cust_type}
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="fw-bold me-2">Email:</span>
                    {el.email}
                  </p>
                  <p className="mb-2">
                    <span className="fw-bold me-2">Phone:</span>
                    {el.phone}
                  </p>
                  <p className="mb-0">
                    <span className="fw-bold me-2">Address:</span>
                    {el.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedStore && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          {/* 👇 margin-top fix for navbar spacing */}
          <div className="modal-dialog modal-lg" style={{ marginTop: "100px" }}>
            <div className="modal-content border-0 shadow-lg rounded-4">
              {/* Header */}
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-primary">
                  Update Store
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
                        value={selectedStore.id || ""}
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
                        value={selectedStore.name || ""}
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
                        value={selectedStore.email || ""}
                        name="email"
                        readOnly
                      />
                    </div>

                    {/* Phone */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Phone <span className="text-danger">*</span>
                      </label>

                      <PhoneInput
                        country={"us"}
                        value={selectedStore?.phone || ""}
                        onChange={(phone, country) =>
                          setSelectedStore((prev) => ({
                            ...prev,
                            phone: phone,
                            countryCode: country.dialCode,
                          }))
                        }
                        inputStyle={{ width: "100%" }}
                        enableSearch={true}
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
                        value={selectedStore.store_no || ""}
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
                        value={selectedStore.company_name || ""}
                        onChange={handleChange}
                        placeholder="Enter company name"
                      />
                    </div>

                    {/* Address full row */}
                    {/* <p className="mt-2">Full Address</p>
                    <p className="text-secondary" style={{ fontSize: "12px" }}>
                      (Address, City, State, Zip)
                    </p>

                    <div className="input-group mb-3 mt-1">
                      <input
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        type="text"
                        name="address"
                        placeholder="Location"
                        value={selectedStore.address || ""}
                        onChange={handleChange} // ✅ same handler
                      />
                      <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={searchCity} // ✅ search function lat/lng ke liye
                      >
                        <i className="bi bi-search"></i>
                      </span>
                    </div> */}

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Full Address
                      </label>
                      <p
                        className="text-secondary mb-2"
                        style={{ fontSize: "12px" }}
                      >
                        (Address, City, State, Zip)
                      </p>

                      <div className="input-group">
                        <input
                          className={`form-control ${
                            errors.address ? "is-invalid" : ""
                          }`}
                          type="text"
                          name="address"
                          placeholder="Location"
                          value={selectedStore.address || ""}
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
                        <div className="text-danger small mt-1">
                          {errors.address}
                        </div>
                      )}
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
                          lat={selectedStore.latitude}
                          lng={selectedStore.longitude}
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

export default MyStore;
