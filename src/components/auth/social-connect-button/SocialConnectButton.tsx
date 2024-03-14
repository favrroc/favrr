import React, { useEffect, useState } from "react";
import SocialLogin from "react-social-login";
import { ButtonPrimary, ButtonSecondary } from "../../styleguide/styleguide";
import styled from "styled-components";
import closeSrc from "../../../assets/images/close.svg";
import Tooltip from "../../tooltip/Tooltip";

type SocialResponseType = {
  id?: string;
  name?: string;
};

const SocialConnectButton = (props: any) => {
  const { children, triggerLogin } = props;
  const [socialData, setSocialData] = useState<SocialResponseType>();
  const [error, setError] = useState<boolean>(false);

  useEffect(()=> {
    const fetchSocial = async () => {
      try {
        const res = await fetch(`https://graph.facebook.com/v16.0/me?fields=id%2Cname&access_token=${props?.socialdata}`);
        const data = await res.json();
        if (data?.error) {
          setError(true);
          props.setErrorStatus("Your Facebook connection has expired.");
        } else {
          setSocialData(data);
          setError(false);
          props.setErrorStatus("");
        }
      } catch (e) {
        console.log(e);
        setError(true);
        props.setErrorStatus("Your Facebook token caused an error, please try again.");
      }
    };
    if(props.socialdata) {
      fetchSocial();
    } else {
      setSocialData({});
    }
  },[props.socialdata]);

  if(error) {
    return (
      <StyledButtonSecondary className="error" type="button" onClick={props.login} {...props}>
        {"Reconnect Now"}
      </StyledButtonSecondary>
    );
  }

  return (
    <>
      {socialData?.name ?
        <ConnectedButtonBox>
          <Tooltip
            tooltip={
              <>
                Disconnect
              </>
            }
            position="top"
          >
            <StyledButtonSecondary type="button" style={{padding: "0 25px", gap: "13px"}} onClick={() => {props.handlelogUserOut();}}>
              <img src={closeSrc} alt="Logout Social User" height="14" width="14" />
              {socialData?.name}
            </StyledButtonSecondary>
          </Tooltip>
        </ConnectedButtonBox>
        :
        <StyledButtonPrimary type="button" onClick={props.login} {...props}>
          {children}
        </StyledButtonPrimary>
      }
    </>
  );
};

export default SocialConnectButton;

const StyledButtonPrimary = styled(ButtonPrimary)`
  font-size: 14px;
  height: 40px;
`;

const StyledButtonSecondary = styled(ButtonSecondary)`
  font-size: 14px;
  height: 40px;
  &:hover {
    filter: brightness(2);
  }
  &.error {
    box-shadow: inset 0 0 0 2px #FFA2C0;
    color: #FFA2C0;
  }
`;

const ConnectedButtonBox = styled.div`
  .tooltip-box {
    text-align: center;
    width: auto !important;
    font-family: 'Poppins';
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    text-align: right;
    color: #FCFCFD;
  }
`;