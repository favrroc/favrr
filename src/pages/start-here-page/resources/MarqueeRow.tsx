import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeRow = React.memo((props: {
  direction: "left" | "right",
  images: string[];
}) => (
  <Marquee direction={props.direction} gradient={false} speed={40}>
    <div className="unicef-row">
      {props.images.map((url, index) => <img src={url} key={index} className="unicef-item" />)}
    </div>
  </Marquee>
));

export default MarqueeRow;