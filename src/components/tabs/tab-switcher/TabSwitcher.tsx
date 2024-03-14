import React from "react";
import styled from "styled-components";

import { getCSSOfStyledComponent } from "../../../core/util/base.util";
import { Caption1Bold } from "../../styleguide/styleguide";

interface Props {
  active: number;
  listOfButtons: string[];
  setFilterAction: (newActive: number) => void;
}

const TabSwitcher = ({ active = 0, listOfButtons = [], setFilterAction }: Props) => {
  return (
    <AreaTabs active={active} count={listOfButtons.length}>
      {/* Loop all buttons */}
      {listOfButtons.map((title, index) => (
        <Button
          key={title}
          onClick={(e: any) => { e.preventDefault(); setFilterAction(index); }}
          className={active === index ? "active" : ""}
        >
          {title}
        </Button>
      ))}
    </AreaTabs>
  );
};

const AreaTabs = styled.div`
  background: #242731;
  border-radius: 30px;
  padding: 4px;
  display: flex;
  max-width: 542px;
  width: 100%;
  margin: auto;
  position: relative;
  box-sizing: border-box;
  display: flex;
  /* gap: 32px; */
  &::before {
    transition: all 0.5s ease;
    left: calc(${(props: any) => props.active * (100 / props.count)}% + 4px);
    content: "";
    color: #fcfcfd;
    background: #353945;
    border-radius: 25px;
    width: calc(${(props: any) => 100 / props.count}% - 8px);
    height: 50px;
    position: absolute;
    top: 3px;
  }
  @media screen and (max-width: 375px) {
    margin: 0 16px;
    width: calc(100% - 32px);
  }
`;

const Button = styled.button`
  height: 48px;
  width: 50%;
  ${getCSSOfStyledComponent(Caption1Bold)}
  position: relative;
  color: #808191;
  border-radius: 25px;
  padding: 4px;
  &:hover {
    color: #fcfcfd;
    transition: all 0.3s ease;
  }
  &.active {
    color: #fcfcfd;
    cursor: default;
  }
`;

export default TabSwitcher;