import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { EmptyStateTypes } from "../../core/interfaces/emptystate.type";
import { increaseNumOfLoadedFollower, increaseNumOfLoadedFollowing } from "../../core/store/slices/followSlice";
import { ParticipantInfo } from "../../core/store/slices/participantsSlice";
import ShowMoreButton from "../button/show-more-button/ShowMoreButton";
import Loader from "../loader/Loader";
import EmptyState from "./children/EmptyState";
import FollowRow from "./children/FollowRow";

interface Props {
  isFollowingTab: boolean;
  data: Array<ParticipantInfo>;
  public?: boolean;
}

const FollowTab = (props: Props) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isFollowingTab, data } = props;

  const { loadingFavs } = useAppSelector(state => state.favs);
  const { loadingParticipantsData, loadingFollowingsAddress, loadingFollowersAddress } = useAppSelector(state => state.participants);
  const { numOfLoadedFollower, numOfLoadedFollowing } = useAppSelector(state => state.follow);
  const [hasMore, setHasMore] = useState(false);

  const numOfLoadedRows = isFollowingTab ? numOfLoadedFollowing[location.pathname] : numOfLoadedFollower[location.pathname];
  const increaseNumOfLoadedRows = isFollowingTab ? increaseNumOfLoadedFollowing : increaseNumOfLoadedFollower;

  useEffect(() => {
    if (!numOfLoadedRows) {
      dispatch(increaseNumOfLoadedRows(location.pathname));
      return;
    }
    setHasMore(() => numOfLoadedRows < data.length);
    if ((numOfLoadedRows+1) >= data.length) {
      if (!(numOfLoadedRows > data.length)) {
        setHasMore(() => false);
        handleShowMore();
      }
    }
  }, [data, numOfLoadedRows]);

  const handleShowMore = () => {
    dispatch(increaseNumOfLoadedRows(location.pathname));
  };

  return (loadingFavs || loadingParticipantsData) ? (
    <Loader wrapperStyle={{ minHeight: "312px" }} />
  ) : isFollowingTab && loadingFollowingsAddress ? (
    <Loader wrapperStyle={{ minHeight: "312px" }} />
  ) : !isFollowingTab && loadingFollowersAddress ? (
    <Loader wrapperStyle={{ minHeight: "312px" }} />
  ) : data.length > 0 ? (
    <>
      {data.slice(0, numOfLoadedRows).map(row => (
        <FollowRow
          key={`${isFollowingTab ? "following" : "follower"}-${row.rank}`}
          follow={row}
          hasMore={hasMore}
          numOfLoadedRows={numOfLoadedRows}
        />
      ))}
      {hasMore && (
        <>
          <div style={{ margin: "auto", marginBottom: "32px" }}>
            <ShowMoreButton onAction={handleShowMore} />
          </div>

          <FollowRow
            key={`${isFollowingTab ? "following" : "follower"}-last`}
            follow={data[data.length - 1]}
            hasMore={hasMore}
            numOfLoadedRows={numOfLoadedRows}
            className="last-button"
          />
        </>
      )}
    </>
  ) : (
    <EmptyState public={!!props.public} variant={props.isFollowingTab ? EmptyStateTypes.Followings : EmptyStateTypes.Followers} />
  );
};

export default FollowTab;