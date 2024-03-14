import React, { CSSProperties, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";

import { FavEntity } from "../../../../generated-graphql/graphql";
import leftArrowSrc from "../../../assets/images/left-arrow.svg";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { FavStatisticsInfo } from "../../../core/interfaces/fav.type";
import { extractFavStatisticsInfo, getColorOfValue } from "../../../core/util/base.util";
import { favPath } from "../../../core/util/pathBuilder.util";
import { Unit, formatNumber } from "../../../core/util/string.util";
import Loader from "../../loader/Loader";
import { ButtonSecondary } from "../../styleguide/styleguide";
import FavThumb from "../fav-thumb/FavThumb";
import "./fav-rows-panel.scss";

const FavRow = (props: {
  fav: FavEntity;
  favStatisticsInfo: FavStatisticsInfo;
  style?: CSSProperties;
  position: number;
}) => {
  const { fav, favStatisticsInfo, position } = props;

  const { multiFavsInfo } = useAppSelector(
    state => state.favs
  );

  const { marketCap } = favStatisticsInfo;
  const newMarketCap = formatNumber({
    value: marketCap,
    unit: Unit.USDC,
    summarize: true,
    withUnit: true
  }).replace(/(.[0-9])[0-9]/, "$1");

  const {
    marketPriceDeltaPercentForWeek,
  } = extractFavStatisticsInfo(multiFavsInfo, fav?.id);

  return (
    <TopRow className="fav-row">
      <Link to={favPath(fav.title as string)} style={{ position: "relative", borderRadius: "100%" }} className="thumb-link">
        <div className="position-badge">{position}</div>
        <FavThumb images={[{ key: "default", image: fav.iconImage || "" }]} size={72} />
      </Link>
      <TopInfo>
        <Link to={favPath(fav.title as string)}>
          <span className="display-name-label">{fav.displayName}</span>{" "}
          <span className="coin-tick">{fav.coin}</span>
        </Link>
        <StyledMarketBox className="market-cap-label">
          <StyledMarketCap>
            {newMarketCap}
          </StyledMarketCap>
          <span>
            Market Cap
          </span>
        </StyledMarketBox>
        <StyledDelta className={`${getColorOfValue(marketPriceDeltaPercentForWeek)}`}>
          {formatNumber({
            value: marketPriceDeltaPercentForWeek,
            unit: Unit.PERCENT,
            summarize: true,
            withUnit: true,
            withSign: true,
          })}
        </StyledDelta>
      </TopInfo>
    </TopRow>
  );
};

const StyledDelta = styled.div`
font-family: 'Poppins';
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 24px;
display: flex;
align-items: center;
text-align: center;
`;

const StyledMarketBox = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  gap: 4px;
  align-items: center;
  color: #808191;
`;

const StyledMarketCap = styled.span`
font-family: 'Poppins';
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 24px;
align-items: center;
color: #E6E8EC;
`;

const TopInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TopRow = styled.div`
  display: flex !important;
  gap: 16px;
  font-size: 12px;
  .display-name-label {
    font-weight: 500;
    font-size: 16px;
  }
  .coin-tick,
  .market-cap-label {
    color: #808191;
  }
  .position-badge {
    position: absolute;
    left: -2px;
    top: -4px;
    background-color: #fcfcfd;
    border-radius: 20px;
    width: 20px;
    height: 20px;
    color: #23262F;
    text-align: center;
    line-height: 20px;
    font-weight: 600;
    border: 2px solid #1F2128;
  }
`;

const FavRowsPanel = () => {
  const { windowWidth } = useWatchResize();
  const { loadingFavs, loadingMultiFavsInfo, topFavs: favs, multiFavsInfo } = useAppSelector(state => state.favs);

  const sliderRef = useRef<Slider>(null);
  const mobileDevice = windowWidth < 660 ? true : false;
  const settings = {
    rows: mobileDevice ? 5 : 2,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: mobileDevice ? 1 : windowWidth < 850 ? 2 : 3,
    slidesToScroll: mobileDevice ? 1 : windowWidth < 850 ? 2 : 3
  };
  const nextSlide = () => {
    sliderRef.current?.slickPrev();
  };
  const prevSlide = () => {
    sliderRef.current?.slickNext();
  };
  return (
    <FavRows>
      <H2 className="favs-section-title">
        <HeaderSpan><span>TOP 10 STOCKS</span> <LiveTag>LIVE</LiveTag></HeaderSpan>
        {!loadingFavs && !loadingMultiFavsInfo && favs?.length > 0 && <><ArrowButton
          className={`left-arrow arrow-btn`}
          onClick={nextSlide}
        >
          <img src={leftArrowSrc} />
        </ArrowButton>
        <ArrowButton
          className={`right-arrow arrow-btn`}
          onClick={prevSlide}
        >
          <img src={leftArrowSrc} />
        </ArrowButton></>}
      </H2>
      {(loadingFavs || loadingMultiFavsInfo) ? (
        <Loader wrapperStyle={{ minHeight: "250px" }} />
      ) : (
        <TopSlider
          ref={sliderRef}
          {...settings}
        >
          {favs?.slice(0, 10).map((fav, i) => {
            return (
              <FavRow
                key={fav?.key as string}
                fav={fav}
                favStatisticsInfo={extractFavStatisticsInfo(multiFavsInfo, fav?.id)}
                position={i + 1}
                style={{}}
              />
            );
          })}
        </TopSlider>
      )
      }
      <ButtonSecondary style={{ minWidth: "auto", margin: "0 auto 0", fontSize: "14px" }} onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        document.querySelector("#explore")?.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
      }}>See All</ButtonSecondary>
    </FavRows>
  );
};

const HeaderSpan = styled.span`
  display: flex;
  align-items: flex-start;
  @media screen and (max-width: 576px) {
    width: 100%;
  }
`;

const LiveTag = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 10px;
  background: #7FBA7A;
  border-radius: 100px;

  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: #FCFCFD;
  margin-top: 9px;
  margin-left: 12px;
`;

const FavRows = styled.div`
  width: 100%;
  max-width: ${RESPONSIVE.maxWidth};
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
`;

const ArrowButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #353945;
  border-radius: 99px;
  &.left-arrow {
    margin-left: auto;
    margin-right: 8px;
  }
  &.right-arrow {
    transform: rotate(180deg);
  }
  @media screen and (max-width: 576px) {
    margin-left: 0 !important;
    margin-top: 24px;
  }
`;

const TopSlider = styled(Slider)`
  .slick-track {
    display: flex;
    gap: 16px;
    @media screen and (max-width: 576px) {
      gap: 0;
    }
  }
  .slick-slide {
    padding: 16px 0 0;
    > div {
      margin-bottom: 32px;
      padding: 0;
      /* display: grid; */
      /* gap: 32px 22px; */
      /* grid-auto-flow: column; */
      /* grid-template-rows: 1fr 1fr; */
      @media screen and (max-width: 576px) {
        /* grid-template-columns: repeat(1, 1fr);
        grid-template-rows: inherit;
        grid-auto-flow: inherit; */
      }
    }
  }
`;

const H2 = styled.h2`
  display: flex;
  font-family: 'Oswald';
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: -0.02em;
  color: #FCFCFD;
  margin-bottom: 30px;

  @media screen and (max-width: 576px) {
    font-size: 32px;
    flex-wrap: wrap;
  }
`;

export default FavRowsPanel;
