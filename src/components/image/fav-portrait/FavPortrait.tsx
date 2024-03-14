import React from "react";
import styled from "styled-components";
import { BixeeImageVar, FavEntity } from "../../../../generated-graphql/graphql";
import ipoBannerDesktopSrc from "../../../assets/images/desktop_IPO.png";
import imgPlaceholder from "../../../assets/images/img-placeholder.svg";
import { default as ipoBannerMobileSrc, default as ipoBannerTabletSrc } from "../../../assets/images/tablet_IPO.png";
import LikeButton from "../../button/like-button/LikeButton";
import FavBadge from "../../fav/fav-badge/FavBadge";
import ResponsiveImage from "../responsive-image/ResponsiveImage";
import "./fav-portrait.scss";

interface Props {
  image?: Array<BixeeImageVar>;
  fav?: FavEntity;
  isTop10?: FavEntity;
  isIPO: boolean;
}
const FavPortrait = (props: Props) => {
  const { fav } = props;
  return (
    <div className="fav-portrait">
      {fav && (
        <LikeButton
          isFavorite={fav?.isLike}
          favId={fav?.id}
        />
      )}
      <ResponsiveImage
        className="fav-image"
        images={props.image}
        defaultImg={imgPlaceholder}
      />
      {props.isIPO ? <IPOBanner /> : null}
      {props.isTop10 && <FavBadge styles={{borderRadius: "0 0 16px 0px"}} />}
    </div>
  );
};

const IPOBanner = styled.div`
  background: url(${ipoBannerDesktopSrc}) no-repeat -9px bottom;
  background-size: cover;
  height: 195px;
  width: 100%;
  position: absolute;
  bottom: 32px;
  left: 0;
  @media screen and (max-width: 1024px){
    height: 270px;
    background: url(${ipoBannerTabletSrc}) no-repeat -9px bottom;
    background-size: cover;
  }
  @media screen and (max-width: 850px){
    background: url(${ipoBannerTabletSrc}) no-repeat -13px center;
    background-size: cover;
    height: 200px;
  }
  @media screen and (max-width: 576px){
    background: url(${ipoBannerMobileSrc}) no-repeat -9px bottom;
    background-size: cover;
    height: 137px;
    bottom: 0;
  }
`;

export default FavPortrait;
