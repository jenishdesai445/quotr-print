import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import { Helmet } from "react-helmet";
import { useLoading } from "../LoadingContext ";
import Swal from "sweetalert2";

const MyStore = () => {
  const [myStoreData, setMyStoreData] = useState();
  let token = localStorage.getItem("quotrUserToken");
  let userId = localStorage.getItem("quotrUserId");
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
      setIsLoading(true);
      if (customerId) {
        axios
          .post(
            `https://bp.quotrprint.com/api/companyList`,
            { customerId: customerId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            // console.log(res.data);
            setMyStoreData(res?.data?.data);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err);
          });
      }
    }
  }, [customerId, token]);

  // console.log(myStoreData);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My-Store</title>
      </Helmet>

      <div class="mt-3 col-11 m-auto text-start">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <p class="fs-1 fw-bold my-3">My Store</p>
          </div>
          <div>
            <p
              onClick={() => navigate("/dashboard")}
              style={{ cursor: "pointer" }}
            >
              <i class="bi bi-arrow-left-circle fs-2 fw-bold"></i>
            </p>
          </div>
        </div>
        <hr />
        <button
          class="homeTopBtn px-4 p-2"
          onClick={() => navigate("/add-users")}
        >
          Add User/Store
        </button>

        <div class="row  my-4  justify-content-center ">
          {myStoreData?.map((el) => {
            return (
              <div class=" col-lg-4 col-md-6  col-11   text-start   mt-4">
                <div class="col-11 m-auto border border-primary rounded-4 p-2 h-100">
                  <div class="">
                    <p class="fs-3 fw-bold my-2">{el.company_name}</p>
                  </div>
                  <div class="d-flex ">
                    <div class="fw-bold" style={{ width: "80px" }}>
                      Name
                    </div>
                    <div class="fw-semibold">
                      - {el.name}{" "}
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        ({el.cust_type})
                      </span>{" "}
                    </div>
                  </div>
                  <div class="d-flex ">
                    <div class="fw-bold" style={{ width: "80px" }}>
                      Email
                    </div>
                    <div class="fw-semibold">- {el.email}</div>
                  </div>
                  <div class="d-flex ">
                    <div class="fw-bold" style={{ width: "80px" }}>
                      Phone
                    </div>
                    <div class="fw-semibold">- {el.phone}</div>
                  </div>
                  <div class="d-flex ">
                    <div class="fw-bold" style={{ width: "80px" }}>
                      Address
                    </div>
                    <div class="fw-semibold">- {el.address}</div>
                  </div>
                  {/* <div class='text-center mb-2'>

                                            <button class="homeTopBtn px-4 p-2 " >Edit <i class="bi bi-pencil-fill mx-2"></i></button>
                                        </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyStore;
