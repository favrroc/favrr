import React, { useMemo } from "react";

import { BixeeImageVar } from "../../../../generated-graphql/graphql";

interface Props {
  images?: Array<BixeeImageVar>;
  defaultImg?: string;
  className?: string;
}
const ResponsiveImage = (props: Props) => {
  const srcSet = useMemo(() => {
    return (
      props.images
        ?.filter((image) => image.key != "default")
        .map((image) => {
          let srcsetDescriptor = image.key || "";
          if (image.key == "x1") {
            srcsetDescriptor = "1x";
          } else if (image.key == "x2") {
            srcsetDescriptor = "2x";
          } else if (image.key == "x3") {
            srcsetDescriptor = "3x";
          } else return ` ${image.image} ${srcsetDescriptor}`;
        })
        .join(",") || undefined
    );
  }, [props.images]);

  const defaultImg = useMemo(() => {
    return props.images?.find((image) => image.key === "default");
  }, [props.images, props.defaultImg]);

  const fallbackToDefaultImg = !defaultImg;

  return (
    <img
      srcSet={srcSet}
      className={`${fallbackToDefaultImg ? "default-img" : ""} ${props.className || ""
      }`}
      src={
        fallbackToDefaultImg ? props.defaultImg : (defaultImg?.image as string)
      }
    />
  );
};

export default ResponsiveImage;
