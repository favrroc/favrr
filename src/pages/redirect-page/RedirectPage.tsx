import React, { useEffect, useState } from "react";
import { Case, Default, Else, If, Switch, Then } from "react-if";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { getEmailLinkConfirm } from "../../api/email-link-confirm";
import checkSrc from "../../assets/images/check-green-circle.svg";
import crossSrc from "../../assets/images/cross-pink-circle.svg";
import { Body1, Body1Bold, ButtonPrimary, H3 } from "../../components/styleguide/styleguide";
import { StorageKeys } from "../../core/constants/base.const";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../core/hooks/useLowercasedAccount";
import { setShowConnectWalletModalAction } from "../../core/store/slices/modalSlice";
import { updateProfileState } from "../../core/store/slices/userSlice";
import { getCSSOfStyledComponent } from "../../core/util/base.util";
import { homePath } from "../../core/util/pathBuilder.util";
import BasePage from "../base-page/BasePage";

const RedirectPage = () => {
  const { id } = useParams<{ id: string; }>();
  const { isConnected } = useLowercasedAccount();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const profile = useAppSelector(state => state.user.profile);

  const [verified, setVerified] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const parsedString = atob(id);

        // Verify Email from Start-Here page
        if (parsedString.includes("verify-email")) {
          const res = await getEmailLinkConfirm(id as string);
          if (res) {
            // res === true means backend's email.service.confirmEmailWithLogin returned 'true'. It will emit socket event, and in App.tsx, it will automatically update user profile.
            const emailParam = parsedString.split("/").at(parsedString.includes("with-login") ? 2 : 1) || "";
            setEmail(emailParam);
          }
          setVerified(res);
        }
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (email) {
      if (isConnected) {
        dispatch(updateProfileState({
          ...profile,
          email,
          emailVerified: true,
          isVerified: !!profile.fullName
        }));
      }
      else {
        localStorage.setItem(StorageKeys.EmailForVerification, email);
      }
    }
  }, [isConnected, email]);

  const handleClickExploreOceana = () => {
    navigate(homePath());
  };

  const handleClickConnectWallet = () => {
    dispatch(setShowConnectWalletModalAction(true));
  };

  return (
    <BasePage style={{ "--number-columns": 0 } as any}>
      <StyledContainer>
        {/* Success Icon */}
        <If condition={verified !== null}>
          <Then>
            <img src={verified ? checkSrc : crossSrc} alt="check-image" width={136} height={136} />
          </Then>
        </If>

        {/* Headline */}
        <Switch>
          <Case condition={verified === null}>
            <SuccessTitle>Confirming ...</SuccessTitle>
          </Case>
          <Case condition={verified === false}>
            <FailureTitle>Link Expired</FailureTitle>
          </Case>
          <Default>
            <SuccessTitle>Your email has been verified!</SuccessTitle>
          </Default>
        </Switch>

        {/* Caption */}
        <If condition={verified !== null}>
          <Then>
            <If condition={verified === true}>
              <Then>
                <If condition={isConnected}>
                  <Then>
                    <ButtonPrimary onClick={handleClickExploreOceana}>Explore Oceana</ButtonPrimary>
                  </Then>
                  <Else>
                    <ButtonPrimary onClick={handleClickConnectWallet}>Connect Wallet to Start Trading</ButtonPrimary>
                  </Else>
                </If>
              </Then>
              <Else>
                <Description>You can resend this email on your profile page.</Description>
              </Else>
            </If>
          </Then>
        </If>
      </StyledContainer>
    </BasePage>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 64px;
  text-align: center;
  @media screen and (max-width: ${RESPONSIVE.large}) {
    margin-top: 0px;
  }
`;
const SuccessTitle = styled.div`
  ${getCSSOfStyledComponent(Body1Bold)}
  color: ${colors.neutrals8};
`;
const FailureTitle = styled.div`
  ${getCSSOfStyledComponent(H3)}
  color: ${colors.neutrals8};
`;
const Description = styled.div`
  ${getCSSOfStyledComponent(Body1)}
  color: ${colors.neutrals4};
  margin-top: -24px;
`;

export default RedirectPage;