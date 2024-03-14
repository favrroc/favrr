// This component is used in `How It Works` page
import React, { ForwardedRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { Body2Bold } from "../styleguide/styleguide";

import chevronSrc from "../../assets/images/chevron.svg";
import { colors } from "../../core/constants/styleguide.const";

interface IAccordionProps {
  titleIndexLabel: string;
  title: string;
  id?: string;
  children?: JSX.Element;
}
const Accordion2 = React.forwardRef((props: IAccordionProps, ref: ForwardedRef<HTMLElement>) => {
  const [isOpened, setIsOpened] = useState(false);
  const childrenRef = useRef(null as null | HTMLDivElement);

  useEffect(() => {
    if (childrenRef.current) {
      childrenRef.current.style.setProperty(
        "max-height",
        isOpened ? (childrenRef.current.scrollHeight + "px") : "0"
      );
    }
  }, [isOpened, childrenRef.current]);

  const onClickHead = (e: any) => {
    e.currentTarget.parentElement.parentElement.childNodes.forEach((accordion: any) => {
      if(accordion.lastChild.style.maxHeight !== "0px") {
        accordion.firstChild.click();
      }
    });
    setIsOpened(!isOpened);
  };

  return (
    <StyledContainer>
      <StyledHead onClick={onClickHead} ref={ref} id={props.id}>
        <StyledTitleIndex isOpened={isOpened}>
          {props.titleIndexLabel}
        </StyledTitleIndex>

        <StyledTitle isOpened={isOpened}>
          {props.title}
        </StyledTitle>

        <StyledArrow src={chevronSrc} isOpened={isOpened} />
      </StyledHead>

      <StyledBody isOpened={isOpened} ref={childrenRef}/*  style={{display: isOpened ? "block" : "none"}} */>
        {props.children}
      </StyledBody>
    </StyledContainer>
  );
});

const StyledContainer = styled.div`
  width: 728px;
  &:last-child > div:first-child {
    border-bottom: 0px !important;
    padding-bottom: 0px !important;
  }
  @media screen and (max-width: 768px) {
    width: 546px;
  }
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;
const StyledHead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px 0px;
  border-bottom: 1px solid ${colors.neutrals3};
  transition: all 0.5s ease-out;
  cursor: pointer;
  &:hover > * {
    color: ${colors.primaryBlue} !important;
  }
`;
const StyledTitleIndex = styled(Body2Bold)`
  width: 48px;
  color: ${(props: any) => props.isOpened ? colors.primaryBlue : colors.neutrals4};
  @media screen and (max-width: 576px) {
    width: 36px;
  }
`;
const StyledTitle = styled(Body2Bold)`
  flex: 1;
  color: ${(props: any) => props.isOpened ? colors.primaryBlue : colors.neutrals8};
`;
const StyledArrow = styled.img`
  margin-left: 18px;
  margin-right: 9px;
  object-fit: contain;
  transition: transform 0.2s ease-out;
  transform: rotate(${(props: any) => props.isOpened ? 90 : 0}deg);
`;
const StyledBody = styled.div`
  padding-left: 48px;
  margin-top: ${(props: any) => props.isOpened ? 24 : 0}px;
  margin-bottom: ${(props: any) => props.isOpened ? 24 : 0}px;
  overflow: hidden;
  transition: all 0.2s ease-out;
  opacity: ${(props: any) => props.isOpened ? 1 : 0};
  @media screen and (max-width: 576px) {
    padding-left: 36px;
    padding-right: 36px;
  }
`;

export default React.memo(Accordion2);