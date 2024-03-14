import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { News } from "../../../../generated-graphql/graphql";
import emptyNewsSrc from "../../../assets/images/news.svg";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import * as favsActions from "../../../core/store/slices/favsSlice";
import LoadMoreButton from "../../button/load-more-button/LoadMoreButton";
import Loader from "../../loader/Loader";
import NewsTile from "../news-tile/NewsTile";
import "./news-list.scss";

const NewsList = (props: {
  favKeys: string[];
}) => {
  const { favKeys } = props;
  const dispatch = useAppDispatch();
  const { windowWidth } = useWatchResize();
  const { loadingNews, newsData, hasMoreNews } = useAppSelector(state => state.favs);

  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    const newHorizontal = windowWidth >= 660;
    if (newHorizontal != horizontal) {
      setHorizontal(newHorizontal);
    }
  }, [windowWidth]);

  const loadMore = (skip: number) => {
    dispatch(favsActions.loadNews({ favKeys: favKeys || [], skip }));
  };

  useEffect(() => {
    loadMore(0);
  }, []);

  const tileOrientation = horizontal ? "row" : "column";

  return (
    <div className={`news-list ${newsData.length === 0 ? "empty" : ""}`}>
      {newsData.map((news, i) =>
        <NewsTile
          key={`News-${i}`}
          orientation={tileOrientation}
          newsInfo={news as News}
        />
      )}
      {
        !loadingNews && newsData.length === 0 && (
          <>
            <img src={emptyNewsSrc} className="empty-news" />
            <span className="empty-news-label">
              <FormattedMessage defaultMessage="No News Yet" />
            </span>
          </>
        )
      }
      {hasMoreNews && <div className="load-more-container">
        {loadingNews ? <Loader /> : <LoadMoreButton onClick={() => loadMore(newsData.length)} />}
      </div>
      }
    </div >
  );
};

export default React.memo(NewsList);
