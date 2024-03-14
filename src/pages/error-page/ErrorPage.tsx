import React from "react";
import { useNavigate } from "react-router-dom";

import { ButtonPrimary } from "../../components/styleguide/styleguide";
import { homePath } from "../../core/util/pathBuilder.util";
import BasePage from "../base-page/BasePage";
import { Styled404, StyledContainer } from "./resources/styled-components";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <BasePage contentStyle={{ margin: 0, paddingLeft: 0, paddingRight: 0 }}>
      <Styled404>ERROR</Styled404>
      <StyledContainer>
        <div className="oops">OOPS...</div>
        <div className="description">{`Something went wrong! Let's get you back on track.`}</div>
        <ButtonPrimary onClick={() => navigate(homePath())}>Go Home</ButtonPrimary>
      </StyledContainer>
    </BasePage>
  );
}