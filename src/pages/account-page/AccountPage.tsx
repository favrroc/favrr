import React, { useEffect } from "react";
import { Else, If, Then } from "react-if";
import styled from "styled-components";

import AccountHistory from "../../components/account/AccountHistory";
import Loader from "../../components/loader/Loader";
import { ButtonPrimary, ButtonSecondary, Flex, H3, H4 } from "../../components/styleguide/styleguide";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useBalance } from "../../core/hooks/useBalance";
import { setShowAddFundsModalAction, setShowClaimFundsModalAction } from "../../core/store/slices/modalSlice";
import { getCSSOfStyledComponent } from "../../core/util/base.util";
import { Unit, formatNumber } from "../../core/util/string.util";
import BasePage from "../base-page/BasePage";
import usdcIcon from "./../../assets/images/usdc.svg";

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const { syncBalance } = useBalance();

  const { usdcBalance, isFetchingUSDCBalance } = useAppSelector(state => state.user);

  useEffect(() => {
    setTimeout(() => {
      syncBalance();
    }, 12000);
  }, [usdcBalance]);

  useEffect(() => {
    syncBalance();
  }, []);

  return (
    <BasePage
      className=""
      contentStyle={{ boxSizing: "border-box", width: "100%" }}
    >
      <StyledHeadline>Account</StyledHeadline>
      <BalanceBlock>
        <BalanceBlockInner>
          <Flex style={{ gap: "20px", alignItems: "start" }}>
            <StyledCoin className="icon" src={usdcIcon} alt="USDC Icon" style={{ marginTop: "28px" }} />
            <Flex style={{ flexDirection: "column", gap: "2px" }}>
              <Caption className="font-neutrals4">
                USDC Balance
              </Caption>
              <If condition={isFetchingUSDCBalance}>
                <Then>
                  <div style={{display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", height: "100px", width: "120px" }}>
                    <Loader />
                  </div>
                </Then>
                <Else>
                  <Balance>
                    {formatNumber({
                      value: usdcBalance,
                      unit: Unit.USDC,
                      summarize: false,
                    })}
                  </Balance>
                  <USDBalance>
                    {formatNumber({
                      value: usdcBalance,
                      unit: Unit.USD,
                      summarize: false,
                      withUnit: true,
                    })}
                  </USDBalance>
                </Else>
              </If>
            </Flex>
          </Flex>
          <HR />
          <Flex style={{ flexDirection: "column", gap: "10px" }}>
            <Strong>Are you ready?</Strong>
            <StyledP>
              Good opportunities pass by in milliseconds. To stay in the game, be sure to keep a healthy USDC balance so you don’t miss your chance to invest.
            </StyledP>
          </Flex>
          <Flex style={{ gap: "12px", justifyContent: "center" }}>
            <ButtonSecondary style={{ width: "144px" }} onClick={() => dispatch(setShowAddFundsModalAction(true))}>
              Add
            </ButtonSecondary>
            <ButtonPrimary style={{ width: "144px" }} onClick={() => dispatch(setShowClaimFundsModalAction(true))}>
              Claim
            </ButtonPrimary>
          </Flex>
        </BalanceBlockInner>
      </BalanceBlock>
      <AccountHistory />
    </BasePage>
  );
};

const StyledHeadline = styled.div`
  ${getCSSOfStyledComponent(H3)}
  
  @media screen and (max-width: ${RESPONSIVE.small}) {
    ${getCSSOfStyledComponent(H4)}
  }
`;

const StyledCoin = styled.img`
  width: 56px;
  height: 56px;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    width: 32px;
    height: 32px;
  }
`;

const Strong = styled.strong`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #E6E8EC;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
  }
`;

const StyledP = styled.p`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #B1B5C4;
  margin: 0 0 24px;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
  }
`;

const HR = styled.hr`
  background-color: #353945;
  height: 1px;
  width: 100%;
  border: none;
  margin: 16px 0 0;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin: 0;
  }
`;

const Caption = styled.span`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: ${colors.neutrals4};
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
  }
`;

const USDBalance = styled.span`
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: -0.01em;
  color: ${colors.neutrals4};
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
`;

const Balance = styled.span`
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 64px;
  line-height: 64px;
  letter-spacing: -0.02em;
  color: ${colors.neutrals8};
  margin: 0;
  word-break: break-all;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
  }
`;

const BalanceBlock = styled.div`
  background: #242731;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 88px 96px 80px;
  margin-top: 40px;
  @media screen and (max-width: 1024px) {
    padding: 72px 64px 64px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    padding: 48px 20px;
  }
`;

const BalanceBlockInner = styled.div`
  max-width: 800px;
  text-align: left;
  width: 100%;
  display: flex;
  gap: 32px;
  flex-direction: column;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    gap: 24px;
  }
`;

export default AccountPage;
