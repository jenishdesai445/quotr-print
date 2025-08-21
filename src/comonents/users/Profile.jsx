import axios from "axios";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import "../style.css";
import { Helmet } from "react-helmet";
import { useLoading } from "../LoadingContext ";
import Swal from "sweetalert2";

const API_key = `AIzaSyAvzHK00m3gO1-hBanLOTHn9wNE_BUgdMw`;

const Profile = () => {
  const [profile, setProfile] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [address, setAddress] = useState();

  let token = localStorage.getItem("quotrUserToken");
  const navigate = useNavigate();

  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://bp.quotrprint.com/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res?.data?.data);
        setLatitude(res?.data?.data?.latitude);
        setLongitude(res?.data?.data?.longitude);
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
  }, [token]);

  useEffect(() => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_key}`
      )
      .then((res) => {
        // console.log(res?.data?.results?.[4]?.formatted_address);
        setAddress(res?.data?.results?.[4]?.formatted_address);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, [latitude, longitude]);

  // console.log(profile);
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Profile</title>
      </Helmet>

      <br />
      <div class="col-lg-6 col-md-8 col-11 m-auto    border border-primary rounded-4 p-3 my-5">
        <div class="col-11 m-auto text-start ">
          <div class="text-center my-2">
            <FaCircleUser class="display-1 " />
          </div>
          <div>
            <div class="d-flex">
              <div style={{ width: "100px" }}>
                <p class="fs-5 fw-semibold">
                  <b>Name </b>{" "}
                </p>
              </div>
              <div>
                <p class="fs-5 fw-semibold">
                  {" "}
                  : {profile?.name} ({profile?.cust_type})
                </p>
              </div>
            </div>

            <div class="d-flex">
              <div style={{ width: "100px" }}>
                <p class="fs-5 fw-semibold">
                  <b>Email </b>{" "}
                </p>
              </div>
              <div>
                <p class="fs-5 fw-semibold"> : {profile?.email} </p>
              </div>
            </div>

            <div class="d-flex">
              <div style={{ width: "100px" }}>
                <p class="fs-5 fw-semibold">
                  <b>Phone </b>{" "}
                </p>
              </div>
              <div>
                <p class="fs-5 fw-semibold"> : {profile?.phone} </p>
              </div>
            </div>

            {address && (
              <div class="d-flex">
                <div style={{ width: "100px" }}>
                  <p class="fs-5 fw-semibold">
                    <b>Address</b>{" "}
                  </p>
                </div>
                <div>
                  <p class="fs-5 fw-semibold">: {address}</p>
                </div>
              </div>
            )}

            <div class="mt-2">
              <button
                class="btn btn-primary"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};

export default Profile;
