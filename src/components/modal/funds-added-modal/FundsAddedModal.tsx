import React from "react";
import { FormattedMessage } from "react-intl";

import checkedCreditCardSrc from "../../../assets/images/add-funds-modal/checked-credit-card.png";
import usdcIcon from "../../../assets/images/usdc.svg";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowFundsAddedModalAction } from "../../../core/store/slices/modalSlice";
import { Block, ButtonPrimary, Caption1, Flex, H3 } from "../../styleguide/styleguide";
import ModalContent from "../children/modal-content/ModalContent";
import Modal from "../Modal";
import "./funds-added-modal.scss";

const FundsAddedModal = () => {
  const dispatch = useAppDispatch();
  const { depositAmount } = useAppSelector(o => o.wyre);
  const integerPart = Math.floor(depositAmount);
  const fractionalPart = depositAmount - integerPart;

  const onClose = () => {
    dispatch(setShowFundsAddedModalAction(false));
  };

  return (
    <Modal>
      <ModalContent className="relative funds-added-modal" onClose={onClose}>
        <Block className="mt-32 text-center font-neutrals8">
          <H3>Funds Added</H3>
        </Block>
        <Block className="content-wrapper">
          <Block className="mt-10 mb-32 text-center font-neutrals4">
            <Caption1>It takes <strong>~10 seconds</strong> for the new funds to show up.</Caption1>
          </Block>
          <Block className="amount-image-container">
            <img src={checkedCreditCardSrc} className="w-full" />

            <Block className="amount-container">
              <img className="icon" src={usdcIcon} alt="USDC Icon" />
              <Flex className="align-end">
                <H3 className="font-neutrals8">{integerPart.toLocaleString("en-US", { "maximumFractionDigits": 0 })}</H3>
                <p className="fractional-part">{fractionalPart === 0 ? "" : fractionalPart.toLocaleString("en-US", { "maximumFractionDigits": 2, "minimumFractionDigits": 2 }).replace("0.", ".")}</p>
              </Flex>
            </Block>
          </Block>
          <ButtonPrimary className="mt-32 mb-10 w-full" onClick={onClose}>
            <FormattedMessage defaultMessage="Done" />
          </ButtonPrimary>
        </Block>
        <Block className="blur-box" />
      </ModalContent>
    </Modal>
  );
};

export default FundsAddedModal;
