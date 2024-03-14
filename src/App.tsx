import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Address, useContractEvent, useNetwork, useWalletClient } from "wagmi";

import { UserEntity } from "../generated-graphql/graphql";
import { BACKEND_API_ENDPOINT } from "./core/constants/base.const";
import { oceanaShareExContract } from "./core/constants/contract";
import {
  SOCKET_EVENT_ADDFUNDS,
  SOCKET_EVENT_CONNECT,
  SOCKET_EVENT_DISCONNECT,
  SOCKET_EVENT_EMAILVERIFIED,
  SOCKET_EVENT_MULTIFAVSINFO,
  SOCKET_EVENT_PARTICIPANTSINFO
} from "./core/constants/socket.const";
import { useEthereum } from "./core/context/ethereum.context";
import { useAppDispatch, useAppSelector } from "./core/hooks/rtkHooks";
import { useBalance } from "./core/hooks/useBalance";
import { useLowercasedAccount } from "./core/hooks/useLowercasedAccount";
import { WyreOrderActionType } from "./core/interfaces/transaction.type";
import { loadAllFanMatches } from "./core/store/slices/fanMatchSlice";
import * as favsActions from "./core/store/slices/favsSlice";
import {
  setShowAddFundsModalAction,
  setShowFundsAddedModalAction,
  setShowSignRejectedModalAction,
  setshowSigningModalAction
} from "./core/store/slices/modalSlice";
import * as participantsActions from "./core/store/slices/participantsSlice";
import { updateSecondsOnApp } from "./core/store/slices/usageSlice";
import * as userActions from "./core/store/slices/userSlice";
import * as wyreActions from "./core/store/slices/wyreSlice";
import {
  setDepositAmountThunk,
  setIsDepositingThunk
} from "./core/store/slices/wyreSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const { chain } = useNetwork();
  const { address, isConnected } = useLowercasedAccount();
  const { isSuccess: isWalletClientLoaded } = useWalletClient();
  const { signMessage, isSigningMessage, isSignError } = useEthereum();
  const { syncBalance } = useBalance();

  const { profile, isLoggedIn } = useAppSelector((o) => o.user);
  const { loadingParticipantsData, participantsData } = useAppSelector(
    (o) => o.participants
  );

  const socket = React.useMemo(
    () => io(BACKEND_API_ENDPOINT.replace("https://", "wss://")),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_connected, setIsConnected] = useState(false);
  const [eventFavId, setEventFavId] = useState(1);

  const refreshApp = async () => {
    setTimeout(() => {
      if (address && eventFavId) {
        dispatch(userActions.loadNotificationsStatus(address));
        dispatch(userActions.loadUserTransactions(address));
        dispatch(userActions.loadHistoricalUserInfo(address));
        dispatch(favsActions.loadHistoricalFavInfo(eventFavId));
        dispatch(userActions.loadUserInfo(address));
        dispatch(favsActions.loadBlockchainHistoriesByFavId(eventFavId));
        dispatch(participantsActions.loadFollowersAddress(address));
        dispatch(participantsActions.loadFollowingsAddress(address));

        syncBalance();
      }
    }, 15000);
  };

  // auto connect wallet manually to avoid "Request method eth_chainId is not supported Version: viem@0.3.37" error
  // useEffect(() => {
  //   walletClient.requestAddresses();
  // }, [walletClient]);

  useEffect(() => {
    const startTime = window.performance.now();

    const interval = setInterval(() => {
      const currentTime = window.performance.now();
      const elapsedTime = (currentTime - startTime) / 1000;
      dispatch(updateSecondsOnApp(elapsedTime));
    }, 200);

    socket.on(SOCKET_EVENT_CONNECT, () => {
      setIsConnected(true);
    });

    socket.on(SOCKET_EVENT_DISCONNECT, () => {
      setIsConnected(false);
    });

    socket.on(SOCKET_EVENT_MULTIFAVSINFO, (data) => {
      dispatch(favsActions.updateMultiFavsInfo(data.multiFavsInfo));
    });

    socket.on(SOCKET_EVENT_PARTICIPANTSINFO, (data) => {
      dispatch(participantsActions.updateParticipantsInfo(data));
    });

    dispatch(favsActions.loadMultiFavsInfo());
    dispatch(participantsActions.loadParticipantsInfo());

    return () => {
      clearInterval(interval);
      socket.off(SOCKET_EVENT_CONNECT);
      socket.off(SOCKET_EVENT_DISCONNECT);
      socket.off(SOCKET_EVENT_MULTIFAVSINFO);
      socket.off(SOCKET_EVENT_PARTICIPANTSINFO);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && address) {
      // web3Login should be invoked inside ethereum.context
      dispatch(favsActions.loadAllFavs(address));
      dispatch(loadAllFanMatches(address));
      dispatch(userActions.loadUserInfo(address));
      dispatch(userActions.loadNotificationsStatus(address));
      dispatch(userActions.loadUserTransactions(address));
      dispatch(userActions.loadHistoricalUserInfo(address));

      syncBalance();

      socket.on(SOCKET_EVENT_ADDFUNDS + address, (data) => {
        dispatch(setDepositAmountThunk(data.amount || 0));
        dispatch(setShowAddFundsModalAction(false));
        dispatch(setShowFundsAddedModalAction(true));
        dispatch(
          wyreActions.loadWyreTransactions({
            skip: 0,
            take: 4,
            actionType: WyreOrderActionType.ALL
          })
        );
        dispatch(
          wyreActions.loadWyreTransactions({
            skip: 0,
            take: 4,
            actionType: WyreOrderActionType.ADDED
          })
        );
        syncBalance();

        dispatch(setIsDepositingThunk(false));
      });

      socket.on(SOCKET_EVENT_EMAILVERIFIED + address, async (email) => {
        const newProfile: UserEntity = {
          ...profile,
          email,
          hasNextStep: !!profile.hasNextStep
        };
        if (newProfile.address) {
          await dispatch(userActions.updateUserProfile(newProfile));
          dispatch(participantsActions.updateOneParticipant(newProfile));
        }
      });
    }
    else {
      dispatch(favsActions.loadAllFavs());
      dispatch(loadAllFanMatches());
    }

    return () => {
      socket.off(SOCKET_EVENT_ADDFUNDS + address);
    };
  }, [isLoggedIn, address, dispatch]);

  useEffect(() => {
    if (!loadingParticipantsData && participantsData.length > 0) {
      dispatch(participantsActions.loadHoldingStocksListOfFansQuery());
      if (isLoggedIn && address) {
        dispatch(participantsActions.loadFollowersAddress(address));
        dispatch(participantsActions.loadFollowingsAddress(address));
      }
    }
  }, [loadingParticipantsData, isLoggedIn, address]);

  useContractEvent({
    address: oceanaShareExContract.address,
    abi: oceanaShareExContract.abi,
    eventName: "BuyFromIPO",
    listener(log) {
      if (log[0] && log[0].args.buyer?.toLowerCase() === address) {
        setEventFavId(Number(log[0].args.favId));
        refreshApp();
      }
    }
  });

  useContractEvent({
    address: oceanaShareExContract.address,
    abi: oceanaShareExContract.abi,
    eventName: "MarketOrder",
    listener(log) {
      if (log[0] && log[0].args.person?.toLowerCase() === address) {
        setEventFavId(Number(log[0].args.favId));
        refreshApp();
      }
    }
  });

  useEffect(() => {
    dispatch(setShowSignRejectedModalAction(isSignError));
    if (isSignError) {
      dispatch(userActions.rejectWeb3LoginAction());
    }
  }, [isSignError]);

  useEffect(() => {
    dispatch(setshowSigningModalAction(isSigningMessage));
  }, [isSigningMessage]);

  useEffect(() => {
    if (
      isConnected &&
      address &&
      isWalletClientLoaded &&
      !isSigningMessage &&
      !isSignError &&
      !chain?.unsupported &&
      !document.hidden &&
      !window.location.href.includes("blog")
    ) {
      signMessage(address as Address);
    }
  }, [
    isConnected,
    address,
    isWalletClientLoaded,
    isSigningMessage,
    isSignError,
    chain?.unsupported,
    document.hidden,
    window.location.href,
  ]);

  return <></>;
};

export default App;
