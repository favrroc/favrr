import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { UnverifiedUserImage, VerifiedUserImage } from "../../../components/assets/app-images/AppImages";
import { Body1Bold, Body2, Caption1Bold, Caption2 } from "../../../components/styleguide/styleguide";
import { colors } from "../../../core/constants/styleguide.const";
import { getCSSOfStyledComponent } from "../../../core/util/base.util";

interface Props {
  verified: boolean;
}
const Verified = (props: Props) => {
  return (
    <VerifiedBox>
      <HideSmall>
        {props.verified ? <VerifiedUserImage /> : <UnverifiedUserImage />}
      </HideSmall>
      <Title>
        {props.verified ? <VerifiedUserImage /> : <UnverifiedUserImage />}
        {props.verified ? "Your Verified!" : "Verify Account"}
      </Title>
      <Desc>
        {props.verified ? "Now let's get to the good part! Complete challenges to become an investment mogul and get noticed by your heroes." : <>
          {"It's"} no fun to compete against bots. So let us know {"you're"} a real person with a real social life (okay, no actual social life is required).  <Link to="/how-it-works?targetTab=1&targetIndex=faq10">Learn More</Link>
        </>}
      </Desc>
    </VerifiedBox>
  );
};

export default Verified;

const HideSmall = styled.div`
  @media (max-width: 850px) {
    display: none;
  }
`;
const Desc = styled.div`
  ${getCSSOfStyledComponent(Body2)}
  text-align: center;
  color: ${colors.neutrals5};
  a {
    color: ${colors.primaryBlue};
    font-weight: 500;
  }
  @media (max-width: 850px) {
    ${getCSSOfStyledComponent(Caption2)}
  }
`;
const Title = styled.h2`
  ${getCSSOfStyledComponent(Body1Bold)}
  text-align: center;
  color: ${colors.neutrals8};
  margin: 0;
  img {
    display: none;
  }
  @media (max-width: 850px) {
    display: flex;
    gap: 8px;
    align-items: center;
    ${getCSSOfStyledComponent(Caption1Bold)}
    img {
      display: block;
      height: 24px;
      width: 24px;
    }
  }
`;
const VerifiedBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 48px 48px;
  gap: 24px;
  background: #242731;
  box-shadow: 0px -64px 64px -48px rgba(31, 47, 70, 0.12);
  border-radius: 16px;
  position: sticky;
  top: 130px;
  @media (max-width: 850px) {
    padding: 16px 20px;
    gap: 4px;
  }
`;