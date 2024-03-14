import React from "react";

import searchSrc from "../../assets/images/search.svg";
import "./search-button.scss";

const SearchButton = () => {
  return (
    <button type="button" className="search-button">
      <img src={searchSrc} />
    </button>
  );
};

export default SearchButton;
