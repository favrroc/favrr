import React from "react";
import styled from "styled-components";

import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { LeagueLib, Leagues } from "../../../core/util/league.util";
import InfoGraphicBubble from "../info-graphic-bubble/InfoGraphicBubble";

const EcoInfoGraphic = () => {
  const { league } = useAppSelector(state => state.user);
  
  return (
    <InfoGraphic>
      <svg
        viewBox="0 0 487 1634"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="infographicLine"
        xmlSpace="preserve"
        preserveAspectRatio="none"
      >
        <linearGradient
          id="grad1"
          x1="0%"
          y1="0%"
          x2="0%"
          y2={`${LeagueLib[league].yAxisPercentage}%`}
        >
          <stop
            offset="100%"
            style={{ stopColor: "#FFD166", stopOpacity: "1" }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "#353945", stopOpacity: "1" }}
          />
        </linearGradient>
        <path
          d="M273.632 1627.5L80.5534 1569.17C3.29383 1545.82 -14.1442 1444.29 50.9003 1396.51V1396.51C67.7082 1384.16 88.0192 1377.5 108.875 1377.5H360.136C382.029 1377.5 403.505 1371.51 422.24 1360.18V1360.18C505.622 1309.77 497.347 1186.25 407.985 1147.4L273.632 1089L75.4397 1017.4C-2.32895 989.311 -17.1922 885.771 49.5333 836.936V836.936C67.2319 823.982 88.5948 817 110.527 817H367.029C384.481 817 401.669 812.743 417.104 804.598V804.598C497.774 762.027 491.899 644.597 407.383 610.291L273.632 556L93.5906 507.753C5.48584 484.143 -23.0089 373.333 42.7772 310.15V310.15C64.5905 289.2 93.6625 277.5 123.907 277.5H359.926C381.924 277.5 403.469 271.252 422.054 259.483V259.483C503.398 207.972 490.325 85.5364 399.939 52.3606L273.632 6"
          width="100%"
          height="100%"
          stroke="url(#grad1)"
          strokeWidth="12"
          strokeLinejoin="round"
        />
      </svg>
      <Bubbles>
        {Leagues.map((a) => {
          return (
            <InfoGraphicBubble
              key={a}
              current={a === league}
              data={{
                title: LeagueLib[a].title,
                image: LeagueLib[a].image,
                index: a + 1
              }}
            />
          );
        })}
      </Bubbles>
    </InfoGraphic>
  );
};
const Bubbles = styled.div``;
const InfoGraphic = styled.div`
  margin: 134px auto 127px;
  position: relative;
  height: 1700px;
  width: 100%;
  #infographicLine {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%) scaleX(-1);
    width: 100%;
    max-width: 504px;
    height: 1650px;
  }
`;
export default EcoInfoGraphic;
