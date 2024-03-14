import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import NumericFormat from "react-number-format";
import { HashLink } from "react-router-hash-link";
import styled from "styled-components";
import { useNetwork } from "wagmi";

import {
  FavEntity,
  LimitOrderEntity,
  LimitOrderStatus,
  LimitOrderType,
  NotificationStatus
} from "../../../../generated-graphql/graphql";
import {
  FavInfo,
  OrderType,
  Stage
} from "../../../../generated-subgraph/graphql";
import { CURRENCY } from "../../../core/constants/base.const";
import { useEthereum } from "../../../core/context/ethereum.context";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import {
  setShowAddFundsModalAction,
  setShowBuySellModal,
  setShowOpeningWalletModalAction,
  setShowOrderPlacedModal,
  setShowOrderRejectedModalAction
} from "../../../core/store/slices/modalSlice";
import * as userActions from "../../../core/store/slices/userSlice";
import { delay } from "../../../core/util/base.util";
import { howItWorksPath } from "../../../core/util/pathBuilder.util";
import { formatNumber, Unit } from "../../../core/util/string.util";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import ModalContent from "../../modal/children/modal-content/ModalContent";
import Modal from "../../modal/Modal";
import WrongNetworkModal from "../../modal/wrong-network-modal/WrongNetworkModal";
import {
  ActionButtonGroup,
  ButtonPrimary,
  ButtonSecondary,
  Flex,
  H4
} from "../../styleguide/styleguide";
import TabSwitcher from "../../tabs/tab-switcher/TabSwitcher";
import Tooltip, { TooltipBody, TooltipTitle } from "../../tooltip/Tooltip";

import errorSrc from "../../../assets/images/error.svg";
import infoSrc from "../../../assets/images/info.svg";
import { oceanaShareExContract } from "../../../core/constants/contract";
import { useBalance } from "../../../core/hooks/useBalance";
import { useLowercasedAccount } from "../../../core/hooks/useLowercasedAccount";
import "./buy-sell-modal.scss";

const intlMessages = defineMessages({
  inputErrorZero: {
    defaultMessage: "Shares cannot be zero"
  },
  inputAboveLimit: {
    defaultMessage: "Shares must be less than {sharesLeft}"
  },
  priceErrorZero: {
    defaultMessage: "Limit share price cannot be zero"
  }
});

export interface IBuySellModalProps {
  fav: FavEntity;
  isIPO: boolean;
  orderType: OrderType;
  favInfo: FavInfo;
  holdingShares: number;
}

const BuySellModal = (props: IBuySellModalProps) => {
  const { fav, isIPO, orderType, favInfo, holdingShares } = props;
  const dispatch = useAppDispatch();
  const {
    buyFromIPO,
    getTotalPriceForMarketBuy,
    getTotalPriceForMarketSell,
    marketBuy,
    marketSell,
    limitBuy,
    limitSell
  } = useEthereum();
  const { address, isConnected } = useLowercasedAccount();
  const { chain } = useNetwork();
  const { syncBalance } = useBalance();
  const intl = useIntl();

  const { usdcBalance } = useAppSelector((state) => state.user);

  let _totalPrice = 0;
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.Ipo);
  const [limitSharePriceInput, setLimitSharePriceInput] = useState("");
  const [marketShareInputText, setMarketShareInputText] = useState("");
  const [limitShareInputText, setLimitShareInputText] = useState("");
  const [transactionErrorMessage, setTransactionErrorMessage] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const [inputPriceErrorMessage, setInputPriceErrorMessage] = useState("");
  const [confirmedLimitPrice, setConfirmedLimitPrice] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const sharesLeft = isIPO
    ? favInfo.availableSupply
    : orderType == OrderType.Buy
      ? favInfo.amountInPool - favInfo.minAmountInPool
      : holdingShares;

  const pps: number = useMemo(() => {
    return isIPO ? favInfo.ipoPrice : favInfo.marketPrice;
  }, [isIPO, favInfo]);

  const tokenInputText =
    currentStage == Stage.Market ? marketShareInputText : limitShareInputText;
  const setTokenInputText =
    currentStage == Stage.Market
      ? setMarketShareInputText
      : setLimitShareInputText;

  const tokenNumber = +tokenInputText;
  const favId = fav.id;

  const handleCloseModal = () => {
    dispatch(setShowBuySellModal({ showModal: false }));
  };

  useEffect(() => {
    syncBalance();
  }, []);

  useEffect(() => {
    setInputPriceErrorMessage("");
    setTransactionErrorMessage("");
    setInputErrorMessage("");
  }, [currentStage]);

  useEffect(() => {
    setCurrentStage(isIPO ? Stage.Ipo : Stage.Market);
  }, [isIPO]);

  const updateTotalPrice = async () => {
    _totalPrice =
      currentStage === Stage.Limit
        ? +limitSharePriceInput * tokenNumber
        : currentStage === Stage.Ipo
          ? tokenNumber * pps
          : orderType === OrderType.Buy
            ? await getTotalPriceForMarketBuy(favId, tokenNumber)
            : await getTotalPriceForMarketSell(favId, tokenNumber);

    setTotalPrice(_totalPrice);
  };

  // set totalPrice
  useEffect(() => {
    setDisabledSubmit(false);
    setInputErrorMessage("");
    updateTotalPrice();
  }, [orderType, currentStage, tokenNumber]);

  const validatePriceInput = () => {
    if (+limitSharePriceInput === 0) {
      setInputPriceErrorMessage(
        intl.formatMessage(intlMessages.priceErrorZero)
      );
      return false;
    }

    if (inputPriceErrorMessage) {
      setInputPriceErrorMessage("");
    }

    return true;
  };

  const validateInput = () => {
    if (tokenNumber === 0) {
      setInputErrorMessage(intl.formatMessage(intlMessages.inputErrorZero));
      return false;
    }
    if (tokenNumber > sharesLeft) {
      setInputErrorMessage(
        intl.formatMessage(intlMessages.inputAboveLimit, {
          sharesLeft: sharesLeft
        })
      );
      return false;
    }

    if (inputErrorMessage) {
      setInputErrorMessage("");
    }

    return true;
  };

  const walletConfirmTransaction = (hash: string, confirmed: boolean) => {
    handleCloseModal();
    dispatch(setShowOpeningWalletModalAction({ showModal: false }));

    if (isConnected && address) {
      if (confirmed) {
        dispatch(
          userActions.createNotification({
            txHash: hash,
            address: address,
            status: NotificationStatus.Unread
          })
        );
      } else {
        dispatch(
          userActions.addToUserTransactions({
            id: hash,
            address: address,
            createdAt: dayjs().valueOf(), // milliseconds
            favId: favId,
            amount: tokenNumber,
            stage: currentStage,
            type: orderType,
            pps: totalPrice / tokenNumber,
            ppsBefore: pps,
            status: LimitOrderStatus.Opened
          })
        );
        dispatch(
          userActions.updateNotificationStatusByTxHash({
            txHash: hash,
            status: NotificationStatus.Unread
          })
        );
      }
    }

    dispatch(
      setShowOrderPlacedModal({
        showModal: true,
        props: {
          transactionHash: hash,
          stage: currentStage,
          orderType: orderType,
          amount: tokenNumber,
          totalPrice: totalPrice,
          tokenName: fav.coin as string,
          orderStatus: confirmed
            ? LimitOrderStatus.Fulfilled
            : LimitOrderStatus.Opened
        }
      })
    );
  };

  const walletRejectTransaction = async () => {
    const { payload } = await dispatch(
      userActions.createRejectedOrder({
        favId: favId,
        type:
          orderType == OrderType.Buy ? LimitOrderType.Buy : LimitOrderType.Sell,
        price: pps * 10 ** oceanaShareExContract.decimals,
        amount: tokenNumber,
        stage: currentStage
      })
    );

    // create notification on the backend
    // set tx status of txHash to Unread on the store
    dispatch(
      userActions.createNotification({
        txHash: (payload as LimitOrderEntity).id as string,
        address: address as string,
        status: NotificationStatus.Unread
      })
    );

    // give a few seconds to the backend :)
    await delay(5);

    dispatch(setShowOpeningWalletModalAction({ showModal: false }));
    dispatch(
      setShowOrderRejectedModalAction({
        showModal: true,
        props: {
          orderType,
          totalPrice,
          fav
        }
      })
    );
  };

  const submit = async () => {
    if (currentStage === Stage.Limit) {
      if (!validatePriceInput() || (confirmedLimitPrice && !validateInput()))
        return;
    } else {
      if (!validateInput()) return;
    }

    if (!favId) return;
    setTransactionErrorMessage("");

    if (currentStage === Stage.Limit) {
      if (!confirmedLimitPrice) {
        setConfirmedLimitPrice(true);
        return;
      } else {
        setDisabledSubmit(true);
        // set approval if not approved
        if (orderType == OrderType.Buy) {
          limitBuy(totalPrice);
        } else if (orderType == OrderType.Sell) {
          limitSell();
        }

        // create limit order on the backend
        // add limit order to the store
        // add user transaction to the store
        const { payload } = await dispatch(
          userActions.createLimitOrder({
            favId,
            type:
              orderType == OrderType.Buy
                ? LimitOrderType.Buy
                : LimitOrderType.Sell,
            price: +limitSharePriceInput * 10 ** oceanaShareExContract.decimals,
            amount: tokenNumber,
            status: LimitOrderStatus.Opened
          })
        );

        // create notification on the backend
        // set tx status of txHash to Unread on the store
        dispatch(
          userActions.createNotification({
            txHash: (payload as LimitOrderEntity).id as string,
            address: address as string,
            status: NotificationStatus.Unread
          })
        );

        // give a few seconds to the backend :)
        await delay(5);

        handleCloseModal();

        // display transaction modal
        dispatch(
          setShowOrderPlacedModal({
            showModal: true,
            props: {
              transactionHash: (payload as LimitOrderEntity).id || "",
              stage: Stage.Limit,
              orderType: orderType,
              amount: tokenNumber,
              totalPrice,
              tokenName: fav.coin as string,
              orderStatus: LimitOrderStatus.Opened
            }
          })
        );
      }
    } else if (currentStage == Stage.Ipo) {
      if (totalPrice > usdcBalance) {
        setInputErrorMessage("Insufficient USDC.");
        setDisabledSubmit(true);
      } else {
        handleCloseModal();
        dispatch(
          setShowOpeningWalletModalAction({
            showModal: true,
            props: {
              stage: currentStage,
              orderType: orderType,
              totalPrice: totalPrice,
              fav: fav
            }
          })
        );
        buyFromIPO(
          favId,
          pps,
          tokenNumber,
          walletConfirmTransaction,
          walletRejectTransaction
        );
      }
    } else {
      if (orderType == OrderType.Buy) {
        if (totalPrice > usdcBalance) {
          setInputErrorMessage("Insufficient USDC.");
          setDisabledSubmit(true);
        } else {
          handleCloseModal();
          dispatch(
            setShowOpeningWalletModalAction({
              showModal: true,
              props: {
                stage: currentStage,
                orderType: orderType,
                totalPrice: totalPrice,
                fav: fav
              }
            })
          );
          marketBuy(
            favId,
            totalPrice,
            tokenNumber,
            walletConfirmTransaction,
            walletRejectTransaction
          );
        }
      } else if (orderType == OrderType.Sell) {
        handleCloseModal();
        dispatch(
          setShowOpeningWalletModalAction({
            showModal: true,
            props: {
              stage: currentStage,
              orderType: orderType,
              totalPrice: totalPrice,
              fav: fav
            }
          })
        );
        marketSell(
          favId,
          tokenNumber,
          walletConfirmTransaction,
          walletRejectTransaction
        );
      }
    }
  };

  const renderNonLimitInputForm = () => (
    <>
      <NumericFormat
        className="number-tokens-input"
        placeholder="0"
        value={tokenInputText}
        allowLeadingZeros={false}
        allowNegative={false}
        thousandSeparator=","
        autoFocus
        decimalScale={0}
        isAllowed={(values) => {
          const { value } = values;
          return +value <= sharesLeft;
        }}
        onValueChange={(values) => {
          const { value } = values;
          setTokenInputText(value);
        }}
      />
      <div className="text-center">
        <FormattedMessage
          defaultMessage="Enter Value in <blue>Shares</blue>"
          values={{
            blue: (content: JSX.Element) => (
              <span className="almost-white">{content}</span>
            )
          }}
        />
      </div>
      {inputErrorMessage ? (
        <div className="input-error-label text-center">{inputErrorMessage}</div>
      ) : (
        <div className="remaining-shares-count">
          <FormattedMessage
            defaultMessage="{tokens} Available"
            values={{
              tokens: formatNumber({
                value: sharesLeft,
                unit: Unit.SHARE,
                summarize: false
              })
            }}
          />
        </div>
      )}
    </>
  );

  const renderLimitInputForm = () => (
    <>
      <NumericFormat
        className="token-price-input"
        placeholder="0"
        value={limitSharePriceInput}
        allowLeadingZeros={false}
        allowNegative={false}
        thousandSeparator=","
        autoFocus
        decimalScale={oceanaShareExContract.decimals}
        onValueChange={(values) => {
          const { value } = values;
          setLimitSharePriceInput(value);
        }}
      />
      <div className="text-center">
        <FormattedMessage defaultMessage="Enter Limit Share Price" />
      </div>
      {inputPriceErrorMessage && (
        <div className="input-error-label text-center">
          {inputPriceErrorMessage}
        </div>
      )}
    </>
  );

  const renderSummaryInfo = () => (
    <div className="summary-info">
      <div className="price-row">
        <span className="price-field">Your Balance</span>
        <span className="price-value">
          {formatNumber({
            value: usdcBalance,
            unit: Unit.USDC,
            summarize: false,
            withUnit: true
          })}
        </span>
      </div>
      {(currentStage == Stage.Market || isIPO) && (
        <div className="price-row">
          <span className="price-field">
            {isIPO ? (
              <FormattedMessage defaultMessage="Price Per Share" />
            ) : (
              <FormattedMessage defaultMessage="Average Share Price" />
            )}
            {!isIPO &&
              currentStage == Stage.Market &&
              renderAvgSharePriceToolTip()}
          </span>
          <span className="price-value">
            {formatNumber({
              value: pps,
              unit: Unit.USDC,
              summarize: false,
              withUnit: true
            })}
          </span>
        </div>
      )}
      <div className="price-row total-price-row">
        <span className="price-field">
          <FormattedMessage defaultMessage="Total Price" />
        </span>
        <span className="price-value total-value">
          {formatNumber({
            value: totalPrice,
            unit: Unit.USDC,
            summarize: false,
            withUnit: true
          })}
          <span className="usd-value">
            {formatNumber({
              value: totalPrice,
              unit: Unit.USD,
              summarize: false,
              withUnit: true
            })}
          </span>
        </span>
      </div>
    </div>
  );

  const renderLimitBuySellDescription = () => {
    if (!confirmedLimitPrice) {
      return (
        <>
          <div className="explanation-title">
            <FormattedMessage
              defaultMessage="What's a limit {transactionType, select, BUY {buy} other {sell}}?"
              values={{ transactionType: orderType }}
            />
          </div>
          <div className="explanation-text">
            {orderType == OrderType.Buy ? (
              <FormattedMessage defaultMessage="A limit buy lets you specify the price per share you’d like to pay. Your pending limit order, if executed, will execute at your requested share price or better." />
            ) : (
              <FormattedMessage defaultMessage="A limit sell lets you specify the sale price per share you’d like to receive. Limit sells will not complete (fill) until a buyer is willing to buy your shares at the limit sell price you set, or higher. It is possible your sell order may not fill, or only partially fill." />
            )}
          </div>
        </>
      );
    } else {
      return (
        <>
          <NumericFormat
            className="number-tokens-input"
            placeholder="0"
            value={tokenInputText}
            allowLeadingZeros={false}
            allowNegative={false}
            thousandSeparator=","
            autoFocus
            decimalScale={0}
            onValueChange={(values) => {
              const { value } = values;
              setTokenInputText(value);
            }}
          />
          <div className="text-center">
            <FormattedMessage
              defaultMessage="Enter Value in <blue>Shares</blue>"
              values={{
                blue: (content: JSX.Element) => (
                  <span className="almost-white">{content}</span>
                )
              }}
            />
          </div>
          <div className="text-center">
            <div className="remaining-shares-count">
              <FormattedMessage
                defaultMessage="{tokens} Available"
                values={{
                  tokens: formatNumber({
                    value: sharesLeft,
                    unit: Unit.SHARE,
                    summarize: false
                  })
                }}
              />
            </div>
          </div>
          {renderSummaryInfo()}
        </>
      );
    }
  };

  const renderAvgSharePriceToolTip = () => (
    <Tooltip
      position="top"
      tooltip={
        <>
          <TooltipTitle>
            <FormattedMessage defaultMessage="What’s average share price?" />
          </TooltipTitle>
          <TooltipBody>
            <FormattedMessage
              defaultMessage="The average share price of  buy orders in the ‘Order book’. This may differ from the last sold price due to market fluctuation. <Link>Learn more</Link>"
              values={{
                Link: (content: JSX.Element) => (
                  <HashLink
                    to={howItWorksPath(2, "buyingAndSelling04")}
                    target={"_blank"}
                    className="learn-more"
                  >
                    {content}
                  </HashLink>
                )
              }}
            />
          </TooltipBody>
        </>
      }
    >
      <img
        src={infoSrc}
        className="info-icon"
        style={{ verticalAlign: "middle", marginLeft: 5 }}
      />
    </Tooltip>
  );

  if (chain?.unsupported) {
    return <WrongNetworkModal onClose={handleCloseModal} />;
  }

  return (
    <Modal>
      <ModalContent className="buy-sell-modal">
        <Flex className="justify-between align-center">
          <H4 className="font-neutrals8">
            <FormattedMessage
              defaultMessage="{orderType, select, BUY {Buy} other {Sell}} {token}"
              values={{
                token: fav.coin,
                orderType: orderType
              }}
            />
          </H4>
          <ModalCloseButton onClose={handleCloseModal} />
        </Flex>

        {!isIPO && (
          <>
            <div className="last-transaction">
              <FormattedMessage
                defaultMessage="Share Price {price} {currency}"
                values={{
                  price: formatNumber({
                    value: pps,
                    unit: Unit.USDC,
                    summarize: false
                  }),
                  currency: CURRENCY
                }}
              />
            </div>
            <StyledTabSwitcherContainer>
              <TabSwitcher
                active={currentStage === Stage.Market ? 0 : 1}
                listOfButtons={
                  orderType === OrderType.Buy
                    ? ["Market Buy", "Limit Buy"]
                    : ["Market Sell", "Limit Sell"]
                }
                setFilterAction={(index) =>
                  setCurrentStage(index === 0 ? Stage.Market : Stage.Limit)
                }
              />
            </StyledTabSwitcherContainer>
          </>
        )}

        {currentStage == Stage.Limit ? (
          <div>
            {renderLimitInputForm()}
            <hr
              style={{
                maxWidth: 325,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            />
            {renderLimitBuySellDescription()}
          </div>
        ) : (
          <>
            {renderNonLimitInputForm()}
            {renderSummaryInfo()}
          </>
        )}
        {transactionErrorMessage && (
          <div className="error-box">
            <img className="error-icon" src={errorSrc} />
            <div className="error-messages">
              <div className="error-title">
                <FormattedMessage defaultMessage="Order failed" />
              </div>
              <div>{transactionErrorMessage}</div>
            </div>
          </div>
        )}
        <ActionButtonGroup>
          {currentStage !== Stage.Limit &&
          orderType === OrderType.Buy &&
          usdcBalance < totalPrice ? (
              <Flex
                style={{
                  flexDirection: "column",
                  gap: "24px",
                  width: "100%",
                  marginTop: "11px"
                }}
              >
                <ButtonPrimary
                  onClick={() => dispatch(setShowAddFundsModalAction(true))}
                >
                Add Funds
                </ButtonPrimary>
                <NoFunds>Not enough funds in USDC.</NoFunds>
              </Flex>
            ) : (
              <>
                <ButtonSecondary
                  onClick={() =>
                    dispatch(setShowBuySellModal({ showModal: false }))
                  }
                >
                Cancel
                </ButtonSecondary>

                <ButtonPrimary disabled={disabledSubmit} onClick={submit}>
                  {currentStage == Stage.Limit
                    ? confirmedLimitPrice
                      ? disabledSubmit
                        ? "Placing Order ..."
                        : "Place Order"
                      : "Set Limit Price"
                    : orderType == OrderType.Sell
                      ? "Sell"
                      : "Buy"}
                </ButtonPrimary>
              </>
            )}
        </ActionButtonGroup>
      </ModalContent>
    </Modal>
  );
};

const NoFunds = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: #e6e8ec;
  margin-bottom: 16px;
`;

const StyledTabSwitcherContainer = styled.div`
  margin: 24px 0px;
`;

export default BuySellModal;
