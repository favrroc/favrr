import { StorageKeys } from "../core/constants/base.const";
import { fetchAPI } from "./fetch-api";

export const postWelcomeEmailWithLogin = async (email: string) => {
  try {
    const { response, data } = await fetchAPI({
      url: "/api/email/send-welcome-email-with-login",
      method: "POST",
      token: `Bearer ${localStorage.getItem(StorageKeys.AuthorizationToken)}`,
      body: { email }
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

export const postWelcomeEmailWithoutLogin = async (email: string) => {
  try {
    const { response, data } = await fetchAPI({
      url: "/api/email/send-welcome-email-without-login",
      method: "POST",
      body: { email }
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