import React from "react";
import styled from "styled-components";
import { colors, sizes } from "../../../core/constants/styleguide.const";

interface Props {
  onAction: () => void;
}
const ShowMoreButton = (props: Props) => {
  return (
    <>
      <Flex>
        <Button
          onClick={(e: { preventDefault: () => void; }) => {
            e.preventDefault();
            props.onAction();
          }}
        >
          More
        </Button>
      </Flex>

      <Flex
        style={{
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Dots></Dots>
        <Dots></Dots>
        <Dots></Dots>
      </Flex>
    </>
  );
};

const Button = styled.div`
  border: 2px solid ${colors.neutrals3};
  border-radius: 90px;
  font-family: "DM Sans";
  font-weight: 700;
  font-size: ${sizes.sm};
  line-height: ${sizes.base};
  text-align: center;
  color: ${colors.neutrals8};
  padding: 12px 16px;
  cursor: pointer;
  &:hover {
    border-color: ${colors.neutrals8};
  }
`;
const Dots = styled.div`
  gap: 10px;
  width: 6px;
  height: 6px;
  background: ${colors.neutrals3};
  border-radius: 64px;
`;
const Flex = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px auto 0;
`;

export default ShowMoreButton;