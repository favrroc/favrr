import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";

import { useClickOutside } from "../../../core/hooks/useClickOutside";
import { scrollToTopOfExplore } from "../../../core/util/base.util";
import BooleanInput from "../../input/boolean-input/BooleanInput";

import "./sorting-panel.scss";

type SortingOption = "trendy" | "cheap" | "expensive";

const SortingPanel = (props: {
  sorting: SortingOption;
  onChangeSorting: (option: SortingOption) => void;
  includeIPOs: boolean;
  onIncludeIPOsChange: (newValue: boolean) => void;
  className?: string;
  onClose?: () => void;
}) => {
  const { sorting, onChangeSorting } = props;
  const trendyRef = useRef<null | HTMLButtonElement>(null);
  const cheapRef = useRef<null | HTMLButtonElement>(null);
  const expensiveRef = useRef<null | HTMLButtonElement>(null);
  const selectedBarIndicatorRef = useRef<null | HTMLDivElement>(null);
  const panelRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    let selectedElement = trendyRef.current;
    if (props.sorting == "cheap") {
      selectedElement = cheapRef.current;
    } else if (props.sorting == "expensive") {
      selectedElement = expensiveRef.current;
    }

    if (selectedElement) {
      selectedBarIndicatorRef.current?.style.setProperty(
        "top",
        selectedElement.offsetTop + "px"
      );
      selectedBarIndicatorRef.current?.style.setProperty(
        "height",
        selectedElement.clientHeight + "px"
      );
    }
  }, [props.sorting]);

  useClickOutside(panelRef, () => {
    if (props.onClose) {
      props.onClose();
    }
  });

  const handleFilterButtonClick = (e: any, opt: SortingOption) => {
    onChangeSorting(opt);
    e.preventDefault();
    e.stopPropagation();
    scrollToTopOfExplore();
  };

  const handleFilterIPOChange = () => {
    props.onIncludeIPOsChange(!props.includeIPOs);
    scrollToTopOfExplore();
  };

  return (
    <div className={`sorting-panel ${props.className || ""}`} ref={panelRef}>
      <div className="selected-indicator" ref={selectedBarIndicatorRef} />
      <button
        className={`sorting-row ${sorting == "trendy" ? "selected" : ""}`}
        onClick={(e) => handleFilterButtonClick(e, "trendy")}
        ref={trendyRef}
      >
        <FormattedMessage defaultMessage="Trendy" />
      </button>
      <button
        className={`sorting-row ${sorting == "cheap" ? "selected" : ""}`}
        onClick={(e) => handleFilterButtonClick(e, "cheap")}
        ref={cheapRef}
      >
        <FormattedMessage defaultMessage="Cheap" />
      </button>
      <button
        className={`sorting-row ${sorting == "expensive" ? "selected" : ""}`}
        onClick={(e) => handleFilterButtonClick(e, "expensive")}
        ref={expensiveRef}
      >
        <FormattedMessage defaultMessage="Expensive" />
      </button>
      <div
        className="sorting-row ipo-row"
        onClick={handleFilterIPOChange}
      >
        <span className={`ipo-label ${props.includeIPOs ? "true" : "false"} `}>
          <FormattedMessage defaultMessage="IPOs" />
        </span>
        <BooleanInput
          value={props.includeIPOs}
          onChange={handleFilterIPOChange}
        />
      </div>
    </div>
  );
};

export default SortingPanel;
