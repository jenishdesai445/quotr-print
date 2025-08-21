import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


export const  HomeTop = ({data})=>{
  const responsive = {
      superLargeDesktop: { 
        breakpoint: { max: 4000, min: 990 },
        items: 6,
      },
      desktop: {
        breakpoint: { max: 990, min: 660 },
        items: 4,
      },
      tablet: {
        breakpoint: { max: 660, min: 420 },
        items: 2,
      },
      mobile: {
        breakpoint: { max: 420, min: 0 },
        items: 1,
      },
    };
    return (
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        arrows={false}
        autoPlaySpeed={5000}
        showDots={false}
      >
        {data?.map((el) => {
          return(
              <div class="col-11 m-auto"> 
                      {el} 
              </div> 
          )
        })}
      </Carousel>
    );
} 


export const  Customer = ({data})=>{
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 4,
        },
        desktop: {
          breakpoint: { max: 3000, min: 1120 },
          items: 3,
        },
        tablet: {
          breakpoint: { max: 1120, min: 690 },
          items: 2,
        },
        mobile: {
          breakpoint: { max: 690, min: 0 },
          items: 1,
        },
      };
      return (
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          arrows={false}
          autoPlaySpeed={2500}
          showDots={false}
        >
          {data?.map((el) => {
            return(
                <div class="py-5 m-auto">
                    <div class='col-11 m-auto'>
                        {el}
                    </div>
                </div>
               
            )
          })}
        </Carousel>
      );
} 

export const  Certifications = ({data})=>{
  const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 1220 },
        items: 4,
      },
      desktop: {
        breakpoint: { max: 1220, min: 870 },
        items: 3,
      },
      tablet: {
        breakpoint: { max: 1120, min: 600 },
        items: 2,
      },
      mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1,
      },
    };
    return (
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        arrows={false}
        autoPlaySpeed={3000}
        showDots={false}
      >
        {data?.map((el) => {
          return(
              <div class="m-auto py-5"> 
                      {el} 
              </div>
             
          )
        })}
      </Carousel>
    );
} 

 

export const  Features = ({data})=>{
  const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 1620 },
        items: 4,
      },
      desktop: {
        breakpoint: { max: 1620, min: 990 },
        items: 3,
      },
      tablet: {
        breakpoint: { max: 990, min: 600 },
        items: 2,
      },
      mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1,
      },
    };
    return (
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        arrows={true}
        autoPlaySpeed={3000}
        showDots={false}
      >
        {data?.map((el) => {
          return( 
                <div class='col-11 m-auto  rounded-4 h-100 ' style={{background:'#F5F5FF'}} data-aos="fade-up">
                    <div class='col-10 m-auto'> 
                        <br />  
                        <p class='fs-5 fw-bold'>{el.title}</p>
                        <p class='mt-2'>{el.text}</p> 
                        <br />
                    </div>
                </div>
           
             
          )
        })}
      </Carousel>
    );
} 

export const  Benefits = ({data})=>{ 
  const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 1620 },
        items: 4,
      },
      desktop: {
        breakpoint: { max: 1620, min: 990 },
        items: 3,
      },
      tablet: {
        breakpoint: { max: 990, min: 600 },
        items: 2,
      },
      mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1,
      },
    };
    return (
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        arrows={true}
        autoPlaySpeed={3000}
        showDots={false}
      >
        {data?.map((el) => {
          return( 
                <div class='col-11 m-auto  rounded-4 h-100 text-white ' style={{background:'#0D6EFD'}} data-aos="fade-up">
                    <div class='col-10 m-auto'> 
                        <br />  
                        <p class='fs-5 fw-bold'>{el.title}</p>
                        <p class='mt-2'>{el.text}</p> 
                        <br />
                    </div>
                </div>
           
             
          )
        })}
      </Carousel>
    );
} 


export const  WhyChoose = ({data})=>{ 
  console.log(data);

  const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 1220 },
        items: 4,
      },
      desktop: {
        breakpoint: { max: 1220, min: 990 },
        items: 3,
      },
      tablet: {
        breakpoint: { max: 990, min: 600 },
        items: 2,
      },
      mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1,
      },
    };
    return (
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        arrows={true}
        autoPlaySpeed={3000}
        showDots={false}
      >
        {data.map((el) => { 
          return( 
            <div class='rounded-4  bg-dark text-white text-start m-auto' style={{position:'relative',width:'280px'}}  >
                <div class='p-2 mt-3'>
                    <div class='col-11 m-auto my-3'> 
                        <p class='fs-5 fw-bold'>{el.title}</p>
                        <p class='mt-2'>{el.text}</p>
                    </div>
                </div>
                <div style={{width:'30px',height:'30px',position:'absolute',top:'-15px',left:'30px'}}>
                    <img src={require('../image/cartIcon.png')} style={{width:'100%',height:'100%'}} alt="" />
                </div>
          </div>
          )
        })}
      </Carousel>
    );
} 