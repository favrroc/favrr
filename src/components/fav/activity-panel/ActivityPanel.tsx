import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import {
  FavEntity, LimitOrderStatus
} from "../../../../generated-graphql/graphql";
import { FavInfo, OrderType, Stage } from "../../../../generated-subgraph/graphql";
import infoSrc from "../../../assets/images/info.svg";
import { CURRENCY } from "../../../core/constants/base.const";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../../core/hooks/useLowercasedAccount";
import { FilteredBlockchainHistory } from "../../../core/interfaces/transaction.type";
import * as favsActions from "../../../core/store/slices/favsSlice";
import { setShowBuySellModal } from "../../../core/store/slices/modalSlice";
import { extractFavStatisticsInfo } from "../../../core/util/base.util";
import { favPath, howItWorksPath } from "../../../core/util/pathBuilder.util";
import { Unit, formatNumber } from "../../../core/util/string.util";
import { OceanaCoinImage } from "../../assets/app-images/AppImages";
import LoadMoreButton from "../../button/load-more-button/LoadMoreButton";
import Loader from "../../loader/Loader";
import OrderBook from "../../orders/order-book/OrderBook";
import TimeSince from "../../time/time-since/TimeSince";
import Tooltip, { TooltipBody, TooltipTitle } from "../../tooltip/Tooltip";
import "./activity-panel.scss";
import { oceanaShareExContract } from "../../../core/constants/contract";

const ActivityPanelItem = (props: {
  history: FilteredBlockchainHistory;
  profile: {
    img: string;
    title: string;
    address: string;
    fullName: string;
  };
  isActivity: boolean;
  displayCoin?: boolean;
  activatedTab?: ActivityTab;
  fav?: FavEntity;
  address?: string;
}) => {
  const { history, profile, isActivity, displayCoin, activatedTab, fav } = props;

  const descriptionVariables = {
    Types: (content: JSX.Element) => (
      <span className="types-label">{content}</span>
    ),
    User: (content: JSX.Element) => (
      <span className="user-label">
        <Link to={`${props.profile.address === props.address ? "/portfolio" : `/fan/${props.profile?.fullName || props.profile?.address}`}`}>
          {content}
        </Link>
      </span>
    ),
    username: props.profile?.title,
    Shares: (content: JSX.Element) => (
      <span className="shares-label">{content}</span>
    ),
    shares: formatNumber({ value: history.amount, unit: Unit.SHARE, summarize: true }),
    Price: (content: JSX.Element) => (
      <span className="price-label">{content}</span>
    ),
    price: formatNumber({ value: history.ppsBefore, unit: Unit.USDC, summarize: false }),
    Coin: (content: JSX.Element) =>
      displayCoin ? (
        <Link
          to={favPath(history.favId.toString() as string)}
          className="coin-label"
        >
          {content}
        </Link>
      ) : null,
    coinName: displayCoin ? history.favId : null,
    CURRENCY: CURRENCY
  };

  const renderDescription = () => {
    if (history.id === "ipo") {
      return <FormattedMessage
        defaultMessage="IPOed at <Price>{price} {CURRENCY}</Price>"
        values={{ ...descriptionVariables }}
      />;
    }
    else if (history.id === "trading") {
      return <FormattedMessage
        defaultMessage="Trading at <Price>{price} {CURRENCY}</Price>"
        values={{ ...descriptionVariables }}
      />;
    }
    return <FormattedMessage
      defaultMessage="<Types>{orderType, select, BUY {Bought} SELL {Sold} other {}}</Types> <Shares>{shares} {shares, select, 1 {share} other {shares}}</Shares> {coinName, select, null {} other {of}} <Coin>{coinName}</Coin> at {ipo, select, true {IPO for} other {}} <Price>{price} {CURRENCY}</Price> by <User>{username}</User>"
      values={{ ...descriptionVariables, orderType: history.type, ipo: history.stage === Stage.Ipo }}
    />;
  };

  return (
    <div className="activity-panel-item">
      <div className={`userthumb ${isActivity ? "favrr-action" : (profile?.img ? "" : "userthumb-placeholder")}`}>
        {activatedTab == ActivityTab.DETAILS ? <img
          className="userthumb-image"
          alt="Fav Thumbnail"
          src={
            fav?.iconImage
              ? fav?.iconImage
              : OceanaCoinImage().props.src
          }
        /> :
          <Link to={`${props.profile.address === props.address ? "/portfolio" : `/fan/${props.profile?.fullName || props.profile?.address}`}`}><img
            className="userthumb-image"
            alt="Thumbnail"
            src={
              isActivity
                ? OceanaCoinImage().props.src
                : (profile?.img || OceanaCoinImage().props.src)
            }
          /></Link>}
      </div>
      <span className={`event-description ${history.type === OrderType.Buy ? "buy-order" : "sell-order"}`}>{renderDescription()}</span>
      <TimeSince date={new Date(history.createdAt).toISOString()} />
    </div>
  );
};

enum ActivityTab {
  HISTORY,
  DETAILS,
  ORDER_BOOK,
}

const ActivityPanel = (props: {
  activities: FilteredBlockchainHistory[];
  loading: boolean;
  hasMore: boolean;
  fetchMore: () => void;
  fav?: FavEntity;
  isIPO: boolean;
  displayCoin?: boolean;
  holdingShares: number;
  favInfo: FavInfo;
  activatedTab: ActivityTab;
}) => {
  const dispatch = useAppDispatch();
  const { address } = useLowercasedAccount();
  const { activities, loading, hasMore, fetchMore, fav, isIPO, displayCoin, holdingShares, favInfo, activatedTab } = props;
  const { participantsInfoByAddress } = useAppSelector(state => state.participants);

  const renderEmptyActivityPanel = () => (
    <div className="empty-activity-panel">
      <h3 className="title">
        <FormattedMessage defaultMessage="Nothing Yet" />
      </h3>
      <div className="text">
        <FormattedMessage
          defaultMessage="Be the 1st to buy <Shares>{shareName} shares</Shares> {ipoCaseText}to get the greatest return on your investment. <Link>Learn more</Link>"
          values={{
            Link: (content: JSX.Element) => (
              <Link to={howItWorksPath(2, "buyingAndSelling02")} className="learn-more">
                {content}
              </Link>
            ),
            Shares: (content: JSX.Element) => (
              <span className="shares-label">{content}</span>
            ),
            shareName: fav?.coin,
            ipoCaseText: isIPO ? "during the IPO " : ""
          }}
        />
      </div>
      <button
        className="action-button primary-button"
        onClick={() => dispatch(setShowBuySellModal({
          showModal: true, props: {
            fav: fav as FavEntity,
            isIPO,
            orderType: OrderType.Buy,
            favInfo,
            holdingShares
          }
        }))}
      >
        <FormattedMessage defaultMessage="Buy Now" />
      </button>
    </div >
  );

  return (
    <div className="activity-panel">
      {loading ? (
        <Loader />
      ) : (
        <>
          {activities?.length === 0 && renderEmptyActivityPanel()}
          {activities.map((history, i) => {
            if (participantsInfoByAddress[history.address]?.profile.address as string !== undefined || true) {
              return (<ActivityPanelItem
                key={i}
                history={history}
                profile={{
                  img: participantsInfoByAddress[history.address]?.profile.profileImageUrl as string,
                  title: participantsInfoByAddress[history.address]?.displayName as string,
                  address: participantsInfoByAddress[history.address]?.profile.address as string,
                  fullName: participantsInfoByAddress[history.address]?.profile.fullName as string
                }}
                isActivity={false}
                displayCoin={displayCoin}
                activatedTab={activatedTab}
                fav={fav}
                address={address}
              />);
            }
          })}
          {hasMore && (
            <div className="load-more-container">
              <LoadMoreButton onClick={fetchMore} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const FavActivityPanel = (props: {
  fav: FavEntity;
  loading: boolean;
  blockchainHistoriesData: FilteredBlockchainHistory[];
  holdingShares: number;
}) => {
  const dispatch = useAppDispatch();
  const { fav, loading, blockchainHistoriesData, holdingShares } = props;
  const { multiFavsInfo } = useAppSelector(state => state.favs);
  const { data: favInfo, isIPO } = extractFavStatisticsInfo(multiFavsInfo, fav?.id);

  const ITEMS_PER_PAGE = 4;

  const [activatedTab, setActivatedTab] = useState<ActivityTab>(ActivityTab.HISTORY);
  const [historyShowAmount, setHistoryShowAmount] = useState<number>(ITEMS_PER_PAGE);

  const filteredBlockchainHistories: FilteredBlockchainHistory[] = React.useMemo(
    () => blockchainHistoriesData.filter((_o, idx) => idx < historyShowAmount),
    [blockchainHistoriesData, historyShowAmount]
  );
  const tradingStartPrice = blockchainHistoriesData.at(blockchainHistoriesData.length - 1)?.pps || 1;
  const activityHistories: FilteredBlockchainHistory[] = useMemo(() => {
    const details = [{
      id: "ipo",
      address: "",
      amount: favInfo?.circulatingSupply,
      createdAt: oceanaShareExContract.deployedTime,
      favId: 0,
      pps: favInfo?.ipoPrice,
      ppsBefore: favInfo?.ipoPrice,
      stage: Stage.Ipo,
      type: OrderType.Buy,
      status: LimitOrderStatus.Fulfilled
    }];
    if (!isIPO) {
      details.push({
        id: "trading",
        address: "",
        amount: favInfo?.circulatingSupply,
        createdAt: favInfo?.ipoEndTime || 0,
        favId: 0,
        pps: tradingStartPrice,
        ppsBefore: tradingStartPrice,
        stage: Stage.Ipo,
        type: OrderType.Buy,
        status: LimitOrderStatus.Fulfilled
      });
    }

    return details.reverse();
  }, [favInfo, isIPO, tradingStartPrice]);

  const hasMore: boolean = historyShowAmount < blockchainHistoriesData.length;
  const fetchMore: () => void = () => setHistoryShowAmount(historyShowAmount + ITEMS_PER_PAGE);
  const hideTabsHeader = isIPO && activatedTab == ActivityTab.HISTORY && (blockchainHistoriesData.length === 0) && false;

  useEffect(() => {
    setActivatedTab(ActivityTab.HISTORY);
    if (!isIPO) {
      dispatch(favsActions.loadLimitBuyOrdersByFavId({ favId: fav.id, skip: 0 }));
      dispatch(favsActions.loadLimitSellOrdersByFavId({ favId: fav.id, skip: 0 }));
    }
  }, [isIPO]);

  const renderOrderBookTab = () => (
    <>
      {isIPO ? null : (
        <button
          className={`activity-tab order-book-tab ${activatedTab == ActivityTab.ORDER_BOOK ? "active-tab" : ""}`}
          onClick={() => setActivatedTab(ActivityTab.ORDER_BOOK)}
          style={{ marginLeft: "12px" }}
        >
          <FormattedMessage defaultMessage="Order book" />
          <Tooltip
            tooltip={
              <div className="whats-an-order">
                <TooltipTitle>
                  <FormattedMessage defaultMessage="What's an order book?" />
                </TooltipTitle>
                <TooltipBody>
                  An order book is a record of all the limit orders for a particular celeb stock. It shows how many shares of the celeb stock people are willing to buy or sell at different prices. <Link to={howItWorksPath(2, "buyingAndSelling04")}
                    className="learn-more">Learn more</Link>
                </TooltipBody>
              </div>
            }
            position="top"
          >
            <img src={infoSrc} />
          </Tooltip>
        </button>
      )}
    </>
  );

  const renderHistoryTab = () => (
    <>
      <button
        className={`activity-tab ${activatedTab == ActivityTab.HISTORY ? "active-tab" : ""}`}
        onClick={() => setActivatedTab(ActivityTab.HISTORY)}
        style={{ marginRight: "12px" }}
      >
        <FormattedMessage defaultMessage="history" />
      </button>
    </>
  );

  const renderDetailsTab = () => (
    <>
      <button
        className={`activity-tab ${activatedTab == ActivityTab.DETAILS ? "active-tab" : ""}`}
        onClick={() => setActivatedTab(ActivityTab.DETAILS)}
      >
        <FormattedMessage defaultMessage="details" />
      </button>
    </>
  );

  return (
    <>
      <div
        className="activity-panel-tabs"
        style={{ visibility: hideTabsHeader ? "hidden" : undefined }}
      >
        {renderHistoryTab()}
        {renderDetailsTab()}
        {renderOrderBookTab()}
      </div>
      {activatedTab == ActivityTab.ORDER_BOOK ? (
        <OrderBook favId={fav.id} />
      ) : (
        <ActivityPanel
          fav={fav}
          isIPO={isIPO}
          loading={loading}
          hasMore={activatedTab === ActivityTab.HISTORY ? hasMore : false}
          fetchMore={fetchMore}
          activities={activatedTab === ActivityTab.HISTORY ? filteredBlockchainHistories : activityHistories}
          favInfo={favInfo}
          holdingShares={holdingShares}
          activatedTab={activatedTab}
        />
      )}
    </>
  );
};

export default ActivityPanel;
