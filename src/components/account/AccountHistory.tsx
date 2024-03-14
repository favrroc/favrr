import React, { useEffect, useState } from "react";
import styled from "styled-components";

import dayjs from "dayjs";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import {
  WyreHistory,
  WyreOrderActionType
} from "../../core/interfaces/transaction.type";
import { loadWyreTransactions } from "../../core/store/slices/wyreSlice";
import {
  getCSSOfStyledComponent,
  getColorOfValue
} from "../../core/util/base.util";
import { Unit, formatNumber, toTitleCase } from "../../core/util/string.util";
import NothingYet from "../list/nothing-yet/NothingYet";
import Loader from "../loader/Loader";
import { Block, ButtonSecondary, H3 } from "../styleguide/styleguide";
import AccountHistoryFilter from "./AccountHistoryFilter";

const WyreOrderActionTypeDisplayText = {
  ALL: "ALL",
  ADDED: "ADDED",
  CLAIMED: "CLAIMED",
  CANCELLED: "REJECTED"
};

const AccountHistory = () => {
  const dispatch = useAppDispatch();
  const address = useAppSelector((state) => state.user.profile.address);
  const {
    loadingAllWyreTransactions,
    loadingAddedWyreTransactions,
    loadingClaimedWyreTransactions,
    loadingCancelledWyreTransactions,
    allWyreTransactions,
    addedWyreTransactions,
    claimedWyreTransactions,
    cancelledWyreTransactions,
    hasMoreAllWyreTransactions,
    hasMoreAddedWyreTransactions,
    hasMoreClaimedWyreTransactions,
    hasMoreCancelledWyreTransactions
  } = useAppSelector((state) => state.wyre);

  const [currentFilter, setCurrentFilter] = useState<WyreOrderActionType>(
    WyreOrderActionType.ALL
  );
  const [loading, history, hasMore, loadMore] =
    currentFilter === WyreOrderActionType.ALL
      ? [
        loadingAllWyreTransactions,
        allWyreTransactions,
        hasMoreAllWyreTransactions,
        () =>
          dispatch(
            loadWyreTransactions({
              skip: allWyreTransactions.length,
              take: 4,
              actionType: WyreOrderActionType.ALL
            })
          )
      ]
      : currentFilter === WyreOrderActionType.ADDED
        ? [
          loadingAddedWyreTransactions,
          addedWyreTransactions,
          hasMoreAddedWyreTransactions,
          () =>
            dispatch(
              loadWyreTransactions({
                skip: addedWyreTransactions.length,
                take: 4,
                actionType: WyreOrderActionType.ADDED
              })
            )
        ]
        : currentFilter === WyreOrderActionType.CLAIMED
          ? [
            loadingClaimedWyreTransactions,
            claimedWyreTransactions,
            hasMoreClaimedWyreTransactions,
            () =>
              dispatch(
                loadWyreTransactions({
                  skip: claimedWyreTransactions.length,
                  take: 4,
                  actionType: WyreOrderActionType.CLAIMED
                })
              )
          ]
          : currentFilter === WyreOrderActionType.CANCELLED
            ? [
              loadingCancelledWyreTransactions,
              cancelledWyreTransactions,
              hasMoreCancelledWyreTransactions,
              () =>
                dispatch(
                  loadWyreTransactions({
                    skip: cancelledWyreTransactions.length,
                    take: 4,
                    actionType: WyreOrderActionType.CANCELLED
                  })
                )
            ]
            : [false, [], false, null];

  useEffect(() => {
    if (address) {
      dispatch(
        loadWyreTransactions({
          skip: 0,
          take: 4,
          actionType: WyreOrderActionType.ALL
        })
      );
      dispatch(
        loadWyreTransactions({
          skip: 0,
          take: 4,
          actionType: WyreOrderActionType.ADDED
        })
      );
      dispatch(
        loadWyreTransactions({
          skip: 0,
          take: 4,
          actionType: WyreOrderActionType.CLAIMED
        })
      );
      dispatch(
        loadWyreTransactions({
          skip: 0,
          take: 4,
          actionType: WyreOrderActionType.CANCELLED
        })
      );
    }
  }, [address]);

  return (
    <Block>
      <StyledHeadline className="font-neutrals8">History</StyledHeadline>
      <AccountHistoryFilter
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />
      {history.length ? (
        <>
          <Table>
            <HeadRow>
              <Col>Date</Col>
              <Col className="hide-small" style={{ minWidth: "133px" }}>
                Type
              </Col>
              <Col>Amount</Col>
              <Col>Balance</Col>
            </HeadRow>
            {history.map((obj: WyreHistory, idx) => {
              const amount =
                obj.type === WyreOrderActionType.CANCELLED
                  ? obj.amount
                  : (obj.type === WyreOrderActionType.ADDED ? 1 : -1) *
                    obj.amount;
              const color =
                obj.type === WyreOrderActionType.CANCELLED
                  ? "rejected"
                  : getColorOfValue(amount);
              return (
                <Row key={`wyre-history-${idx}`}>
                  <Col>
                    <StyledDate>
                      <Day>{dayjs(obj.date).format("MMM")}</Day>
                      <Month>{dayjs(obj.date).format("D")}</Month>
                    </StyledDate>
                  </Col>
                  <Col className="hide-small">
                    <span className={color}>
                      {toTitleCase(WyreOrderActionTypeDisplayText[obj.type])}
                    </span>
                  </Col>
                  <Col>
                    <span className={color}>
                      {obj.type === WyreOrderActionType.CANCELLED && "x"}
                      {formatNumber({
                        value: amount,
                        unit: Unit.USDC,
                        summarize: false,
                        withUnit: true,
                        withSign:
                          obj.type === WyreOrderActionType.CANCELLED
                            ? false
                            : true
                      })}
                    </span>
                    <ExtraLabel>
                      {toTitleCase(WyreOrderActionTypeDisplayText[obj.type])}
                    </ExtraLabel>
                    <VisibleSmall>
                      <BalanceUSDC>
                        {formatNumber({
                          value: obj.balance,
                          unit: Unit.USDC,
                          summarize: false,
                          withUnit: true
                        })}
                      </BalanceUSDC>
                      <BalanceFiat>
                        {formatNumber({
                          value: obj.balance,
                          unit: Unit.USD,
                          summarize: false,
                          withUnit: true
                        })}
                      </BalanceFiat>
                      <ExtraLabel>Balance</ExtraLabel>
                    </VisibleSmall>
                  </Col>
                  <Col className="hide-small">
                    <BalanceUSDC>
                      {formatNumber({
                        value: obj.balance,
                        unit: Unit.USDC,
                        summarize: false,
                        withUnit: true
                      })}
                    </BalanceUSDC>
                    <BalanceFiat>
                      {formatNumber({
                        value: obj.balance,
                        unit: Unit.USD,
                        summarize: false,
                        withUnit: true
                      })}
                    </BalanceFiat>
                  </Col>
                </Row>
              );
            })}
          </Table>
          {loading ? (
            <Loader wrapperStyle={{ marginTop: "10px" }} />
          ) : (
            hasMore && (
              <ButtonSecondary
                onClick={loadMore}
                style={{ fontSize: "14px", margin: "auto", minWidth: "auto" }}
              >
                More
              </ButtonSecondary>
            )
          )}
        </>
      ) : loading ? (
        <Loader wrapperStyle={{ marginTop: "100px" }} />
      ) : (
        <NothingYet />
      )}
    </Block>
  );
};

const VisibleSmall = styled.div`
  display: none;
  margin-top: 20px;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    display: block;
  }
`;

const ExtraLabel = styled.div`
  display: none;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #808191;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    display: block;
  }
`;

const BalanceUSDC = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #fcfcfd;
`;

const BalanceFiat = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #808191;
`;

const StyledDate = styled.div`
  text-align: center;
  display: inline-block;
`;

const Day = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #808191;
`;

const Month = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.01em;
  color: #fcfcfd;
`;

const StyledHeadline = styled.div`
  ${getCSSOfStyledComponent(H3)}
  margin-top: 120px;

  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-size: 32px;
    line-height: 40px;
  }
`;

const Table = styled.div`
  display: table;
  width: 100%;
  box-sizing: border-box;
  font-family: "Poppins";
  margin-bottom: 24px;
  & > * {
    box-sizing: border-box;
    display: table-row;
  }
`;

const Col = styled.div`
  display: table-cell;
  padding: 24px 16px;
  vertical-align: middle;
  .nothing {
    color: #cdb4db !important;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    &.hide-small {
      display: none;
    }
  }
`;

const Row = styled.div`
  ${Col} {
    padding: 16px 22px;
    &:first-child {
      border-radius: 20px 0 0 20px;
    }
    &:last-child {
      border-radius: 0 20px 20px 0;
    }
  }
  &:nth-child(odd) {
    background: #242731;
  }
  &:nth-child(even) {
    background: none;
  }
`;

const HeadRow = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #808191;
  ${Col} {
    border-bottom: solid 1px #353945;
    font-size: 14px;
    line-height: 24px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    display: none;
  }
`;

export default AccountHistory;
