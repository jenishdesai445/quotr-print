import React from "react";
import { Testimonial } from "./MultiCarousel";
import "./style.css";

const tetimonial = [
  {
    img: `${require("../images/pople.jpg")}`,
    name: "John Devil",
    post: "Chartered Accountant US",
    text: "Exceptional service from Quotr Your Pricing Tool! Their innovative platform made it incredibly easy to customize and get instant quotes for our printing projects. The quality of the prints exceeded our expectations, and the turnaround time was impressive. Highly recommend Quotr for anyone looking for a reliable and affordable printing solution.",
  },

  {
    img: `${require("../images/pople.jpg")}`,
    name: "John Devil",
    post: "Chartered Accountant US",
    text: "Exceptional service from Quotr Your Pricing Tool! Their innovative platform made it incredibly easy to customize and get instant quotes for our printing projects. The quality of the prints exceeded our expectations, and the turnaround time was impressive. Highly recommend Quotr for anyone looking for a reliable and affordable printing solution.",
  },

  {
    img: `${require("../images/pople.jpg")}`,
    name: "John Devil",
    post: "Chartered Accountant US",
    text: "Exceptional service from Quotr Your Pricing Tool! Their innovative platform made it incredibly easy to customize and get instant quotes for our printing projects. The quality of the prints exceeded our expectations, and the turnaround time was impressive. Highly recommend Quotr for anyone looking for a reliable and affordable printing solution.",
  },

  {
    img: `${require("../images/pople.jpg")}`,
    name: "John Devil",
    post: "Chartered Accountant US",
    text: "Exceptional service from Quotr Your Pricing Tool! Their innovative platform made it incredibly easy to customize and get instant quotes for our printing projects. The quality of the prints exceeded our expectations, and the turnaround time was impressive. Highly recommend Quotr for anyone looking for a reliable and affordable printing solution.",
  },

  {
    img: `${require("../images/pople.jpg")}`,
    name: "John Devil",
    post: "Chartered Accountant US",
    text: "Exceptional service from Quotr Your Pricing Tool! Their innovative platform made it incredibly easy to customize and get instant quotes for our printing projects. The quality of the prints exceeded our expectations, and the turnaround time was impressive. Highly recommend Quotr for anyone looking for a reliable and affordable printing solution.",
  },
];
const UperFooter = () => {
  const testi = () => {
    let arr = [];
    for (let i = 0; i < tetimonial.length; i++) {
      arr.push(
        <div
          key={i}
          class="rounded-3 p-3 text-white"
          style={{ border: "1px solid #95dbfc" }}
        >
          <div class="d-flex gap-3 text-start">
            <div style={{ width: "50px", height: "50px", borderRadius: "50%" }}>
              <img
                src={tetimonial?.[i]?.img}
                width={"100%"}
                style={{ borderRadius: "50%" }}
                alt=""
              />
            </div>
            <div>
              <p>{tetimonial?.[i]?.name}</p>
              <p style={{ fontSize: "12px" }}>{tetimonial?.[i]?.post}</p>
            </div>
          </div>
          <div class="text-start mt-2">
            <p style={{ fontSize: "12px" }}>{tetimonial?.[i]?.text}</p>
          </div>
        </div>
      );
    }
    return arr;
  };
  return (
    <div>
      <div class="bg-dark">
        <div class="col-11 m-auto row align-items-center">
          <div class="col-lg-3  col-md-5 position-relative my-5">
            <div class="col-11  m-4" data-aos="zoom-in">
              <img src={require("../images/quats.png")} width={"100%"} alt="" />
            </div>
            <br />
            <div
              class="position-absolute text-white col-10 text-end"
              style={{ bottom: "0", right: "0" }}
            >
              <p class="fs-4 "> A Word From Our Customers</p>
              <p>
                There are many variations of passages of lorem but the majority.
              </p>
              <br />
            </div>
          </div>
          <div class="col-lg-9 col-md-7 ">
            <br />
            <Testimonial data={testi()} />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UperFooter;
