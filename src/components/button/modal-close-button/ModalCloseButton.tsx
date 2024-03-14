import React from "react";

import closeSrc from "../../../assets/images/close.svg";
import "./modal-close-button.scss";

interface IModalCloseButtonProps {
  onClose: () => void;
}

export default function (props: IModalCloseButtonProps) {
  return (
    <button className="modal-close-button" onClick={props.onClose}>
      <img src={closeSrc} />
    </button>
  );
}