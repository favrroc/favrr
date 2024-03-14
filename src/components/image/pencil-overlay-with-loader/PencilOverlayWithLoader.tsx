import React from "react";
import styled from "styled-components";
import { colors } from "../../../core/constants/styleguide.const";

import { PencilImage } from "../../assets/app-images/AppImages";
import Loader from "../../loader/Loader";

interface Props {
  isMouseHovered: boolean;
  rounded?: boolean;
  uploading?: boolean;
}
const PencilOverlayWithLoader = ({ isMouseHovered, rounded, uploading }: Props) => {
  return (
    <>
      {(isMouseHovered || uploading) && (
        <StyledContainer rounded={!!rounded}>
          {uploading ? (
            <Loader />
          ) : (
            <PencilImage size="large" />
          )}
        </StyledContainer>
      )}
    </>
  );
};

const StyledContainer = styled.div<Props>`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: ${colors.neutrals4};
  opacity: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${(props: Props) => props.rounded ? "100%" : 0};
  overflow: hidden;
  cursor: pointer !important;
`;

export default PencilOverlayWithLoader;