import React from "react";
import { Link } from "react-router-dom";

import { FavEntity } from "../../../../../../generated-graphql/graphql";
import { useWatchResize } from "../../../../../core/hooks/useWatchResize";
import { stopAnchorMouseEventPropagination } from "../../../../../core/util/base.util";
import { favPath } from "../../../../../core/util/pathBuilder.util";

interface IFavAvatarProps {
  fav: FavEntity;
  isLiveMatch: boolean;
  isOnFanMatchesPage: boolean;
}

const FavAvatar = ({
  fav,
  isLiveMatch,
  isOnFanMatchesPage
}: IFavAvatarProps) => {
  const { smallerThanTablet } = useWatchResize();

  const avatarSize = (isLiveMatch && !smallerThanTablet && isOnFanMatchesPage) ? "88px" : "64px";

  return (
    <Link
      to={favPath(fav?.title as string)}
      onClick={stopAnchorMouseEventPropagination}
      style={{
        borderRadius: "100%",
        width: avatarSize,
        height: avatarSize,
        position: "relative",
        zIndex: "1"
      }}
    >
      <img
        src={fav?.iconImage || ""}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "100%"
        }}
      />
    </Link>
  );
};

export default FavAvatar;
