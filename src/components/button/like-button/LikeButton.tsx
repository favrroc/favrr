import React from "react";
import { CSSTransition } from "react-transition-group";

import { ReactComponent as OutterStarIcon } from "../../../assets/images/outter-star.svg";
import { ReactComponent as StarIcon } from "../../../assets/images/star.svg";
import { useAppDispatch } from "../../../core/hooks/rtkHooks";
import { useAuthentication } from "../../../core/hooks/useAuthentication";
import * as favsActions from "../../../core/store/slices/favsSlice";
import "./like-button.scss";

const LikeButton = (props: {
  isFavorite: boolean | undefined | null;
  favId: number | undefined;
}) => {
  const { isFavorite, favId } = props;
  const dispatch = useAppDispatch();
  const { checkAuthentication } = useAuthentication();

  const toggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (checkAuthentication() && favId) {
      dispatch(favsActions.toggleFavLikesInfo({ favId: favId }));
    }
  };

  return (
    <button
      className={`like-button ${isFavorite ? "highlighted" : ""}`}
      onClick={toggle}
    >
      <StarIcon />
      <CSSTransition
        in={!!isFavorite}
        timeout={600}
        classNames="like-transition"
      >
        <OutterStarIcon className="colorfull-icon" />
      </CSSTransition>
    </button>
  );
};

export default LikeButton;
