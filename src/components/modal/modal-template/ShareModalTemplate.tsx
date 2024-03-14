import React from "react";
import styled from "styled-components";

import { colors } from "../../../core/constants/styleguide.const";
import { Headline4 } from "../../styleguide/styleguide";
import Modal from "../Modal";

interface Props {
  shareTitle: string;
  shareDescription?: string;
  children?: JSX.Element;
  shareButtonGroup: JSX.Element;
  onCloseButton: JSX.Element;
}

const ShareModalTemplate = (props: Props) => {
  const {
    shareTitle,
    shareDescription,
    children,
    shareButtonGroup,
    onCloseButton
  } = props;

  return (
    <Modal>
      <ModalContent>
        <CloseButtonDiv>{onCloseButton}</CloseButtonDiv>

        {children && <Children>{children}</Children>}

        <Headline4>{shareTitle}</Headline4>

        <StyledReactMarkDownDiv>
          {shareDescription || ""}
        </StyledReactMarkDownDiv>

        {shareButtonGroup}
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
const Children = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  width: 100%;
`;
const StyledReactMarkDownDiv = styled.div`
  margin-top: -20px;
  color: ${colors.neutrals4};
  font-family: "Poppins";
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
`;

export default ShareModalTemplate;
