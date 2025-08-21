import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './style.css'



export const  ProductDetailsCarousel =({data}) =>{
    return (
        <Carousel showStatus={false}  showArrows={true}  >
            {
                data?.map((el)=>{
                    return( 
                        <div class ='col-xxl-11 col-xl-9 col-lg-11  col-md-6   m-auto  ' style={{height:'100%'}}>
                            <img class=' img-fluid p-1 py-3'  src={require('../images/bcImage1.png')}  /> 
                        </div>   
                    )
                })
            }  
    </Carousel>
    )
}