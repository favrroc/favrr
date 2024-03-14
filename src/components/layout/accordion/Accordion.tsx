import React, {
  HTMLProps,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { CSSTransition } from "react-transition-group";

interface Props extends HTMLProps<HTMLDivElement> {
  accordionHeader: (props: {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
  }) => JSX.Element | null;
  alwaysDisplay?: boolean;
}
const Accordion = (props: PropsWithChildren<Props>) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null as null | HTMLDivElement);
  const headerRef = useRef(null as null | HTMLDivElement);
  const lastChildrenRef = useRef(null as null | React.ReactNode);

  if (props.children) {
    lastChildrenRef.current = props.children;
  }

  const expandedDisplay = expanded || !!props.alwaysDisplay;

  //Initial max height if initial state is collapsed
  useEffect(() => {
    if (ref.current && headerRef.current && !expandedDisplay) {
      ref.current?.style.setProperty(
        "max-height",
        `${ref.current?.scrollHeight}px`
      );
    }
  }, []);

  return (
    <div
      className={`accordion ${expandedDisplay ? "expanded" : "collapsed"} ${props.className || ""
      }`}
      style={{
        transition: "max-height 0.3s linear",
        overflow: "hidden",
        ...props.style,
      }}
      ref={ref}
    >
      <div className="accordion-header" ref={headerRef}>
        <props.accordionHeader
          expanded={expandedDisplay}
          setExpanded={setExpanded}
        ></props.accordionHeader>
      </div>
      <CSSTransition
        in={expandedDisplay}
        timeout={300}
        unmountOnExit
        mountOnEnter
        onExit={() => {
          ref.current?.style.setProperty(
            "max-height",
            `${headerRef.current?.scrollHeight}px`
          );
        }}
        onEnter={() => {
          ref.current?.style.setProperty(
            "max-height",
            `${ref.current?.scrollHeight}px`
          );
        }}
      >
        {props.children}
      </CSSTransition>
    </div>
  );
};

export default Accordion;
