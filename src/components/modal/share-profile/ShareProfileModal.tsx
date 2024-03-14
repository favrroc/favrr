import React from "react";
import Modal from "../Modal";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowShareProfileModal } from "../../../core/store/slices/modalSlice";
import { portfolioPath } from "../../../core/util/pathBuilder.util";
import Share from "../../social/share/share";
import { ButtonPrimary, ButtonSecondary, Flex } from "../../styleguide/styleguide";
import ModalContent from "../children/modal-content/ModalContent";
import "./share-profile.scss";

export interface IShareProfileProps {
  img?: string;
  url?: string;
  sharetitle?: string;
  customAction?: boolean;
  public?: boolean;
}

const ShareProfileModal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { shareProfileModalProps } = useAppSelector(state => state.modal);

  const closeModal = () => {
    dispatch(setShowShareProfileModal({ showModal: false }));
  };
  const handleClickDone = () => {
    closeModal();
    if (shareProfileModalProps.customAction) {
      navigate(portfolioPath());
    }
  };

  return (
    <Modal>
      <ModalContent className="share-profile-modal" onClose={closeModal}>
        <div className="content margin-top-20">
          <div className="content-inner">
            <div className="purchased-nft-thumbnail">
              <img src={shareProfileModalProps.img} alt="NFT Thumbnail" />
            </div>
          </div>
        </div>
        <h2
          className="text-center"
          style={{ display: "block", marginTop: 32 }}
        >
          <span className="buy-title">
            {shareProfileModalProps.sharetitle}
          </span>
        </h2>
        <div className="content" style={{ marginTop: 6 }}>
          {!shareProfileModalProps.public && <div className="content-inner bid-info-box text-center">
            Share your profile to grow your influence.
          </div>}
          <div className="content-inner" style={{marginTop: shareProfileModalProps.public ? 32 : 0}}>
            <Share sharetitle={shareProfileModalProps.sharetitle} url={shareProfileModalProps.url || ""} />
          </div>
          <Flex style={{ gap: 12 }}>
            {shareProfileModalProps.customAction && (
              <ButtonSecondary onClick={closeModal} style={{ flex: 1 }}>
                Keep Editing
              </ButtonSecondary>
            )}
            {shareProfileModalProps.sharetitle == "Profile Updated!" && (
              <ButtonPrimary style={{ flex: 1 }} onClick={handleClickDone}>
                Done
              </ButtonPrimary>
            )}
          </Flex>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ShareProfileModal;
