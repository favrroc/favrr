import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { Address } from "viem";

import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { useEthereum } from "../../../core/context/ethereum.context";
import { useAppDispatch } from "../../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../../core/hooks/useLowercasedAccount";
import { setShowSignRejectedModalAction } from "../../../core/store/slices/modalSlice";
import { FavrrIconImage } from "../../assets/app-images/AppImages";
import InfoBox from "../../info/info-box/InfoBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  Flex,
  H3
} from "../../styleguide/styleguide";
import Modal from "../Modal";
import ModalContent from "../children/modal-content/ModalContent";

const SignRejectedModal = () => {
  const dispatch = useAppDispatch();
  const { signMessage } = useEthereum();
  const { address } = useLowercasedAccount();

  const closeModal = () => {
    dispatch(setShowSignRejectedModalAction(false));
  };

  const handleRetry = () => {
    signMessage(address as Address);
  };

  return (
    <Modal>
      <ModalContent onClose={closeModal}>
        <Flex style={{ justifyContent: "center" }}>
          <FavrrIconImage />
        </Flex>
        <StyledHeader>
          <H3>
            <FormattedMessage defaultMessage="Sign Rejected" />
          </H3>
        </StyledHeader>
        <StyledInfoBox pink={true}>
          {`To connect to your wallet you'll first need to sign the signature request.`}
        </StyledInfoBox>
        <StyledButtonGroup>
          <ButtonPrimary className="w-full mt-32" onClick={handleRetry}>
            <FormattedMessage defaultMessage="Retry" />
          </ButtonPrimary>
          <ButtonSecondary
            className="w-full mt-32"
            onClick={closeModal}
            style={{ marginTop: "12px" }}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </ButtonSecondary>
        </StyledButtonGroup>
      </ModalContent>
    </Modal>
  );
};

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

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
  color: ${colors.neutrals6};
  strong {
    color: ${colors.neutrals8};
  }
`;

export default SignRejectedModal;
