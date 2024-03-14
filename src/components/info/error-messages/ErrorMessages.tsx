import React from "react";
import styled from "styled-components";

interface Props {
  errors: [];
}
const ErrorMessages = (props: Props) => {
  return (
    <>
      {Object.values(props.errors.bid?.types || {}).map((errorMessage, i) => (
        <StyledErrorMessages key={i}>{errorMessage}</StyledErrorMessages>
      ))}
    </>
  );
};
const StyledErrorMessages = styled.div`
  color: #ffa2c0;
  font-size: 12px;
  line-height: 20px;
  margin-top: 8px;
`;
export default ErrorMessages;
