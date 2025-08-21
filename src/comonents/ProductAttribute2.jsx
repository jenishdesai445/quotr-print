import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLoading } from "./LoadingContext ";
import { ClipLoader } from "react-spinners";

const ProductAttribute2 = ({ attrData, productId, getData }) => {
  const [loading, setIsLoading] = useState();

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
          // Find the index of the selected ID in updatedDat
          const indexOfSelectedId = updatedDat.findIndex(
            (attr) => attr.id === id
          );
          // Delete objects from updatedDat after the selected ID
          const newUpdatedDat = updatedDat.slice(0, indexOfSelectedId + 1);
          // Only update updatedDat with the new data received from the API response
          setUpdatedDat(newUpdatedDat.concat(response.Attribute || []));
          const newSendDetails = {
            attribute: sendDetails.attribute.slice(0, indexOfSelectedId + 1),
          };
          setSendDetails(newSendDetails);
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
        const previousValueId =
          newSendDetails.attribute[selectedIndex]?.attributeValueId;

        // Check if the previous value is defined
        if (typeof previousValueId === "undefined") {
          // If previous value is undefined, set the new value without refreshing
          newSendDetails.attribute[selectedIndex].attributeValueId =
            attributeValueId;
          setSendDetails(newSendDetails);
          handleApiCall(id, newSendDetails, true);
        } else {
          if (previousValueId !== attributeValueId) {
            let newSendDetails = { ...sendDetails };
            const index = sendDetails.attribute.findIndex(
              (value) => value.attributeId == id
            );
            delete newSendDetails.attribute[index].attributeValueId;
            newSendDetails.attribute[index].attributeValueId = attributeValueId;
            newSendDetails.attribute.splice(
              index + 1,
              newSendDetails.attribute.length
            );

            const indexOfSelectedId = updatedDat.findIndex(
              (attr) => attr.id === id
            );
            const newUpdatedDat = updatedDat.slice(0, indexOfSelectedId + 1);
            setUpdatedDat(newUpdatedDat);

            setSendDetails(newSendDetails);
            handleApiCall(id, newSendDetails, true);
          } else {
            // If the new value is the same as the previous one, no need to refresh
            console.log("Same value selected");
          }
        }
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
          <option value="">Select an option </option>
          {loading && (
            <option value="">
              loading...
              <ClipLoader
                loading={loading}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </option>
          )}
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

export default ProductAttribute2;
