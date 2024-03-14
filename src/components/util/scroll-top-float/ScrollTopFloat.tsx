import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import arrowSrc from "../../../assets/images/left-arrow.svg";
import "./scroll-top-float.scss";

const ScrollTopFloat = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const newVisible = window.scrollY > window.innerHeight * 0.9;
      if (newVisible != visible) {
        setVisible(newVisible);
      }
    };
    checkScroll();
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, [visible]);

  if (!visible) {
    return null;
  }
  return createPortal(
    <button
      className="scroll-top-float"
      onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
    >
      <img src={arrowSrc} />
    </button>,
    document.querySelector("body") as HTMLBodyElement
  );
};

export default ScrollTopFloat;
