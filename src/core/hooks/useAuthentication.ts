import { useAppDispatch, useAppSelector } from "./rtkHooks";
import { useEthereum } from "../context/ethereum.context";
import { setShowConnectWalletModalAction } from "../store/slices/modalSlice";
import { useLowercasedAccount } from "./useLowercasedAccount";

export const useAuthentication = () => {
  const dispatch = useAppDispatch();
  const { signMessage } = useEthereum();
  const { isConnected, address } = useLowercasedAccount();
  const { isLoggedIn } = useAppSelector((state) => state.user);

  return {
    checkAuthentication: () => {
      if (!isConnected) {
        dispatch(setShowConnectWalletModalAction(true));
      } else if (!isLoggedIn) {
        signMessage(address);
      } else {
        return true;
      }
    }
  };
};
