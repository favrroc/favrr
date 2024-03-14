import React from "react";

import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowLateralMenu } from "../../../core/store/slices/modalSlice";
import LateralMenu from "../../header/children/lateral-menu/LateralMenu";

import burgerSrc from "../../../assets/images/burger.svg";
import "./burger-button.scss";

const BurgerButton = () => {
  const dispatch = useAppDispatch();
  const showLateralMenu = useAppSelector(state => state.modal.showLateralMenu);

  return (
    <button className="burger-button">
      <img src={burgerSrc} onClick={() => dispatch(setShowLateralMenu(!showLateralMenu))} />
      {showLateralMenu && <LateralMenu onClose={() => dispatch(setShowLateralMenu(false))} />}
    </button>
  );
};

export default BurgerButton;
