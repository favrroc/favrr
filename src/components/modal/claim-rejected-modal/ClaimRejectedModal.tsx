import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { colors } from "../../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowClaimRejectedModalAction } from "../../../core/store/slices/modalSlice";
import { formatNumber, Unit } from "../../../core/util/string.util";
import InfoBox from "../../info/info-box/InfoBox";
import { ButtonPrimary, H3 } from "../../styleguide/styleguide";
import ModalContent from "../children/modal-content/ModalContent";
import Modal from "../Modal";

import { RESPONSIVE } from "../../../core/constants/responsive.const";

const ClaimRejectedModal = () => {
  const dispatch = useAppDispatch();
  const { claimAmount, claimAddress } = useAppSelector(state => state.wyre);
  const formattedAmount = formatNumber({ value: claimAmount, unit: Unit.USDC, summarize: false, withUnit: true });
  const formattedAddress = (claimAddress.slice(0, 11) + "..." + claimAddress.slice(-4)).toLowerCase();

  const closeModal = () => {
    dispatch(setShowClaimRejectedModalAction(false));
  };

  return (
    <Modal>
      <ModalContent onClose={closeModal}>
        <StyledHeader>
          <H3>
            <FormattedMessage defaultMessage="Claim Rejected" />
          </H3>
        </StyledHeader>
        <StyledInfoBox pink={true}>
          Your claim of <strong>{formattedAmount}</strong> to <strong>{formattedAddress}</strong> has been rejected.
        </StyledInfoBox>
        <ButtonPrimary className="w-full mt-32" onClick={closeModal}>
          <FormattedMessage defaultMessage="OK" />
        </ButtonPrimary>
      </ModalContent>
    </Modal>
  );
};

const StyledHeader = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  color: ${colors.neutrals7};
  text-align: center;

  @media (max-width: ${RESPONSIVE.small}) {
    margin-top: 12px;
  }
`;

const StyledInfoBox = styled(InfoBox)`
  color: ${colors.neutrals6} !important;
  strong {
    color: ${colors.neutrals8} !important;
  }
`;

export default ClaimRejectedModal;
