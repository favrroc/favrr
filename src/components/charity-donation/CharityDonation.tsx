import React, { useMemo } from "react";
import styled from "styled-components";

import { FavEntity } from "../../../generated-graphql/graphql";
import infoSrc from "../../assets/images/info.svg";
import { charities, favCarity } from "../../core/constants/charities.const";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { Unit, formatNumber } from "../../core/util/string.util";
import { CharityLogoImage } from "../assets/app-images/AppImages";
import Loader from "../loader/Loader";
import { Flex, HairlineSmall, Headline4 } from "../styleguide/styleguide";
import Tooltip from "../tooltip/Tooltip";

const CharityDonation = (props: {fav: FavEntity, className?: string, charityValue: number}) => {
  const favData = useMemo(() => {
    for(const fav of favCarity) {
      if(fav.title === props.fav?.title) {
        return fav;
      }
    }
    return favCarity[0];
  }, [props.fav?.title]);
  
  const favCahrityData = favData;
  const charityData = charities.find(e => e.id === favCahrityData?.charity);
  return (
    <StyledFlex className={props.className}>
      {!props.fav?.title ? <Loader /> : 
        <>
          <div>
            <StyledHeadline4>Help {charityData?.name}</StyledHeadline4>
            <StyledHairlineSmall>with {props?.fav?.displayName}</StyledHairlineSmall>
            <a href={charityData?.url} rel="noreferrer" target="_blank">
              <CharityImg>
                <img src={CharityLogoImage(favCahrityData?.charity as number).props.src} alt={charityData?.name} />
              </CharityImg>
            </a>
          </div>
          <div>
            <Flex style={{alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6}}>
              <StyledHairlineSmall>Donation Value</StyledHairlineSmall><Tooltip
                tooltipBoxStyle={
                  {
                    display: "flex"
                  }  
                }
                tooltip={
                  <>
                    <div className="tooltip-text">
                      {"The donation value is based on your idols' contribution and the current value of the shares."}
                    </div>
                  </>
                }
                position="top"
              >
                <img src={infoSrc} />
              </Tooltip>
            </Flex>
            <DonationValue>{formatNumber({ decimalToFixed: 1, value: props.charityValue, unit: Unit.USDC, summarize: true, withUnit: true })}</DonationValue>
            <Label>
              {favCahrityData?.support ? `Why ${props.fav.displayName} Supports ${charityData?.name}?` : `About ${charityData?.name}`}
            </Label>
            <Labelp>{charityData?.description}</Labelp>
          </div>
        </>
      }
    </StyledFlex>
  );
};

const StyledHeadline4 = styled(Headline4)`
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    font-size: 24px;
    line-height: 32px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-size: 32px;
    line-height: 40px;
  }
`;

const DonationValue = styled.div`
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    letter-spacing: -0.01em;
    color: #FCFCFD;
    margin-bottom: 48px;
`;

const Label = styled.div`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #E6E8EC;
    margin-bottom: 12px;
`;

const Labelp = styled.div`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #808191;
`;

const CharityImg = styled.div`
    width: 237px;
    height: 225px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    margin-top: 48px;
`;

const StyledHairlineSmall = styled(HairlineSmall)`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    text-transform: uppercase;
    color: #808191;
`;

const StyledFlex = styled(Flex)`
    flex-direction: column;
    gap: 48px;
    justify-content: center;
    align-items: center;
    padding: 32px;
    background: #242731;
    box-shadow: 0px 8px 16px -8px rgba(15, 15, 15, 0.2);
    border-radius: 24px;
    text-align: center;
    @media screen and (max-width: ${RESPONSIVE.large}) {
        flex-direction: row;
        gap: 64px;
    }
    @media screen and (max-width: ${RESPONSIVE.medium}) {
        flex-direction: row;
        gap: 32px;
    }
    @media screen and (max-width: ${RESPONSIVE.small}) {
        flex-direction: column;
        gap: 48px;
    }
`;

export default CharityDonation;