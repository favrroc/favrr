import { BACKEND_API_ENDPOINT } from "../core/constants/base.const";

type Props = {
  url: string;
  method: "GET" | "POST";
  token?: string;
  body?: any;
};

export const fetchAPI = async ({ url /* must start with '/' */, method, token, body }: Props) => {
  try {
    const response = await fetch(
      `${BACKEND_API_ENDPOINT}${url}`,
      {
        method: method,
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(body)
      }
    );
    const data = await response.json();
  
    return { response, data };
  }
  catch (e) {
    console.error("fetchAPI error: ", e);
    return {
      response: undefined,
      data: undefined
    };
  }
};
