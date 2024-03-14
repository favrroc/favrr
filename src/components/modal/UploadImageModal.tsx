import React from "react";
import styled from "styled-components";

import { ErrorMessages } from "../../core/constants/messages.const";
import { colors } from "../../core/constants/styleguide.const";
import { ImageVariant } from "../../core/enums/image-variant.enum";
import { getCSSOfStyledComponent } from "../../core/util/base.util";
import Loader from "../loader/Loader";
import { ButtonPrimary, ButtonSecondary, Caption, Caption2, Headline4 } from "../styleguide/styleguide";
import ModalContent from "./children/modal-content/ModalContent";
import Modal from "./Modal";

export interface IUploadImageModalProps {
  imageVariant: ImageVariant;
  onClose: () => void;
  onOpenFile: () => void;
  hasImageDimensionError?: boolean;
  hasImageSizeError?: boolean;
  hasImageFileFormatError?: boolean;
  uploading?: boolean;
}

export default function UploadImageModal({
  imageVariant,
  onClose,
  onOpenFile,
  hasImageDimensionError,
  hasImageSizeError,
  hasImageFileFormatError,
  uploading
}: IUploadImageModalProps) {
  const handleClickSelectFile = () => onOpenFile();
  const handleClickCancel = () => onClose();

  const isAvatar = imageVariant === ImageVariant.Avatar;

  return (
    <Modal>
      <ModalContent style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "24px" }} onClose={handleClickCancel}>
        {uploading ? (
          <>
            <Loader />

            <div>
              <Caption style={{ color: colors.neutrals4 }}>
                {`Your ${isAvatar ? "avatar" : "cover image"} is uploading.`}
              </Caption>
            </div>

            <ButtonSecondary onClick={handleClickCancel} style={{ width: "100%" }}>Cancel</ButtonSecondary>
          </>
        ) : (
          <>
            <div>
              <Headline4 style={{ color: colors.neutrals7 }}>
                {imageVariant === ImageVariant.Avatar ? "Update Avatar" : "Update Cover Image"}
              </Headline4>
              <Caption style={{ color: colors.neutrals4 }}>
                {imageVariant === ImageVariant.Avatar ? "Minimum: 400px x 400px" : "Minimum: 1440px x 260px"}
                <br />
                {imageVariant === ImageVariant.Avatar ? "Max 5 MB in JPEG, PNG or GIF format" : "Max 15 MB in JPEG, PNG or GIF format"}
              </Caption>
              {(hasImageDimensionError || hasImageSizeError || hasImageFileFormatError) && (
                <StyledErrorBox>
                  {hasImageDimensionError && (
                    <div>{isAvatar ? ErrorMessages.AvatarImageDimensionError : ErrorMessages.CoverImageDimensionError}</div>
                  )}
                  {hasImageSizeError && (
                    <div>{isAvatar ? ErrorMessages.AvatarImageSizeError : ErrorMessages.CoverImageSizeError}</div>
                  )}
                  {hasImageFileFormatError && (
                    <div>{ErrorMessages.ImageFormatError}</div>
                  )}
                </StyledErrorBox>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <ButtonPrimary onClick={handleClickSelectFile} style={{ width: "100%" }}>Select File</ButtonPrimary>
              <ButtonSecondary onClick={handleClickCancel} style={{ width: "100%" }}>Cancel</ButtonSecondary>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

const StyledErrorBox = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  ${getCSSOfStyledComponent(Caption2)}
  color: ${colors.primaryPink};
`;