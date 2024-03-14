import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import NumericFormat from "react-number-format";
import styled from "styled-components";
import { useAccount, useNetwork } from "wagmi";

import { getDailyDepositLimit } from "../../../api/daily-deposit-limit";
import { useEthereum } from "../../../core/context/ethereum.context";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useBalance } from "../../../core/hooks/useBalance";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import {
  setShowAddFundsCanceledModalAction,
  setShowAddFundsModalAction,
  setShowImportTokenModalAction
} from "../../../core/store/slices/modalSlice";
import {
  addFunds,
  setDepositAmountThunk,
  setIsDepositingThunk
} from "../../../core/store/slices/wyreSlice";
import { Unit, formatNumber } from "../../../core/util/string.util";
import BackButton from "../../button/back-button/BackButton";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import Loader from "../../loader/Loader";
import {
  ActionButtonGroup,
  Block,
  Body1Bold,
  ButtonPrimary,
  ButtonSecondary,
  Caption1,
  Caption2Bold,
  Flex,
  FundsManageModalContainer,
  H4
} from "../../styleguide/styleguide";
import TabSwitcher from "../../tabs/tab-switcher/TabSwitcher";
import Modal from "../Modal";
import WrongNetworkModal from "../wrong-network-modal/WrongNetworkModal";

import creditCardSrc from "../../../assets/images/add-funds-modal/credit-card.png";
import walletSrc from "../../../assets/images/wallet-icon.svg";
import { colors } from "../../../core/constants/styleguide.const";
import { oceanaUSDCContract } from "../../../core/constants/contract";

interface IFormInput {
  amount: number | undefined;
}
const LIMIT_PER_DEPOSIT = 500;
const LIMIT_PER_DAY = 650;
const mobileWidth = 375;

const AddFundsModal = () => {
  const dispatch = useAppDispatch();
  const { getUSDCBalance } = useEthereum();
  const { chain } = useNetwork();
  const { windowWidth } = useWatchResize();
  const { connector } = useAccount();
  const { syncBalance } = useBalance();

  const { depositAmount, depositing } = useAppSelector((o) => o.wyre);

  const [tabIndex, setTabIndex] = useState(0);
  const [todaysDepositAmount, setTodaysDepositAmount] = useState<number>(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch
  } = useForm<IFormInput>({
    defaultValues: {
      amount: depositing ? depositAmount : undefined
    },
    mode: "onChange"
  });
  const amount = watch("amount");
  const overflownDailyLimit =
    +(amount || 0) + todaysDepositAmount > LIMIT_PER_DAY;
  const limitErrorMsg = overflownDailyLimit
    ? `Daily limit cannot exceed ${LIMIT_PER_DAY} USDC`
    : (amount || 0) > LIMIT_PER_DEPOSIT
      ? `Amount cannot exceed ${LIMIT_PER_DEPOSIT} USDC.`
      : "";

  useEffect(() => {
    getDailyDepositLimit().then((res) => setTodaysDepositAmount(res as number));
  }, []);

  if (chain?.unsupported) {
    return (
      <WrongNetworkModal
        onClose={() => dispatch(setShowAddFundsModalAction(false))}
      />
    );
  }

  const onClose = () => {
    dispatch(setShowAddFundsModalAction(false));
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.amount) {
      try {
        const isMetaMask = connector?.id === "metaMask";

        // check if ocnUSDC token is already added to metamask. coinbase supports auto tracking token
        if (isMetaMask) {
          dispatch(setShowImportTokenModalAction(true));
          // inject a provider manually
          window.ethereum = await connector.getProvider();
          // wasAdded is a boolean. Like any RPC method, an error may be thrown.
          await (window as any)?.ethereum?.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20", // Initially only supports ERC20, but eventually more!
              options: {
                address: oceanaUSDCContract.address, // The address that the token is at.
                symbol: oceanaUSDCContract.symbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: oceanaUSDCContract.decimals, // The number of decimals in the token
                image: oceanaUSDCContract.iconUrl // A string url of the token logo
              }
            }
          });
          dispatch(setShowImportTokenModalAction(false));
        }

        // add funds
        dispatch(setIsDepositingThunk(true));
        dispatch(setDepositAmountThunk(data.amount));
        dispatch(addFunds(data.amount)).then(() => {
          syncBalance();
        });
      } catch (e) {
        console.error(e);
        dispatch(setShowImportTokenModalAction(false));
        dispatch(
          setShowAddFundsCanceledModalAction({
            showModal: true,
            props: {
              amount: data.amount
            }
          })
        );
      }
    }
  };

  return (
    <Modal>
      <FundsManageModalContainer>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Block>
            {windowWidth <= mobileWidth && (
              <>
                <BackButton onClose={onClose} />
                <Block className="h-32" />
              </>
            )}
            <Flex className="justify-between align-center">
              <H4 className="font-neutrals8">
                <FormattedMessage defaultMessage="Add Funds" />
              </H4>
              {windowWidth > mobileWidth && (
                <ModalCloseButton onClose={onClose} />
              )}
            </Flex>
            <Block className="h-32" />
            <TabSwitcher
              active={tabIndex}
              setFilterAction={setTabIndex}
              listOfButtons={["Use Credit Card", "Deposit USDC"]}
            />
          </Block>
          <Block className="h-32" />

          {tabIndex === 0 ? (
            <>
              <StyledImg
                src={creditCardSrc}
                className="w-full z-1"
                alt="Card"
              />
              <Block className="h-32" />

              <div className="amount-input-container">
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    max: {
                      value: overflownDailyLimit ? -1 : LIMIT_PER_DEPOSIT,
                      message: ""
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
                      className={`amount-input ${
                        !isValid && isDirty ? "input-error" : ""
                      }`}
                      placeholder="Enter Amount"
                      value={field.value}
                      allowLeadingZeros={false}
                      allowNegative={false}
                      thousandSeparator=","
                      decimalScale={2}
                      disabled={depositing}
                      onValueChange={(values) => {
                        const { value } = values;
                        if (isNaN(Number(value))) return false;
                        field.onChange(value);
                      }}
                    />
                  )}
                />
                <AmountLabel>USDC</AmountLabel>
              </div>
              <Block className="h-32" />

              {(limitErrorMsg || errors.amount?.message || amount) && (
                <div className="subtext">
                  {limitErrorMsg || errors.amount?.message ? (
                    <p className="error-message">
                      {limitErrorMsg || errors.amount?.message}
                    </p>
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
                </div>
              )}

              <ActionButtonGroup>
                {!depositing && (
                  <ButtonSecondary onClick={onClose}>Cancel</ButtonSecondary>
                )}
                <ButtonPrimary disabled={!isValid || depositing}>
                  {depositing ? (
                    <>
                      <Loader />
                      <span>Adding...</span>
                    </>
                  ) : (
                    "Add Now"
                  )}
                </ButtonPrimary>
              </ActionButtonGroup>

              <Block className="h-32" />

              <Block className="text-center">
                <Caption2Bold className="font-neutrals4">
                  This credit card is our gift to you, beta user.
                </Caption2Bold>
                <br />
                <Caption2Bold className="font-neutrals4">
                  Please enjoy irresponsibly!
                </Caption2Bold>
              </Block>
            </>
          ) : (
            <>
              <ComingSoonContainer>
                <img src={walletSrc} className="pb-36" />
                <Body1Bold className="text-center font-neutrals8">
                  Coming Soon
                </Body1Bold>
                <Caption1 className="pt-8 font-neutrals4">
                  Really soon...
                </Caption1>
              </ComingSoonContainer>

              <Block className="h-32" />

              <ButtonPrimary className="w-full mb-16" onClick={onClose}>
                {" "}
                OK{" "}
              </ButtonPrimary>
            </>
          )}
        </form>
        {tabIndex === 0 && <div className="blur-box" />}
      </FundsManageModalContainer>
    </Modal>
  );
};

const StyledImg = styled.img`
  height: 243px;
  @media screen and (max-width: 660px) {
    height: auto;
  }
`;

const ComingSoonContainer = styled.div`
  height: 389px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 660px) {
    height: 337px;
  }
`;

const AmountLabel = styled(Caption1)`
  position: absolute;
  color: ${colors.neutrals4};
  right: 12px;
  top: 50%;
  transform: translate(0, -50%);
`;

export default AddFundsModal;
