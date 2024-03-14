import { oceanaUSDCContract } from "../constants/contract";

const MAX_USERNAME_SIZE = 13;

export const formatUserDisplay = (address: string, username?: string) => {
  if (username) {
    return username.length > MAX_USERNAME_SIZE
      ? `${username.slice(0, MAX_USERNAME_SIZE - 3)}...`
      : username;
  } else {
    return `${address?.toUpperCase().slice(0, 6)}...${address
      ?.toUpperCase()
      .slice(9 - MAX_USERNAME_SIZE)}`;
  }
};

export const toUSDC = (price: string | number | undefined): number => {
  if (!price) return 0;
  return typeof price == "string" ? +price / (Math.pow(10, oceanaUSDCContract.decimals)) : price;
};

export enum Unit {
  USDC,
  USD,
  PERCENT,
  SHARE,
  EMPTY,
}

const units = ["USDC", "", "%", "", ""];

export const formatNumber = (props: {
  value: number | undefined;
  unit: Unit;
  summarize: boolean;
  withSign?: boolean;
  withUnit?: boolean;
  decimalToFixed?: number;
  forceSummarize?: boolean;
}) => {
  const { value: _value, unit, summarize, withSign, withUnit, decimalToFixed } = props;

  const value = !_value ? 0 : _value;
  const isPercent = unit == Unit.PERCENT;
  const isShare = unit == Unit.SHARE;
  const needDecimals = !isPercent && !isShare;
  const decimalPoints = value === 0 ? 0 : decimalToFixed ? decimalToFixed : Math.abs(value) <= 0.009 && value !== 0 ? 5 : 2;

  const absPrice = Math.abs(value);
  const decimalPlaces = (unit == Unit.SHARE || unit == Unit.EMPTY) ? 0 : decimalToFixed;
  let formattedPrice = value.toString();

  if (!summarize) {
    formattedPrice = value.toLocaleString("en-US", {
      "minimumFractionDigits": (needDecimals ? decimalPoints : 0),
      "maximumFractionDigits": (needDecimals ? decimalPoints : 0)
    });
  } else {
    if (absPrice >= 10 ** 12) {
      formattedPrice = `${(Math.round(value / 10 ** 10) / 100).toFixed(needDecimals ? decimalPoints : 0)}T`; // 1 230 000 000 000 => 1.23T
    } else if (absPrice >= 10 ** 9) {
      formattedPrice = `${(Math.round(value / 10 ** 7) / 100).toFixed(needDecimals ? decimalPoints : 0)}B`; // 1 230 000 000 => 1.23B
    } else if (absPrice >= 10 ** 6) {
      formattedPrice = `${(Math.round(value / 10 ** 4) / 100).toFixed(needDecimals ? decimalPoints : 0)}M`; // 1 230 000 => 1.23M
    } else if (absPrice >= 10 ** 4) {
      formattedPrice = `${(Math.round(value / 10 ** 1) / 100).toFixed(needDecimals ? decimalPoints : 0)}K`; // 901 243.77 => 901.24K
    } else if (absPrice >= 10 ** 3) {
      // Adding in `props.forceSummarize` because there are some instances that don't summarize 1000's
      if (unit == Unit.EMPTY || props.forceSummarize) {
        formattedPrice = `${(Math.round(value / 10) / 100)}K`; // 1 230 => 1.23K
      }
      else {
        formattedPrice = `${(Math.round(value * 100) / 100).toLocaleString("en-US", {
          "minimumFractionDigits": (needDecimals ? decimalPoints : 0),
          "maximumFractionDigits": (needDecimals ? decimalPoints : 0)
        })}`; // 12 345.6789 => 12,345.67
      }
    } else if (absPrice >= 10 && unit == Unit.PERCENT) {
      formattedPrice = `${Math.round(value).toLocaleString("en-US")}`;
    } else if (absPrice >= 1 && unit == Unit.PERCENT) {
      formattedPrice = `${Math.round(value * 10) / 10}`;
    } else if (absPrice >= 0.01) {
      if (absPrice < 1) {
        formattedPrice = `${(Math.round(value * 100) / 100)}`;
      }
      else {
        formattedPrice = `${(Math.round(value * 100) / 100).toFixed(decimalPlaces)}`;
      }
    } else if (absPrice >= 0.001) {
      formattedPrice = `${Math.round(value * 1000) / 1000}`;
    } else if (absPrice >= 0.0001) {
      formattedPrice = `${Math.round(value * 10000) / 10000}`;
    } else {
      formattedPrice = `${Math.round(value * 100000) / 100000}`;
    }
  }

  const sign = withSign && value > 0 ? "+" : "";
  const prefix = withUnit && unit == Unit.USD ? "$" : "";
  const unitString = withUnit
    ? units[unit] === "%"
      ? "%"
      : ` ${units[unit]}`
    : "";

  return sign + prefix + formattedPrice + unitString;
};

export const toTitleCase = (str: string) => {
  const lstr = str.toLowerCase();
  return lstr.charAt(0)?.toUpperCase() + lstr.slice(1);
};

export const pixelToNumber = (pixelString: string) => {
  if (pixelString.length > 2) {
    return +pixelString.replace("px", "");
  }
  else return 0;
};

export const validateEmail = async (email: string) => {
  const Message = {
    Invalid: "Invalid email.",
    TooLong: "Email cannot exceed 320 characters.",
    LocalTooShortError: `The email before the "@" must be at least 2 characters.`,
    LocalTooLongError: `The email before the "@" cannot exceed 64 characters.`,
    DomainTooLongError: `The email after the "@" cannot exceed 254 characters.`
  };

  try {
    const [local, domain, rest] = email.split("@");

    const formatErrorMessage = !email ? ""
      : email.length > 320 ? Message.TooLong
        : (rest || !local || !domain) ? Message.Invalid
          : !/^\w+([\.-]?\w+)*$/.test(local) ? Message.Invalid
            : local.length < 2 ? Message.LocalTooShortError
              : local.length > 64 ? Message.LocalTooLongError
                : !/^\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(domain) ? Message.Invalid
                  : domain.length > 254 ? Message.DomainTooLongError : "";

    // if (!formatErrorMessage && email.length > 0) {
    //   const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${EMAIL_VALIDATION_API_KEY}&email=${email}`;
    //   const response = await fetch(url);
    //   const jsonResponse = await response.json();
    //   return jsonResponse?.is_mx_found?.value ? "" : Message.Invalid;
    // }
    // else {
    //   return formatErrorMessage;
    // }
    return formatErrorMessage;
  }
  catch (e) {
    console.log(e);
    return Message.Invalid;
  }
};

export const basicNumberFormatterSummarizer = ({ value = 0, decimalPoints = 0 }: {
  value: number;
  decimalPoints?: number;
}) => {
  const absPrice = Math.abs(value);
  if (absPrice >= 10 ** 12) {
    return `${(Math.round(value / 10 ** 10) / 100).toFixed(decimalPoints)}T`; // 1 230 000 000 000 => 1.23T
  } else if (absPrice >= 10 ** 9) {
    return `${(Math.round(value / 10 ** 7) / 100).toFixed(decimalPoints)}B`; // 1 230 000 000 => 1.23B
  } else if (absPrice >= 10 ** 6) {
    return `${(Math.round(value / 10 ** 4) / 100).toFixed(decimalPoints)}M`; // 1 230 000 => 1.23M
  } else if (absPrice >= 10 ** 4) {
    return `${(Math.round(value / 10 ** 1) / 100).toFixed(decimalPoints)}K`; // 901 243.77 => 901.24K
  } else if (absPrice >= 10 ** 3) {
    return `${(Math.round(value / 10) / 100).toFixed(decimalPoints)}K`; // 1 230 => 1.23K
  }
  return value;
};