import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from "react";
import { useWatchResize } from "../../core/hooks/useWatchResize";

import "./tooltip.scss";

const Tooltip = (
  props: PropsWithChildren<{
    tooltip: JSX.Element | null;
    position: "top" | "bottom";
    hideTooltipArrow?: boolean;
    tooltipTargetStyle?: CSSProperties;
    tooltipBoxStyle?: CSSProperties;
    tooltipBoxClassName?: string;
  }>
) => {
  const { windowWidth } = useWatchResize();
  const [displayTooltip, setDisplayTooltip] = useState(false);
  const tooltipBoxRef = useRef(null as null | HTMLDivElement);

  useEffect(() => {
    if (tooltipBoxRef.current) {
      const rect = tooltipBoxRef.current.getBoundingClientRect();

      let xOffset = 0;
      if (windowWidth < rect.right) {
        xOffset = windowWidth - rect.right;
      } else if (rect.left < 0) {
        xOffset = -rect.left;
      }

      if (xOffset < 0) {
        tooltipBoxRef.current.style.setProperty(
          "transform",
          `translate(-50%, -100%) translateX(${xOffset}px)`
        );
      }
    }
  });

  const hideTooltipRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTooltip = () => {
    if (hideTooltipRef.current) {
      clearTimeout(hideTooltipRef.current);
    }
    hideTooltipRef.current = setTimeout(() => setDisplayTooltip(false), 300);
  };

  const showTooltip = () => {
    if (hideTooltipRef.current) {
      clearTimeout(hideTooltipRef.current);
    }
    setDisplayTooltip(true);
  };
  return (
    <div
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className={`tooltip ${props.position} ${props.hideTooltipArrow ? "hide-chevron" : ""
      }`}
      style={props.tooltipBoxStyle}
    >
      {props.children}
      {displayTooltip && (
        <div
          className={`tooltip-box ${props.tooltipBoxClassName || ""}`}
          ref={tooltipBoxRef}
          style={props.tooltipBoxStyle}
        >
          {props.tooltip}
        </div>
      )}
    </div>
  );
};

export const TooltipTitle = (props: PropsWithChildren<unknown>) => {
  return <div className="tooltip--title">{props.children}</div>;
};

export const TooltipBody = (props: PropsWithChildren<unknown>) => {
  return <div className="tooltip--body">{props.children}</div>;
};

export default Tooltip;
