import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import styled from "styled-components";
import { colors } from "../../../core/constants/styleguide.const";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import {
  Body2,
  ButtonPrimary,
  ButtonSecondary,
  Headline4
} from "../../styleguide/styleguide";
import Modal from "../Modal";

interface Props {
  showCloseButton?: boolean;
  closeAction: () => void;
  primaryActionTitle?: string;
  primaryAction?: () => void;
  secondaryActionTitle?: string;
  secondaryAction?: () => void;
  headerImage?: JSX.Element;
  title: string;
  description?: string;
  children?: Array<JSX.Element>;
  footer?: JSX.Element;
}

const ModalTemplate = (props: Props) => {
  const {
    showCloseButton,
    closeAction,
    primaryActionTitle,
    primaryAction,
    secondaryActionTitle,
    secondaryAction,
    headerImage,
    title,
    description,
    children,
    footer,
  } = props;

  return (
    <Modal>
      <ModalContent>
        {showCloseButton === true && (
          <CloseButtonDiv>
            <ModalCloseButton onClose={closeAction} />
          </CloseButtonDiv>
        )}
  
        {headerImage && <HeaderImage>{headerImage}</HeaderImage>}
  
        <Headline4>{title}</Headline4>
  
        <StyledReactMarkDownDiv>
          <StyledReactMarkDown linkTarget="_self">{description || ""}</StyledReactMarkDown>
        </StyledReactMarkDownDiv>
  
        {children && <Children>{children}</Children>}
  
        {(primaryActionTitle || secondaryActionTitle) && (
          <ActionGroup>
            <ButtonPrimary onClick={primaryAction} style={{ width: "100%" }}>
              <ButtonLabel>{primaryActionTitle}</ButtonLabel>
            </ButtonPrimary>
            <ButtonSecondary
              onClick={secondaryAction}
              style={{ width: "100%" }}
            >
              <ButtonLabel>{secondaryActionTitle}</ButtonLabel>
            </ButtonSecondary>
          </ActionGroup>
        )}
  
        {footer && <Footer>{footer}</Footer>}
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 32px 32px 32px;
  align-items: center;
  background-color: ${colors.neutrals1};
  border: 1px solid ${colors.neutrals2};
  box-shadow: 0px 64px 64px -48px rgba(31, 47, 70, 0.12);
  width: 384px;
  border-radius: 20px;
  gap: 32px;
  margin: auto;
`;

const CloseButtonDiv = styled.div`
  position: relative;
  display: flex;
  align-items: end;
  width: 100%;
`;

const HeaderImage = styled.div`
  display: flex;
  border-radius: 100%;
  background: rgba(63, 140, 255, 0.08);
  justify-content: center;
  align-items: center;
  width: 128px;
  height: 128px;
  margin: auto;
  img {
    width: 116px;
    height: 116px;
  }
`;

const Children = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 12px;
`;

const ButtonLabel = styled.span`
  font-family: "DM Sans";
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
`;

const StyledReactMarkDownDiv = styled.div`
  margin-top: -20px;
  color: ${colors.neutrals4};
  font-family: "Poppins";
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`;

const StyledReactMarkDown = styled(ReactMarkdown)`
  text-align: center;
  a {
    color: ${colors.primaryBlue};
    font-weight: 500;
  }
`;
export default ModalTemplate;
