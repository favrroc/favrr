import React, { useEffect, useRef } from "react";

import SocialConnectButton from "../social-connect-button/SocialConnectButton";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { UserEntity } from "../../../../generated-graphql/graphql";

import * as participantsActions from "../../../core/store/slices/participantsSlice";
import * as userActions from "../../../core/store/slices/userSlice";

enum socialNameTypes {
  facebook = "facebookInfo"
}

type FacebookType = {
  authResponse: {
    accessToken: string;
    graphDomain: string;
  }
};

type SocialType = {
  authResponse: {
    accessToken?: string;
    graphDomain?: string;
  }
};

interface Props {
  socialConnectionStatus: (provider: string, message: string) => void;
  setErrorStatus: (data: string) => void;
}

const Social = (props: Props) => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(state => state.user);

  const handleSocialLogin = async (user: FacebookType) => {
    console.log(user);
    
    await postApi(user);
  };

  const handleSocialLoginFailure = (err: any) => {
    console.log(err);
  };

  const handleLogoutSuccess = async () => {
    console.log("Logout");
  };

  const facebookButtonRef = useRef<null | HTMLButtonElement>();

  const logoutPostApi = async () => {
    const newProfile: UserEntity = {...profile};
    newProfile.facebookInfo = "";
    dispatch(userActions.updateUserProfile(newProfile));
    dispatch(participantsActions.updateOneParticipant(newProfile));
  };

  const postApi = async (data: SocialType) => {
    const newProfile: UserEntity = {...profile};
    newProfile[socialNameTypes[data.authResponse.graphDomain as keyof typeof socialNameTypes]] = `${data.authResponse.accessToken}`;
    dispatch(userActions.updateUserProfile(newProfile));
    dispatch(participantsActions.updateOneParticipant(newProfile));
    props.socialConnectionStatus(
      data.authResponse.graphDomain || "Facebook",
      data.authResponse.accessToken === "" ? "successfully disconnected" : "connected",
    );
  };

  const onLoginClick = () => {
    // (window as any).FB.getLoginStatus(function(res: FacebookType) {
    (window as any).FB.login(function(res: FacebookType) {
      handleSocialLogin(res);
    }, true);
  };

  useEffect(() => {
    (window as any).fbAsyncInit = () => {
      (window as any).FB.init({
        appId            : "577511370479095",
        autoLogAppEvents : true,
        xfbml            : true,
        version          : "v11.0"
      });
    };
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      let js = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      if(js) {
        js = d.createElement(s); js.id = id;
        (js as HTMLImageElement).src = "https://connect.facebook.net/en_US/sdk.js";
        fjs?.parentNode?.insertBefore(js, fjs);
      }
    }(document, "script", "facebook-jssdk"));
  }, []);

  return (
    <>
      <SocialConnectButton
        handlelogUserOut={() => postApi({authResponse: {
          accessToken: "",
          graphDomain: "facebook",
        }})}
        socialdata={profile?.facebookInfo || ""}
        login={onLoginClick}
        setErrorStatus={props.setErrorStatus}
      >
        Connect
      </SocialConnectButton>
    </>
  );
};

export default Social;