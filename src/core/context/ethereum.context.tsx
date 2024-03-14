import {
  prepareWriteContract,
  readContract,
  waitForTransaction,
  writeContract
} from "@wagmi/core";
import React, { PropsWithChildren, createContext, useContext } from "react";
import { Address, formatUnits, recoverMessageAddress } from "viem";
import { useSignMessage } from "wagmi";

import { setAuthorizationHeader } from "../clients/apolloClient";
import { StorageKeys, WEB3_SIGN_MESSAGE } from "../constants/base.const";
import {
  oceanaShareExContract,
  oceanaUSDCContract
} from "../constants/contract";
import { useAppDispatch, useAppSelector } from "../hooks/rtkHooks";
import { useLowercasedAccount } from "../hooks/useLowercasedAccount";
import { web3Login } from "../store/slices/userSlice";

interface EthereumContextValue {
  buyFromIPO: (
    favId: number,
    pps: number,
    amount: number,
    onSuccess?: (hash: string, confirmed: boolean) => void,
    onError?: () => void
  ) => void;
  getTotalPriceForMarketBuy: (favId: number, amount: number) => Promise<number>;
  getTotalPriceForMarketSell: (
    favId: number,
    amount: number
  ) => Promise<number>;
  getUSDCBalance: () => Promise<number>;
  marketBuy: (
    favId: number,
    totalPrice: number,
    amount: number,
    onSuccess?: (hash: string, confirmed: boolean) => void,
    onError?: () => void
  ) => void;
  marketSell: (
    favId: number,
    amount: number,
    onSuccess?: (hash: string, confirmed: boolean) => void,
    onError?: () => void
  ) => void;
  limitBuy: (totalPrice: number) => void;
  limitSell: () => void;
  transferUSDC: (
    destination: string,
    amountInUnit: number,
    onSuccess?: (hash: string, confirmed: boolean) => void,
    onError?: () => void
  ) => void;
  signMessage: (signerAddress: Address) => void;
  isSigningMessage: boolean;
  isSignError: boolean;
  resetWalletSignStatus: () => void;
}

const EthereumContext = createContext<EthereumContextValue>({
  buyFromIPO: () => undefined,
  getTotalPriceForMarketBuy: () =>
    new Promise<number>((value) => {
      return value;
    }),
  getTotalPriceForMarketSell: () =>
    new Promise<number>((value) => {
      return value;
    }),
  getUSDCBalance: () =>
    new Promise<number>((value) => {
      return value;
    }),
  marketBuy: () => undefined,
  marketSell: () => undefined,
  limitBuy: () => undefined,
  limitSell: () => undefined,
  transferUSDC: () => undefined,
  signMessage: () => undefined,
  isSigningMessage: false,
  isSignError: false,
  resetWalletSignStatus: () => undefined
});

export const useEthereum = () =>
  useContext<EthereumContextValue>(EthereumContext);

export const EthereumProvider = (props: PropsWithChildren<unknown>) => {
  const dispatch = useAppDispatch();
  const { address: account } = useLowercasedAccount();
  const { isLoggedIn } = useAppSelector(state => state.user);
  const {
    signMessage: wagmiSignMessage,
    isLoading,
    isError,
    reset
  } = useSignMessage({
    message: WEB3_SIGN_MESSAGE,
    onSuccess(data: any) {
      setAuthorizationHeader(`Bearer ${data}`);
      localStorage.setItem(StorageKeys.AuthorizationToken, data);
      dispatch(web3Login(account));
    },
  });

  const getUSDCAllowance = async () => {
    if (!account) return;
    const allowance = await readContract({
      address: oceanaUSDCContract.address,
      abi: oceanaUSDCContract.abi,
      functionName: "allowance",
      args: [account, oceanaShareExContract.address]
    });

    return +formatUnits(allowance, oceanaUSDCContract.decimals);
  };
  const approveUSDC = async (onError?: () => any) => {
    if (!account) return;
    try {
      const { request } = await prepareWriteContract({
        address: oceanaUSDCContract.address,
        abi: oceanaUSDCContract.abi,
        functionName: "approve",
        account,
        args: [oceanaShareExContract.address, BigInt(Number.MAX_SAFE_INTEGER)]
      });
      await writeContract(request);
    } catch (e) {
      console.error(e);
      if (onError) {
        onError();
      }
    }
  };
  const isApprovedForAll = async () => {
    if (!account) return;
    const result = await readContract({
      address: oceanaShareExContract.address,
      abi: oceanaShareExContract.abi,
      functionName: "isApprovedForAll",
      args: [account, oceanaShareExContract.address]
    });

    return result;
  };
  const approveAllShares = async (onError?: () => any) => {
    if (!account) return;
    try {
      const { request } = await prepareWriteContract({
        address: oceanaShareExContract.address,
        abi: oceanaShareExContract.abi,
        functionName: "setApprovalForAll",
        account,
        args: [oceanaShareExContract.address, true]
      });
      await writeContract(request);
    } catch (e) {
      console.error(e);
      if (onError) {
        onError();
      }
    }
  };

  const signMessage = async (signerAddress: Address) => {
    // reset useSignMessage hook
    reset();

    const token = localStorage.getItem(StorageKeys.AuthorizationToken);
    if (token) {
      try {
        const recoveredAddress = await recoverMessageAddress({
          message: WEB3_SIGN_MESSAGE,
          signature: (token || "") as Address | Uint8Array
        });

        if (recoveredAddress.toLowerCase() === signerAddress?.toLowerCase()) {
          await setAuthorizationHeader(`Bearer ${token}`);
          if (!isLoggedIn) {
            dispatch(web3Login(signerAddress));
          }
        } else {
          wagmiSignMessage();
        }
      } catch (e) {
        console.error("verifyMessage error", e);
      }
    } else {
      localStorage.removeItem(StorageKeys.AuthorizationToken);
      wagmiSignMessage();
    }
  };

  const buyFromIPO = async (
    favId: number,
    pps: number,
    amount: number,
    onSuccess?: (hash: string, confirmed: boolean) => void,
    onError?: () => void
  ) => {
    if (!account) return;

    const allowance = await getUSDCAllowance();
    if (!allowance) return;
    if (allowance < pps * amount) {
      await approveUSDC(onError);
    }

    const { request } = await prepareWriteContract({
      address: oceanaShareExContract.address,
      abi: oceanaShareExContract.abi,
      functionName: "buyFromIPO",
      account,
      args: [BigInt(favId), BigInt(amount)]
    });
    const { hash } = await writeContract(request);
    if (onSuccess) {
      onSuccess(hash, false);
      const receipt = await waitForTransaction({ hash });
      if (receipt.status === "success") {
        onSuccess(hash, true);
      } else {
        onError?.();
      }
    }
  };

  const getTotalPriceForMarketBuy = async (
    favId: number,
    amount: number
  ): Promise<number> => {
    if (!account) return 0;

    const price = await readContract({
      address: oceanaShareExContract.address,
      abi: oceanaShareExContract.abi,
      functionName: "getTotalPriceForMarketBuy",
      args: [BigInt(favId), BigInt(amount)]
    });
    const nPrice = +formatUnits(
      price as bigint,
      oceanaShareExContract.decimals
    );

    return nPrice;
  };

  const getTotalPriceForMarketSell = async (
    favId: number,
    amount: number
  ): Promise<number> => {
    if (!account) return 0;

    const price = await readContract({
      address: oceanaShareExContract.address,
      abi: oceanaShareExContract.abi,
      functionName: "getTotalPriceForMarketSell",
      args: [BigInt(favId), BigInt(amount)]
    });
    const nPrice = +formatUnits(
      price as bigint,
      oceanaShareExContract.decimals
    );

    return nPrice;
  };

  const getUSDCBalance = async (): Promise<number> => {
    if (!account) return 0;

    const balance = await readContract({
      address: oceanaUSDCContract.address,
      abi: oceanaUSDCContract.abi,
      functionName: "balanceOf",
      args: [account]
    });
    const nBalance = +formatUnits(
      balance as bigint,
      oceanaUSDCContract.decimals
    );
    return Math.floor(nBalance * 100) / 100;
  };

  const marketBuy = async (
    favId: number,
    totalPrice: number,
    amount: number,
    onSuccess?: (hash: string, confirmed: boolean) => void,
    onError?: () => void
  ) => {
    if (!account) return;

    const allowance = await getUSDCAllowance();
    if (!allowance) return;
    if (allowance < totalPrice) {
      await approveUSDC(onError);
    }

    // const { request } = await prepareWriteContract({
    //   address: oceanaShareExContract.address,
    //   abi: oceanaShareExContract.abi,
    //   functionName: "marketBuy",
    //   account,
    //   args: [BigInt(favId), BigInt(amount)]
    // });
    // const hash = await writeContract(request);
    const { request } = await prepareWriteContract({
      address: oceanaShareExContract.address,
      abi: oceanaShareExContract.abi,
      functionName: "marketBuy",
      args: [BigInt(favId), BigInt(amount)]
    });
    const { hash } = await writeContract(request);

    if (onSuccess) {
      onSuccess(hash, false);
      const receipt = await waitForTransaction({ hash });
      if (receipt.status === "success") {
        onSuccess(hash, true);
      } else {
        onError?.();
      }
    }
  };

  const marketSell = async (
    favId: number,
    amount: number,
    onSuccess?: (hash: string, confirmed: boolean) => void,
    onError?: () => void
  ) => {
    const approved = isApprovedForAll();
    if (!approved) {
      approveAllShares(onError);
    }

    const { request } = await prepareWriteContract({
      address: oceanaShareExContract.address,
      abi: oceanaShareExContract.abi,
      functionName: "marketSell",
      account,
      args: [BigInt(favId), BigInt(amount)]
    });
    const { hash } = await writeContract(request);
    if (onSuccess) {
      onSuccess(hash, false);
      const receipt = await waitForTransaction({ hash });
      if (receipt.status === "success") {
        onSuccess(hash, true);
      } else {
        onError?.();
      }
    }
  };

  const limitBuy = async (totalPrice: number) => {
    if (!account) return;
    const allowance = await getUSDCAllowance();
    if (!allowance) return;

    if (allowance < totalPrice) {
      await approveUSDC();
    }
  };

  const limitSell = async () => {
    if (!account) return;
    const approved = isApprovedForAll();
    if (!approved) {
      approveAllShares();
    }
  };

  const transferUSDC = async (
    destination: string,
    amountInUnit: number,
    onSuccess?: (hash: string, confirmed: boolean) => void,
    onError?: () => void
  ) => {
    if (!account) return;

    const { request } = await prepareWriteContract({
      address: oceanaUSDCContract.address,
      abi: oceanaUSDCContract.abi,
      functionName: "transfer",
      account,
      args: [destination as Address, BigInt(amountInUnit)]
    });
    const { hash } = await writeContract(request);
    if (onSuccess) {
      onSuccess(hash, false);
      const receipt = await waitForTransaction({ hash });
      if (receipt.status === "success") {
        onSuccess(hash, true);
      } else {
        onError?.();
      }
    }
  };

  return (
    <EthereumContext.Provider
      value={{
        buyFromIPO,
        getTotalPriceForMarketBuy,
        getTotalPriceForMarketSell,
        getUSDCBalance,
        marketBuy,
        marketSell,
        limitBuy,
        limitSell,
        transferUSDC,
        signMessage,
        isSigningMessage: isLoading,
        isSignError: isError,
        resetWalletSignStatus: reset
      }}
    >
      {props.children}
    </EthereumContext.Provider>
  );
};
