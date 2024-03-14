import React from "react";

import arrowLeftSrc from "../../../assets/images/arrowleft.svg";
import arrowLeftDarkSrc from "../../../assets/images/arrowleftDark.svg";
import "./back-button.scss";

interface IBackButtonProps {
  onClose: () => void;
  dark?: boolean;
}

export default function ({onClose, dark = true}: IBackButtonProps) {
  return (
    <button className="back-button" onClick={onClose}>
      <img src={dark ? arrowLeftSrc : arrowLeftDarkSrc} />
      <span>Back</span>
    </button>
  );
}