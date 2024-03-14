import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { useAppDispatch } from "../../../core/hooks/rtkHooks";
import { setShowImportTokenModalAction } from "../../../core/store/slices/modalSlice";
import InfoBox from "../../info/info-box/InfoBox";
import { ButtonPrimary, Caption1, H3 } from "../../styleguide/styleguide";
import ModalContent from "../children/modal-content/ModalContent";
import Modal from "../Modal";

import { colors } from "../../../core/constants/styleguide.const";
import Loader from "../../loader/Loader";
import "../funds-added-modal/funds-added-modal.scss";

const ImportTokenModal = () => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(setShowImportTokenModalAction(false));
  };

  return (
    <Modal>
      <ModalContent className="relative funds-added-modal" style={{ backgroundColor: colors.neutrals1 }} onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Loader />
          <StyledCaption>Confirm on Wallet</StyledCaption>
          <StyledDescription>Follow wallet instructions to add funds.</StyledDescription>
        </div>
        <StyledInfoBox>
          {`Be sure to add Oceana's custom token `}<strong>ocnUSDC</strong>{` to your wallet.`}
        </StyledInfoBox>
        <ButtonPrimary className="mt-32 mb-10 w-full" disabled={true}>
          <FormattedMessage defaultMessage="Waiting..." />
        </ButtonPrimary>
      </ModalContent>
    </Modal>
  );
};

const StyledCaption = styled(H3)`
  margin-top: 24px;
  text-align: center;
  color: ${colors.neutrals8};
`;
const StyledDescription = styled(Caption1)`
  margin-top: 6px;
  text-align: center;
  color: ${colors.neutrals4};
`;
const StyledInfoBox = styled(InfoBox)`
  margin-top: 32px;
  color: ${colors.neutrals6};
  strong {
    color: ${colors.neutrals8};
  }
`;

export default ImportTokenModal;
