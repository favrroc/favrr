import { MutableRefObject, useEffect, useRef } from "react";

export const useClickOutside = (
  ref: MutableRefObject<HTMLElement | null>,
  callback: () => void
) => {
  const callbackRef = useRef(callback);

  if (callback != callbackRef.current) {
    callbackRef.current = callback;
  }

  useEffect(() => {
    const handleClick = (e: { target: HTMLElement; }) => {
      const triggerCallBack = !ref.current || !ref.current.contains(e.target);
      if (triggerCallBack) {
        callbackRef.current();
      }
    };
    document.addEventListener("click", handleClick as any);
    return () => document.removeEventListener("click", handleClick as any);
  }, [ref]);
};
