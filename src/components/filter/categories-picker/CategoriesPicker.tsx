import React, { useCallback, useRef } from "react";
import { useIntl } from "react-intl";

import { scrollToTopOfExplore } from "../../../core/util/base.util";
import ScrollShadowOverlay from "../../layout/scroll-shadow-overlay/ScrollShadowOverlay";

import { CATEGORIES } from "../../../core/constants/categories.const";
import "./categories-picker.scss";

interface ButtonProps {
  category: {
    id: null | string;
    message: {
      defaultMessage: string;
    };
  };
}

const CategoriesPicker = (props: {
  selectedCategories: Array<string>;
  setSelectedCategories: (categories: Array<string>) => void;
}) => {
  const { selectedCategories, setSelectedCategories } = props;

  const intl = useIntl();

  const CategoryButton = useCallback(
    (props: ButtonProps) => {
      const isSelected =
        selectedCategories.find((id) => id == props.category.id) ||
        (selectedCategories.length == 0 && props.category.id == null);

      const handleClickCategory = () => {
        if (isSelected) {
          setSelectedCategories(
            selectedCategories.filter((id) => id != props.category.id)
          );
        } else {
          const newSelectedCategories =
            props.category.id == null ? [] : [props.category.id];
          setSelectedCategories(
            newSelectedCategories.length ==
              Object.keys(CATEGORIES).length - 1
              ? []
              : newSelectedCategories
          );
        }
        scrollToTopOfExplore();
      };

      return (
        <button
          className={`category-button ${isSelected ? "selected" : ""}`}
          onClick={handleClickCategory}
        >
          {intl.formatMessage(props.category.message)}
        </button>
      );
    },
    [selectedCategories, setSelectedCategories]
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <ScrollShadowOverlay
      scrollElementRef={scrollRef}
      className="categories-picker"
      hideVerticalOverlay
    >
      <div className="categories-scroll" ref={scrollRef}>
        <CategoryButton category={CATEGORIES.all} />
        <CategoryButton category={CATEGORIES.politicians} />
        <CategoryButton category={CATEGORIES.celebrities} />
        <CategoryButton category={CATEGORIES.athletes} />
        <CategoryButton category={CATEGORIES.entrepreneurs} />
        <CategoryButton category={CATEGORIES.activists} />
      </div>
    </ScrollShadowOverlay>
  );
};

export default CategoriesPicker;
