import React from "react";
import { Helmet } from "react-helmet";
const faq = [
  {
    que: "What is Product standard round corner radius?",
    ans: 'We offer 1/4" and 1/8" radius round corners to all of our customers.',
  },
  {
    que: "Do you offer custom sizes for products?",
    ans: "Yes, we can manufacture products in custom sizes as per your requirements.",
  },
  {
    que: "What materials are available for this product?",
    ans: "Our products are available in paper, plastic, and premium vinyl materials.",
  },
];

const Support = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Support</title>
      </Helmet>
      <div class="col-11 m-auto my-5 row">
        <div class="col-md-6">
          <div class="col-11 m-auto">
            <iframe
              width="100%"
              height={400}
              src="https://www.youtube.com/embed/XeNe-GHZi9c?si=y9_njkH3LkFMg_1p"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div class="col-md-6">
          <div class="col-11 m-auto">
            <iframe
              width="100%"
              height={400}
              src="https://www.youtube.com/embed/XeNe-GHZi9c?si=y9_njkH3LkFMg_1p"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
      <div className="col-11 m-auto my-5">
        <p className="fs-3 fw-bold text-center mb-4">FAQ's</p>

        {faq?.map((el, i) => {
          return (
            <div className="border rounded-3 shadow-sm mt-3 overflow-hidden">
              {/* Question */}
              <div
                className="productDetailCollap bg-light px-3 py-2 d-flex align-items-center justify-content-between cursor-pointer"
                data-bs-toggle="collapse"
                href={`#specifition${i}`}
                role="button"
                aria-expanded="false"
                aria-controls={`specifition${i}`}
              >
                <p className="m-0 fw-semibold fs-6">{el.que}</p>
                <i className="bi bi-chevron-down fs-6"></i>
              </div>

              {/* Answer */}
              <div className="collapse" id={`specifition${i}`}>
                <div className="text-start p-3 bg-white">
                  <p className="mb-0 text-muted small">{el.ans}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <br />
    </div>
  );
};

export default Support;
