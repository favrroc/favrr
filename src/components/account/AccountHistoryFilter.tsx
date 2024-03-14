import React from "react";
import styled from "styled-components";
import { WyreOrderActionType } from "../../core/interfaces/transaction.type";

const Options = [
  {
    title: "All",
    key: WyreOrderActionType.ALL
  },
  {
    title: "Added",
    key: WyreOrderActionType.ADDED
  },
  {
    title: "Claimed",
    key: WyreOrderActionType.CLAIMED
  },
  {
    title: "Rejected",
    key: WyreOrderActionType.CANCELLED
  }
];

interface Props {
  currentFilter: WyreOrderActionType,
  setCurrentFilter: React.Dispatch<React.SetStateAction<WyreOrderActionType>>
}
const AccountHistoryFilter = (props: Props) => {
  return (
    <Filter>
      {Options.map(option => {
        return (
          <OptionButton
            onClick={() => {
              props.setCurrentFilter(option.key);
            }}
            className={`${props.currentFilter == option.key ? "active" : ""}`} key={option.key}>
            {option.title}
          </OptionButton>
        );
      })}
    </Filter>
  );
};

const Filter = styled.div`
  display: flex;
  gap: 24px;
  margin: 40px 0;
`;

const OptionButton = styled.button`
  border: none;
  background: none;
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #808191;
  padding: 8px 12px;
  &.active {
      color: #FCFCFD;
      border-radius: 100px;
      background: #353945;
  }
`;

export default AccountHistoryFilter;