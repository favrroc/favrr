import dayjs from "dayjs";
import React from "react";
import { FavEntity } from "../../../../generated-graphql/graphql";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { updateUserMatchStatusAction } from "../../../core/store/slices/fanMatchSlice";
import { setShowCrabModal3BAction, setShowCrabModal3CAction } from "../../../core/store/slices/modalSlice";
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

  const closeModal = () => {
    dispatch(setShowCrabModal3BAction(false));
  };

  const { userInfo } = useAppSelector(state => state.user);

  const endedFirstFavId = fanMatchesList[1]?.leftFav.id;
  const endedSecondFavId = fanMatchesList[1]?.rightFav.id;

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
      dispatch(updateUserMatchStatusAction({ started: true, step: 2 }));
    } else {
      if (matchResult === "win" || matchResult === "lost") {
        dispatch(updateUserMatchStatusAction({ started: false, step: 3 }));
        dispatch(setShowCrabModal3CAction(true));
        dispatch(setShowCrabModal3BAction(false));
      }
    }
    console.log("userStatus", userStatus);
  };
  return (
    <ModalTemplate
      showCloseButton={true}
      closeAction={() => {
        dispatch(closeModal);
      }}
      headerImage={
        <>
          <CrabImage />
        </>
      }
      title={`Just 2 To Go!`}
      description={`Win 2 more challenges to reach [Blowfish status](/?targetTab=1&targetIndex=faq05).`}
      primaryActionTitle={`Start Now`}
      primaryAction={primaryAction}
      secondaryActionTitle={`Cancel`}
      secondaryAction={closeModal}
    >
      <FanMatchTile
        isLoading={loadingFanMatchesList}
        title={fanMatchesList[1]?.title || ""}
        firstFav={favsById[fanMatchesList[1]?.leftFav.id] as FavEntity}
        secondFav={favsById[fanMatchesList[1]?.rightFav.id] as FavEntity}
        endDate={dayjs(fanMatchesList[1]?.expiredAt).toDate() as Date}
        isLiveMatch={false}
        isOnFanMatchesPage={false}
        liveFanMatchResults={liveMatchResults}
        fanMatchId={fanMatchesList[1]?.id as string}
      />
      <CrabModalStatudsBar progress={1} />
    </ModalTemplate>
  );
};

export default CrabModal3A;
