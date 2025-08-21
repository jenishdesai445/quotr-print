import React, { useEffect, useRef, useState } from "react";
import "./quotr.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollTrigger from "react-scroll-trigger";
import CountUp from "react-countup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Helmet } from "react-helmet";
import { useLoading } from "./LoadingContext ";
import { Link } from "react-scroll";

const Quotr = () => {
  const [counterOn, setCounterOn] = useState(false);
  const [subscription, setSubscription] = useState();

  const { setIsLoading } = useLoading();

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const hidemobileRef = useRef(null);

  useEffect(() => {
    const mobileImg = document.querySelector(".HeroMobileImg");
    const polygon1 = document.querySelector(".polygon1");
    const polygon2 = document.querySelector(".polygon2");
    const polygon3 = document.querySelector(".polygon3");
    const polygon4 = document.querySelector(".polygon4");
    const polygon5 = document.querySelector(".polygon5");
    const polygon6 = document.querySelector(".polygon6");
    mobileImg.style.transition = "0.5s";
    polygon1.style.transition = "0.5s";
    polygon2.style.transition = "0.5s";
    polygon3.style.transition = "0.5s";
    polygon4.style.transition = "0.5s";
    polygon5.style.transition = "0.5s";
    polygon6.style.transition = "0.5s";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // mobileImg.style.marginTop = "100%"
          polygon1.style.top = "50%";
          polygon1.style.left = "50%";
          polygon2.style.top = "50%";
          polygon2.style.left = "50%";
          polygon3.style.top = "50%";
          polygon3.style.left = "50%";
          polygon4.style.top = "50%";
          polygon4.style.right = "50%";
          polygon5.style.top = "50%";
          polygon5.style.right = "50%";
          polygon6.style.top = "50%";
          polygon6.style.right = "50%";
        }
      },
      { rootMargin: "0px", threshold: 0.5 }
    );
    if (hidemobileRef.current) {
      observer.observe(hidemobileRef.current);
    }
    return () => {
      if (hidemobileRef.current) {
        observer.unobserve(hidemobileRef.current);
      }
    };
  }, [hidemobileRef]);

  const mobileRef = useRef(null);

  useEffect(() => {
    const mobileImg = document.querySelector(".HeroMobileImg");
    const polygon1 = document.querySelector(".polygon1");
    const polygon2 = document.querySelector(".polygon2");
    const polygon3 = document.querySelector(".polygon3");
    const polygon4 = document.querySelector(".polygon4");
    const polygon5 = document.querySelector(".polygon5");
    const polygon6 = document.querySelector(".polygon6");
    mobileImg.style.transition = "0.5s";
    polygon1.style.transition = "1s";
    polygon2.style.transition = "1s";
    polygon3.style.transition = "1s";
    polygon4.style.transition = "1s";
    polygon5.style.transition = "1s";
    polygon6.style.transition = "1s";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // mobileImg.style.marginTop = "0%"
          polygon1.style.top = "5%";
          polygon1.style.left = "15%";
          polygon2.style.top = "40%";
          polygon2.style.left = "8%";
          polygon3.style.top = "70%";
          polygon3.style.left = "15%";
          polygon4.style.top = "5%";
          polygon4.style.right = "15%";
          polygon5.style.top = "40%";
          polygon5.style.right = "8%";
          polygon6.style.top = "70%";
          polygon6.style.right = "15%";
        }
      },
      { rootMargin: "0px", threshold: 0.5 }
    );
    if (mobileRef.current) {
      observer.observe(mobileRef.current);
    }
    return () => {
      if (mobileRef.current) {
        observer.unobserve(mobileRef.current);
      }
    };
  }, [mobileRef]);

  useEffect(() => {
    const div = document.querySelector(".heroMobile");
    div.addEventListener("mousemove", parallax);

    function parallax(e) {
      let polygons = document.querySelectorAll(".polygon");
      polygons.forEach((polygon) => {
        var x = (e.clientX * 20) / 250;
        var y = (e.clientY * 20) / 250;
        polygon.style.transform =
          "translateX(" + x + "px) translateY(" + y + "px)";
      });
    }

    return () => {
      div.removeEventListener("mousemove", parallax);
    };
  }, []);

  const getSsubscriptionPlan = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://bp.quotrprint.com/api/subscriptionPlan`
      );
      // console.log(response.data);
      setSubscription(response.data?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      // console.log(error);
    }
  };
  useEffect(() => {
    getSsubscriptionPlan();
  }, []);

  // console.log(subscription);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Quotr - Your Pricing Tool, Instant Print Pricing Solution{" "}
        </title>
        <meta
          name="description"
          content="Quotr revolutionizes print sales by offering instant pricing quotes, empowering businesses to quote faster and sell more. With Quotr, customers can quickly obtain accurate pricing information, transforming their printing purchasing experience. Say goodbye to lengthy quoting processes and hello to streamlined sales with Quotr.    "
        />
        <meta
          name="keywords"
          content=" Quotr, instant print pricing, print sales, quote faster, streamlined sales, printing purchasing, pricing solution, print quotes, printing business, quote automation, sales transformation."
        />
      </Helmet>
      <div
        style={{
          background:
            "linear-gradient( rgba(202,238,255,0.5) 30%, rgba(155,230,250) 100%)",
        }}
      >
        <div
          class="d-flex align-items-center justify-content-center"
          style={{ height: "70vh" }}
        >
          <div
            class="col-lg-10 col-11 m-auto"
            ref={hidemobileRef}
            data-aos="zoom-in"
          >
            <p class="display-1 fw-bold">
              Introducing <span style={{ color: "#0094DE" }}>Quotr</span>{" "}
            </p>
            <p class="fs-1 fw-bold">
              Empower Your Customers with Instant Print Pricing
            </p>
            {/* <p class='display-3 fw-bold'><span style={{ color: '#0094DE' }}>Quotr App</span> for Printing Shop</p> */}
            <p class="fw-semibold fs-4 mt-3 col-10 m-auto">
              Transforming Print Sales Behind the Counter. Quote Faster, Sell
              More
            </p>
            <Link
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <button class="homeTopBtn px-4 p-2"> Sign-Up Now</button>
            </Link>
          </div>
        </div>

        <div
          class="col-sm-11 m-auto mt-5 position-relative d-flex align-items-end heroMobile"
          ref={mobileRef}
        >
          <div
            class="  col-lg-6 col-md-10 col-sm-12 mx-auto HeroMobileImgDiv "
            data-aos="fade-up"
          >
            <img
              class="HeroMobileImg"
              src={require("../images/quotrHero.png")}
              style={{ width: "100%", height: "100%" }}
              alt=""
            />
          </div>
          <img
            class="polygon polygon1 position-absolute"
            src={require("../images/Polygon1.png")}
            alt=""
          />
          <img
            class="polygon polygon2 position-absolute"
            src={require("../images/Polygon2.png")}
            alt=""
          />
          <img
            class="polygon polygon3 position-absolute"
            src={require("../images/Polygon3.png")}
            alt=""
          />
          <img
            class="polygon polygon4 position-absolute"
            src={require("../images/Polygon4.png")}
            alt=""
          />
          <img
            class="polygon polygon5 position-absolute"
            src={require("../images/Polygon5.png")}
            alt=""
          />
          <img
            class="polygon polygon6 position-absolute"
            src={require("../images/Polygon6.png")}
            alt=""
          />
        </div>
      </div>

      <div class="bg-dark about">
        <br />
        <div class="col-11 m-auto text-white mt-3">
          <p class="display-4 fw-bold" data-aos="fade-up">
            How it Works
          </p>
          <p class="fs-5 col-lg-8 col-11 mt-3 m-auto" data-aos="fade-up">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit,
            labore aperiam odio neque nulla corporis ab unde dolor hic
            inventore!
          </p>
        </div>

        <div class="col-11 m-auto mt-5">
          <div class="row">
            <div class="col-lg-3 col-sm-6" data-aos="zoom-in">
              <div
                class="d-flex align-items-center justify-content-center bg-white m-auto"
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              >
                <p class="fs-5 fw-bold">01</p>
              </div>
              <div class="text-white my-3">
                <p class="fw-bold fs-5">Register Account</p>
                <p>And choose tier</p>
              </div>
            </div>

            <div class="col-lg-3 col-sm-6" data-aos="zoom-in">
              <div
                class="d-flex align-items-center justify-content-center bg-white m-auto"
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              >
                <p class="fs-5 fw-bold">02</p>
              </div>
              <div class="text-white my-3">
                <p class="fw-bold fs-5">Download Our App</p>
                <p>From link above</p>
              </div>
            </div>

            <div class="col-lg-3 col-sm-6" data-aos="zoom-in">
              <div
                class="d-flex align-items-center justify-content-center bg-white m-auto"
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              >
                <p class="fs-5 fw-bold">03</p>
              </div>
              <div class="text-white my-3">
                <p class="fw-bold fs-5">Customize Admin Account</p>
                <p>Add Users and set up profit margins</p>
              </div>
            </div>

            <div class="col-lg-3 col-sm-6" data-aos="zoom-in">
              <div
                class="d-flex align-items-center justify-content-center bg-white m-auto"
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              >
                <p class="fs-5 fw-bold">04</p>
              </div>
              <div class="text-white my-3">
                <p class="fw-bold fs-5 ">Start Selling</p>
                <p> You’re ready to start selling print like never before!</p>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>

      {/* <div class='bg-white'>

        <div class='col-11 m-auto row my-4'>
          <div class='col-md-4 col-sm-6 d-flex align-items-center justify-content-center '>
            <div class='my-3'>
              <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)}>
                <p class='fs-1 fw-bold' ><span  >{counterOn && <CountUp start={0} end={30} delay={0} />}</span> K</p>
              </ScrollTrigger>

              <p class='fw-semibold fs-5'>Active User</p>
            </div>
          </div>

          <div class='col-md-4 col-sm-6 d-flex align-items-center justify-content-center '>
            <div class='my-3'>
              <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)}>
                <p class='fs-1 fw-bold' ><span  >{counterOn && <CountUp start={0} end={150} delay={0} />}</span> +</p>
              </ScrollTrigger>

              <p class='fw-semibold fs-5'>Active Store</p>
            </div>
          </div>

          <div class='col-md-4 col-sm-6 d-flex align-items-center justify-content-center '>
            <div class='my-3'>
              <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)}>
                <p class='fs-1 fw-bold' ><span  >{counterOn && <CountUp start={0} end={50} delay={0} />}</span> K</p>
              </ScrollTrigger>

              <p class='fw-semibold fs-5'>Order Completed</p>
            </div>
          </div>


        </div>
      </div> */}

      <div
        style={{
          background:
            "linear-gradient(rgba(202,238,255,0.5) 30%, rgba(155,230,250,0.6) 70%,#fff 0)",
        }}
      >
        <div class="col-md-6 col-11 m-auto Features" id="features">
          <div class="position-relative">
            <br />
            <img
              class="position-absolute"
              style={{ top: "-5%", left: "0%", zIndex: "0" }}
              src={require("../images/tringel.png")}
              alt=""
            />
            <p class="fs-1 fw-bold mt-3 z-1" data-aos="fade-up">
              Key Features of{" "}
            </p>
            <p
              class="fs-1 fw-bold z-1"
              style={{ color: "#0094DE" }}
              data-aos="fade-up"
            >
              Quotr App
            </p>
          </div>
        </div>

        <div class="col-11 m-auto row my-3">
          <div
            class="col-lg-3 col-md-4 col-sm-6  my-4 m-auto"
            data-aos="zoom-in"
          >
            <div
              class="col-11 m-auto rounded-4 p-4 bg-white h-100"
              style={{
                boxShadow:
                  " 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                class="d-flex align-items-center justify-content-center m-auto my-3 "
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#fcd9d7",
                }}
              >
                <p class="fw-bold fs-3" style={{ color: "#EF4136" }}>
                  <i class="bi bi-clock"></i>
                </p>
              </div>
              <div>
                <p class="fs-5 fw-bold">Inuitive Interface</p>
                <p class="">
                  Quotr makes it easy for employees and customers alike to find
                  exactly what they’re looking for
                </p>
              </div>
              <br />
            </div>
          </div>

          <div
            class="col-lg-3 col-md-4 col-sm-6  my-4 m-auto"
            data-aos="zoom-in"
          >
            <div
              class="col-11 m-auto rounded-4 p-4 bg-white h-100"
              style={{
                boxShadow:
                  " 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                class="d-flex align-items-center justify-content-center m-auto my-3 "
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#fdead2",
                }}
              >
                <p class="fw-bold fs-3" style={{ color: "#f7941e" }}>
                  <i class="bi bi-calendar3"></i>
                </p>
              </div>
              <div>
                <p class="fs-5 fw-bold">Visual & Interactive</p>
                <p class="">
                  Customers that see your print selection on Quotr are more
                  likely to purchase, and even upgrade their purchase.
                </p>
              </div>
              <br />
            </div>
          </div>

          <div
            class="col-lg-3 col-md-4 col-sm-6  my-4 m-auto"
            data-aos="zoom-in"
          >
            <div
              class="col-11 m-auto rounded-4 p-4 bg-white h-100 "
              style={{
                boxShadow:
                  " 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                class="d-flex align-items-center justify-content-center m-auto my-3 "
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#d0ecd8",
                }}
              >
                <p class="fw-bold fs-3" style={{ color: "#14a13d" }}>
                  <i class="bi bi-person-vcard"></i>
                </p>
              </div>
              <div>
                <p class="fs-5 fw-bold">Emailed Order Forms</p>
                <p class="">
                  Once an order submitted on the Quotr app, a detailed form is
                  emailed to your store. Giving your print manager all the info
                  they need to finalize the order at your preferred print shop.
                </p>
              </div>
              <br />
            </div>
          </div>

          <div
            class="col-lg-3 col-md-4 col-sm-6  my-4 m-auto"
            data-aos="zoom-in"
          >
            <div
              class="col-11 m-auto rounded-4 p-4 bg-white h-100"
              style={{
                boxShadow:
                  " 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                class="d-flex align-items-center justify-content-center m-auto my-3 "
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#e9edff",
                }}
              >
                <p class="fw-bold fs-3" style={{ color: "#91a7ff" }}>
                  <i class="bi bi-megaphone"></i>
                </p>
              </div>
              <div>
                <p class="fs-5 fw-bold">Accurate and Up To Date</p>
                <p class="">
                  The Quotr team monitors popular online wholesale printshop to
                  ensure you’re always quoting at a competitive price.
                </p>
              </div>
              <br />
            </div>
          </div>
        </div>
        {/* <button class="homeTopBtn px-4 p-2" data-aos="fade-up" >View All Features</button> */}
      </div>

      <div>
        <div class="col-11 m-auto my-5 pricing" id="pricing">
          <div
            class="position-relative m-auto"
            style={{ width: "fit-content" }}
          >
            <img
              class="position-absolute"
              style={{
                width: "100px",
                top: "-30px",
                left: "-100px",
                zIndex: "0",
              }}
              src={require("../images/tringel.png")}
              alt=""
            />

            <p class="fs-1 fw-bold" data-aos="fade-up">
              {" "}
              Quotr <span style={{ color: "#0094DE" }}>
                Pricing & Plans
              </span>{" "}
            </p>
          </div>
          {/* <p class='fs-5 fw-bold col-lg-8 m-auto' data-aos="fade-up">Discover the ideal plan to fuel your business growth. Our pricing options are carefully crafted to cater to business.</p> */}
        </div>

        <div class=" d-flex align-items-center justify-content-center m-auto row gap-3 my-5">
          {subscription?.map((el) => {
            return (
              <div class="" data-aos="fade-up" style={{ width: "fit-content" }}>
                <div class="text-start m-auto rounded-4 p-3 fw-bold planCard">
                  <div class="col-11 m-auto">
                    <div>
                      <p class="mt-3 fs-4 fw-bold">{el.name}</p>
                      {/* <p style={{ fontSize: '12px' }} > Take Your Business to the Next Level with Business Plan</p> */}
                      <p style={{}}>Max Store : {el.allow_login}</p>

                      <p>
                        <span class="fs-1">$ {el?.price}</span>{" "}
                        <span style={{ fontSize: "12px" }}>per month</span>
                      </p>
                    </div>
                    <hr />

                    <div class="m-auto my-2" style={{ width: "fit-content" }}>
                      <button
                        class="homeTopBtn "
                        onClick={() =>
                          navigate("/sign-up", { state: { plan: { el } } })
                        }
                      >
                        Sign Up{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <br />

      <div
        class="mt-4"
        style={{
          background:
            "linear-gradient( rgba(202,238,255,0.5) 30%, rgba(155,230,250) 100%)",
        }}
      >
        <div class="col-11 m-auto row">
          <div class="col-md-6">
            <div class="col-lg-9 col-md-11 m-auto my-5" data-aos="zoom-in">
              <img
                src={require("../images/quoterLanding.png")}
                style={{ width: "100%" }}
                alt=""
              />
            </div>
          </div>
          <div class="col-md-6 text-start fw-semibold">
            <div class="col-11 m-auto my-5">
              <div class="position-relative" style={{ width: "fit-content" }}>
                <img
                  class="position-absolute"
                  style={{
                    width: "100px",
                    top: "-30px",
                    left: "-80px",
                    zIndex: "0",
                  }}
                  src={require("../images/tringel.png")}
                  alt=""
                />
                <p class="fs-1 fw-bold" data-aos="fade-up">
                  Why
                </p>
              </div>
              <p
                class="fs-1 fw-bold"
                style={{ color: "#0094DE" }}
                data-aos="fade-up"
              >
                Quotr App
              </p>

              <p data-aos="fade-up">
                At QUOTR, we're dedicated to revolutionizing/streamlining the
                way your store manages its operations.
              </p>
              <div class="d-flex gap-2 mt-3" data-aos="fade-up">
                <div
                  class="p-1 bg-light d-flex align-items-center justify-content-center"
                  style={{ width: "25px", height: "25px", borderRadius: "50%" }}
                >
                  <i class="bi bi-check"></i>
                </div>
                <div> Vast selection of print products</div>
              </div>
              <div class="d-flex gap-2 mt-3" data-aos="fade-up">
                <div
                  class="p-1 bg-light d-flex align-items-center justify-content-center"
                  style={{ width: "25px", height: "25px", borderRadius: "50%" }}
                >
                  <i class="bi bi-check"></i>
                </div>
                <div>Customizable profit mark-ups</div>
              </div>
              <div class="d-flex gap-2 mt-3" data-aos="fade-up">
                <div
                  class="p-1 bg-light d-flex align-items-center justify-content-center"
                  style={{ width: "25px", height: "25px", borderRadius: "50%" }}
                >
                  <i class="bi bi-check"></i>
                </div>
                <div>Quotes emailed to directly to store</div>
              </div>
              <div class="d-flex gap-2 mt-3" data-aos="fade-up">
                <div
                  class="p-1 bg-light d-flex align-items-center justify-content-center"
                  style={{ width: "25px", height: "25px", borderRadius: "50%" }}
                >
                  <i class="bi bi-check"></i>
                </div>
                <div>24 Hour Support </div>
              </div>

              <button
                class="homeTopBtn px-4 p-2"
                data-aos="fade-up"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotr;
