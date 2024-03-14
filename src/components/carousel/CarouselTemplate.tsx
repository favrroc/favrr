import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import styled from "styled-components";

import { Else, If, Then } from "react-if";
import { ReactComponent as LeftArrowIcon } from "../../assets/images/left-arrow.svg";
import { ReactComponent as RigthArrowIcon } from "../../assets/images/right-arrow.svg";
import "../../assets/styles/vendor/slick-theme.css";
import "../../assets/styles/vendor/slick.css";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { useAppSelector } from "../../core/hooks/rtkHooks";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import { EmptyStateTypes } from "../../core/interfaces/emptystate.type";
import LiveBadge from "../badge/LiveBadge";
import GetUpdateModule from "../get-update-module/GetUpdateModule";
import Loader from "../loader/Loader";
import EmptyState from "../portfolio/children/EmptyState";
import { Body2Bold } from "../styleguide/styleguide";

export interface ICarouselTemplate {
  carouselTitle: string;
  carouselDescription: string;
  mainParameter: React.ReactNode;
  settings: any;
  numberOfTiles?: number;
}

const CarouselTemplate = (props: ICarouselTemplate) => {
  const { smallerThanTablet, smallerThanXLarge } = useWatchResize();
  const {
    carouselTitle,
    carouselDescription,
    mainParameter,
    settings,
    numberOfTiles
  } = props;

  const { loadingFanMatchesList } = useAppSelector((state) => state.fanMatch);

  const parentRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<Slider>(null);

  const [, forceRender] = useState({});
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slickDot = parentRef.current?.querySelector(
    ".slick-dots .slick-active"
  );

  const tilesPerPage = smallerThanTablet ? 1 : smallerThanXLarge ? 2 : 3;
  const buttonWidth = slickDot?.clientWidth;

  if (!!!slickDot) {
    setTimeout(() => forceRender({}), 100);
  }

  useEffect(() => {
    const numberOfSlides = Math.ceil((numberOfTiles as number) / tilesPerPage);
    setCurrentSlide(Math.min(Math.max(currentSlide, 0), numberOfSlides - 1));
  }, [tilesPerPage, smallerThanTablet, smallerThanXLarge]);

  const getCurrentButton = () => {
    setTimeout(() => {
      const el = parentRef.current?.querySelector(".slick-dots .slick-active");
      if (el?.parentElement) {
        const index = Array.from(el.parentElement.children).indexOf(el);
        setCurrentSlide(index);
      }
    }, 100);
  };

  return (
    <Carousel ref={parentRef}>
      <StyledTitleSection>
        <Title>{carouselTitle}</Title>
        <StyledLeftButtonDiv>
          <ArrowButton onClick={() => sliderRef.current?.slickPrev()}>
            <LeftArrowIcon />
          </ArrowButton>
        </StyledLeftButtonDiv>
        <StyledRightButtonDiv>
          <ArrowButton onClick={() => sliderRef.current?.slickNext()}>
            <StyledRightArrowIcon />
          </ArrowButton>
        </StyledRightButtonDiv>
        <LiveBadge isOnLandingPage={false} />
      </StyledTitleSection>

      <Description>{carouselDescription}</Description>

      <If condition={loadingFanMatchesList}>
        <Then>
          <Loader wrapperStyle={{ minHeight: "250px" }} />
        </Then>
        <Else>
          <If condition={numberOfTiles === 0}>
            <Then>
              <StyledEmptyDiv>
                <EmptyState public={false} variant={EmptyStateTypes.IPO} />
              </StyledEmptyDiv>
            </Then>
            <Else>
              <StyledSlider
                beforeChange={() => {
                  getCurrentButton();
                }}
                initialSlide={0}
                centerPadding={`32px`}
                {...settings}
                ref={sliderRef}
                count={currentSlide}
                btnwidth={buttonWidth}
              >
                {mainParameter}
                <GetUpdateModule isOnFanMatchesPage={false} />
              </StyledSlider>
            </Else>
          </If>
        </Else>
      </If>
    </Carousel>
  );
};

const Carousel = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px auto;
  padding-bottom: 204px;
  box-sizing: border-box;
  padding-top: 16px;
  max-width: ${RESPONSIVE.maxWidth};
  @media screen and (max-width: ${RESPONSIVE.large}) {
    padding-bottom: 156px;
    padding-top: 16px;
    width: 100%;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    padding-bottom: 142px;
    padding-top: 4px;
  }
  @media screen and (max-width: ${RESPONSIVE.xSmall}) {
    padding-bottom: 142px;
    padding-top: 0;
  }
`;

const StyledTitleSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const Title = styled.span`
  font-family: "Oswald";
  font-size: 40px;
  font-weight: 700;
  line-height: 48px;
  color: ${colors.neutrals8};
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-size: 32px;
    line-height: 40px;
  }
`;

const Description = styled(Body2Bold)`
  margin-top: 12px;
  color: ${colors.neutrals4};
`;

const ArrowButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  box-shadow: inset 0 0 0 2px #353945;
  background-position: center;
  background-repeat: no-repeat;
  &:hover {
    box-shadow: inset 0 0 0 2px #fcfcfd;
    filter: brightness(2);
  }
`;

const StyledLeftButtonDiv = styled.div`
  position: absolute;
  right: 48px;
`;

const StyledRightButtonDiv = styled.div`
  position: absolute;
  right: 0px;
`;

const StyledRightArrowIcon = styled(RigthArrowIcon)`
  path {
    fill: ${colors.neutrals4};
  }
`;

const StyledSlider = styled(Slider)`
  .slick-track {
    padding-top: 60px;
    display: flex;
    transition: all 0.25s ease;
  }
  .slick-dots {
    display: flex !important;
    border-radius: 100px;
    height: 4px;
    max-width: 373px;
    overflow: hidden;
    transform: translateX(-50%);
    left: 50%;
    bottom: -40px;
    position: relative;
    li {
      height: 4px;
      flex: 1;
      display: inherit;
      margin: 0;
      button {
        height: 4px;
        width: 100%;
      }
      background-color: #353945;
      &.slick-active {
        border-radius: 0 100px 100px 0;
        background-color: #353945;
      }
    }
    @media screen and (max-width: 576px) {
      max-width: 196px;
    }
    &:after {
      position: absolute;
      left: ${(props: { count: number; btnwidth: number }) => {
    return props.count * props.btnwidth;
  }}px;
      width: ${(props: { count: number; btnwidth: number }) => {
    return props.btnwidth;
  }}px;
      top: 0;
      content: "";
      height: 4px;
      border-radius: 0 100px 100px 0;
      background-color: #b1b5c4;
      transition: all 0.25s ease;
    }
  }
`;

const StyledEmptyDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 97px;
    object-fit: cover;
    margin-bottom: 28px;
  }

  p {
    color: #808191;
  }

  .empty-label {
    margin-top: 32px;
    font-size: 24px;
    color: $gray;
    font-weight: 600;
  }
`;

export default CarouselTemplate;
