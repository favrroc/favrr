import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ScrollBlockContextValue {
  isScrollBlocked: boolean;
  scrollBlock: () => void;
  unscrollBlock: () => void;
}

export const ScrollBlockContext = createContext<ScrollBlockContextValue>({
  isScrollBlocked: false,
  scrollBlock: () => undefined,
  unscrollBlock: () => undefined,
});

export const useScrollBlock = (block: boolean) => {
  const { isScrollBlocked, scrollBlock, unscrollBlock } =
    useContext<ScrollBlockContextValue>(ScrollBlockContext);

  useEffect(() => {
    if (block) {
      scrollBlock();
      return () => unscrollBlock();
    }
  }, [block]);
  return { isScrollBlocked };
};

const BLOCK_SCROLL_CLASS = "block-scroll";
export const ScrollBlockProvider = (props: PropsWithChildren<unknown>) => {
  const [scrollStack, setScrollStack] = useState(0);
  useEffect(() => {
    if (scrollStack > 0) {
      document.body.classList.add(BLOCK_SCROLL_CLASS);

      return () => document.body.classList.remove(BLOCK_SCROLL_CLASS);
    }
  }, [scrollStack > 0]);

  const scrollBlock = useCallback(() => {
    setScrollStack((stack) => stack + 1);
  }, []);

  const unscrollBlock = useCallback(() => {
    setScrollStack((stack) => stack - 1);
  }, []);

  return (
    <ScrollBlockContext.Provider
      value={{ isScrollBlocked: scrollStack > 0, scrollBlock, unscrollBlock }}
    >
      {props.children}
    </ScrollBlockContext.Provider>
  );
};
