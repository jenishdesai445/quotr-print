import React from "react";
import { Helmet } from "react-helmet";
const faq = [
  {
    que: "What is Product standard round corner radius?",
    ans: 'We offer 1/4" and 1/8" radius round corners to all of our customers.',
  },
  {
    que: "What is Product standard round corner radius?",
    ans: 'We offer 1/4" and 1/8" radius round corners to all of our customers.',
  },
  {
    que: "What is Product standard round corner radius?",
    ans: 'We offer 1/4" and 1/8" radius round corners to all of our customers.',
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
      <div class="col-11 m-auto">
        <p class="fs-1 fw-bold">FAQ's</p>
        {faq?.map((el, i) => {
          return (
            <div class=" border rounded-2 mt-2">
              <div
                class="productDetailCollap rounded-2 p-2 px-3 d-flex align-items-center justify-content-between"
                data-bs-toggle="collapse"
                href={`#specifition${i}`}
                role="button"
                aria-expanded="false"
                aria-controls={`specifition${i}`}
              >
                <div>
                  <p>{el.que}</p>
                </div>
                <div>
                  <i class="bi bi-chevron-down"></i>
                </div>
              </div>
              <div class="collapse" id={`specifition${i}`}>
                <div class="text-start p-2 px-4 ">
                  <p class="">{el.ans}</p>
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
