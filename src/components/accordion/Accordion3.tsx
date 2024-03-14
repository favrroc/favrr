// This component is used in `Start Here` page
import React, { ForwardedRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { getCSSOfStyledComponent } from "../../core/util/base.util";
import { Chevron3Image } from "../assets/app-images/AppImages";
import { Body1, Body1Bold, Body2, H4 } from "../styleguide/styleguide";

interface IAccordionProps {
  title: string;
  children?: JSX.Element;
}
const Accordion3 = React.forwardRef((props: IAccordionProps, ref: ForwardedRef<HTMLElement>) => {
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
      if(accordion.lastChild && (accordion.lastChild.style.maxHeight !== "0px")) {
        accordion.firstChild.click();
      }
    });
    setIsOpened(!isOpened);
  };

  return (
    <StyledContainer>
      <StyledHead onClick={onClickHead} ref={ref}>
        <StyledTitle isOpened={isOpened}>
          {props.title}
        </StyledTitle>

        <StyledArrow src={Chevron3Image().props.src} isOpened={isOpened} />
      </StyledHead>

      <StyledBody isOpened={isOpened} ref={childrenRef}>
        {props.children}
      </StyledBody>
    </StyledContainer>
  );
});

const StyledContainer = styled.div`
  width: 100%;
  &:last-child > div:first-child {
    border-bottom: 0px !important;
    padding-bottom: 0px !important;
  }
`;
const StyledHead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px 0px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  &:hover > * {
    color: ${colors.primaryBlue} !important;
  }
`;
const StyledTitle = styled.span`
  ${getCSSOfStyledComponent(Body1Bold)}
  flex: 1;
  color: ${(props: any) => props.isOpened ? colors.primaryBlue : colors.neutrals8};
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    ${getCSSOfStyledComponent(H4)}
  }
`;
const StyledArrow = styled.img`
  margin-left: 18px;
  margin-right: 9px;
  object-fit: contain;
  transition: transform 0.2s ease-out;
  transform: rotate(${(props: any) => props.isOpened ? 90 : 0}deg);
`;
const StyledBody = styled.div`
  margin-top: ${(props: any) => props.isOpened ? 24 : 0}px;
  margin-bottom: ${(props: any) => props.isOpened ? 24 : 0}px;
  overflow: hidden;
  transition: all 0.2s ease-out;
  opacity: ${(props: any) => props.isOpened ? 1 : 0};
  color: ${colors.neutrals5};
  ${getCSSOfStyledComponent(Body2)}
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    ${getCSSOfStyledComponent(Body1)}
  }
`;

export default React.memo(Accordion3);