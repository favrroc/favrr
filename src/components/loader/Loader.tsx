import React, { CSSProperties } from "react";

import styled from "styled-components";
import { colors } from "../../core/constants/styleguide.const";
import { FavrrIconImage, OceanaCoinIconImage } from "../assets/app-images/AppImages";

interface Props {
  isFavrrIcon?: boolean;
  wrapperStyle?: CSSProperties;
}

const Loader = ({
  isFavrrIcon,
  wrapperStyle
}: Props) => {
  return (
    <LoaderWrapper style={wrapperStyle}>
      {isFavrrIcon ? <FavrrIconImage /> : <OceanaCoinIconImage />}
    </LoaderWrapper>
  );
};

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @keyframes load-animation {
    0% {
      transform: rotate(-0deg) scale(1);
      fill: ${colors.neutrals4};
    }
    23%, 29% {
      transform: rotate(-90deg) scale(1.3);
      fill: var(--second-animation-step);
    }
    47%, 55% {
      transform: rotate(-180deg) scale(1);
      fill: ${colors.neutrals4};
    }
    72%, 79% {
      transform: rotate(-270deg) scale(1.3);
      fill: var(--second-animation-step);
    }
    92%, 100% {
      transform: rotate(-360deg) scale(1);
      fill: ${colors.neutrals4};
    }
  }

  animation: load-animation 2.4s linear infinite;
  animation-direction: reverse;
  --second-animation-step: ${colors.neutrals3};
  path {
    fill : unset
  }
`;

export default Loader;
