import React, { HTMLProps } from "react";
import { FormattedMessage } from "react-intl";

import Loader from "../../loader/Loader";
import { ButtonSecondary } from "../../styleguide/styleguide";

const LoadMoreButton = (
  props: HTMLProps<HTMLButtonElement> & { loading?: string; }
) => {
  return props.loading !== "true" ? (
    <ButtonSecondary {...props}>
      <FormattedMessage defaultMessage="More" />
    </ButtonSecondary>
  ) : (
    <Loader />
  );
};

export default LoadMoreButton;
