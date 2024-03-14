import React from "react";
import styled from "styled-components";

import { colors } from "../../../core/constants/styleguide.const";
import { useEthereum } from "../../../core/context/ethereum.context";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowConnectWalletModalAction } from "../../../core/store/slices/modalSlice";

const ConnectWalletButton = () => {
  const dispatch = useAppDispatch();
  const { isSigningMessage } = useEthereum();

  const { loadingProfile } = useAppSelector(state => state.user);

  return (
    <StyledButton
      disabled={isSigningMessage || loadingProfile}
      onClickCapture={() => dispatch(setShowConnectWalletModalAction(true))}
    >
      {isSigningMessage || loadingProfile ? "Connecting..." : "Connect Wallet"}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  border-radius: 99px;
  background-color: ${colors.primaryBlue};
  color: white;
  height: 40px;
  font-weight: bold;
  padding-left: 16px;
  padding-right: 16px;
  font-family: DM Sans;

  &:hover:not(:disabled) {
    background-color: ${colors.darkBlue};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: #212435;
  }
`;
export default ConnectWalletButton;
