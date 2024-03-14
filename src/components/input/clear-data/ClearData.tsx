import React, { InputHTMLAttributes, useRef } from "react";
import styled from "styled-components";

import UnionSrc from "../../../assets/images/union.svg";

interface Props {
  children: InputHTMLAttributes<HTMLInputElement>;
  data: string | number | null;
  clear: () => void;
}
const ClearData = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <ClearInputWrapper ref={inputRef}>
      {props.children}
      <ClearButton
        className={props.data ? "show-input" : "hide-input"}
        onClick={() => {
          props.clear();
          inputRef?.current?.querySelector("input, textarea")?.focus();
        }}
        type="button"
      >
        <img src={UnionSrc} />
      </ClearButton>
    </ClearInputWrapper>
  );
};

const ClearInputWrapper = styled.div`
  position: relative;
  input,
  textarea {
    padding-right: 38px !important;
    &:focus + .show-input {
      opacity: 0.5;
      visibility: visible;
      &:hover {
        opacity: 1;
      }
    }
  }
  &:hover .show-input {
    opacity: 0.5;
    visibility: visible;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 16px;
  top: 12px;
  padding: 0;
  margin: 0;
  display: flex;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  &.show-input:hover {
    opacity: 1;
  }
  &.hide-input {
    opacity: 0;
  }
`;

export default ClearData;
