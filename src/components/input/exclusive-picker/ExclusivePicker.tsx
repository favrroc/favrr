import React from "react";

import "./exclusive-picker.scss";

interface Props<T extends number | string> {
  value: T;
  onChange: (newValue: T) => void;
  options: Array<{ value: T; label: string | JSX.Element; disabled?: boolean; }>;
  className?: string;
  disabled?: boolean;
}

const ExclusivePicker = <T extends number | string>(props: Props<T>) => {
  return (
    <div className={`exclusive-picker ${props.className}`}>
      {props.options.map((option) => (
        <button
          disabled={props.disabled || option.disabled}
          className={`option-button ${props.value == option.value ? "active" : ""
          } `}
          key={option.value}
          onClick={() => props.onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ExclusivePicker;
