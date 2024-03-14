import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { useAppDispatch } from "../../core/hooks/rtkHooks";
import { setShowAddFundsCanceledModalAction } from "../../core/store/slices/modalSlice";
import { formatNumber, Unit } from "../../core/util/string.util";
import { FavrrIconImage } from "../assets/app-images/AppImages";
import InfoBox from "../info/info-box/InfoBox";
import { ButtonPrimary, Flex, H3 } from "../styleguide/styleguide";
import ModalContent from "./children/modal-content/ModalContent";
import Modal from "./Modal";

export interface IAddFundsCanceledModalProps {
  amount?: number;
}
const AddFundsCanceledModal = (props: IAddFundsCanceledModalProps) => {
  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(setShowAddFundsCanceledModalAction({ showModal: false }));
  };

  return (
    <Modal>
      <ModalContent onClose={closeModal}>
        <Flex style={{ justifyContent: "center" }}>
          <FavrrIconImage />
        </Flex>
        <StyledHeader>
          <H3>
            <FormattedMessage defaultMessage="Add Funds Canceled" />
          </H3>
        </StyledHeader>
        <StyledInfoBox pink={true}>
          Your request to add <strong>{formatNumber({ value: props.amount, unit: Unit.USDC, summarize: false, withUnit: true })}</strong> {formatNumber({ value: props.amount, unit: Unit.USD, summarize: false, withUnit: true })} has been canceled.
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
  color: ${colors.neutrals6};
  strong {
    color: ${colors.neutrals8};
  }
`;

export default AddFundsCanceledModal;
