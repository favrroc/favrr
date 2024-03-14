import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import fundsClaimedCardSrc from "../../../assets/images/add-funds-modal/funds-claimed-card.png";
import usdcIcon from "../../../assets/images/usdc.svg";
import { colors } from "../../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowFundsClaimedModalAction } from "../../../core/store/slices/modalSlice";
import { getCSSOfStyledComponent } from "../../../core/util/base.util";
import { Block, ButtonPrimary, Caption1, H3 } from "../../styleguide/styleguide";
import ModalContent from "../children/modal-content/ModalContent";
import "../funds-added-modal/funds-added-modal.scss";
import Modal from "../Modal";

const FundsClaimedModal = () => {
  const dispatch = useAppDispatch();
  const { claimAmount, claimAddress } = useAppSelector(o => o.wyre);
  const integerPart = Math.floor(claimAmount);
  const fractionalPart = claimAmount - integerPart;

  const onClose = () => {
    dispatch(setShowFundsClaimedModalAction(false));
  };

  return (
    <Modal>
      <ModalContent className="relative funds-added-modal" style={{ backgroundColor: colors.neutrals1 }} onClose={onClose}>
        <Block className="mt-32 text-center font-neutrals8">
          <H3>Funds Claimed</H3>
        </Block>
        <Block className="content-wrapper">
          <StyledDescription className="mt-10 mb-32 text-center">
            <Caption1>Your funds have been claimed by <strong>{(claimAddress.slice(0, 11) + "..." + claimAddress.slice(-4)).toLowerCase()}</strong></Caption1>
          </StyledDescription>
          <Block className="amount-image-container">
            <img src={fundsClaimedCardSrc} className="w-full" />

            <StyledAmountContainer className="amount-container">
              <img className="icon" src={usdcIcon} alt="USDC Icon" />
              <Block className="align-end">
                <StyledH3 className="font-neutrals8">
                  {integerPart.toLocaleString("en-US", { "maximumFractionDigits": 0 })}
                </StyledH3>
                <span className="fractional-part">{fractionalPart === 0 ? "" : fractionalPart.toLocaleString("en-US", { "maximumFractionDigits": 2 }).replace("0.", ".")}</span>
              </Block>
            </StyledAmountContainer>
          </Block>
          <ButtonPrimary className="mt-32 mb-10 w-full" onClick={onClose}>
            <FormattedMessage defaultMessage="Done" />
          </ButtonPrimary>
        </Block>
      </ModalContent>
    </Modal>
  );
};

const StyledAmountContainer = styled.div`
  width: 260px;
`;

const StyledDescription = styled.div`
  color: ${colors.neutrals4} !important;
  strong {
    color: ${colors.neutrals8} !important;
  }
`;

const StyledH3 = styled.span`
  ${getCSSOfStyledComponent(H3)}
  word-break: break-all;
`;

export default FundsClaimedModal;
