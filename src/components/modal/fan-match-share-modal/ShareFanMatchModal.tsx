import dayjs from "dayjs";
import React from "react";

import { FavEntity } from "../../../../generated-graphql/graphql";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowShareFanMatchModalAction } from "../../../core/store/slices/modalSlice";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import FanMatchTile from "../../fav/fan-match-carousel/fan-match-tile/FanMatchTile";
import Share from "../../social/share/share";
import ShareModalTemplate from "../modal-template/ShareModalTemplate";

export interface IShareFanMatchProps {
  fanMatchId: string;
  url?: string;
  shareTitle?: string;
}

const ShareFanMatchModal = (_props: IShareFanMatchProps) => {
  const dispatch = useAppDispatch();
  const { shareFanMatchModalProps } = useAppSelector((state) => state.modal);
  const {
    fanMatchesList,
    loadingFanMatchesList,
    liveMatchResults,
    loadingFanMatchStatsData
  } = useAppSelector((state) => state.fanMatch);

  const { favsById } = useAppSelector(
    (state) => state.favs
  );

  const fanMatch = fanMatchesList.find((match) => {
    return match.id == shareFanMatchModalProps.fanMatchId;
  });

  const closeModal = () => {
    dispatch(setShowShareFanMatchModalAction({ showModal: false }));
  };

  const isLoadingStats = loadingFanMatchStatsData;
  const defaultLiveMatchDate = dayjs().add(1, "week");

  const isLiveMatch =
    dayjs(fanMatchesList[0]?.expiredAt).diff(dayjs(), "week") === 0;

  return (
    <ShareModalTemplate
      onCloseButton={<ModalCloseButton onClose={closeModal} />}
      shareTitle="Share Match"
      shareDescription="Share this match to help your fave win!"
      shareButtonGroup={
        <Share
          sharetitle={shareFanMatchModalProps.shareTitle as string}
          url={shareFanMatchModalProps.url as string}
        />
      }
    >
      <div style={{ pointerEvents: "none", width: "100%" }}>
        <FanMatchTile
          isLoading={
            (loadingFanMatchesList && !fanMatchesList[0]?.id) || isLoadingStats
          }
          title={fanMatch?.title || ""}
          firstFav={favsById[fanMatch?.leftFav.id || 1] as FavEntity}
          secondFav={favsById[fanMatch?.rightFav.id || 1] as FavEntity}
          liveFanMatchResults={isLiveMatch ? liveMatchResults : undefined}
          endDate={dayjs(fanMatch?.expiredAt || defaultLiveMatchDate).toDate()}
          isLiveMatch={false}
          isOnFanMatchesPage={false}
          fanMatchId={fanMatch?.id || ""}
          isLike={Boolean(fanMatch?.isLike)}
          isSharing={true}
        />
      </div>
    </ShareModalTemplate>
  );
};

export default ShareFanMatchModal;
