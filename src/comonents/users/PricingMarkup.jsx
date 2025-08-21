import axios from "axios";
import React, { useEffect, useState } from "react";

import "../style.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useLoading } from "../LoadingContext ";
import Swal from "sweetalert2";

const PricingMarkup = () => {
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
      axios
        .post(
          `https://bp.quotrprint.com/api/companyList`,
          { customerId: customerId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setCompany(res?.data?.data);
          setCompanyId(res?.data?.data?.[0]?.id);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);

          // console.log(err);
        });
    }
  }, [customerId, token]);

  useEffect(() => {
    setIsLoading(true);
    setMarkUpList([]);
    if (companyId) {
      axios
        .post(
          `https://bp.quotrprint.com/api/categoryWiseMarkupList`,
          { companyId: companyId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          const updatedMarkUpList = res?.data?.data.map((item) => ({
            ...item,
            companyId: companyId,
            markupType: 2,
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
    setIsLoading(true);

    axios
      .post(
        `https://bp.quotrprint.com/api/addCategoryWiseMarkup`,
        { markup: markUpList },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // console.log(res.data);
        setIsLoading(false);
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: "OK",
          cancelButtonText: `  <a class="text-white" style='text-decoration:none' href="/dashboard"><i class="bi bi-box-arrow-left"></i> Dashboard</a>  `,
        });
        setChangeAll(false);
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
        markupValue: allMarkupValue,
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
        <title>Pricing Markup</title>
      </Helmet>

      <div className="col-11 m-auto my-3 text-start">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <p class="fs-1 fw-bold my-3">Pricing Markup</p>
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

        <div className=" row  align-items-center">
          <div class="col-md-6">
            <div
              className="col-11 mt-3  border rounded-4 border-primary p-2"
              data-bs-toggle="collapse"
              href="#collapseComponyId"
              role="button"
              aria-expanded="false"
              aria-controls="collapseComponyId"
            >
              <p className="fs-5 fw-bold">
                {" "}
                Store :{" "}
                {company?.find((el) => el.id === companyId)?.company_name}{" "}
              </p>
              <div className="collapse" id="collapseComponyId">
                <div className="card card-body border-0">
                  {company.map((el) => (
                    <div
                      className="p-2 border-bottom"
                      key={el.id}
                      onClick={() => setCompanyId(el.id)}
                    >
                      <p className="fw-bold">{el.company_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-3 mt-3 align-items-center">
              <div
                class="d-flex gap-2"
                style={{ cursor: "pointer" }}
                onClick={() => setChangeAll(!changeAll)}
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckChecked"
                  checked={changeAll ? true : false}
                />
                <label class="form-check-label" for="flexCheckChecked">
                  Bulk Update
                </label>
              </div>
              {changeAll && (
                <div class="d-flex gap-2">
                  <input
                    type="number"
                    class="form-control"
                    onChange={(e) => setAllMarkupValue(e.target.value)}
                  />
                  {/* <button class='btn btn-primary text-nowrap' onClick={updateBulkMarkup}>Update All</button> */}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className=" mt-2" style={{ overflowX: "auto" }}>
            <table className="table table-bordered border-primary table-hover rounded-3">
              <thead className="table-primary">
                <tr>
                  <th scope="col" className="text-nowrap text-center">
                    No
                  </th>
                  <th scope="col" className="text-nowrap text-center">
                    Categary Name
                  </th>
                  {/* <th scope="col"  colspan="2" className='text-nowrap text-center'>Markup Type</th> */}
                  <th scope="col" className="text-nowrap text-center">
                    Change Markup Value (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {markUpList?.map((markup, index) => (
                  <tr key={index}>
                    <td className="text-nowrap fw-bold text-center">
                      <input
                        type="text"
                        className="form-control p-0"
                        readOnly
                        style={{ border: "none", width: "40px" }}
                        value={markup.categoryId}
                        onChange={(e) =>
                          handleMarkupChange(
                            index,
                            "categoryId",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="text-nowrap">
                      <input
                        type="text"
                        className="form-control p-0"
                        readOnly
                        style={{ border: "none" }}
                        value={markup.name}
                      />
                    </td>
                    <td className="text-nowrap">
                      {" "}
                      <input
                        type="text"
                        className="form-control p-0"
                        style={{ border: "none" }}
                        value={markup.markupValue}
                        onChange={(e) =>
                          handleMarkupChange(
                            index,
                            "markupValue",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end">
            <button className="homeTopBtn px-4 p-2" onClick={updateMarkup}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingMarkup;
