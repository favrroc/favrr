import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { useAppDispatch } from "../../../core/hooks/rtkHooks";
import { setshowSigningModalAction } from "../../../core/store/slices/modalSlice";
import Loader from "../../loader/Loader";
import { ButtonSecondary, Caption1, Flex, H3 } from "../../styleguide/styleguide";
import Modal from "../Modal";
import ModalContent from "../children/modal-content/ModalContent";

const SigningModal = () => {
  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(setshowSigningModalAction( false ));
  };

  return (
    <Modal>
      <ModalContent onClose={closeModal}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Flex style={{ justifyContent: "center" }}>
            <Loader />
          </Flex>
          <StyledHeader>
            <H3>
              <FormattedMessage defaultMessage="Sign Wallet" />
            </H3>
          </StyledHeader>
          <Caption1 style={{ color: colors.neutrals4, textAlign: "center" }}>{`Sign the message in your wallet to connect safely.`}</Caption1>
        </div>
        <StyledButtonGroup>
          <StyledButtonWaitting>
            <FormattedMessage defaultMessage="Waiting..." />
          </StyledButtonWaitting>
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
  margin-bottom: 6px;
  color: ${colors.neutrals7};
  text-align: center;

  @media (max-width: ${RESPONSIVE.small}) {
    margin-top: 12px;
  }
`;

const StyledButtonWaitting = styled(ButtonSecondary)`
  margin-top: 32px;
  background-color: ${colors.neutrals4};

  &:hover {
    transition: none;
    cursor: default;
    box-shadow: none;
    border-width: none;
  }
`;

export default SigningModal;
