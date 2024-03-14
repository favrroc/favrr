import { Address, useAccount } from "wagmi";

export const useLowercasedAccount = () => {
  const account = useAccount();
  return {
    ...account,
    address: account.address?.toLowerCase() as Address
  };
};