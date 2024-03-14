import dayjs from "dayjs";
import React, { useMemo, useState } from "react";

import { News } from "../../../../generated-graphql/graphql";
import outlinkSrc from "../../../assets/images/arrow.svg";
import "./news-tile.scss";

interface Props {
  orientation: "column" | "row";
  newsInfo: News;
}

const NewsTile = (props: Props) => {
  const icons = props.newsInfo.bixees[0]?.icons || [];
  const date = dayjs(props.newsInfo.date);
  const now = dayjs();

  const [hoverImage, setHoverImage] = useState(false);

  const imageSrc = useMemo(() => {
    if (props.newsInfo.image) {
      return props.newsInfo.image;
    }
    if (!icons?.length) {
      return null;
    }
    const image2x = icons.find(
      (icon) => icon?.key == "x2"
    )?.image;

    return image2x || icons[0]?.image;
  }, [props.newsInfo.image, icons]) as string;
  return (
    <div
      className={`news-tile ${props.orientation || "row"} ${hoverImage ? "hover" : ""
      }`}
    >
      <a
        className="image-link"
        href={props.newsInfo.link as string}
        target="__blank"
        referrerPolicy="no-referrer"
        onMouseEnter={() => setHoverImage(true)}
        onMouseLeave={() => setHoverImage(false)}
      >
        <img className={`thumbnail`} src={imageSrc} />
      </a>
      <div className="news-content">
        <a
          href={props.newsInfo.link as string}
          className="title"
          target="__blank"
          referrerPolicy="no-referrer"
        >
          {props.newsInfo.title}
          <img className="out-link-arrow" src={outlinkSrc} />
        </a>
        <div className="source-date">
          {props.newsInfo.source ? (
            <span className="source">{props.newsInfo.source}</span>
          ) : null}
          <span className="date">
            {date.format(date.year() == now.year() ? "MMM DD" : "MMM DD, YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsTile;
