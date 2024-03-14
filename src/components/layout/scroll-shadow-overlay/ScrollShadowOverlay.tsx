import React, { MutableRefObject, PropsWithChildren, useEffect, useState } from "react";

import "./scroll-shadow-overlay.scss";

const ScrollShadowOverlay = (
  props: PropsWithChildren<{
    scrollElementRef: MutableRefObject<HTMLElement | null>;
    className?: string;
    hideVerticalOverlay?: boolean;
    hideHorizontalOverlay?: boolean;
  }>
) => {
  const { hideVerticalOverlay, hideHorizontalOverlay } = props;
  const [scrollableState, setScrollabelState] = useState({
    top: false,
    bottom: false,
    right: false,
    left: false,
  });

  useEffect(() => {
    const updateScrollableDirection = () => {
      const element = props.scrollElementRef.current;
      if (element) {
        const scrollableLeft = element.scrollLeft > 0;
        const scrollableTop = element.scrollTop > 0;
        const scrollableRight =
          element.scrollLeft + element.clientWidth < element.scrollWidth;
        const scrollableBottom =
          element.scrollTop + element.clientHeight < element.scrollHeight;
        if (
          scrollableLeft != scrollableState.left ||
          scrollableRight != scrollableState.right ||
          scrollableBottom != scrollableState.bottom ||
          scrollableTop != scrollableState.top
        ) {
          setScrollabelState({
            top: scrollableTop,
            left: scrollableLeft,
            right: scrollableRight,
            bottom: scrollableBottom,
          });
        }
      }
    };
    updateScrollableDirection();
    props.scrollElementRef.current?.addEventListener(
      `scroll`,
      updateScrollableDirection
    );
    return () =>
      props.scrollElementRef.current?.removeEventListener(
        `scroll`,
        updateScrollableDirection
      );
  });
  
  return (
    <div className={`scroll-shadow-overlay ${props.className || ""}`}>
      {props.children}
      <div className={`shadow-overlay`}>
        {scrollableState.top && !hideVerticalOverlay && (
          <div className="top-shadow" />
        )}
        {scrollableState.bottom && !hideVerticalOverlay && (
          <div className="bottom-shadow" />
        )}
        {scrollableState.left && !hideHorizontalOverlay && (
          <div className="left-shadow" />
        )}
        {scrollableState.right && !hideHorizontalOverlay && (
          <div className="right-shadow" />
        )}
      </div>
    </div>
  );
};

export default ScrollShadowOverlay;
