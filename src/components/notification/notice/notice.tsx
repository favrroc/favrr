import React, { ReactNode } from "react";

import noticeImgSrc from "../../assets/images/info-circle.svg";
import "./notice.scss";

const Notice = ({ children }: { children: ReactNode; }) => {
  return (
    <div className="notice-tile">
      <img className="notice-icon" src={noticeImgSrc} alt="Notice" />
      {children}
    </div>
  );
};

export default Notice;
