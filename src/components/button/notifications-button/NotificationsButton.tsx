import React, { useEffect, useState } from "react";

import {
  NotificationStatus
} from "../../../../generated-graphql/graphql";
import notificationSrc from "../../../assets/images/notification.svg";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import * as userActions from "../../../core/store/slices/userSlice";
import { OceanaCoinImage } from "../../assets/app-images/AppImages";
import MobileUserMenu from "../../header/children/mobile-user-menu/MobileUserMenu";
import PopupFullpageResponsive from "../../modal/popup-full-page-responsive/PopupFullPageResponsive";
import NotificationSubscriptionMenu from "../../notification/notification-subscription-menu/NotificationSubscriptionMenu";
import "./notifications-button.scss";

interface Props {
  avatar?: string;
}

const NotificationsButton = (props: Props) => {
  const { profile } = useAppSelector(state => state.user);
  const {
    userTransactions,
    notificationStatusByTxHash,
    hasUnreadNotifications,
    loading,
  } = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const { windowWidth } = useWatchResize();

  const userSrc = props.avatar || OceanaCoinImage().props.src;

  const isMobileLayout = windowWidth <= 750;

  useEffect(() => {
    if (userTransactions && notificationStatusByTxHash) {
      const len = userTransactions.length;
      let foundUnread = false;

      for (let i = 0; i < len; ++i) {
        const status = notificationStatusByTxHash[userTransactions[i].id];

        if (status == NotificationStatus.Unread) {
          foundUnread = true;
          dispatch(
            userActions.updateUserInfo({ hasUnreadNotifications: true })
          );
          break;
        }
      }

      if (!foundUnread) {
        dispatch(userActions.updateUserInfo({ hasUnreadNotifications: false }));
      }
    }
  }, [userTransactions, notificationStatusByTxHash]);

  return (
    <div className="notifications-button">
      <img
        className={`notification-img ${isMobileLayout ? "user-img" : "notification-icon"
        }`}
        src={isMobileLayout ? profile?.profileImageUrl || userSrc : notificationSrc}
        height={31}
        width={31}
        onClick={(e) => {
          if (displayNotifications) {
            e.stopPropagation();
            e.preventDefault();
          }
          //This slight async delay allows for the click to propagante before the useClickOutside listener is added
          setTimeout(() => {
            setDisplayNotifications(!displayNotifications);
          }, 0);
        }}
      />
      {hasUnreadNotifications && <div className="notification-marker" />}
      {displayNotifications &&
        (isMobileLayout ? (
          <MobileUserMenu
            onClose={() => {
              if (displayNotifications) {
                setDisplayNotifications(false);
              }
            }}
          />
        ) : (
          <PopupFullpageResponsive
            onClose={() => setDisplayNotifications(false)}
          >
            <NotificationSubscriptionMenu
              userTransactions={userTransactions}
              notificationStatusByTxHash={notificationStatusByTxHash}
              loading={loading}
              onClose={() => setDisplayNotifications(false)}
            />
          </PopupFullpageResponsive>
        ))}
    </div>
  );
};

export default NotificationsButton;
