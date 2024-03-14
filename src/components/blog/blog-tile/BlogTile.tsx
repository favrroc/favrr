import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import leftArrowSrc from "../../../assets/images/left-arrow.svg";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { ButtonSecondary } from "../../styleguide/styleguide";
import Author from "../author/Author";

export default function BlogTile({ hideDetail = false, featured = false, tile = {}, dark = false, listCount = 2000, moreButton = false }: { hideDetail?: boolean, featured?: boolean, tile?: any, dark?: boolean, listCount?: number, moreButton?: boolean; }) {
  if (moreButton) {
    return <SeeAllBlock>
      <Link to="/blog" target={featured || !dark ? "_self" : "_blank"}>
        <ProceedButton>
          <ProceedImg src={leftArrowSrc} alt="See All Articles" />
        </ProceedButton>
      </Link>
      <Link to="/blog" target={featured || !dark ? "_self" : "_blank"}>
        <StyledButtonSecondary className={dark ? "dark-theme" : "light-theme"} style={{ width: 165 }}>
          See All Articles
        </StyledButtonSecondary>
      </Link>
    </SeeAllBlock>;
  }
  return (
    <Tile className={`${featured ? "featured" : "not-featured"} ${dark ? "dark-theme" : "light-theme"} ${listCount <= 5 ? "expand-view" : "expand-view"}`}>
      <Link target={featured || !dark ? "_self" : "_blank"} to={`/blog/${tile.url}`}>
        <Img src={tile.banner} />
      </Link>
      <Text>
        <StyledLink target={featured || !dark ? "_self" : "_blank"} to={`/blog/${tile.url}`}>
          {tile.heading}
        </StyledLink>
        <Sep />
        <Author detail={tile?.detail} showDetail={hideDetail} />
      </Text>
    </Tile>
  );
}

const borderRadius = "24px 24px 0px 0px";

const StyledButtonSecondary = styled(ButtonSecondary)`
    &.light-theme {
        color: #353945 !important;
        box-shadow: inset 0 0 0 2px #808191 !important;
        &:hover {
        box-shadow: inset 0 0 0 2px #353945 !important;
        filter: none;
        }
    }
`;

const ProceedButton = styled.div`
    background: #242731;
    border-radius: 14px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        filter: brightness(2);
    }
`;

const ProceedImg = styled.img`
    flex-basis: 20px;
    transform: rotate(180deg);
`;

const SeeAllBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 32px;
    flex-direction: column;
`;

const Img = styled.div`
    width: 100%;
    height: 288px;
    background: #E6E8EC url(${(props: { src: string; }) => props.src});
    border-radius: ${borderRadius};
    background-position: center;
    background-size: cover;
`;

const StyledLink = styled(Link)`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: ${colors.neutrals1};
`;

const Text = styled.div`
    gap: 16px;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
`;

const Sep = styled.div`
    height: 1px;
    background: #E6E8EC;
`;

const Tile = styled.div`
    display: flex;
    flex-basis: calc(33.3333333333% - 24px);
    /* flex: 1; */
    font-family: "Open Sans", Arial;
    font-size: 20px;
    color: #FFF;
    text-align: center;
    border-radius: 6px;
    margin-bottom: 24px;
    color: black;
    flex-direction: column;
    gap: 24px;
    text-align: left;
    transition: transform ease-out 0.2s;
    &:hover {
        transform: translateY(-10px);
    }
    @media (max-width: ${RESPONSIVE.large}) {
        flex: 1;
        display: flex;
        flex-direction: column;
        flex-basis: calc(50% - 28px);
    }
    /* Target first Tile on Desktop */
    &.dark-theme {
        ${StyledLink} {
            color: ${colors.neutrals8};
        }
        ${Sep} {
            background: ${colors.neutrals3};
        }
    }
    &.featured {
        margin-bottom: 104px;
        &:last-child {
            /* margin-bottom: 16px; */
        }
    }
    &:first-child.featured {
        flex: 3;
        display: flex;
        flex-basis: 100%;
        margin-bottom: 135px;
        flex-direction: row;
        display: flex;
        align-items: center;
        gap: 48px;
        &:hover {
         transform: translateY(0);   
        }
        & > * {
            flex: 1;
            @media (max-width: ${RESPONSIVE.large}) {
                flex: auto;
                width: 100%;
            }
        }
        ${Img} {
            border-radius: 0%;
            height: 485px;
            @media (max-width: ${RESPONSIVE.small}) {
                height: 208px;
                border-radius: ${borderRadius};
            }
        }
        ${Text} {
            gap: 40px;
            ${StyledLink} {
                font-family: "DM Sans";
                font-style: normal;
                font-weight: 700;
                font-size: 48px;
                line-height: 56px;
                @media (max-width: ${RESPONSIVE.small}) {
                    font-weight: 700;
                    font-size: 32px;
                    line-height: 40px;
                }
            }
        }
        ${Sep} {
            display: none;
        }
        @media (max-width: ${RESPONSIVE.large}) {
            flex-direction: column;
            gap: 40px;
        }
        @media (max-width: ${RESPONSIVE.small}) {
            gap: 24px;
            margin-bottom: 80px;
            ${Sep} {
                display: none;
            }
        }
    }
    &:nth-child(2).featured, &:nth-child(3).featured, &.featured.expand-view:not(:first-child) {
        flex: 1;
        display: flex;
        flex-direction: column;
        flex-basis: calc(50% - 28px);
    }
    @media (max-width: ${RESPONSIVE.small}) {
        flex-basis: 100% !important;
    }
`;