import React, { CSSProperties, PropsWithChildren } from "react";

import closeSrc from "../../../../assets/images/close.svg";
import "./modal-title.scss";

const ModalTitle = (
  props: PropsWithChildren<{
    className?: string;
    onClose?: () => void;
    style?: CSSProperties;
    titleStyle?: CSSProperties;
  }>
) => {
  const { children, titleStyle, onClose, style } = props;
  return (
    <div className={`modal-title`} style={{ display: "flex", ...style }}>
      <h2 className="title" style={titleStyle}>
        {children}
      </h2>
      {onClose && (
        <button className="close-button" onClick={onClose}>
          <img src={closeSrc} />
        </button>
      )}
    </div>
  );
};

export default ModalTitle;
