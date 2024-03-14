import React, { useEffect, useState } from "react";

import { ButtonPrimary, ButtonSecondary, IconButton, IconSecondaryButton } from "../../../components/styleguide/styleguide";
import { sizes } from "../../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { FollowButtonTypes } from "../../../core/interfaces/follow.type";
import { follow, unfollow } from "../../../core/store/slices/participantsSlice";

import minusIconSrc from "../../../assets/images/utility-icons/minus.svg";
import plusIconSrc from "../../../assets/images/utility-icons/plus.svg";
import whiteMinusIconSrc from "../../../assets/images/utility-icons/white-minus.svg";
import { useAuthentication } from "../../../core/hooks/useAuthentication";

interface Props {
  type: FollowButtonTypes,
  following: boolean,
  followAddress: string;
}
const FollowButton = (props: Props) => {
  const { type, following, followAddress } = props;
  const { checkAuthentication } = useAuthentication();
  const address = useAppSelector(state => state.user.profile.address);

  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(false);

  const onClickFollow = async () => {
    if (checkAuthentication()) {
      setDisabled(true);
      await dispatch(follow(followAddress));
      setDisabled(false);
    }
  };

  const onClickUnfollow = async () => {
    setDisabled(true);
    await dispatch(unfollow(followAddress));
    setDisabled(false);
  };

  useEffect(() => {
    setDisabled(followAddress === address);
  }, [address, followAddress]);

  const followButtonStyle = {
    width: "90px",
    height: "40px",
    fontSize: sizes.sm
  };

  return type === FollowButtonTypes.Button ?
    following ? (
      <ButtonSecondary
        onClick={onClickUnfollow}
        style={followButtonStyle}
        disabled={disabled}
      >
        Unfollow
      </ButtonSecondary>
    ) : (
      <ButtonPrimary
        onClick={onClickFollow}
        style={followButtonStyle}
        disabled={disabled}
      >
        {followAddress === address ? "Unfollow" : "Follow"}
      </ButtonPrimary>
    ) : (
      following ? (
        <IconSecondaryButton onClick={onClickUnfollow} disabled={disabled}>
          <img src={minusIconSrc} />
        </IconSecondaryButton>
      ) : (
        <IconButton onClick={onClickFollow} disabled={disabled}>
          <img src={followAddress === address ? whiteMinusIconSrc : plusIconSrc} />
        </IconButton>
      )
    );
};

export default FollowButton;