import React from "react";
import styled from "styled-components";

import { RESPONSIVE } from "../../../core/constants/responsive.const";

interface Props {
  current?: boolean;
  data: {
    title: string;
    index: number;
    image: JSX.Element;
  };
}
const InfoGraphicBubble = (props: Props) => {
  return (
    <Bubble className={`${props.current ? "current" : ""}`}>
      <Position>{props.data.index}</Position>
      <Img src={props.data.image.props.src} />
      <Tag>{props.data.title}</Tag>
    </Bubble>
  );
};

const Bubble = styled.div`
  height: 112px;
  width: 112px;
  border-radius: 160px;
  background-color: #242731;
  position: absolute;
  margin-top: -56px;
  top: 0;
  left: 50%;
  transform: translateX(-56px);
  box-shadow: 0 0 0 10px #ffd166;
  &:nth-child(1) {
    margin-top: -34px;
  }
  &:nth-child(3) {
    top: 17.6666%;
    transform: translateX(112px);
    @media screen and (max-width: ${RESPONSIVE.small}) {
      transform: translateX(33px);
    }
    @media screen and (max-width: ${RESPONSIVE.xSmall}) {
      transform: translateX(26px);
    }
  }
  &:nth-child(2) {
    top: 17.6666%;
    transform: translateX(-240px);
    @media screen and (max-width: ${RESPONSIVE.small}) {
      transform: translateX(-136px);
    }
    @media screen and (max-width: ${RESPONSIVE.xSmall}) {
      transform: translateX(-128px);
    }
  }
  &:nth-child(4) {
    top: 34.3332%;
  }
  &:nth-child(6) {
    top: 49.9998%;
    transform: translateX(112px);
    @media screen and (max-width: ${RESPONSIVE.small}) {
      transform: translateX(33px);
    }
    @media screen and (max-width: ${RESPONSIVE.xSmall}) {
      transform: translateX(26px);
    }
  }
  &:nth-child(5) {
    top: 49.9998%;
    transform: translateX(-240px);
    @media screen and (max-width: ${RESPONSIVE.small}) {
      transform: translateX(-136px);
    }
    @media screen and (max-width: ${RESPONSIVE.xSmall}) {
      transform: translateX(-128px);
    }
  }
  &:nth-child(7) {
    top: 65.6664%;
  }
  &:nth-child(9) {
    top: 83.333%;
    transform: translateX(112px);
    @media screen and (max-width: ${RESPONSIVE.small}) {
      transform: translateX(33px);
    }
    @media screen and (max-width: ${RESPONSIVE.xSmall}) {
      transform: translateX(26px);
    }
  }
  &:nth-child(8) {
    top: 83.333%;
    transform: translateX(-240px);
    @media screen and (max-width: ${RESPONSIVE.small}) {
      transform: translateX(-136px);
    }
    @media screen and (max-width: ${RESPONSIVE.xSmall}) {
      transform: translateX(-128px);
    }
  }
  &:nth-child(10) {
    top: 100%;
    margin-top: -96px;
  }

  &.current {
    box-shadow: 0 0 0 10px #3f8cff, 0 0 0 20px rgba(63, 140, 255, 0.15),
      0px 30px 50px rgba(63, 140, 255, 0.15);
    ~ * {
      box-shadow: 0 0 0 10px #252e40;
      background-color: #252e40;
    }
  }
`;
const Img = styled.img`
  height: 112px;
  width: 112px;
  overflow: hidden;
  object-fit: cover;
  object-position: center;
  ${Bubble}.current ~ * & {
    filter: grayscale(100%);
  }
`;
const Position = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  background: #242731;
  border: 4px solid #ffd166;
  box-shadow: 0px 16px 64px -48px rgba(31, 33, 40, 0.5);
  border-radius: 85.3333px;
  top: -8px;
  left: -20px;

  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #fcfcfd;

  display: flex;
  justify-content: center;
  align-items: center;
  ${Bubble}.current & {
    border-color: #3f8cff;
  }
  ${Bubble}.current ~ * & {
    border-color: #252e40;
  }
`;
const Tag = styled.div`
  background: #ffd166;
  border-radius: 100px;
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  height: 32px;
  color: #1f2128;
  position: absolute;
  top: calc(100% + 23px);
  left: 50%;
  transform: translateX(-50%);
  ${Bubble}.current & {
    background: #3f8cff;
    color: #fcfcfd;
  }
  ${Bubble}.current ~ * & {
    background: #252e40;
    color: #fcfcfd;
  }
`;
export default InfoGraphicBubble;
