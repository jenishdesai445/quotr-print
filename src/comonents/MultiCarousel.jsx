import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './style.css'


export const Testimonial = ({ data }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1400 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1400, min: 990 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 990, min: 520 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 520, min: 0 },
      items: 1,
    },
  };
  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={false}
      arrows={true}
      autoPlaySpeed={5000}
      showDots={false}
    >
      {data?.map((el) => {
        return (
          <div class="col-11 m-auto">
            {el}
          </div>
        )
      })}
    </Carousel>
  );
}