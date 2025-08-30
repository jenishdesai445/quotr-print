import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLoading } from "../LoadingContext ";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [orderTableDetails, setOrderTableDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");

  const [filterStatus, setFilterStatus] = useState("All"); // 👈 filter state

  let token = localStorage.getItem("quotrUserToken");
  let userId = localStorage.getItem("quotrUserId");
  let user = localStorage.getItem("quotrUserControl");

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  // ✅ Fetch Orders function (with status in payload)
  const fetchOrders = (status = "All") => {
    setIsLoading(true);

    const payload = {
      userId: userId,
    };

    if (status !== "All") {
      payload.status = status; // 👈 backend ko bhejna
    }

    axios
      .post(`https://bp.quotrprint.com/api/orderList`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrderTableDetails(res?.data?.data || []);
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
  };

  // ✅ Initial load
  useEffect(() => {
    fetchOrders(filterStatus);
  }, [token, userId, updateStatus]);

  // ✅ Filter change par API call
  useEffect(() => {
    fetchOrders(filterStatus);
  }, [filterStatus]);

  // ✅ Update order status
  useEffect(() => {
    if (updateStatus) {
      setIsLoading(true);
      axios
        .post(`https://bp.quotrprint.com/api/changeOrderStatus`, updateStatus, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setIsLoading(false);
          Swal.fire({
            title: "Success!",
            text: res?.data?.message,
            icon: "success",
            confirmButtonText: "ok",
          });
          setUpdateStatus("");
          fetchOrders(filterStatus); // refresh after update
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

  // ✅ Show order details
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
      <div className="col-11 m-auto text-start">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="fs-1 fw-bold my-3">Order List</p>
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

        {/* ✅ Status Filter */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between my-3 p-3 shadow-sm rounded bg-white gap-3">
          {/* Filter Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <label
              htmlFor="statusFilter"
              className="fw-semibold text-secondary"
            >
              Filter:
            </label>
            <select
         
              id="statusFilter"
              className="form-select fw-semibold border-primary"
              style={{ maxWidth: "220px",cursor:"pointer" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="1">Pending</option>
              <option value="2">In Process</option>
              <option value="3">Cancel</option>
              <option value="4">Completed</option>
            </select>
          </div>

          {/* Count */}
          <div className="text-md-end">
            <p className="fw-bold text-dark m-0">
              Showing:{" "}
              <span className="text-primary">{orderTableDetails.length}</span>{" "}
              {filterStatus === "All" ? "Orders" : "Orders in this status"}
            </p>
          </div>
        </div>

        <div className=" mt-2" style={{ overflowX: "auto" }}>
          <table className="table table-bordered border-primary table-hover rounded-3">
            <thead className="table-primary">
              <tr>
                <th className="text-nowrap text-center">Company Name</th>
                <th className="text-nowrap text-center">Customer Name</th>
                <th className="text-nowrap text-center">Email</th>
                <th className="text-nowrap text-center">Phone</th>
                <th className="text-nowrap text-center">Address</th>
                <th className="text-nowrap text-center">Amount ($)</th>
                <th className="text-nowrap text-center">Tax ($)</th>
                <th className="text-nowrap text-center">Total ($)</th>
                <th className="text-nowrap text-center">Order Status</th>
                <th className="text-nowrap text-center">Order Details</th>
              </tr>
            </thead>
            <tbody>
              {orderTableDetails?.map((el, i) => (
                <tr key={i}>
                  <td className="text-nowrap fw-bold text-center">
                    {el.company_name}
                  </td>
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
                  <td className="text-nowrap fw-bold text-center">
                    <select
                      style={{ cursor: "pointer" }}
                      className={`form-control fw-bold orderStatus${el.status}`}
                      value={el.status}
                      disabled={el.status === 4}
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
                  <td className="text-nowrap fw-bold text-center">
                    <button
                      className="btn btn-primary"
                      onClick={() => showOrderDetails(el?.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {orderTableDetails.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center fw-bold">
                    No orders found for this status
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details */}
        {orderDetails && showDetails && (
          <div className="orderdetails">
            <div className="col-lg-6 col-md-9 col-11 m-auto bg-white rounded-4">
              <div className="col-11 m-auto p-3">
                <p className="fs-2 fw-bold">{orderDetails?.product_name}</p>
                {orderDetails?.run_size === "" ? (
                  <p className="fw-semibold">Quantity : {orderDetails?.qty}</p>
                ) : (
                  <p className="fw-semibold">
                    Run Size : {orderDetails?.run_size}
                  </p>
                )}
                <div className="my-3">
                  <table className="table table-bordered border-primary table-hover rounded-3">
                    <thead className="table-primary">
                      <tr>
                        <th className="text-nowrap text-center">Name</th>
                        <th className="text-nowrap text-center">Details</th>
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
                  className="btn btn-dark"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
