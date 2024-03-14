import React, {
  createContext,
  PropsWithChildren, useEffect, useState
} from "react";

import {
  MAX_MOBILE_WIDTH,
  MAX_TABLET_WIDTH
} from "../constants/base.const";

export enum screenType {
  MOBILE,
  TABLET,
  DESKTOP,
}
export const ResponsiveContext = createContext({
  currentScreenType: screenType.DESKTOP,
});

const getScreenType = () => {
  if (typeof window == "undefined") {
    return screenType.DESKTOP;
  }
  if (window.innerWidth <= MAX_MOBILE_WIDTH) {
    return screenType.MOBILE;
  }
  if (window.innerWidth <= MAX_TABLET_WIDTH) {
    return screenType.TABLET;
  }
  return screenType.DESKTOP;
};
export const ResponsiveProvider = (props: PropsWithChildren<unknown>) => {
  const [currentScreenType, setCurrentScreenType] = useState(getScreenType());

  useEffect(() => {
    const onResize = () => {
      const newScreenType = getScreenType();
      if (newScreenType != currentScreenType) {
        setCurrentScreenType(newScreenType);
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [currentScreenType]);

  return (
    <ResponsiveContext.Provider value={{ currentScreenType }}>
      {props.children}
    </ResponsiveContext.Provider>
  );
};
