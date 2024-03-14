import React, { CSSProperties } from "react";
import styled from "styled-components";
import { colors } from "../../core/constants/styleguide.const";
import { getCSSOfStyledComponent } from "../../core/util/base.util";
import { Body2Bold, Caption2 } from "../styleguide/styleguide";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  containerStyle?: CSSProperties;
  errorMessage?: string;
}

export default React.forwardRef(function TextInput(props: Props, ref) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", ...props.containerStyle }}>
      <StyledTextInput {...props} ref={ref} className={props.errorMessage ? "error" : ""} />
      {!!props.errorMessage && (
        <StyledErrorMessage>
          {props.errorMessage}
        </StyledErrorMessage>
      )}
    </div>
  );
});

const StyledTextInput = styled.input`
  transition: all 0.2s ease;
  border: 2px solid ${colors.neutrals3};
  border-radius: 12px;
  padding: 12px 16px;
  display: block;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
  ${getCSSOfStyledComponent(Body2Bold)}
  color: ${colors.neutrals8};
  &::placeholder {
    color: ${colors.neutrals4};
    font-weight: 400 !important;
  }
  &:hover {
    border-color: ${colors.neutrals4};
  }
  &:focus {
    border-color: ${colors.primaryBlue};
  }
  &.error {
    border-color: ${colors.primaryPink};
  }
`;
const StyledErrorMessage = styled.div`
  ${getCSSOfStyledComponent(Caption2)}
  color: ${colors.primaryPink};
`;