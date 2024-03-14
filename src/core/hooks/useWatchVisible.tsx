import { RefObject, useEffect, useRef } from "react";

interface Props {
  elementRef: RefObject<HTMLElement>;
  visibleOffset?: number;
  onVisibilityChange?: (visibility: boolean) => void;
}

export const useWatchVisible = (props: Props) => {
  const { elementRef, visibleOffset = 0, onVisibilityChange } = props;
  const visibleRef = useRef(false);
  useEffect(() => {
    const watch = () => {
      if (!elementRef.current) {
        return;
      }

      const rect = elementRef.current.getBoundingClientRect();
      const isTopVisible =
        rect.top > 0 && rect.top + visibleOffset < window.innerHeight;
      const isBottomVisible =
        rect.bottom > 0 && rect.bottom + visibleOffset < window.innerHeight;
      const isVisible = isTopVisible || isBottomVisible;
      if (isVisible != visibleRef.current) {
        visibleRef.current = isVisible;
        if (isVisible) {
          if (onVisibilityChange) {
            onVisibilityChange(isVisible);
          }
        }
      }
    };
    watch();
    document.addEventListener("scroll", watch);
    return () => document.removeEventListener("scroll", watch);
  }, [elementRef, visibleOffset, onVisibilityChange]);
};
