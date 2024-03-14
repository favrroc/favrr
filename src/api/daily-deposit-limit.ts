import { StorageKeys } from "../core/constants/base.const";
import { fetchAPI } from "./fetch-api";

export const getDailyDepositLimit = async () => {
  try {
    const { response, data } = await fetchAPI({
      url: "/api/wyre-gateway/calculate-daily-limit",
      method: "POST",
      token: `Bearer ${localStorage.getItem(StorageKeys.AuthorizationToken)}`,
      body: { "cardNumber": "" }
    });

    if (response?.status !== 201) {
      console.error(data);
    }
    else {
      return data;
    }
  }
  catch (e) {
    console.error("Catch error: ", e);
  }
};