import React, { ChangeEvent, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import styled from "styled-components";

import { Mutation as GraphqlMutation } from "../../../generated-graphql/graphql";
import {
  ApolloActionType,
  ClientType,
  apolloClient
} from "../../core/clients/apolloClient";
import { ReactComponent as GreenCheckGreenPathImage } from "../../assets/images/check-green-path.svg";
import { ErrorMessages } from "../../core/constants/messages.const";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { generateCreateEmailSubscriptionQuery } from "../../core/graphql-queries/backend-queries/fanMatches.mutation";
import { getCSSOfStyledComponent } from "../../core/util/base.util";
import { pixelToNumber, validateEmail } from "../../core/util/string.util";
import { RightArrowImage } from "../assets/app-images/AppImages";
import { Body1Bold, Caption1Bold, Caption2 } from "../styleguide/styleguide";

interface Props {
  isOnFanMatchesPage: boolean;
}

const GetUpdateModule = (props: Props) => {
  const { isOnFanMatchesPage } = props;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsSubscribed(false);
  }, []);

  const confirmEmailToGetUpdates = async () => {
    if (email) {
      setIsSubscribing(true);
      const errMessage = await validateEmail(email);

      if (errMessage) {
        setErrorMessage(errMessage);
        setIsSubscribing(false);
      } else {
        const { createEmailSubscribe }: GraphqlMutation = await apolloClient(
          ClientType.GRAPHQL,
          ApolloActionType.MUTATE,
          generateCreateEmailSubscriptionQuery(email)
        );

        setIsSubscribing(false);

        if (createEmailSubscribe) {
          setIsSubscribed(true);
        } else {
          setErrorMessage("Error");
        }
      }
    } else {
      setErrorMessage(ErrorMessages.EmailRequiredError);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setErrorMessage("");
    setIsSubscribing(false);
    setEmail(e.target.value);
  };

  return (
    <>
      <StyledWrapper>
        <BoxShadow />
        <StyledContainer isOnFanMatchesPage={isOnFanMatchesPage}>
          {isSubscribed ? (
            <StyledSubscribedContainer>
              <GreenCheckGreenPathImage />
              <Body1Bold>{`Subscribed`}</Body1Bold>
            </StyledSubscribedContainer>
          ) : (
            <>
              <StyledDescriptionSection
                className={!!errorMessage ? "invalid" : ""}
              >
                <Body1Bold>{`Get Updates`}</Body1Bold>
                <Caption2
                  style={{ color: `${colors.neutrals5}`, textAlign: "center" }}
                >
                  {`Be the first to know about new matchups.`}
                </Caption2>
              </StyledDescriptionSection>

              <EnterEmailForm className={!!errorMessage ? "invalid" : ""}>
                <StyledInput
                  value={email}
                  onChange={handleChange}
                  placeholder={`Enter Email`}
                />
                {!(errorMessage || isSubscribing) && (
                  <StyledButton
                    onClick={confirmEmailToGetUpdates}
                    className={
                      isSubscribing || errorMessage ? "notAllowed" : ""
                    }
                  >
                    <StyledRightArrow src={RightArrowImage().props.src} />
                  </StyledButton>
                )}
              </EnterEmailForm>
              <StyledErrorgMessage className={!!errorMessage ? "invalid" : ""}>
                {errorMessage}
              </StyledErrorgMessage>
            </>
          )}
        </StyledContainer>
      </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  padding: 12px 24px 12px 24px;
  background-color: ${colors.neutrals2};
  width: 100%;
  height: 208px;
  box-sizing: border-box;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    width: ${(props: { isOnFanMatchesPage: boolean }) => {
    return props.isOnFanMatchesPage ? "46" : "100";
  }}%;
  }
  @media screen and (min-width: ${pixelToNumber(RESPONSIVE.large) + 1}px) {
    width: 100%;
  }
`;

const StyledSubscribedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const EnterEmailForm = styled.div`
  position: relative;
  box-sizing: border-box;
  height: 48px;
  border: 2px solid ${colors.neutrals3};
  border-radius: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 24px;
  &.invalid {
    border-color: ${colors.primaryPink};
    margin-top: 12px;
  }
`;

const StyledInput = styled.input`
  ${getCSSOfStyledComponent(Caption1Bold)}
  color: ${colors.neutrals8};
  position: absolute;
  background-color: ${colors.neutrals2};
  border: none;
  width: 82%;
  font-weight: 500;
  &::placeholder {
    font-weight: 400 !important;
  }
`;

const StyledRightArrow = styled(SVG)`
  width: 21px;
  height: 13.5px;
`;

const StyledButton = styled.div`
  position: absolute;
  right: 6px;
  display: flex;
  justify-content: center;
  background-color: ${colors.primaryBlue};
  width: 35px;
  height: 35px;
  border-radius: 50%;
  align-items: center;
  color: ${colors.neutrals8};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const BoxShadow = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: 70%;
  box-shadow: 0px 29px 13.222px -25.778px rgba(19, 20, 24, 0.6);
`;

const StyledDescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  &.invalid {
    gap: 6px;
  }
`;

const StyledErrorgMessage = styled.span`
  ${getCSSOfStyledComponent(Caption2)}
  margin-top: 8px;
  height: 20px;
  color: ${colors.primaryPink};
  align-self: flex-start;
  &.invalid {
    margin-bottom: 12px;
    line-height: 16px;
  }
`;

export default GetUpdateModule;
