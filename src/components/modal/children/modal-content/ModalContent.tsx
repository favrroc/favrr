import React, { CSSProperties, ReactNode } from "react";
import { CrossImage } from "../../../assets/app-images/AppImages";
import BorderedButton from "../../../button/bordered-button/BorderedButton";
import { Flex } from "../../../styleguide/styleguide";

import "./modal-content.scss";

interface Props {
  className?: string;
  style?: CSSProperties;
  onClose?: () => void;
  children?: ReactNode;
}
const ModalContent = ({ onClose, className, style, children }: Props) => {
  return (
    <div className={`modal-content ${className || ""}`} style={style}>
      {onClose && (
        <Flex className="justify-end">
          <BorderedButton
            buttonProps={{ className: "close-button", onClick: onClose }}
            iconSrc={CrossImage().props.src}
          />
        </Flex>
      )}
      {children}
    </div>
  );
};

export default ModalContent;
