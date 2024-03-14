import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSwitchNetwork } from "wagmi";

import { CHAIN } from "../../../core/constants/base.const";
import { colors } from "../../../core/constants/styleguide.const";
import { CrossImage } from "../../assets/app-images/AppImages";
import BorderedButton from "../../button/bordered-button/BorderedButton";
import Loader from "../../loader/Loader";
import { ButtonPrimary, Caption1, Flex, H4 } from "../../styleguide/styleguide";
import Modal from "../Modal";
import ModalContent from "../children/modal-content/ModalContent";

const WrongNetworkModal = (props: { onClose?: () => void; }) => {
  const { switchNetwork } = useSwitchNetwork();

  const handleClickSwitchNetwork = () => {
    switchNetwork?.(CHAIN.id);
  };

  useEffect(() => {
    return () => document.location.reload();
  }, []);

  return (
    <Modal>
      <ModalContent style={{ textAlign: "center" }}>
        {props.onClose && <Flex className="justify-end">
          <BorderedButton
            buttonProps={{ className: "close-button", onClick: props.onClose }}
            iconSrc={CrossImage().props.src}
          />
        </Flex>}
        <Loader wrapperStyle={{ marginBottom: "24px" }} />
        <div style={{ marginBottom: "16px" }}>
          <H4 style={{ color: colors.neutrals8 }}>Wrong Network</H4>
        </div>
        <Caption1 style={{ color: colors.neutrals4 }}>
          <FormattedMessage
            defaultMessage="To continue, please switch your network to <Network>{network}</Network>"
            values={{
              Network: (content: JSX.Element) => (
                <>
                  <br />
                  <span style={{ fontWeight: 700, color: colors.neutrals8 }}>{content}</span>
                </>
              ),
              network: CHAIN.name
            }}
          />
        </Caption1>
        <ButtonPrimary style={{ marginTop: "32px", width: "100%", position: "relative", zIndex: 2 }} onClick={handleClickSwitchNetwork}>
          <FormattedMessage defaultMessage="Switch Now" />
        </ButtonPrimary>
      </ModalContent>
    </Modal>
  );
};

export default WrongNetworkModal;
