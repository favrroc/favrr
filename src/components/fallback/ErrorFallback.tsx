import React, { useEffect } from "react";
import { Styled404, StyledContainer } from "./resources/styled-components";
import { useNavigate } from "react-router-dom";
import { homePath } from "../../core/util/pathBuilder.util";
import { ButtonPrimary } from "../styleguide/styleguide";
import BasePage from "../../pages/base-page/BasePage";

export function ErrorFallback(props: { error: any }) {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("ERROR", props);
    
    const chunkFailedMessageRegex = /Loading chunk [\d]+ failed/;
    if (props.error?.message && chunkFailedMessageRegex.test(props.error.message)) {
      window.location.reload();
    }
  }, [props.error]);
  
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