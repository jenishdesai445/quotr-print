import axios from "axios";
import React, { useEffect, useState } from "react";

import "../style.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useLoading } from "../LoadingContext ";
import Swal from "sweetalert2";

const ShippingPricingMarkup = () => {
  let token = localStorage.getItem("quotrUserToken");
  let userId = localStorage.getItem("quotrUserId");
  let customerId = localStorage.getItem("quotrCustomerId");

  const [markUpList, setMarkUpList] = useState([]);
  const [companyId, setCompanyId] = useState();
  const [company, setCompany] = useState([]);

  const [tableData, setTableData] = useState();

  const navigate = useNavigate();
  const notAdmin = localStorage.getItem("quotrUserControl");

  const { setIsLoading } = useLoading();

  const [changeAll, setChangeAll] = useState(false);
  const [allMarkupValue, setAllMarkupValue] = useState();

  // useEffect(() => {
  //   if (notAdmin == "true") {
  //     Swal.fire({
  //       title: "Error!",
  //       text: "Please Contact us Admin !",
  //       icon: "error",
  //       confirmButtonText: "ok",
  //     });
  //     navigate("/dashboard");
  //   } else {
  //     setIsLoading(true);
  //     if (customerId) {
  //       axios
  //         .post(
  //           `https://bp.quotrprint.com/api/companyList`,
  //           { customerId: customerId },
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         )
  //         .then((res) => {
  //           setCompany(res?.data?.data);
  //           setCompanyId(res?.data?.data?.[0]?.id);
  //           setIsLoading(false);
  //         })
  //         .catch((err) => {
  //           setIsLoading(false);
  //           // console.log(err);
  //         });
  //     }
  //   }
  // }, [customerId, token]);
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
            setCompany(res?.data?.data);

            // 👇 yaha localStorage check add kiya
            const savedCompanyId = localStorage.getItem("quotrCompanyId");
            if (savedCompanyId) {
              setCompanyId(parseInt(savedCompanyId));
            } else {
              setCompanyId(res?.data?.data?.[0]?.id);
            }

            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      }
    }
  }, [customerId, token]);
  useEffect(() => {
    if (companyId) {
      setIsLoading(true);
      setMarkUpList([]);
      axios
        .post(
          `https://bp.quotrprint.com/api/companyWiseShippingList`,
          { companyId: companyId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          const updatedMarkUpList = res?.data?.data.map((item) => ({
            ...item,
            companyId: companyId,
          }));
          setMarkUpList(updatedMarkUpList);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);

          // console.log(err);
        });
    }
  }, [companyId, token]);

  const updateMarkup = () => {
    axios
      .post(
        `https://bp.quotrprint.com/api/addCompanyWiseShipping`,
        { shipping: markUpList },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // console.log(res.data);
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: "OK",
          cancelButtonText: "Dashboard",
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            navigate("/dashboard");
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: err?.response?.data?.message?.email,
          icon: "error",
          confirmButtonText: "ok",
        });
      });
  };

  const handleMarkupChange = (index, fieldName, value) => {
    const updatedMarkupList = markUpList.map((markup, i) => {
      if (i === index) {
        return { ...markup, [fieldName]: value };
      }
      return markup;
    });
    setMarkUpList(updatedMarkupList);
  };

  useEffect(() => {
    if (allMarkupValue !== undefined) {
      const updatedMarkUpList = markUpList.map((el) => ({
        ...el,
        price: allMarkupValue,
      }));
      setMarkUpList(updatedMarkUpList);
    }
  }, [allMarkupValue]);

  const updateBulkMarkup = () => {
    setIsLoading(true);
    axios
      .post(
        `https://bp.quotrprint.com/api/addCategoryWiseMarkup`,
        { markup: markUpList },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setIsLoading(false);
        setChangeAll(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Shipping Pricing Markup</title>
      </Helmet>

      <div class="col-11 m-auto my-3 text-start">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <p class="fs-1 fw-bold my-3">Shipping Pricing Markup</p>
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

        <div className="row align-items-center">
          {/* Store Dropdown */}
          <div className="col-md-6">
            <div className="col-11 mt-3 border rounded-4 shadow-sm overflow-hidden">
              {/* Header */}
              <div
                className="p-3 d-flex justify-content-between align-items-center bg-light"
                data-bs-toggle="collapse"
                href="#collapseComponyId"
                role="button"
                aria-expanded="false"
                aria-controls="collapseComponyId"
                style={{ cursor: "pointer" }}
              >
                <p className="fs-6 fw-bold mb-0">
                  Store:{" "}
                  {company?.find((el) => el.id === companyId)?.company_name ||
                    "Select Store"}
                </p>
                <i className="bi bi-chevron-down text-muted"></i>
              </div>

              {/* Collapse Content */}
              <div className="collapse" id="collapseComponyId">
                <div className="p-2">
                  {company.map((el) => (
                    <div
                      key={el.id}
                      className={`p-2 rounded-3 mb-1 border d-flex justify-content-between align-items-center ${
                        companyId === el.id
                          ? "border-primary bg-primary bg-opacity-10"
                          : "border-light"
                      }`}
                      style={{ cursor: "pointer", transition: "0.2s" }}
                      onClick={() => {
                        setCompanyId(el.id);
// localStorage saved 
                        localStorage.setItem("quotrCompanyId", el.id);
                        // Collapse auto-close
                        const collapseEl =
                          document.getElementById("collapseComponyId");
                        const bsCollapse =
                          window.bootstrap.Collapse.getOrCreateInstance(
                            collapseEl
                          );
                        bsCollapse.hide();
                      }}
                    >
                      <p className="fw-semibold mb-0">{el.company_name}</p>
                      {companyId === el.id && (
                        <i className="bi bi-check-circle-fill text-primary"></i>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Update Section */}
          <div className="col-md-6">
            <div className="d-flex gap-3 mt-3 align-items-center">
              <div
                className="d-flex gap-2 align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => setChangeAll(!changeAll)}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckChecked"
                  checked={changeAll}
                  readOnly
                />
                <label
                  className="form-check-label fw-semibold"
                  htmlFor="flexCheckChecked"
                >
                  Bulk Update
                </label>
              </div>

              {changeAll && (
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter value"
                    onChange={(e) => setAllMarkupValue(e.target.value)}
                  />
                  {/* <button className="btn btn-primary text-nowrap" onClick={updateBulkMarkup}>Update All</button> */}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div class=" mt-2" style={{ overflowX: "auto" }}>
            <table class="table table-bordered border-primary table-hover rounded-3">
              <thead class="table-primary">
                <tr>
                  <th scope="col" rowspan="2" class="text-nowrap text-center">
                    No
                  </th>
                  <th scope="col" rowspan="2" class="text-nowrap text-center">
                    Shipping Method
                  </th>
                  <th scope="col" colspan="2" class="text-nowrap text-center">
                    Enter Your Price ($)
                  </th>
                </tr>
              </thead>
              <tbody>
                {markUpList?.map((markup, index) => (
                  <tr key={index}>
                    <td class="text-nowrap fw-bold text-center">
                      <input
                        type="text"
                        class="form-control p-0"
                        readOnly
                        style={{ border: "none", width: "40px" }}
                        value={markup.shippingId}
                        onChange={(e) =>
                          handleMarkupChange(
                            index,
                            "shippingId",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td class="text-nowrap">
                      <input
                        type="text"
                        class="form-control p-0"
                        readOnly
                        style={{ border: "none" }}
                        value={markup.name}
                      />
                    </td>
                    <td class="text-nowrap ">
                      <input
                        type="text"
                        class="form-control p-0"
                        style={{ border: "none" }}
                        value={markup.price}
                        onChange={(e) =>
                          handleMarkupChange(index, "price", e.target.value)
                        }
                      />{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-end">
            <button class="homeTopBtn px-4 p-2" onClick={updateMarkup}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPricingMarkup;
