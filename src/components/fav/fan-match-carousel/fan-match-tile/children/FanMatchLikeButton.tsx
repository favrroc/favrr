import React from "react";

import { useAppDispatch } from "../../../../../core/hooks/rtkHooks";
import { useAuthentication } from "../../../../../core/hooks/useAuthentication";
import { toggleFanMatchLikesInfo } from "../../../../../core/store/slices/fanMatchSlice";
import LikeButton2 from "../../../../button/like-button/LikeButton2";

interface Props {
  isLiveMatch: boolean;
  isLike: boolean;
  isOnFanMatchesPage: boolean;
  fanMatchId: string;
}

const FanMatchLikeButton = ({
  fanMatchId,
  isLike,
  isLiveMatch,
  isOnFanMatchesPage
}: Props) => {
  const dispatch = useAppDispatch();
  const { checkAuthentication } = useAuthentication();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (checkAuthentication()) {
      dispatch(toggleFanMatchLikesInfo({ fanMatchId: fanMatchId }));
    }
  };

  return (
    <LikeButton2
      isActive={isLike}
      onClick={handleClick}
      fromTop={12}
      fromRight={12}
      isOnLandingPage={isOnFanMatchesPage}
      isLiveMatch={isLiveMatch}
    />
  );
};

export default FanMatchLikeButton;
