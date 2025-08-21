import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

const ExpresionAtribute = ({
  attributeId,
  productId,
  attributeSelect,
  disabled,
}) => {
  const token = localStorage.getItem("quotrUserToken");
  const [attr, setAttr] = useState([]);

  const getAttribute = (el) => {
    axios
      .post(
        `https://bp.quotrprint.com/api/getAttributeValueFormula`,
        { attribute_id: el, product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // console.log(res.data);
        setAttr(res.data.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const handleAttributeChange = (e) => {
    const selectedValue = e.target.value;
    const value = {
      attributeId: attributeId,
      attributeValueId: selectedValue,
    };
    attributeSelect(value);
  };

  return (
    <div>
      <select
        className="form-select detailList"
        onChange={handleAttributeChange}
        disabled={disabled}
        onClick={() => getAttribute(attributeId)}
      >
        <option value="">Select an option</option>
        {attr.map((value, i) => (
          <option key={value?.id} value={value?.id}>
            {value?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExpresionAtribute;
