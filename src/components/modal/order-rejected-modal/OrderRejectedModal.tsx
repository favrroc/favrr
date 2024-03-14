import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { FavEntity } from "../../../../generated-graphql/graphql";
import { OrderType } from "../../../../generated-subgraph/graphql";
import { colors } from "../../../core/constants/styleguide.const";
import { useAppDispatch } from "../../../core/hooks/rtkHooks";
import { setShowOrderRejectedModalAction } from "../../../core/store/slices/modalSlice";
import { formatNumber, Unit } from "../../../core/util/string.util";
import InfoBox from "../../info/info-box/InfoBox";
import { ButtonPrimary, H3 } from "../../styleguide/styleguide";
import ModalContent from "../children/modal-content/ModalContent";
import Modal from "../Modal";

import { RESPONSIVE } from "../../../core/constants/responsive.const";

export interface IOrderRejectedModalProps {
  orderType?: OrderType;
  totalPrice?: number;
  fav?: FavEntity;
}
const OrderRejectedModal = (props: IOrderRejectedModalProps) => {
  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(setShowOrderRejectedModalAction({ showModal: false }));
  };

  return (
    <Modal>
      <ModalContent onClose={closeModal}>
        <StyledHeader>
          <H3>
            <FormattedMessage defaultMessage="Order Rejected" />
          </H3>
        </StyledHeader>
        <StyledInfoBox>
          Your order to {props.orderType} <strong>{formatNumber({ value: props.totalPrice, unit: Unit.USDC, summarize: false, withUnit: true })}</strong> {formatNumber({ value: props.totalPrice, unit: Unit.USD, summarize: false, withUnit: true })} of <strong>{props.fav?.coin}</strong> has been rejected.
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

export default OrderRejectedModal;
