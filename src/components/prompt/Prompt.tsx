import React from "react";
import type { unstable_Blocker as Blocker } from "react-router-dom";
import ModalContent from "../modal/children/modal-content/ModalContent";
import Modal from "../modal/Modal";
import { ButtonPrimary, ButtonSecondary, Flex } from "../styleguide/styleguide";
import alertIconSrc from "./../../assets/images/alert-icon.svg";

export const FormPrompt = ({ blocker, actionsave }: { blocker: Blocker, actionsave: () => void; }) => {
  if (blocker.state === "blocked") {
    return (
      <Modal>
        <ModalContent className="share-profile-modal" onClose={() => blocker.reset?.()}>
          <Flex style={{ flexDirection: "column", gap: "32px", alignItems: "center" }}>
            <img src={alertIconSrc} alt="Alert unsaved changes" width="128" height="128" style={{ marginTop: "32px" }} />
            <h2 className="text-center">Unsaved Changes</h2>
            <Flex style={{ width: "100%", gap: 12, justifyContent: "center" }}>
              <ButtonSecondary style={{ maxWidth: "176px", flex: 1, padding: "0 16px" }} onClick={() => blocker.proceed?.()}>{"Don't Save"}</ButtonSecondary>
              <ButtonPrimary style={{ maxWidth: "176px", flex: 1, padding: "0 16px" }} onClick={() => { blocker.reset?.(); actionsave(); }}>Save</ButtonPrimary>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    );
  }
  else if (blocker.state === "proceeding") {
    return (
      <Modal><ModalContent className="share-profile-modal">Proceeding ...</ModalContent></Modal>
    );
  }
  else {
    return <></>;
  }
};
