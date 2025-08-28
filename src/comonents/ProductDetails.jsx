import React, { useEffect, useState } from "react";
import { ProductDetailsCarousel } from "./ResponsiveCarousel";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { Link } from "react-scroll";
import axios from "axios";
import ProductAttribute from "./ProductAttribute";
import { Helmet } from "react-helmet";
import { useLoading } from "./LoadingContext ";
import Swal from "sweetalert2";
import ExpresionAtribute from "./ExpresionAtribute";
import ProductAttribute2 from "./ProductAttribute2";

import AOS from "aos";
import "aos/dist/aos.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ProductDetails = () => {
  const location = useLocation();
  const [productData, setProductData] = useState();
  const [details, setdetails] = useState("Description");
  const [jpg, setJpg] = useState(false);
  const [jpgImg, setJpgImg] = useState();
  const [step, setStep] = useState("step1");
  const [selectedAttributes, setSelectedAttributes] = useState();

  const [productType, setProductType] = useState();
  const [sendDetails, setsendDetails] = useState();
  const [runSize, setrunSize] = useState();
  const [selcectRunSize, setSelcectRunSize] = useState();
  const [pricePick, setPricePick] = useState(null);

  const [placeOrder, setPlaceOrder] = useState();

  const [shippmentNeed, setShippmentNeed] = useState(false);
  const [shippingList, setSippingList] = useState();
  const [shippingMethod, setShippingMethod] = useState();

  const [totalTax, setTotalTax] = useState();

  const [sendDetailsExp, setSendDetailsExp] = useState();
  const [selectedAttributesExp, setSelectedAttributesExp] = useState([]);
  const [productQtyExp, setProductQtyExp] = useState(1);

  let token = localStorage.getItem("quotrUserToken");
  let companyId = localStorage.getItem("quotrCompanyId");
  let userId = localStorage.getItem("quotrUserId");

  const [emailError, setEmailError] = useState("");

  const { setIsLoading } = useLoading();

  const navigate = useNavigate();

  const showJpg = (img) => {
    setJpgImg(img);
    setJpg(true);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .post(
        `https://bp.quotrprint.com/api/productDetail`,
        { product_id: location?.state },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setProductData(res.data?.data);
        setProductType(res?.data?.data?.p_type);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        // Swal.fire({
        //   title: 'Error!',
        //   text: err.response?.data?.message,
        //   icon: 'error',
        //   confirmButtonText: 'ok'
        // })
        navigate("/product-list");
      });
  }, [token, location]);

  useEffect(() => {
    setsendDetails({
      product_id: location?.state,
      companyId: companyId,
      attribute: selectedAttributes?.attribute,
    });
  }, [selectedAttributes, location?.state, companyId]);

  useEffect(() => {
    axios
      .post(`https://bp.quotrprint.com/api/ProductPrice`, sendDetails, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setrunSize(res.data?.data);
        setSelcectRunSize(res.data?.data?.[0]);
      })
      .catch((err) => {
        setrunSize([]);
        setSelcectRunSize("");
      });
  }, [sendDetails, token]);

  const table = (data) => {
    let arr = [];
    for (let i = 0; i < data?.length; i++) {
      arr.push(
        <tr key={i} onClick={() => setSelcectRunSize(data?.[i])}>
          <td
            class={
              data?.[i]?.run_size == selcectRunSize?.run_size
                ? "bg-primary text-white  text-nowrap "
                : ""
            }
          >
            {data?.[i]?.run_size}
          </td>
          <td
            class={
              data?.[i]?.per_unit == selcectRunSize?.per_unit
                ? "bg-primary text-white text-nowrap "
                : ""
            }
          >
            {data?.[i]?.per_unit}
          </td>
          <td
            class={
              data?.[i]?.markup_price == selcectRunSize?.markup_price
                ? "bg-primary text-white text-nowrap "
                : ""
            }
          >
            {data?.[i]?.markup_price}
          </td>
        </tr>
      );
    }
    return arr;
  };

  useEffect(() => {
    if (shippmentNeed) {
      setIsLoading(true);
      axios
        .post(
          `https://bp.quotrprint.com/api/companyWiseShippingList`,
          { companyId: companyId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          const updatedMarkUpList = res?.data?.data;
          setSippingList(updatedMarkUpList);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          // console.log(err);
        });
    }
  }, [shippmentNeed, companyId, token]);

  useEffect(() => {
    setPricePick(selcectRunSize);
  }, [selcectRunSize]);

  const fillPlaceOrder = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }

    setPlaceOrder({ ...placeOrder, [name]: value });
  };

  useEffect(() => {
    const oderUpdate = { ...placeOrder };
    if (productType == "Expression Base") {
      oderUpdate.qty = productQtyExp;
      oderUpdate.attribute = selectedAttributesExp;
    }
    if (shippmentNeed) {
      oderUpdate.shipping_method_id = shippingMethod?.shippingId;
      oderUpdate.address = placeOrder?.address;
      oderUpdate.grand_tot_amount = (
        Number(pricePick?.markup_price) +
        Number(shippingMethod?.price) +
        Number(totalTax)
      )?.toFixed(2);
    } else {
      oderUpdate.shipping_method_id = "";
      oderUpdate.address = "";
      oderUpdate.grand_tot_amount = (
        Number(pricePick?.markup_price) + Number(totalTax)
      )?.toFixed(2);
    }

    oderUpdate.product_price_id = pricePick?.product_price_id;
    {
      productType == "Regular"
        ? (oderUpdate.run_price_group_id = pricePick?.run_price_group_id)
        : (oderUpdate.run_price_group_id = "0");
    }

    oderUpdate.created_by = userId;
    oderUpdate.user_id = companyId;
    oderUpdate.tot_amount = pricePick?.markup_price;
    oderUpdate.tax_amount = totalTax;
    setPlaceOrder(oderUpdate);
  }, [
    shippmentNeed,
    shippingMethod,
    userId,
    companyId,
    pricePick,
    totalTax,
    productType,
  ]);

  const validateEmail = (email) => {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return regex.test(email);
  };

  const confirmOrder = () => {
    if (
      placeOrder?.name &&
      placeOrder?.name != "" &&
      placeOrder?.phone &&
      placeOrder?.phone != "" &&
      placeOrder?.email &&
      placeOrder?.email != "" &&
      placeOrder?.user_id &&
      placeOrder?.user_id != "" &&
      placeOrder?.created_by &&
      placeOrder?.created_by != "" &&
      placeOrder?.product_price_id &&
      placeOrder?.product_price_id != "" &&
      placeOrder?.run_price_group_id &&
      placeOrder?.run_price_group_id != "" &&
      placeOrder?.grand_tot_amount &&
      placeOrder?.grand_tot_amount != "" &&
      placeOrder?.tot_amount &&
      placeOrder?.tot_amount != ""
    ) {
      setIsLoading(true);
      axios
        .post(`https://bp.quotrprint.com/api/placeOrder`, placeOrder, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setIsLoading(false);
          Swal.fire({
            title: ` Your Order Id : ${res?.data?.orderId}`,
            text: res?.data?.message,
            icon: "Success",
            confirmButtonText: "ok",
          });
          navigate("/dashboard");
        })
        .catch((err) => {
          setIsLoading(false);
          // console.log(err);
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "All fields are required !",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 2000, // animation duration
      once: false, // ek hi bar chale scroll pe
    });
  }, []);

  // console.log(shippmentNeed);
  useEffect(() => {
    setTotalTax(
      (
        (Number(shippmentNeed ? shippingMethod?.price : 0) +
          Number(placeOrder?.tot_amount)) *
        0.0825
      ).toFixed(2)
    );
  }, [shippingMethod, placeOrder]);

  // ============Expression function ----------
  const handleAttributeSelect = (selectedValue, attributeIndex) => {
    const updatedSelectedAttributes = [...selectedAttributesExp];
    updatedSelectedAttributes[attributeIndex] = selectedValue;
    setSelectedAttributesExp(updatedSelectedAttributes);
  };

  useEffect(() => {
    setSendDetailsExp({
      product_id: location?.state,
      companyId: companyId,
      attribute: selectedAttributesExp,
      qty: productQtyExp,
    });
  }, [selectedAttributesExp, location?.state, companyId, productQtyExp]);

  useEffect(() => {
    axios
      .post(`https://bp.quotrprint.com/api/ProductPrice`, sendDetailsExp, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSelcectRunSize(res?.data?.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, [sendDetailsExp, token]);

  const showAttributes = () => {
    return productData?.attribute?.map((item, index) => (
      <div className="col-md-6" key={index}>
        <div className="col-11 m-auto mt-3">
          <p className="fw-semibold">
            {item?.name} <span class="text-danger">*</span>
          </p>
          <ExpresionAtribute
            key={index}
            attributeId={item?.id}
            productId={location?.state}
            attributeSelect={(value) => handleAttributeSelect(value, index)}
          />
        </div>
      </div>
    ));
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Product Details</title>
      </Helmet>

      <div class="col-11 m-auto row mt-3 gap-lg-0 gap-4 mb-3">
        <div class="col-lg-5  ProductSlider rounded-3 ">
          <div data-aos="zoom-in" className="text-center my-5">
            <p
              className="h1 fw-bold position-relative d-inline-block"
              style={{
                background: "linear-gradient(90deg, #0d6efd, #6610f2)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                position: "relative",
                textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                letterSpacing: "1px",
              }}
            >
              {productData?.name}
            </p>
          </div>

          {/* <ProductDetailsCarousel data={productData?.images} /> */}
          <div
            class="col-xxl-11 col-xl-9 col-lg-11  col-md-6   m-auto  "
            style={{ height: "100%" }}
          >
            <img src={productData?.photo} width={"100%"} />
          </div>
        </div>

        <div class="col-lg-7 text-start  px-lg-3  p-0 ">
          <div class="productListDetails border border-primary rounded-3 p-2">
            <div class="d-flex rounded-3 " style={{ background: "#CFE2FF" }}>
              <div
                class="productSteps rounded-start-3 "
                style={
                  step == "step1"
                    ? {
                        background: "#0094DE",
                        color: "white",
                        cursor: "pointer",
                      }
                    : {}
                }
                onClick={() => setStep("step1")}
              >
                {" "}
                <p style={{cursor:"pointer"}}> Step 1 : Product Option</p>
              </div>
              <div
                class="productSteps rounded-end-3 "
                style={
                  step == "step2"
                    ? {
                        background: "#0094DE",
                        color: "white",
                        cursor: "pointer",
                      }
                    : {}
                }
                onClick={() =>
                  setStep(pricePick?.markup_price ? "step2" : "step1")
                }
              >
                {" "}
                <p style={{ cursor: "pointer" }}>
                  {" "}
                  Step 2 : Order Confirmation
                </p>
              </div>
            </div>
            <div style={{ display: step === "step1" ? "block" : "none" }}>
              <div class="">
                {/* <ProductAttribute/> */}
                {productType == "Regular" ? (
                  <ProductAttribute2
                    key={productData?.attribute?.[0]}
                    attrData={productData?.attribute?.[0]}
                    productId={location?.state}
                    getData={setSelectedAttributes}
                  />
                ) : (
                  <div class="row">
                    {showAttributes()}

                    <div className="col-md-6">
                      <div className="col-11 m-auto mt-3">
                        <p className="fw-semibold">
                          Quantity <span class="text-danger">*</span>
                        </p>
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Enter your Quantity "
                          value={productQtyExp}
                          onChange={(e) => setProductQtyExp(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {productType == "Regular" && (
                  <div class="p-3">
                    <p class="fw-semibold">Run Size</p>
                    <div class=" mt-2" style={{ overflowX: "auto" }}>
                      <table class="table table-bordered border-primary table-hover  rounded-3">
                        <thead class="table-primary">
                          <tr>
                            <th scope="col" class="text-nowrap ">
                              Run Size
                            </th>
                            <th scope="col" class="text-nowrap ">
                              Per Unit ($)
                            </th>
                            <th scope="col" class="text-nowrap ">
                              Total Price ($)
                            </th>
                          </tr>
                        </thead>
                        <tbody>{table(runSize)}</tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div class="p-3">
                <div class=" border " style={{ background: "#F4F4F4" }}>
                  <div class="col-11 m-auto d-flex align-items-center justify-content-between my-3 fs-5">
                    <p>Item Total: </p>
                    <p>${pricePick?.markup_price}</p>
                  </div>

                  {/* <div class='d-flex align-items-center justify-content-between fs-5 my-3'>
                    <p>Subtotal: </p>
                    <p>${pricePick?.markup_price}</p>
                  </div> */}

                  <div class="text-center my-3">
                    {pricePick && (
                      <Link
                        activeClass="active"
                        to="productListDetails"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        style={{
                          // textDecoration: "none",
                          color: "black",
                          cursor: "pointer",
                        }}
                        onClick={() => setStep("step2")}
                      >
                        <button type="button" class="btn btn-primary col-11 ">
                          Proceed to Checkout
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* )} */}
            <div style={{ display: step === "step2" ? "block" : "none" }}>
              <div
                class=" text-start  mt-4"
                style={{
                  boxShadow: "0 -2px 5px -2px rgba(115,115,115,0.75)",
                }}
              >
                <br />
                <div class="col-11 m-auto">
                  <p>Price Per Set</p>
                  <p class="fs-3 text-primary fw-bold">
                    ${pricePick?.markup_price}
                  </p>

                  <div class="mt-3">
                    <label htmlFor="" class="fw-semibold">
                      Project / Client Name <span class="text-danger">*</span>
                    </label>
                    <input
                      type="type"
                      class="form-control"
                      placeholder="Type Here"
                      name="name"
                      onChange={fillPlaceOrder}
                    />
                  </div>

                  <div className="mt-3">
                    <label htmlFor="phone" className="fw-semibold">
                      Mobile/Phone No. <span className="text-danger">*</span>
                    </label>

                    <PhoneInput
                      country={"us"}
                      value={placeOrder?.phone || ""}
                      onChange={(phone, country) =>
                        fillPlaceOrder({
                          target: { name: "phone", value: phone },
                        })
                      }
                      inputProps={{
                        name: "phone",
                        required: true,
                        id: "phone",
                      }}
                      containerClass="w-100"
                      inputClass="form-control w-100 fw-medium"
                    />
                  </div>

                  <div className="mt-3">
                    <label htmlFor="email" className="fw-semibold">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`form-control ${
                        emailError ? "is-invalid" : ""
                      }`}
                      placeholder="Type Here"
                      name="email"
                      required
                      onChange={fillPlaceOrder}
                    />
                    {emailError && (
                      <div className="text-danger small mt-1">{emailError}</div>
                    )}
                  </div>

                  <div class="mt-3 d-flex gap-3 align-items-center">
                    <label htmlFor="" class="fw-semibold">
                      Need Delivery ?{" "}
                    </label>
                    <div
                      class="d-flex gap-1"
                      onClick={() => setShippmentNeed(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        class="form-check-input"
                        type="radio"
                        checked={shippmentNeed}
                      />
                      <p>Yes</p>
                    </div>
                    <div
                      class="d-flex gap-1"
                      onClick={() => setShippmentNeed(false)}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        class="form-check-input"
                        type="radio"
                        checked={!shippmentNeed}
                      />
                      <p>No</p>
                    </div>
                  </div>
                  {shippmentNeed && (
                    <div className="mt-3">
                      {/* Delivery Address */}
                      <label
                        htmlFor="address"
                        className="fw-semibold mb-2 d-block"
                      >
                        Delivery Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="address"
                        className="form-control shadow-sm border rounded-3 px-3 py-2"
                        placeholder="Enter your delivery address"
                        name="address"
                        onChange={fillPlaceOrder}
                      />
                    </div>
                  )}

                  {shippmentNeed && (
                    <div className="border rounded-3 mt-4 shadow-sm overflow-hidden">
                      {/* Header */}
                      <div
                        className="d-flex gap-2 align-items-center justify-content-between p-3 bg-light rounded-top"
                        data-bs-toggle="collapse"
                        href="#shippingMethod"
                        role="button"
                        aria-expanded="false"
                        aria-controls="shippingMethod"
                        style={{ cursor: "pointer" }}
                      >
                        <div>
                          <p className="fw-semibold mb-1">
                            Shipping Method{" "}
                            <span className="text-danger">*</span>
                          </p>
                          <p className="text-secondary fw-semibold small mb-0">
                            {!shippingMethod
                              ? "Select your preferred method"
                              : shippingMethod?.name}
                          </p>
                        </div>
                        <i className="bi bi-chevron-down fs-5 text-muted"></i>
                      </div>

                      {/* Collapse Content */}
                      <div className="collapse" id="shippingMethod">
                        <div className="p-3">
                          {shippingList && shippingList.length > 0 ? (
                            shippingList.map((el, i) => (
                              <div
                                key={i}
                                className={`p-3 rounded-3 mb-2 border d-flex justify-content-between align-items-center ${
                                  shippingMethod?.name === el?.name
                                    ? "border-primary bg-primary bg-opacity-10"
                                    : "border-light"
                                }`}
                                style={{
                                  cursor: "pointer",
                                  transition: "0.2s",
                                }}
                                onClick={() => {
                                  setShippingMethod(el);

                                  // Collapse close after selection
                                  const collapseEl =
                                    document.getElementById("shippingMethod");
                                  const bsCollapse =
                                    window.bootstrap.Collapse.getOrCreateInstance(
                                      collapseEl
                                    );
                                  bsCollapse.hide();
                                }}
                              >
                                <p className="mb-0 fw-semibold">{el?.name}</p>
                                {shippingMethod?.name === el?.name && (
                                  <i className="bi bi-check-circle-fill text-primary"></i>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">
                              No shipping methods available
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Error */}
                      {!shippingMethod && (
                        <p className="text-danger px-3 pb-2 small">
                          ** Please select a shipping method **
                        </p>
                      )}
                    </div>
                  )}

                  {/* <div class='mt-4'>
                      <p class='fs-4 fw-bold'>Shipment 1</p>
                      <div class='mt-2'>
                        <label htmlFor="" class='fw-semibold' >Sets</label>
                        <input type="number" min={1} class='form-control' placeholder='Type Here' />
                      </div>
                      <div class='mt-2'>
                        <label htmlFor="" class='fw-semibold' >Set Name 1</label>
                        <input type="text" class='form-control' placeholder='Type Here' />
                      </div>
                    </div> */}

                  {/* <div class='mt-4'>
                      <p class='fs-4 fw-bold'>Ship To </p>
                      <div class='border p-3 mt-3'>
                        <p>Tapan Patel, 3616 FAR WEST BZVD, STE 117 AUSTIN, TX 78731 - 3198 United States 5123466245 The UPS Store</p>
                        <p class='text-primary mt-2'>Default Shipping</p>
                      </div>
                      <div class='d-flex gap-3 align-items-center  mt-4'>
                        <button class='btn btn-primary fs-4 p-2 py-0'>+</button>
                        <p class='fw-semibold'>Add new Address</p>
                      </div>
                    </div> */}
                  {/*                     
                    <hr />

                    <div class='mt-2'>
                      <p class='fs-4 fw-bold'>Add Dropship </p>
                      <div class='d-flex gap-3 align-items-center  mt-3'>
                        <button class='btn btn-primary fs-4 p-2 py-0'>+</button>
                        <p class='fw-semibold'>Add new Address</p>
                      </div>
                    </div> */}

                  <hr />

                  {/* <button type="button" class="btn btn-dark rounded-1 mt-3  col-md-6 col-12">+ Add Another Shipment</button> */}
                </div>
              </div>
              {/* <div class='mt-3' style={{ background: '#F4F4F4' }}>

                  <div class='col-11 mt-4 m-auto'>
                    <div style={{ height: '2px' }}></div>
                    <div class='border rounded-3 mt-4  bg-white'>
                      <div class="d-flex gap-1 align-items-center justify-content-between   p-3 py-2" data-bs-toggle="collapse" href="#productSummary" role="button" aria-expanded="false" aria-controls="productSummary">
                        <div>
                          <p>Product Order Summary</p>
                        </div>

                        <p><i class="bi bi-chevron-down"></i></p>
                      </div>
                      <div class="collapse  bg-white" id="productSummary">
                        <div class='col-11 m-auto mt-3'>
                          <div class='d-flex align-items-center justify-content-between my-2'>
                            <div><p class='fw-semibold'>Size</p></div>
                            <div><p>1.75" x 3.5</p></div>
                          </div>
                          <div class='d-flex align-items-center justify-content-between my-2'>
                            <div><p class='fw-semibold'>Stock</p></div>
                            <div><p>16pt</p></div>
                          </div>
                          <div class='d-flex align-items-center justify-content-between my-2'>
                            <div><p class='fw-semibold'>Shape</p></div>
                            <div><p>Rounded 4 corners</p></div>
                          </div>
                          <div class='d-flex align-items-center justify-content-between my-2'>
                            <div><p class='fw-semibold'>Radius of Corners</p></div>
                            <div><p>Rounded 1/4”</p></div>
                          </div>
                          <div class='d-flex align-items-center justify-content-between my-2'>
                            <div><p class='fw-semibold'>spotUV Sides</p></div>
                            <div><p>spotUV Back</p></div>
                          </div>
                          <div class='d-flex align-items-center justify-content-between my-2'>
                            <div><p class='fw-semibold'>Coating</p></div>
                            <div><p>Matte</p></div>
                          </div>
                          <div class='d-flex align-items-center justify-content-between my-2'>
                            <div><p class='fw-semibold'>Colorspec</p></div>
                            <div><p>4/0 (4 Color Front)</p></div>
                          </div>
                          <div class='d-flex align-items-center justify-content-between my-2'>
                            <div><p class='fw-semibold'>Runsize</p></div>
                            <div><p>500</p></div>
                          </div>
                          <div class='d-flex align-items-center justify-content-between'>
                            <div><p class='fw-semibold'>Turnaround time</p></div>
                            <div><p>4 Business Days</p></div>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>

                  <div class='col-10 m-auto mt-3'>
                    <div class='d-flex align-items-center justify-content-between'>
                      <div><p>Item Total:</p></div>
                      <div><p>${pricePick?.markup_price}</p></div>
                    </div>
                    <div class='d-flex align-items-center justify-content-between text-start my-2'>
                      <div><p>Item Total:</p>
                        <p style={{ fontSize: '10px' }}>*Group tax was applied</p></div>
                      <div><p>$ {pricePick?.markup_price}</p></div>
                    </div>

                    <div class='d-flex align-items-center justify-content-between'>
                      <div><p class='h4'>Total:</p>
                      </div>
                      <div class='text-end'>
                        <p>$ {pricePick?.markup_price}</p>
                        <p style={{ fontSize: '10px' }}>*Taxes may apply</p>
                      </div>
                    </div>
                  </div>

                  <div class='col-11 m-auto my-3'>
                    <button type="button" class="btn btn-outline-danger form-control fw-bold rounded-1"> <span><i class="bi bi-file-earmark-arrow-up-fill"></i></span> Upload your work</button>

                    <div class="form-check text-start mt-3">
                      <input class="form-check-input" type="radio" value="" id="flexCheckDefault" />
                      <label class="form-check-label" for="flexCheckDefault" style={{ fontSize: '14px' }}>
                        I will assign/upload my artwork after I complete my Purchse
                      </label>
                    </div>

                    <button type="button" class="btn btn-outline-secondary form-control fw-bold rounded-1 my-3" onClick={() => navigate('/shopping')}>Add to Cart</button>
                    <p class="text-secondry" style={{ fontSize: '14px' }} > <i class='fw-bold'>Next : </i>Assign/Upload your artwork or Add to cart</p>
                    <br />
                  </div>

                </div> */}

              <div class=" mt-2" style={{ background: "#F4F4F4" }}>
                <div class="col-11 mt-2 m-auto">
                  <div style={{ height: "10px" }}></div>
                  <div class="text-start">
                    <p class="h6 fw-semibold">Cost Summary</p>

                    <hr />
                    <div class="d-flex align-items-center justify-content-between">
                      <div>
                        <p>Subtotal :</p>
                      </div>
                      <div>
                        <p>$ {placeOrder?.tot_amount}</p>
                      </div>
                    </div>
                    {shippmentNeed && (
                      <div class="d-flex align-items-center justify-content-between">
                        <div>
                          <p>Shipping & Processing :</p>
                        </div>
                        <div>
                          <p>$ {shippingMethod?.price}</p>
                        </div>
                      </div>
                    )}
                    <div class="d-flex align-items-center justify-content-between">
                      <div>
                        <p>Tax (8.25%) : </p>
                      </div>
                      <div>
                        <p>$ {placeOrder?.tax_amount}</p>
                      </div>
                    </div>
                    {/* <div class='d-flex align-items-center justify-content-between'>
                        <div><p>Tax :</p></div>
                        <div><p>$ {placeOrder?.tax_amount}</p></div>
                      </div> */}
                  </div>

                  <div class="p-2 form-control   bg-secondary rounded-1 d-flex align-items-center justify-content-between mt-3 fw-semibold">
                    <div>
                      <p class="text-white">Total :</p>
                    </div>
                    <div>
                      <p class="text-white">${placeOrder?.grand_tot_amount}</p>
                    </div>
                  </div>
                  <br />
                </div>
              </div>

              <div class="border   my-2">
                <div class="col-11 m-auto d-flex my-3 align-items-center justify-content-between">
                  <div>
                    <p class="text-secondry">Grand Total</p>
                    <p class="text-danger h4">
                      $ {placeOrder?.grand_tot_amount}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={confirmOrder}
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>

      {/* <div class='col-11 m-auto'> 
        <div class=' col-lg-9 text-start my-4'>
          <div class='d-flex gap-4'>
            <p style={{ cursor: 'pointer' }} class={details == 'Description' ? 'fw-bold text-black' : 'fw-semibold text-secondary'} onClick={() => setdetails('Description')}>Description</p>
            <p style={{ cursor: 'pointer' }} class={details == 'Specs' ? 'fw-bold text-black' : 'fw-semibold text-secondary'} onClick={() => setdetails('Specs')}>Specs</p>
            <p style={{ cursor: 'pointer' }} class={details == 'Templates' ? 'fw-bold text-black' : 'fw-semibold text-secondary'} onClick={() => setdetails('Templates')}>Templates</p>
            <p style={{ cursor: 'pointer' }} class={details == 'FAQ' ? 'fw-bold text-black' : 'fw-semibold text-secondary'} onClick={() => setdetails('FAQ')}>FAQ's</p>

          </div>
          <div class='border-top mt-3'>

            {
              details != "Description" ? "" :
                <div>
                  <div class='mt-3'>
                    {
                      productData?.Description?.text?.map((el) => {
                        return (
                          <p class='mt-3 text-secondary'>{el}</p>
                        )
                      })
                    }
                  </div>
                  <div class='mt-3'>
                    <p class='fw-bold'>{productData?.Description?.points?.title}</p>
                    <ul>
                      {
                        productData?.Description?.points?.points?.map((el) => {
                          return (
                            <li class='text-secondary'>{el}</li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
            }
            {
              details != "Specs" ? "" :
                <div>
                  {
                    productData?.specification?.map((el) => {
                      return (
                        <div>
                          <p class='fw-semibold '>{el.title}</p>
                          <ul>
                            {
                              el?.data?.size?.map((el) => {
                                return (
                                  <li class='text-secondary'>{el}</li>
                                )
                              })
                            }
                          </ul>
                        </div>
                      )
                    })
                  }
                </div>
            }
            {
              details != "Templates" ? "" :
                <div>
                  {
                    productData?.templates?.map((el) => {
                      return (
                        <div class='col-sm-12 col-11 m-auto border-bottom p-2 py-3'>
                          <div class='d-flex align-items-center justify-content-between '>
                            <div class=''>{el.text}</div>
                            <div class='d-flex gap-3'>
                              <div style={{ cursor: 'pointer' }} onClick={() => showJpg(el.img)} class=' text-nowrap'><i class="bi bi-file-richtext-fill text-primary"></i> EPS</div>
                              <div style={{ cursor: 'pointer' }} onClick={() => showJpg(el.img)} class='text-nowrap'><i class="bi bi-file-richtext-fill text-primary"></i> JPG</div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }

                  <div class={jpg ? 'productTempletImg active' : 'productTempletImg'}>
                    <div style={{ height: '130px' }}></div>
                    <div class='col-11 m-auto'>
                      <div class='d-flex justify-content-end mt-3'>
                        <p onClick={() => setJpg(false)}><i class="bi bi-x-lg fs-5 text-white"></i></p>
                      </div>
                    </div>
                    <div class='d-flex align-items-center justify-content-center h-50'>
                      <div class='col-lg-5 col-md-8 col-sm-10 col-11 m-auto bg-light p-3 rounded-4'>
                        <img src={jpgImg} style={{ width: '100%' }} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
            }

            {details != "FAQ" ? "" :
              <div class='text-start'>
               

                {
                  productData?.faq?.map((el, i) => {
                    return (
                      <div class=' border rounded-2 mt-2'>
                        <div class="productDetailCollap rounded-2 p-2 px-3 d-flex align-items-center justify-content-between" data-bs-toggle="collapse" href={`#specifition${i}`} role="button" aria-expanded="false" aria-controls={`specifition${i}`}>
                          <div>
                            <p>{el.que}</p>
                          </div>
                          <div><i class="bi bi-chevron-down"></i></div>
                        </div>
                        <div class="collapse" id={`specifition${i}`}>
                          <div class='text-start p-2 px-4 '>
                            <p class=''>{el.ans}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })

                }
              </div>
            }

          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProductDetails;
