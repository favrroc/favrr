import { useEthereum } from "../context/ethereum.context";
import { updateFetchingBalanceStatus, updateUSDCBalance } from "../store/slices/userSlice";
import { useAppDispatch } from "./rtkHooks";

export const useBalance = () => {
  const dispatch = useAppDispatch();
  const { getUSDCBalance } = useEthereum();

  const syncBalance = async () => {
    dispatch(updateFetchingBalanceStatus(true));

    const balance = await getUSDCBalance();
    dispatch(updateUSDCBalance({ usdcBalance: balance }));
  };

  return {
    syncBalance
  };
};