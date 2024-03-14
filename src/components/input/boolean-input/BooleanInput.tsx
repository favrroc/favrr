import React from "react";

import "./boolean-input.scss";

const BooleanInput = (props: {
  value: boolean;
  onChange: (newValue: boolean) => void;
}) => {
  const { value, onChange } = props;
  return (
    <button
      className={`boolean-input ${value ? "true" : "false"}`}
      onClick={(e) => {
        onChange(!value);
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="circle-indicator" />
    </button>
  );
};

export default BooleanInput;
