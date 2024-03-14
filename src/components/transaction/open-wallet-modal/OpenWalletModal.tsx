import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { FavEntity } from "../../../../generated-graphql/graphql";
import { OrderType, Stage } from "../../../../generated-subgraph/graphql";
import { CURRENCY } from "../../../core/constants/base.const";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowOpeningWalletModalAction } from "../../../core/store/slices/modalSlice";
import { formatNumber, Unit } from "../../../core/util/string.util";
import InfoBox from "../../info/info-box/InfoBox";
import Loader from "../../loader/Loader";
import ModalContent from "../../modal/children/modal-content/ModalContent";
import Modal from "../../modal/Modal";
import { Block, ButtonPrimary, Caption, H3 } from "../../styleguide/styleguide";
import "../order-placed-modal/order-placed-modal.scss";
import "./open-wallet-modal.scss";

export interface IOpeningWalletModalProps {
  stage?: Stage;
  orderType?: OrderType;
  totalPrice?: number;
  fav?: FavEntity;
}
const OpenWalletModal = (props: IOpeningWalletModalProps) => {
  const dispatch = useAppDispatch();
  const { orderType, stage, totalPrice } = props;
  const { claimAmount, claimAddress } = useAppSelector(state => state.wyre);
  const formattedAmount = formatNumber({ value: claimAmount, unit: Unit.USDC, summarize: false, withUnit: true });
  const formattedAddress = (claimAddress.slice(0, 11) + "..." + claimAddress.slice(-4)).toLowerCase();

  const onClose = () => dispatch(setShowOpeningWalletModalAction({ showModal: false }));

  return (
    <Modal>
      <ModalContent className="open-wallet-modal" onClose={onClose}>
        <Loader />
        <StyledHeader>
          <H3>
            <FormattedMessage defaultMessage="Opening Wallet" />
          </H3>
        </StyledHeader>
        <Block className="mt-6 mb-32 text-center font-neutrals4">
          <Caption>
            <FormattedMessage
              defaultMessage="Follow wallet instructions to complete your {actionType}."
              values={{
                actionType: totalPrice ? "order" : "claim"
              }}
            />
          </Caption>
        </Block>
        <StyledInfoBox>
          {totalPrice ? (
            <FormattedMessage
              defaultMessage="You are placing {stage, select, null {a} other {a}} {orderType} order to {orderType} {price} {currency} of {coin}. Your pending {stage} order, if executed, will execute at your requested share price or better."
              values={{
                price: formatNumber({ value: totalPrice, unit: Unit.USDC, summarize: false }),
                stage:
                  stage == Stage.Limit
                    ? "limit"
                    : stage == Stage.Market
                      ? "market"
                      : null,
                orderType,
                currency: CURRENCY,
                coin: props.fav?.coin,
              }}
            />
          ) : (
            <span>You are claiming <strong>{formattedAmount}</strong> to <strong>{formattedAddress}</strong></span>
          )}
        </StyledInfoBox>
        <ButtonPrimary className="w-full mt-32" onClick={onClose}>
          <FormattedMessage defaultMessage="OK" />
        </ButtonPrimary>
      </ModalContent>
    </Modal>
  );
};

const StyledHeader = styled.div`
  margin-top: 24px;
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

export default OpenWalletModal;
