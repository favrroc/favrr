import { StorageKeys } from "../core/constants/base.const";
import { fetchAPI } from "./fetch-api";

export const getEmailLinkConfirm = async (id: string) => {
  const userId = atob(id);

  try {
    const { data } = await fetchAPI({
      url: `/api/email/${userId}`,
      method: "GET",
      token: `Bearer ${localStorage.getItem(StorageKeys.AuthorizationToken)}`,
    });

    return !!!data?.error;
  }
  catch (e) {
    console.error("Catch error: ", e);
    return false;
  }
};