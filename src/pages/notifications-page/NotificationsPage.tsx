import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import NotificationSubscriptionMenu from "../../components/notification/notification-subscription-menu/NotificationSubscriptionMenu";
import { useAppSelector } from "../../core/hooks/rtkHooks";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import { homePath } from "../../core/util/pathBuilder.util";
import BasePage from "../base-page/BasePage";
import "./notifications-page.scss";

const NotificationsPage = () => {
  const { windowWidth } = useWatchResize();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userTransactions,
    notificationStatusByTxHash,
    loading,
  } = useAppSelector(state => state.user);
  
  useEffect(() => {
    if (windowWidth > 730) {
      if (location.key) {
        navigate(-1);
      } else {
        navigate(homePath(), { replace: true });
      }
    }
  }, [windowWidth < 730]);
  return (
    <BasePage className="notifications-page" displayFooter={false}>
      <NotificationSubscriptionMenu
        userTransactions={userTransactions}
        notificationStatusByTxHash={notificationStatusByTxHash}
        loading={loading}
      />
    </BasePage>
  );
};

export default NotificationsPage;
