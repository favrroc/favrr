import React from "react";
import styled from "styled-components";

import { FavEntity } from "../../../../../../generated-graphql/graphql";
import { RESPONSIVE } from "../../../../../core/constants/responsive.const";
import { colors } from "../../../../../core/constants/styleguide.const";
import { getCSSOfStyledComponent } from "../../../../../core/util/base.util";
import { Body2, Caption2 } from "../../../../styleguide/styleguide";

interface IFavCoinProps {
  fav: FavEntity;
  isLiveMatch: boolean;
  isOnFanMatchesPage: boolean;
}

const FavCoin = (props: IFavCoinProps) => {
  const { isLiveMatch, fav, isOnFanMatchesPage } = props;
  return (
    <>
      {isOnFanMatchesPage ? (
        isLiveMatch ? (
          <StyledLiveMatchFavCoin>{fav?.coin}</StyledLiveMatchFavCoin>
        ) : (
          <Caption2 style={{ color: colors.neutrals4,}}>
            {fav?.coin}
          </Caption2>
        )
      ) : (
        <Caption2 style={{ color: colors.neutrals2,}}>
          {fav?.coin}
        </Caption2>
      )}
    </>
  );
};

const StyledLiveMatchFavCoin = styled.div`
  ${getCSSOfStyledComponent(Caption2)}
  color: ${colors.neutrals3};
  /* padding-top: 10px; */
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    ${getCSSOfStyledComponent(Body2)}
    color: ${colors.neutrals2};
  }
`;

export default FavCoin;
