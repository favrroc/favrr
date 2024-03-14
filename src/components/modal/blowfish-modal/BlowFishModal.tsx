import React from "react";
import styled from "styled-components";
import { colors } from "../../../core/constants/styleguide.const";
import { BlowfishImage } from "../../assets/app-images/AppImages";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import { Body2, ButtonPrimary, Headline4 } from "../../styleguide/styleguide";
import ModalTemplate from "../modal-template/ModalTemplate";

const BlowFishModal = () => {
  return (
    <>
      <ModalTemplate
        closeButton={
          <ModalCloseButton onClose={close} />
        }
        avata={
          <>
            <BlowfishImage />
          </>
        }
        descriptionTitle={
          <>
            <Headline4>
              {`Lorem Ipsum Dolor`}
            </Headline4>
            <StyledBody2Bold>
              {`Coming Soon`}
            </StyledBody2Bold>
          </>
        }
        descriptionContent={
          undefined
        }
        content={
          undefined
        }
        status={
          undefined
        }
        formGroup={
          <>
            <ButtonPrimary style={{ width: "100%" }}>
              <StyledButtonLabel>
                {`OK`}
              </StyledButtonLabel>
            </ButtonPrimary>
          </>
        }
        footer={
          <></>
        }
      />
    </>
  );
};

const StyledButtonLabel = styled.span`
  font-family: "DM Sans";
  font-size: 16px;
  line-height: 16px;
  text-align: center;
  color: ${colors.neutrals8}
`;

const StyledBody2Bold = styled(Body2)`
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${colors.neutrals4};
`;
export default BlowFishModal;