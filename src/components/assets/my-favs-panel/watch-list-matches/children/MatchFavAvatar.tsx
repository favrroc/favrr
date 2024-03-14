import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { FavEntity } from "../../../../../../generated-graphql/graphql";
import { stopAnchorMouseEventPropagination } from "../../../../../core/util/base.util";
import { favPath } from "../../../../../core/util/pathBuilder.util";

interface IMatchFaveAvatarProps {
  fav: FavEntity;
}

const MatchFaveAvatar = ({ fav }: IMatchFaveAvatarProps) => (
  <StyledLink
    to={favPath(fav?.title as string)}
    onClick={stopAnchorMouseEventPropagination}
  >
    <Thumbnail src={fav?.iconImage} />
  </StyledLink>
);

const Thumbnail = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 100%;
`;

const StyledLink = styled(Link)`
  border-radius: 100%;
`;
export default MatchFaveAvatar;
