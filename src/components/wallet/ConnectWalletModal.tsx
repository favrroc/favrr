import { useWeb3Modal } from "@web3modal/react";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { HashLink } from "react-router-hash-link";
import styled from "styled-components";
import { Address, Connector, useConnect } from "wagmi";

import {
  CHAIN,
  ENV_STAGE,
  StorageKeys,
  WalletsData
} from "../../core/constants/base.const";
import { colors } from "../../core/constants/styleguide.const";
import { useEthereum } from "../../core/context/ethereum.context";
import { useAppDispatch } from "../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../core/hooks/useLowercasedAccount";
import {
  setShowConnectWalletModalAction,
  setShowLateralMenu
} from "../../core/store/slices/modalSlice";
import { howItWorksPath } from "../../core/util/pathBuilder.util";
import { CrossImage } from "../assets/app-images/AppImages";
import BorderedButton from "../button/bordered-button/BorderedButton";
import Modal from "../modal/Modal";
import ModalContent from "../modal/children/modal-content/ModalContent";
import {
  Body2Bold,
  Caption1,
  Caption2,
  Flex,
  H4
} from "../styleguide/styleguide";
import Tooltip, { TooltipBody, TooltipTitle } from "../tooltip/Tooltip";

const ConnectWalletModal = () => {
  const dispatch = useAppDispatch();
  const { setDefaultChain } = useWeb3Modal();
  const { connect, connectors } = useConnect();
  const { address, isConnected, connector: activeConnector } = useLowercasedAccount();
  const { signMessage, resetWalletSignStatus } = useEthereum();

  useEffect(() => {
    setDefaultChain(CHAIN);
  }, [setDefaultChain]);

  const onClose = () => {
    dispatch(setShowConnectWalletModalAction(false));
    dispatch(setShowLateralMenu(false));
  };

  const handleClickButton = (e: MouseEvent, connector: Connector<any, any>) => {
    resetWalletSignStatus();
    if (connector.ready) {
      e.preventDefault();
      localStorage.setItem(StorageKeys.RecentConnectorId, connector.id);
      isConnected && activeConnector?.id === connector.id
        ? signMessage(address as Address)
        : connect({ connector });
    }
    onClose();
  };

  return (
    <Modal>
      <ModalContent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          backgroundColor: colors.neutrals2,
          overflow: "visible"
        }}
      >
        <Flex style={{ justifyContent: "space-between" }}>
          <H4 style={{ color: colors.neutrals8 }}>Connect Wallet</H4>
          <BorderedButton
            buttonProps={{ className: "close-button", onClick: onClose }}
            iconSrc={CrossImage().props.src}
          />
        </Flex>
        <div className="modal-subtitl">
          <span
            style={{
              color: colors.neutrals8,
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <Body2Bold>{`It's time to connect your wallet!`}</Body2Bold>
            <Tooltip
              tooltip={
                <>
                  <TooltipTitle>
                    <FormattedMessage defaultMessage="What's a wallet?" />
                  </TooltipTitle>
                  <TooltipBody>
                    <FormattedMessage
                      defaultMessage="
                          Wallets manage all your digital assets. They can be added as either a browser extension or an app on your phone. <Link>Learn more</Link>"
                      values={{
                        Link: (content: JSX.Element) => (
                          <HashLink
                            to={howItWorksPath(1, "faq01")}
                            className="learn-more"
                            onClick={() => onClose()}
                          >
                            {content}
                          </HashLink>
                        )
                      }}
                    />
                  </TooltipBody>
                </>
              }
              position="top"
            >
              <span
                className="text-link"
                style={{
                  color: colors.primaryBlue,
                  marginLeft: "4px",
                  zIndex: 10
                }}
              >{`What's a wallet?`}</span>
            </Tooltip>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {connectors.map((connector) => (
            <StyledWalletProviderButton
              key={connector.id}
              onClick={(e: MouseEvent) => handleClickButton(e, connector)}
              referrerPolicy="no-referrer"
              rel="noreferrer"
              href={WalletsData[connector.id].website}
              target="_blank"
              style={{ padding: "10px" }}
            >
              <IconByConnectorId
                src={WalletsData[connector.id].icon}
              ></IconByConnectorId>
              <Body2Bold
                style={{
                  color: colors.neutrals8,
                  marginLeft: "12%",
                  fontSize: "16px",
                  textAlign: "justify"
                }}
              >
                {connector.name}
              </Body2Bold>
            </StyledWalletProviderButton>
          ))}
          {ENV_STAGE !== "dev" && (
            <StyledWalletProviderButton
              key={"coinbase"}
              disabled={true}
              onClick={(e: MouseEvent) => {
                e.preventDefault();
              }}
              referrerPolicy="no-referrer"
              rel="noreferrer"
              // href={`${ENV_STAGE === "dev" ? WalletsData["coinbaseWallet"].website : ""}`}
              target="_blank"
              style={{
                padding: "10px",
                border: "solid 1px transparent",
                cursor: "not-allowed"
              }}
            >
              <IconByConnectorId
                src={WalletsData["coinbaseWallet"].icon}
              ></IconByConnectorId>
              <Body2Bold
                style={{
                  color: colors.neutrals4,
                  marginLeft: "12%",
                  fontSize: "16px",
                  textAlign: "justify",
                  display: "flex",
                  flexWrap: "wrap"
                }}
              >
                {"Coinbase "}
                <SpecializedSpan>{`(Coming Soon)`}</SpecializedSpan>
              </Body2Bold>
            </StyledWalletProviderButton>
          )}
        </div>
        <Caption2
          style={{
            color: colors.neutrals4,
            textAlign: "center",
            padding: "0 10px"
          }}
        >
          Oceana.Market does not own your private key and cannot access your
          funds without your confirmation.
        </Caption2>
      </ModalContent>
    </Modal>
  );
};

const StyledWalletProviderButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 32px;
  gap: 32px;
  margin-bottom: 12px;
  border: solid 1px transparent;
  box-sizing: border-box;

  width: 100%;
  height: 90px;

  background-color: #1f2128;
  border-radius: 16px;
  &:hover {
    border: solid 1px ${colors.neutrals3};
  }
  &:hover > * {
    color: ${colors.neutrals4} !important;
  }
`;

const IconByConnectorId = styled.img`
  margin: auto 0px;
  width: 10%;
  padding-left: 32px;
`;

const SpecializedSpan = styled(Caption1)`
  margin-left: 5px;
  @media screen and (max-width: 576px) {
    margin-left: 0px;
  }
`;

export default ConnectWalletModal;
