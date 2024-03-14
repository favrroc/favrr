import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

import { useClickOutside } from "../../../core/hooks/useClickOutside";
import "./exclusive-picker-panel.scss";

interface Props {
  value: string;
  options: Array<{ value: string; display: string; }>;
  onChange: (value: string) => void;
  onClickOutside?: () => void;
  customClass?: string;
  id?: string;
}

const ExclusivePickerPanel = (props: Props) => {
  const { options, value, onChange, onClickOutside, id, customClass } = props;

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }
  });

  useClickOutside(rootRef, () => {
    if (onClickOutside) {
      onClickOutside();
    }
  });

  return (
    <div
      id={id}
      className={`exclusive-picker-panel ${customClass || ""}`}
      ref={rootRef}
    >
      <div className="selected-indicator" />
      {options.map((option, i) => (
        <React.Fragment key={option.value}>
          {i > 0 && <hr />}
          <motion.button
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.1,
              delay: i * 0.05,
            }}
            type="button"
            className={option.value == value ? "selected" : ""}
            onClick={() => onChange(option.value)}
          >
            {option.display}
          </motion.button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ExclusivePickerPanel;
