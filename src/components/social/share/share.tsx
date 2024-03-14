import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";

import chainSrc from "../../../assets/images/chain.svg";
import emailSrc from "../../../assets/images/icon-email.svg";
import facebookSrc from "../../../assets/images/social-icons/icon-facebook.svg";
import twitterSrc from "../../../assets/images/social-icons/icon-twitter.svg";
import "./share.scss";

interface Props {
  url: string;
  sharetitle?: string;
  sharesubject?: string;
}

const Share = (props: Props) => {
  const { sharetitle, sharesubject } = props;
  const [actionMessage, setActionMessage] = useState<boolean>(false);

  const toggleCopied = () => {
    setActionMessage(true);
    setTimeout(() => setActionMessage(false), 1000);
  };
  return (
    <div className="share-component" style={{ position: "relative" }}>
      <div
        className="share-button"
        style={{
          marginBottom: props.sharetitle != "Profile Updated!" ? 0 : "inherit"
        }}
      >
        <FacebookShareButton
          quote={sharetitle}
          url={props.url}
        >
          <img src={facebookSrc} alt="Facebook Share Link" />
        </FacebookShareButton>
        <TwitterShareButton
          title={sharetitle}
          url={props.url}
          via="oceana.mrkt"
        >
          <img src={twitterSrc} alt="Twitter Share Link" />
        </TwitterShareButton>
        <EmailShareButton
          url={`${props.url}`}
          subject={sharesubject || "Shared Oceana.market profile"}
          body={sharetitle}
          className="hide-sm"
        >
          <img src={emailSrc}></img>
        </EmailShareButton>
        <CopyToClipboard text={props.url} onCopy={toggleCopied}>
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <img src={chainSrc} alt="URL Share Link" />
          </button>
        </CopyToClipboard>
      </div>
      {actionMessage && <span className="click-status">Copied!</span>}
    </div>
  );
};

export default Share;
