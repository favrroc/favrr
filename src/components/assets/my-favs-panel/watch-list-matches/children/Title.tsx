import React from "react";
import styled from "styled-components";

import { colors } from "../../../../../core/constants/styleguide.const";

interface IFavTitleProps {
  title: string;
}

const Title = ({ title }: IFavTitleProps) => {
  return <StyledTitle>{title}</StyledTitle>;
};

const StyledTitle = styled.span`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.neutrals8};
  text-transform: capitalize;
`;
export default Title;
