import axios from "axios";
import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { useLoading } from "../LoadingContext ";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [orderTableDetails, setOrderTableDetails] = useState();
  const [orderDetails, setOrderDetails] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");

  let token = localStorage.getItem("quotrUserToken");
  let userId = localStorage.getItem("quotrUserId");
  let user = localStorage.getItem("quotrUserControl");

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    if (updateStatus == "") {
      setIsLoading(true);
      axios
        .post(
          `https://bp.quotrprint.com/api/orderList`,
          { userId: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setOrderTableDetails(res?.data?.data);
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
          navigate("/dashboard");
        });
    }
  }, [token, userId, updateStatus]);

  // const statuValueUser = (e) => {
  //     if (e == 1) {
  //         return (
  //             <span class='text-primary'>Pending</span>
  //         )
  //     } else if (e == 2) {
  //         return (
  //             <span class='text-warning' >In process</span>
  //         )
  //     } else if (e == 3) {
  //         return (
  //             <span class='text-danger'>Cancel</span>
  //         )
  //     } else if (e == 4) {
  //         return (
  //             <span class='text-success'>Completed</span>
  //         )
  //     }
  // }

  useEffect(() => {
    if (updateStatus) {
      setIsLoading(true);
      axios
        .post(`https://bp.quotrprint.com/api/changeOrderStatus`, updateStatus, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
          setIsLoading(false);
          Swal.fire({
            title: "Success!",
            text: res?.data?.message,
            icon: "success",
            confirmButtonText: "ok",
          });
          setUpdateStatus("");
        })
        .catch((err) => {
          setIsLoading(false);
          Swal.fire({
            title: "Error!",
            text: err.response?.data?.message,
            icon: "error",
            confirmButtonText: "ok",
          });
          setUpdateStatus("");
        });
    }
  }, [updateStatus]);

  const showOrderDetails = (e) => {
    setIsLoading(true);
    axios
      .post(
        `https://bp.quotrprint.com/api/orderProductDetail`,
        { orderId: e },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setShowDetails(true);
        setOrderDetails(res?.data?.data);
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
      });
  };

  return (
    <div>
      <div class="col-11 m-auto text-start">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <p class="fs-1 fw-bold my-3">Order List</p>
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

        <div className=" mt-2" style={{ overflowX: "auto" }}>
          <table className="table table-bordered border-primary table-hover rounded-3">
            <thead className="table-primary">
              <tr>
                <th scope="col" className="text-nowrap text-center">
                  Customer Name
                </th>
                <th scope="col" className="text-nowrap text-center">
                  Email
                </th>
                <th scope="col" className="text-nowrap text-center">
                  Phone
                </th>
                <th scope="col" className="text-nowrap text-center">
                  Address
                </th>
                <th scope="col" className="text-nowrap text-center">
                  Amount ($){" "}
                </th>
                <th scope="col" className="text-nowrap text-center">
                  Tax ($)
                </th>
                <th scope="col" className="text-nowrap text-center">
                  Total ($)
                </th>
                <th scope="col" className="text-nowrap text-center">
                  Order Status
                </th>
                <th scope="col" className="text-nowrap text-center">
                  Order Details
                </th>
              </tr>
            </thead>
            <tbody>
              {orderTableDetails?.map((el, i) => (
                <tr key={i}>
                  <td className="text-nowrap fw-bold text-center">{el.name}</td>
                  <td className="text-nowrap fw-bold text-center">
                    {el.email}
                  </td>
                  <td className="text-nowrap fw-bold text-center">
                    {el.phone}
                  </td>
                  <td className="text-nowrap fw-bold text-center">
                    {el.address}
                  </td>
                  <td className="text-nowrap fw-bold text-center">
                    {el.tot_amount}
                  </td>
                  <td className="text-nowrap fw-bold text-center">
                    {el.tax_amount}
                  </td>
                  <td className="text-nowrap fw-bold text-center">
                    {el.grand_tot_amount}
                  </td>
                  {/* {user == 'true' &&
                                        <td className='text-nowrap fw-bold text-center'>  {statuValueUser(el.status)}  </td>
                                    } */}
                  {/* {user == 'false' && */}
                  <td className="text-nowrap fw-bold text-center">
                    <select
                      className={`form-control fw-bold orderStatus${el.status}`}
                      key={i}
                      value={el.status}
                      onChange={(e) =>
                        setUpdateStatus({
                          status: e.target.value,
                          orderId: el?.id,
                        })
                      }
                    >
                      <option value="1" disabled={el.status !== 1}>
                        Pending
                      </option>
                      <option value="2">Process</option>
                      <option value="3">Cancel</option>
                      <option value="4">Completed</option>
                    </select>
                  </td>

                  {/* } */}
                  <td className="text-nowrap fw-bold text-center">
                    <button
                      class="btn btn-primary"
                      onClick={() => showOrderDetails(el?.id)}
                    >
                      View{" "}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div class="d-flex justify-content-end ">
            {/* <button class='btn btn-primary px-3' onClick={handelOrderStatus}> Save</button> */}
          </div>
        </div>
        <br />

        {orderDetails && showDetails ? (
          <div class="orderdetails">
            <div class="col-lg-6 col-md-9 col-11 m-auto bg-white rounded-4">
              <div class="col-11 m-auto p-3">
                <p class="fs-2 fw-bold">{orderDetails?.product_name}</p>
                {orderDetails?.run_size == "" ? (
                  <p class="fw-semibold">Quantity : {orderDetails?.qty}</p>
                ) : (
                  <p class="fw-semibold">Run Size : {orderDetails?.run_size}</p>
                )}
                <div class="my-3">
                  <table className="table table-bordered border-primary table-hover rounded-3">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col" className="text-nowrap text-center">
                          Name
                        </th>
                        <th scope="col" className="text-nowrap text-center">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails?.attributes_detail?.map((el, i) => (
                        <tr key={i}>
                          <td className="text-nowrap fw-bold text-center">
                            {el.attribute_name}
                          </td>
                          <td className="text-nowrap fw-bold text-center">
                            {el.attribute_values_name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  class="btn btn-dark"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default OrderList;
