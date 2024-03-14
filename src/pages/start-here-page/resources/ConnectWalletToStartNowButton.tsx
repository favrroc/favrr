import React from "react";
import { FormattedMessage } from "react-intl";

import { ButtonPrimary } from "../../../components/styleguide/styleguide";
import { useAppDispatch } from "../../../core/hooks/rtkHooks";
import { setShowConnectWalletModalAction } from "../../../core/store/slices/modalSlice";

const ConnectWalletToStartNowButton = () => {
  const dispatch = useAppDispatch();

  return (
    <ButtonPrimary onClick={() => dispatch(setShowConnectWalletModalAction(true))}>
      <FormattedMessage defaultMessage="Connect Wallet to Start Now" />
    </ButtonPrimary>
  );
};

export default ConnectWalletToStartNowButton;
