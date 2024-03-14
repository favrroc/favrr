import React, { CSSProperties } from "react";

import ResponsiveImage, { BixeeImageVar } from "../../image/responsive-image/ResponsiveImage";
import favPlaceholderSrc from "../../../assets/images/person-placeholder.svg";
import "./fav-thumb.scss";

const FavThumb = (props: {
  images?: Array<BixeeImageVar> | null;
  size?: number;
  style?: CSSProperties;
}) => {
  const { images, size = 28, style } = props;

  return (
    <div
      className="fav-thumb"
      style={{ "--thumb-size": size + "px", ...style } as any}
    >
      <ResponsiveImage images={images || []} defaultImg={favPlaceholderSrc} />
    </div>
  );
};

export default FavThumb;
