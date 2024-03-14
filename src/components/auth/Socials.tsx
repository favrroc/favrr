import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import greenCheckSrc from "../../assets/images/green-check.svg";
import { Flex } from "../styleguide/styleguide";
import Social from "./social/Social";
import ComingSoon from "../social/ComingSoon";
import { ErrorIconImage, FacebookIconImage, InfoIconImage, TwitterImage } from "../assets/app-images/AppImages";

export default function Socials () {
  // social
  const [socialInit, setSocialInit] = useState(false);
  const [showConnectedStatus, setShowConnectedStatus] = useState(false);
  const [connectedStatusName, setConnectedStatusName] = useState("");
  const [connectedStatusMessage, setConnectedStatusMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState<string>("");

  const socialConnectionStatus = (provider: string, message: string) => {
    setShowConnectedStatus(true);
    setConnectedStatusName(provider);
    setConnectedStatusMessage(message);
    setTimeout(() => {
      setShowConnectedStatus(false);
    }, 5000);
  };

  useEffect(() => setSocialInit(true), []);
  
  return (
    <>
      <Label style={{ display: "flex" }}>
        Social Links
        <span
          data-for="social-tooltip"
          data-tip
          className="tooltip-icon"
        >
          <InfoIconImage />
        </span>
        <ReactTooltip
          place="top"
          effect="solid"
          className="react-tooltip react-tooltip-clickable-link"
          id="social-tooltip"
          delayHide={200}
        >
                    Adding social links helps get your account verified. <Link target={"_blank"} to="/how-it-works?targetTab=1&targetIndex=faq10">Learn More</Link>
        </ReactTooltip>
      </Label>
      <LabelP>Add your existing social links to build a stronger reputation.</LabelP>

      {/* Success Connection Status */}
      {showConnectedStatus && <ConnectedStatus>
        <img height="24" src={greenCheckSrc} alt="Check" />
        <span>Your <span style={{ textTransform: "capitalize" }}>{connectedStatusName}</span> account is {connectedStatusMessage}.</span>
      </ConnectedStatus>}

      {/* Error Connection Status */}
      {errorStatus.length > 0 ? <ConnectedStatus className="error">
        <ErrorIconImage />
        {errorStatus}
      </ConnectedStatus> : null}

      <Flex style={{ gap: "24px", flexDirection: "column", marginTop: "12px" }}>
        <Flex style={{ gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
          {socialInit && <><Flex style={{ gap: "12px" }}><FacebookIconImage />Facebook</Flex>
            <Social socialConnectionStatus={socialConnectionStatus} setErrorStatus={setErrorStatus} /></>}
        </Flex>
        <ComingSoon />
      </Flex>
    </>
  );
}

const Label = styled.label`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #FCFCFD;
`;

const LabelP = styled.p`
  color: #808191;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  margin: 0;
`;

const ConnectedStatus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  gap: 16px;
  background: rgba(63, 140, 255, 0.08);
  border-radius: 10px;
  margin-bottom: 12px;
  margin-top: 12px;
  
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  color: #7FBA7A;
  &.error {
    background: rgba(255, 162, 192, 0.08);
    color: #FFA2C0;
  }
`;