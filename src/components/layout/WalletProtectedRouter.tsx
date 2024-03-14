import React, { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StorageKeys } from "../../core/constants/base.const";
import { homePath } from "../../core/util/pathBuilder.util";
import { useAppSelector } from "../../core/hooks/rtkHooks";

export default function WalletProtectedRouter({ children }: PropsWithChildren<unknown>) {
  const navigate = useNavigate();

  const { isLoggedIn } = useAppSelector(state => state.user);

  const isLoggedIn_ = localStorage.getItem(StorageKeys.IsLoggedIn);

  useEffect(() => {
    if (isLoggedIn_ != "TRUE" && !isLoggedIn) {
      navigate(homePath());
    }
  }, [isLoggedIn, isLoggedIn_]);

  return <>{children}</>;
}
