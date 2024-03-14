import { ethers } from "ethers";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import NumericFormat from "react-number-format";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNetwork } from "wagmi";

import emptyCreditCardSrc from "../../../assets/images/add-funds-modal/empty-credit-card.png";
import usdcIcon from "../../../assets/images/usdc.svg";
import { oceanaShareExContract } from "../../../core/constants/contract";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { useEthereum } from "../../../core/context/ethereum.context";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useBalance } from "../../../core/hooks/useBalance";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import {
  setShowClaimFundsModalAction,
  setShowClaimRejectedModalAction,
  setShowFundsClaimedModalAction,
  setShowOpeningWalletModalAction
} from "../../../core/store/slices/modalSlice";
import {
  cancelFunds,
  claimFunds,
  setClaimAddressThunk,
  setClaimAmountThunk,
  setIsClaimingThunk
} from "../../../core/store/slices/wyreSlice";
import { getCSSOfStyledComponent } from "../../../core/util/base.util";
import { howItWorksPath } from "../../../core/util/pathBuilder.util";
import {
  Unit,
  formatNumber,
  pixelToNumber
} from "../../../core/util/string.util";
import BackButton from "../../button/back-button/BackButton";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import {
  ActionButtonGroup,
  Block,
  ButtonPrimary,
  ButtonSecondary,
  Caption1,
  Caption1Bold,
  Caption2Bold,
  Flex,
  FundsManageModalContainer,
  H3,
  H4
} from "../../styleguide/styleguide";
import Tooltip from "../../tooltip/Tooltip";
import Modal from "../Modal";
import "../funds-added-modal/funds-added-modal.scss";
import WrongNetworkModal from "../wrong-network-modal/WrongNetworkModal";

interface IFormInput {
  amount: number | undefined;
  address: string;
}

const ClaimFundsModal = () => {
  const dispatch = useAppDispatch();
  const usdcBalance = useAppSelector((o) => o.user.usdcBalance);
  const { windowWidth } = useWatchResize();
  const { getUSDCBalance, transferUSDC } = useEthereum();
  const { chain } = useNetwork();
  const { syncBalance } = useBalance();

  const integerPart = Math.floor(usdcBalance);
  const fractionalPart = usdcBalance - integerPart;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<IFormInput>({
    defaultValues: {
      amount: undefined,
      address: ""
    },
    mode: "onChange"
  });

  const amount = watch("amount");

  if (chain?.unsupported) {
    return (
      <WrongNetworkModal
        onClose={() => dispatch(setShowClaimFundsModalAction(false))}
      />
    );
  }

  const onClose = () => {
    dispatch(setShowClaimFundsModalAction(false));
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (data.amount && data.address) {
      dispatch(setIsClaimingThunk(true));
      dispatch(setClaimAmountThunk(data.amount));
      dispatch(setClaimAddressThunk(data.address));

      transferUSDC(
        data.address,
        data.amount * 10 ** oceanaShareExContract.decimals,
        (txHash, confirmed) => {
          if (txHash && confirmed) {
            dispatch(
              claimFunds({
                amount: data.amount as number,
                address: data.address
              })
            );

            dispatch(setShowOpeningWalletModalAction({ showModal: false }));
            dispatch(setShowFundsClaimedModalAction(true));
            syncBalance();
          }
        },
        () => {
          dispatch(setShowOpeningWalletModalAction({ showModal: false }));
          dispatch(setShowClaimRejectedModalAction(true));
          dispatch(
            cancelFunds({ address: data.address, amount: data.amount || 0 })
          );
        }
      );

      dispatch(setShowClaimFundsModalAction(false));
      dispatch(setShowOpeningWalletModalAction({ showModal: true }));
    }
  };

  return (
    <StyledModal>
      <FundsManageModalContainer style={{ height: "auto" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {windowWidth <= pixelToNumber(RESPONSIVE.mobile) && (
            <>
              <BackButton onClose={onClose} />
              <Block className="h-32" />
            </>
          )}
          <Flex className="justify-between align-center">
            <H4 className="font-neutrals8">
              <FormattedMessage defaultMessage="Claim Funds" />
            </H4>
            {windowWidth > pixelToNumber(RESPONSIVE.mobile) && (
              <ModalCloseButton onClose={onClose} />
            )}
          </Flex>

          <Block className="h-32" />

          <Caption1 className="font-neutrals4">
            Transfer funds to anyone using their wallet address.
          </Caption1>
          <Tooltip
            tooltipBoxStyle={{ width: "50%" }}
            tooltip={
              <>
                <div className="tooltip-title">
                  <FormattedMessage defaultMessage="What's a wallet?" />
                </div>
                <div className="tooltip-text">
                  Wallets manage all your digital assets. They can be added as
                  either a browser extension or an app on your phone.{" "}
                  <Link
                    className="learn-more"
                    to={"/how-it-works?targetTab=1&targetIndex=faq01"}
                    target="_blank"
                  >
                    Learn more
                  </Link>
                </div>
              </>
            }
            position="bottom"
          >
            <Caption1Bold className="blue-link">{`What's a wallet?`}</Caption1Bold>
          </Tooltip>

          <Block className="h-32" />

          <Block className="amount-image-container">
            <img src={emptyCreditCardSrc} className="w-full z-1" />

            <CardContent className="amount-container z-10">
              <img className="icon" src={usdcIcon} alt="USDC Icon" />
              <Block className="align-end">
                <StyledH3 className="relative font-neutrals8">
                  {integerPart.toLocaleString("en-US", {
                    maximumFractionDigits: 0
                  })}
                  <StyledCaption2Bold className="absolute">
                    USDC Balance
                  </StyledCaption2Bold>
                </StyledH3>
                <span className="fractional-part">
                  {fractionalPart === 0
                    ? ""
                    : fractionalPart
                      .toLocaleString("en-US", { maximumFractionDigits: 2 })
                      .replace("0.", ".")}
                </span>
              </Block>
            </CardContent>
          </Block>

          <Block className="h-32" />

          <Block style={{ color: colors.neutrals8, marginBottom: "12px" }}>
            <Caption1Bold>Claim Amount</Caption1Bold>
          </Block>
          <Block className="amount-input-container">
            <Controller
              name="amount"
              control={control}
              rules={{
                max: {
                  value: usdcBalance + 0.001,
                  message: "Amount cannot exceed your USDC balance."
                },
                min: {
                  value: 0.01,
                  message: "Amount cannot be zero."
                },
                required: {
                  value: true,
                  message: "Amount is required."
                }
              }}
              render={({ field }) => (
                <NumericFormat
                  className={`amount-input ${errors.amount?.message ? "input-error" : ""
                  }`}
                  placeholder="Enter Amount"
                  value={field.value}
                  allowLeadingZeros={false}
                  allowNegative={false}
                  thousandSeparator=","
                  decimalScale={2}
                  onValueChange={(values) => {
                    const { value } = values;
                    field.onChange(value);
                  }}
                />
              )}
            />
            <AmountLabel className="font-neutrals4">USDC</AmountLabel>
          </Block>
          <Block className="h-32" />

          {(errors.amount?.message || amount) && (
            <Block className="subtext">
              {errors.amount?.message ? (
                <p className="error-message">{errors.amount?.message}</p>
              ) : (
                <p className="amount-usd">
                  {formatNumber({
                    value: amount,
                    unit: Unit.USD,
                    summarize: false,
                    withUnit: true
                  })}
                </p>
              )}
              <Block className="h-32" />
            </Block>
          )}

          <Block style={{ color: colors.neutrals8, marginBottom: "12px" }}>
            <Caption1Bold>Claim Recipient</Caption1Bold>
          </Block>
          <Block className="amount-input-container">
            <Controller
              name="address"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Wallet Address is required."
                },
                validate: (value) =>
                  ethers.utils.isAddress(value as string) ||
                  "Invalid wallet address."
              }}
              render={({ field }) => (
                <input
                  type="text"
                  className={`amount-input ${errors.address?.message ? "input-error" : ""
                  }`}
                  placeholder="Enter Wallet Address"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </Block>

          <Block className="h-32" />
          {errors.address?.message && (
            <Block className="subtext">
              {errors.address?.message && (
                <Block className="error-message flex align-center gap-2">
                  {errors.address?.message}
                  <Caption2Bold style={{ color: colors.primaryBlue }}>
                    <Link to={howItWorksPath(1, "faq01")} target="_blank">
                      Learn more
                    </Link>
                  </Caption2Bold>
                </Block>
              )}
              <Block className="h-32" />
            </Block>
          )}

          <ActionButtonGroup>
            <ButtonSecondary onClick={onClose}>Cancel</ButtonSecondary>
            <ButtonPrimary disabled={!isValid} type="submit">
              Claim Now
            </ButtonPrimary>
          </ActionButtonGroup>

          <Block className="h-32" />

          <Block className="text-center font-neutrals4">
            <Caption2Bold>
              Oceana does not own your wallet address and
            </Caption2Bold>
            <br />
            <Caption2Bold>cannot access your funds without your</Caption2Bold>
            <br />
            <Caption2Bold>confirmation.</Caption2Bold>
          </Block>
        </form>
        <div className="blur-box" style={{ top: "48%" }} />
      </FundsManageModalContainer>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)``;

const CardContent = styled.div`
  top: 55% !important;
  width: 300px !important;
`;

const AmountLabel = styled(Caption1)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translate(0, -50%);
`;

const StyledH3 = styled.span`
  ${getCSSOfStyledComponent(H3)}
  word-break: break-all;
`;

const StyledCaption2Bold = styled(Caption2Bold)`
  top: -20px;
  left: 0px;
  color: ${colors.neutrals5};
  width: 100px;
`;

export default ClaimFundsModal;
