import React from "react";
import { FormattedMessage } from "react-intl";
import { colors } from "../../../core/constants/styleguide.const";

import { formatNumber, Unit } from "../../../core/util/string.util";
import { Caption2, Caption2Bold } from "../../styleguide/styleguide";
import "./progress-bar.scss";

const ENDING_SHARES_THRESHOLDS = 0.1;

const ProgressBar = (props: {
  sharesTotal: number;
  sharesLeft: number;
  isIpo?: boolean;
}) => {
  const { sharesTotal, sharesLeft } = props;

  const formattedSharesLeft = formatNumber({ value: sharesLeft, unit: Unit.SHARE, summarize: false });
  const formattedSharesTotal = formatNumber({ value: sharesTotal, unit: Unit.SHARE, summarize: true });

  const progress = sharesTotal === 0 ? 0 : sharesLeft / sharesTotal;
  const progressPercentage = progress * 100;

  return (
    <>
      <div
        className={`progress-bar ${progress > ENDING_SHARES_THRESHOLDS ? "green" : "pink"}`}
        style={
          {
            "--progress-percentage": `${progressPercentage}%`,
          }
        }
      />
      <div
        className={
          progress > ENDING_SHARES_THRESHOLDS
            ? "many-available"
            : "few-available"
        }
      >
        {progress > ENDING_SHARES_THRESHOLDS ? (
          <span className="remaining-shares">
            <FormattedMessage
              defaultMessage="<White>{sharesLeft}</White><Grey> of {sharesTotal} IPO Shares Left</Grey>"
              values={{
                sharesLeft: formattedSharesLeft,
                sharesTotal: formattedSharesTotal,
                White: (content: JSX.Element) => (
                  <Caption2Bold style={{ color: colors.neutrals8 }}>{content}</Caption2Bold>
                ),
                Grey: (content: JSX.Element) => (
                  <Caption2 style={{ color: colors.grey }}>{content}</Caption2>
                ),
              }}
            />
          </span>
        ) : (
          <>
            {progress === 0 ? <span>
              {`🔥 ${props.isIpo ? "IPO " : ""}Shares Sold Out`}
            </span> : <span>
              <FormattedMessage
                defaultMessage="Only {value} IPO Shares Left 🔥"
                values={{ value: formattedSharesLeft }}
              />
            </span>}
          </>
        )}
      </div>
    </>
  );
};

export default ProgressBar;
