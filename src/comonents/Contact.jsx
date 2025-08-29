import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";

import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Contact = () => {
  const [contact, setContact] = useState();

  const contactDetails = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const submitForm = () => {
    if (
      contact?.name &&
      contact?.name != "" &&
      contact?.phone &&
      contact?.phone != "" &&
      contact?.email &&
      contact?.email != "" &&
      contact?.subject &&
      contact?.subject != "" &&
      contact?.message &&
      contact?.message != ""
    ) {
      axios
        .post("https://hi-labsolution.net/api/quotr-contact.php", contact)
        .then((res) => {
          Swal.fire({
            title: "Success!",
            text: res?.data?.responseMessage,
            icon: "success",
            confirmButtonText: "ok",
          });
          setContact({
            name: "",
            phone: "",
            email: "",
            message: "",
            subject: "",
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            title: "Error!",
            text: err?.responseMessage,
            icon: "error",
            confirmButtonText: "ok",
          });
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "All fields must be required!",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((el) => {
      el.addEventListener("blur", (e) => {
        if (e.target.value) {
          e.target.classList.add("dirty");
        } else {
          e.target.classList.remove("dirty");
        }
      });
    });
  }, []);
  return (
    <div>
      <div class="col-11 m-auto text-start my-5">
        {/* <img src={require('../images/footerLogo.png')} style={{ height: '70px' }} alt="" /> */}
        <p class="fs-2 fw-semibold">Get in Touch</p>

        <div
          class="row border border-3 border-primary rounded-4 p-0 m-0 mt-3"
          // style={{ overflow: "hidden" }}
        >
          <div class="col-md-4" style={{ background: "#0D6EFD" }}>
            <div class="col-11 m-auto fs-5 contact-text fw-bold h-100 text-white ">
              <div class="my-5">
                <div class="d-flex gap-3 mt-2">
                  <div>
                    <i class="bi bi-envelope-fill"></i>
                  </div>
                  <a
                    href="mailto:info@quotrprint.com"
                    className=" text-decoration-none text-white"
                  >
                    info@quotrprint.com
                  </a>
                </div>

                <div class="d-flex gap-3 mt-2">
                  <div>
                    <i class="bi bi-telephone-fill"></i>
                  </div>
                  <div>512-222-8360</div>
                </div>

                <div class="d-flex gap-3 mt-2">
                  <div>
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    {" "}
                    3616 Far West Blvd Suite 117-777 Austin, Texas 78731
                  </div>
                </div>

                <div class="d-flex gap-3 fw-bold fs-4 mt-3  ">
                  {/* <a href='http://fb.com/quotrprint' target='_balnk' class='text-white' >
                                        <i class="bi bi-facebook"></i>
                                    </a>
                                    <a href='http://instagram.com/quotrprint' target='_balnk' class='text-white' >
                                        <i class="bi bi-instagram"></i>
                                    </a> */}
                  {/* <a href='http://youtube.com/quotrprint' target='_balnk' class='text-white' >
                                        <i class="bi bi-youtube"></i>
                                    </a> */}
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form__group field">
              <input
                type="input"
                class="form__field"
                value={contact?.name}
                placeholder="Name"
                name="name"
                onChange={contactDetails}
              />
              <label for="name" class="form__label">
                Name
              </label>
            </div>

            <div class="form__group field">
              <input
                type="input"
                class="form__field"
                value={contact?.email}
                placeholder="Email"
                name="email"
                onChange={contactDetails}
              />
              <label for="name" class="form__label">
                Email
              </label>
            </div>

            {/* ✅ PhoneInput with same style */}
            <div className="form__group field">
              <PhoneInput
                country={"us"}
                value={contact?.phone}
                onChange={(phone) => setContact({ ...contact, phone })}
                inputClass="form__field phone-input-field"
                containerClass="w-100"
                buttonClass="phone-input-btn"
                placeholder="Phone"
              />
              <label htmlFor="phone" className="form__label">
                Phone
              </label>
            </div>

            <div class="form__group field">
              <input
                type="input"
                class="form__field"
                value={contact?.subject}
                placeholder="Subject"
                name="subject"
                onChange={contactDetails}
              />
              <label for="name" class="form__label">
                Subject
              </label>
            </div>

            <div class="form__group field">
              <input
                type="input"
                class="form__field"
                value={contact?.message}
                placeholder="Message"
                name="message"
                onChange={contactDetails}
              />
              <label for="name" class="form__label">
                Message
              </label>
            </div>

            <div class="my-3">
              <button class="btn btn-primary  w-100" onClick={submitForm}>
                Submit
              </button>
            </div>
          </div>
          <div class="col-md-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5258.730287882384!2d-97.75840773376342!3d30.355207582449125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644cb1a7ea019a7%3A0x750ed2042a9c22e8!2s3616%20Far%20W%20Blvd%20117%20777%2C%20Austin%2C%20TX%2078731%2C%20USA!5e0!3m2!1sen!2sin!4v1712825178385!5m2!1sen!2sin"
              width="100%"
              style={{ minHeight: "350px" }}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* <div class='my-4'>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.596037939033!2d-118.26596362524089!3d34.13109011356449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c0e592d394ff%3A0xe7e4d7728d710e4!2s1225%20Los%20Angeles%20St%2C%20Glendale%2C%20CA%2091204%2C%20USA!5e0!3m2!1sen!2sin!4v1712656513031!5m2!1sen!2sin" width="100%" height='300' style={{ border: "none", borderRadius: '20px' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div> */}
      </div>

      {/* <div class='col-md-7'>
                    <div class='col-11 m-auto text-start row border border-primary rounded-4 p-3'>
                        <div class='col-sm-6 mt-2'>
                            <label htmlFor="" class='mt-2'>Name</label>
                            <input type="text" class='form-control' value={contact?.name} placeholder='Name' name='name' onChange={contactDetails} />
                        </div>

                        <div class='col-sm-6 mt-2'>
                            <label htmlFor="" class='mt-2'>Email</label>
                            <input type="text" class='form-control' value={contact?.email} placeholder='Email' name='email' onChange={contactDetails} />
                        </div>

                        <div class='col-sm-6 mt-2'>
                            <label htmlFor="" class='mt-2'>Phone</label>
                            <input type="text" class='form-control' value={contact?.phone} placeholder='Phone' name='phone' onChange={contactDetails} />
                        </div>

                        <div class='col-sm-6 mt-2'>
                            <label htmlFor="" class='mt-2'>Subject</label>
                            <input type="text" class='form-control' value={contact?.subject} placeholder='Subject' name='subject' onChange={contactDetails} />
                        </div>

                        <div class='mt-2'>
                            <label htmlFor="" class='mt-2'>Message</label>
                            <textarea placeholder='Message' class='form-control' value={contact?.message} name='message' onChange={contactDetails} />
                        </div>
                        <div class='mt-3'>
                            <button class='btn btn-primary  w-100' onClick={submitForm}>Submit</button>
                        </div>



                    </div>
                </div> */}
    </div>
  );
};

export default Contact;
