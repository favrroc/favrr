import React, { useState } from "react";
import styled from "styled-components";

import ExclusivePickerPanel from "../exclusive-picker-panel/ExclusivePickerPanel";
import ErrorMessages from "../../info/error-messages/ErrorMessages";
import chevronSrc from "../../assets/images/chevron.svg";

interface Props {
  value: string | null;
  property: string | null;
  setValue: (field: string, value: null) => void;
  register: (field: string) => void;
  clearErrors: (field?: string | string[]) => void;
  trigger: (field?: string | string[]) => void;
  resetField: (field: string) => void;
  errors: [];
  currency: string;
  changeCurrency: (field: string) => void;
}
enum currencyType {
  eth = "ETH",
  usd = "USD",
}
const PriceSelect = (props: Props) => {

  const [currencyToggleVisible, setCurrencyToggleVisible] =
    useState<boolean>(false);
  return (
    <>
      <PriceContainer>
        <Input
          {...props.register(props.property)}
          onKeyDown={(e) => {
            const x = e.key;
            if (
              ![
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                ".",
                "Backspace",
                "ArrowLeft",
                "ArrowRight",
              ].includes(x)
            ) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onChange={(e) => {
            let input = e.target.value;
            const regExp = /^(\d+(\.\d{0,18})?|\.?\d{0,2})$/;
            if (input.length === 1 && input === ".") {
              input = `0.`;
            }

            if (regExp.test(input)) {
              props.setValue(props.property, input);
            } else {
              props.setValue(props.property, input.slice(0, -1));
              e.preventDefault();
              e.stopPropagation();
            }
            props.clearErrors(props.property || "");
            props.trigger(props.property || "");
          }}
          placeholder={"Enter Bid"}
          className={`${props.errors.bid ? "error" : ""}`}
          type="text"
          autoComplete="off"
        />
        <CurrencyToggleButton
          className={`${currencyToggleVisible ? "expanded" : ""}`}
          onClick={() => {
            setTimeout(() => {
              setCurrencyToggleVisible(!currencyToggleVisible);
            }, 0);
          }}
        >
          {props.currency}
          <img src={chevronSrc} />
          {currencyToggleVisible && (
            <ExclusivePickerPanel
              options={[
                {
                  value: currencyType.eth,
                  display: currencyType.eth,
                },
                {
                  value: currencyType.usd,
                  display: currencyType.usd,
                },
              ]}
              value={props.currency}
              onChange={(value) => {
                props.changeCurrency(value as currencyType);
                setTimeout(() => {
                  if (parseFloat(value) !== 0 && value !== "") {
                    props.clearErrors(props.property || "");
                    props.trigger(props.property || "");
                  }
                }, 250);
              }}
              onClickOutside={() => setCurrencyToggleVisible(false)}
            />
          )}
        </CurrencyToggleButton>
      </PriceContainer>
      <ErrorMessages errors={props.errors} />
    </>
  );
};
const PriceContainer = styled.div`
  position: relative;
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  color: #fcfcfd;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;
const Input = styled.input`
  transition: all 0.2s ease;
  border: 2px solid #353945;
  border-radius: 12px;
  padding: 12px 16px;
  display: block;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
  color: #fcfcfd;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  margin-top: 12px;
  &.error {
    border-color: #ffa2c0;
  }
`;
const CurrencyToggleButton = styled.div`
  cursor: pointer;
  color: #808191;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  position: absolute;
  right: 16px;
  top: 26px;
  img {
    transform: rotate(90deg);
    margin-left: 8px;
  }
  &:hover {
    color: #fcfcfd;
    img {
      filter: brightness(2);
    }
  }
  .exclusive-picker-panel {
    position: absolute;
    top: 40px;
    right: 0px;
    box-shadow: 0px 16px 50px 2px rgb(15 17 24 / 67%);
    button.selected {
      border-left: solid 2px #3f8cff;
    }
  }
`;
export default PriceSelect;
