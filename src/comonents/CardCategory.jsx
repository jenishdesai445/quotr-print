import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useLoading } from "./LoadingContext ";
import Swal from "sweetalert2";
import { FaBorderAll } from "react-icons/fa6";

const CardCategory = () => {
  const [catBtn, setCatBtn] = useState([]);
  const [filterCatReport, setFilterCatReport] = useState("0");
  const [filterCatData, setFilterCatData] = useState([]);
  const containerRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const token = localStorage.getItem("quotrUserToken");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://bp.quotrprint.com/api/categoryList`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCatBtn(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        // Swal.fire({
        //     title: 'Error!',
        //     text: err.response?.data?.message || 'An error occurred.',
        //     icon: 'error',
        //     confirmButtonText: 'OK'
        // })
        // .then(() => {
        navigate("/dashboard");
        // });
      });
  }, [token, setIsLoading, navigate]);

  useEffect(() => {
    if (filterCatReport == "0") {
      setFilterCatData(catBtn);
    } else {
      setFilterCatData(catBtn.filter((el) => el.id === filterCatReport));
    }
  }, [filterCatReport, catBtn]);

  const selectBgColor = (colorNum, colors) => {
    if (colors < 1) colors = 1;
    return "hsl(" + ((colorNum * 37) % 360) + ",25%,90%)";
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Category Cards</title>
      </Helmet>

      <div style={{ background: "#083D3A" }}>
        <div className="row  m-0">
          <div className="col-lg-10 col-sm-8 col-6 my-4  h-auto">
            <div className="col-11 m-auto text-start d-flex align-items-center  h-100 ">
              <div>
                <p className="homtoptext1" style={{ color: "#14A13D" }}>
                  Place an Order
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-sm-4 col-6">
            <img
              src={require("../images/homeBaner.png")}
              style={{ width: "100%" }}
              alt=""
            />
          </div>
        </div>
      </div>

      <div
        className="mt-5 col-11 m-auto"
        style={{ overflowX: "auto", cursor: "grab" }}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="d-flex gap-4 align-items-center my-3">
          <button
            style={{ marginLeft: "5%" }}
            className={filterCatReport === "0" ? "catBtn active" : "catBtn"}
            onClick={() => setFilterCatReport("0")}
          >
            {" "}
            All{" "}
          </button>
          {catBtn?.map((el) => {
            return (
              <button
                key={el.id}
                className={
                  el.id === filterCatReport ? "catBtn active" : "catBtn"
                }
                onClick={() => setFilterCatReport(el.id)}
              >
                {" "}
                {el.name}{" "}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <div className="col-md-8 m-auto row mt-5">
          {filterCatData?.map?.((el) => {
            return (
              <div key={el.id} className="col-lg-4 col-6 m-auto my-3">
                <div
                  className="m-auto col-sm-10"
                  style={{
                    height: "270px",
                    borderRadius: "25px",
                    background: "white",
                    boxShadow: "0px 4px 4px 0px rgba(60, 65, 68, 0.09)",
                  }}
                  onClick={() => navigate("/product-list", { state: el.id })}
                >
                  <div
                    className="col-12 d-flex align-items-center"
                    style={{
                      height: "200px",
                      borderRadius: "25px 25px 0 0",
                      background: `${selectBgColor(
                        Math.floor(Math.random() * 999),
                        10
                      )}`,
                    }}
                  >
                    <div className="col-8 m-auto h-100 d-flex align-items-center">
                      <img
                        src={el.photo}
                        className="img-fluid p-1"
                        style={{ maxHeight: "180px" }}
                        alt=""
                      />
                    </div>
                  </div>
                  <div>
                    <p className="fs-16 fw-bold py-3">{el.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardCategory;
