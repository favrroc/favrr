import React from "react";
import { Link } from "react-router-dom";

import "./tag-button.scss";

interface Props {
  label: string;
  url: string;
}
const TagButton = (props: Props) => {
  return (
    <Link className="tag-button" to={props.url}>
      {props.label}
    </Link>
  );
};

export default TagButton;
