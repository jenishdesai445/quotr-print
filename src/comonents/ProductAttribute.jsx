import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLoading } from "./LoadingContext ";

const ProductAttribute = ({ attrData, productId, getData }) => {
  const { setIsLoading } = useLoading();

  let token = localStorage.getItem("quotrUserToken");
  const attId = attrData?.id;
  const attName = attrData?.name;
  const [sendDetails, setSendDetails] = useState({
    attribute: [],
  });

  const [mapOfAttributeIdToValue, setMapOfAttributeIdToValue] = useState(
    new Map()
  );

  useEffect(() => {
    getData(sendDetails);
  }, [sendDetails]);

  const [updatedDat, setUpdatedDat] = useState([
    {
      id: attId,
      name: attName,
      meta_name: "size",
    },
  ]);

  const handleApiCall = (id, sendDetails, inside = false) => {
    setIsLoading(true);
    axios
      .post(
        "https://bp.quotrprint.com/api/getAttributeDetail",
        { product_id: productId, ...sendDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const response = res.data.data;
        if (inside) {
          setUpdatedDat(updatedDat.concat(response.Attribute ?? []));
        } else
          setMapOfAttributeIdToValue((prev) =>
            new Map(prev).set(id, response.AttributeValue)
          );
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const handleChangeEvent = (e, id) => {
    try {
      const data = JSON.parse(e.target.value);
      const attributeValueId = data.id;
      const newSendDetails = { ...sendDetails };
      const selectedIndex = newSendDetails.attribute.findIndex(
        (element) => element.attributeId === id
      );
      if (selectedIndex !== -1) {
        newSendDetails.attribute[selectedIndex].attributeValueId =
          attributeValueId;
        setSendDetails(newSendDetails);
        handleApiCall(id, newSendDetails, true);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // You can handle the error here, such as showing a message to the user
    }
  };

  const handleClickEvent = (id) => {
    const hasAlready = sendDetails.attribute.some(
      (value) => value.attributeId === id
    );
    if (!hasAlready) {
      const newSendDetails = { ...sendDetails };
      newSendDetails.attribute.push({
        attributeId: id,
      });
      setSendDetails(newSendDetails);
      handleApiCall(id, newSendDetails);
    }
  };

  const selectElements = updatedDat.map((el) => (
    <div class="col-md-6 ">
      <div class="col-11 m-auto">
        <p class="mt-3 fw-semibold">
          {el?.name} <span class="text-danger">*</span>
        </p>
        <select
          key={el.id}
          className="form-select detailList"
          onClick={() => handleClickEvent(el.id)}
          onChange={(e) => handleChangeEvent(e, el.id)}
        >
          <option value="">Select an option</option>
          {(mapOfAttributeIdToValue.get(el.id) || []).map((value) => (
            <option key={value.id} value={JSON.stringify(value)}>
              {value.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  ));

  return (
    <div>
      <div class="row p-0 m-0">{selectElements}</div>
    </div>
  );
};

export default ProductAttribute;
