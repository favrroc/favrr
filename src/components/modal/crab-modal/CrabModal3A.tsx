import dayjs from "dayjs";
import React from "react";
import { FavEntity } from "../../../../generated-graphql/graphql";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { updateUserMatchStatusAction } from "../../../core/store/slices/fanMatchSlice";
import {
  setShowCrabModal3AAction,
  setShowCrabModal3BAction
} from "../../../core/store/slices/modalSlice";
import { CrabImage } from "../../assets/app-images/AppImages";
import FanMatchTile from "../../fav/fan-match-carousel/fan-match-tile/FanMatchTile";
import ModalTemplate from "../modal-template/ModalTemplate";
import CrabModalStatudsBar from "./CrabModalStatudsBar";

const CrabModal3A = () => {
  const dispatch = useAppDispatch();
  const {
    fanMatchesList,
    loadingFanMatchesList,
    liveMatchResults,
    userStatus
  } = useAppSelector((state) => state.fanMatch);

  const { favsById } = useAppSelector((state) => state.favs);

  const { userInfo } = useAppSelector((state) => state.user);

  const endedFirstFavId = fanMatchesList[0]?.leftFav.id;
  const endedSecondFavId = fanMatchesList[0]?.rightFav.id;

  const endedFirstFavInfo = userInfo?.shareAssets.find((firstfav) => {
    return Number(firstfav.favInfo.id) === endedFirstFavId;
  });

  const endedSecondFavInfo = userInfo?.shareAssets.find((secondfav) => {
    return Number(secondfav.favInfo.id) === endedSecondFavId;
  });

  const myFav =
    (endedFirstFavInfo?.amount || 1) < (endedSecondFavInfo?.amount || 1)
      ? "first"
      : "second";

  const matchResult =
    myFav === "first"
      ? liveMatchResults[0] > liveMatchResults[1]
        ? "win"
        : "lost"
      : liveMatchResults[0] > liveMatchResults[1]
        ? "lost"
        : "win";

  const primaryAction = () => {
    if (!userStatus.started) {
      dispatch(updateUserMatchStatusAction({ started: true, step: 1 }));
    } else {
      if (matchResult === "win") {
        dispatch(updateUserMatchStatusAction({ started: false, step: 2 }));
        dispatch(setShowCrabModal3BAction(true));
        dispatch(setShowCrabModal3AAction(false));
      }
    }
    console.log("userStatus", userStatus);
  };

  return (
    <ModalTemplate
      showCloseButton={true}
      closeAction={() => {
        dispatch(setShowCrabModal3AAction(false));
      }}
      headerImage={
        <>
          <CrabImage />
        </>
      }
      title={`You've Got This!`}
      description={`Win 3 challenges to climb the food chain and reach coveted [Blowfish status](/?targetTab=1&targetIndex=faq05).`}
      primaryActionTitle={`Start Now`}
      primaryAction={primaryAction}
      secondaryActionTitle={`Cancel`}
      secondaryAction={() => {
        dispatch(setShowCrabModal3AAction(false));
      }}
    >
      <FanMatchTile
        isLoading={loadingFanMatchesList}
        title={fanMatchesList[0]?.title || ""}
        firstFav={favsById[fanMatchesList[0]?.leftFav.id] as FavEntity}
        secondFav={favsById[fanMatchesList[0]?.rightFav.id] as FavEntity}
        endDate={dayjs(fanMatchesList[0]?.expiredAt).toDate() as Date}
        isLiveMatch={false}
        isOnFanMatchesPage={false}
        liveFanMatchResults={liveMatchResults}
        fanMatchId={fanMatchesList[0]?.id as string}
        isLike={fanMatchesList[0]?.isLike as boolean}
      />
      <CrabModalStatudsBar progress={0} />
    </ModalTemplate>
  );
};

export default CrabModal3A;
