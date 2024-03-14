import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

import { FavEntity } from "../../../../generated-graphql/graphql";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { FilteredBlockchainHistory } from "../../../core/interfaces/transaction.type";
import { NotificationStatusByTxHash } from "../../../core/interfaces/user.type";
import Loader from "../../loader/Loader";
import EmptyNotificationsForm from "../empty-notifications-form/EmptyNotificationsForm";
import NotificationTile from "../notification-tile/NotificationTile";
import FanMatchNotificationTile from "./fan-match-notification-tile/FanMatchNotificationTile";
import "./notification-subscription-menu.scss";

const NotificationSubscriptionMenu = (props: {
  userTransactions: FilteredBlockchainHistory[];
  notificationStatusByTxHash: NotificationStatusByTxHash;
  loading: boolean;
  onClose?: () => void;
}) => {
  const { userTransactions, notificationStatusByTxHash, loading } = props;
  const { favsById, favs, multiFavsInfo } = useAppSelector(
    (state) => state.favs
  );
  const { fanMatchesList } = useAppSelector(
    (state) => state.fanMatch
  );

  const [displaySubscription, setDisplaySubscription] = useState(false);

  const fanMatchesWatchList = fanMatchesList.filter((fanMatch) => {
    return fanMatch?.isLike;
  });
  const hasNotifications: boolean = userTransactions?.length > 0;
  const notificationsListRef = useRef<HTMLDivElement>(null);
  const subscribeButtonContainerRef = useRef<HTMLDivElement>(null);

  // const endedFirstFavId = fanMatchesList[0]?.leftFav.id;
  // const endedSecondFavId = fanMatchesList[0]?.rightFav.id;

  // const endedFirstFavInfo = userInfo?.shareAssets.find((firstfav) => {
  //   return Number(firstfav.favInfo.id) === endedFirstFavId;
  // });

  // const endedSecondFavInfo = userInfo?.shareAssets.find((secondfav) => {
  //   return Number(secondfav.favInfo.id) === endedSecondFavId;
  // });

  // const myFav =
  //   (endedFirstFavInfo?.amount || 1) > (endedSecondFavInfo?.amount || 1)
  //     ? "first"
  //     : "second";

  // const matchResult =
  //   myFav === "first"
  //     ? endedMatchResult[0] > endedMatchResult[1]
  //       ? "Congrates, " +
  //         favsInfo[(fanMatchesList[0]?.leftFav.id || 1) - 1].displayName?.split(
  //           " "
  //         )[1] +
  //         " Won!"
  //       : "Oh no, " +
  //         favsInfo[(fanMatchesList[0]?.leftFav.id || 1) - 1].displayName?.split(
  //           " "
  //         )[1] +
  //         " Lost!"
  //     : endedMatchResult[0] > endedMatchResult[1]
  //       ? "Oh no, " +
  //       favsInfo[(fanMatchesList[0]?.rightFav.id || 1) - 1].displayName?.split(
  //         " "
  //       )[1] +
  //       " Lost!"
  //       : "Congrates, " +
  //       favsInfo[(fanMatchesList[0]?.rightFav.id || 1) - 1].displayName?.split(
  //         " "
  //       )[1] +
  //       " Won!";

  useEffect(() => {
    if (notificationsListRef.current) {
      const clientHeight = notificationsListRef.current.clientHeight;
      const scrollHeight = notificationsListRef.current.scrollHeight;
      const displayShadow = scrollHeight > clientHeight;
      subscribeButtonContainerRef.current?.style.setProperty(
        "box-shadow",
        displayShadow ? null : "none"
      );
    }
  });

  return (
    <>
      <div
        className={`notification-subscription-menu ${(displaySubscription || !hasNotifications) && !loading
          ? "subscription"
          : "notifications"
        }`}
      >
        {loading ? (
          <Loader />
        ) : hasNotifications && !displaySubscription ? (
          <>
            <h2 className="notifications-title">
              <FormattedMessage defaultMessage="Notifications" />
            </h2>
            <div className="notifications-list" ref={notificationsListRef}>
              {/* <FanMatchNotificationTile
                key={0}
                fanMatch={fanMatchesList[0]}
                title={matchResult}
                matchStatus={true}
              /> */}
              {/* {fanMatchesWatchList?.slice(1, 5).map((matchId, i) => {
                const fanMatch = fanMatchesList.find((match) => {
                  return match == matchId;
                });
                return (
                  <FanMatchNotificationTile
                    key={i + 1}
                    fanMatch={fanMatch}
                    title={""}
                    matchStatus={false}
                  />
                );
              })} */}
              {userTransactions?.map((history) => {
                const fav: FavEntity | undefined = favsById[history.favId];
                const status = notificationStatusByTxHash[history.id];

                return (
                  <NotificationTile
                    key={history.id}
                    fav={fav}
                    history={history}
                    status={status}
                  />
                );
              })}
            </div>

            <div
              className="subscription-button-container"
              ref={subscribeButtonContainerRef}
            >
              <button
                className="subscription-button"
                onClick={() => setDisplaySubscription(true)}
              >
                <FormattedMessage defaultMessage="Subscribe for Updates" />
              </button>
            </div>
          </>
        ) : (
          <EmptyNotificationsForm
            skipEmptyNotifications={hasNotifications}
            onFinish={
              hasNotifications ? () => setDisplaySubscription(false) : undefined
            }
          />
        )}
      </div>
    </>
  );
};

export default NotificationSubscriptionMenu;
