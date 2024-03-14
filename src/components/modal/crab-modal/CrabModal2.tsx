import React from "react";
import { useAppDispatch } from "../../../core/hooks/rtkHooks";
import {
  setShowCrabModal2Action,
  setShowCrabModal3AAction
} from "../../../core/store/slices/modalSlice";
import { CrabImage } from "../../assets/app-images/AppImages";
import ModalTemplate from "../modal-template/ModalTemplate";

const CrabModal2 = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <ModalTemplate
        showCloseButton={true}
        headerImage={
          <>
            <CrabImage />
          </>
        }
        closeAction={() => {
          dispatch(setShowCrabModal2Action(false));
        }}
        title={`Ready to Prove Your Claw-some Skills?`}
        primaryActionTitle={`Bring It On!`}
        secondaryActionTitle={`Not Now`}
        primaryAction={() => {
          dispatch(setShowCrabModal3AAction(true));
          dispatch(setShowCrabModal2Action(false));
        }}
        secondaryAction={() => {
          dispatch(setShowCrabModal2Action(false));
        }}
      />
    </>
  );
};

export default CrabModal2;
