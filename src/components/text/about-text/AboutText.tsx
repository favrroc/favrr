import React from "react";

import "./about-text.scss";

interface Props {
  fullText: string | null;
}

const AboutText = (props: Props) => {
  // const [expanded, setExpanded] = useState(false);
  // const collapsedText = useMemo(() => {
  //   const sentences = props.fullText?.split(/[\.\?!] /);
  //   if (sentences?.length && sentences.length > 1) {
  //     return (
  //       sentences[0] +
  //       props.fullText?.slice(sentences[0].length, sentences[0].length + 2)
  //     );
  //   }
  //   return null;
  // }, [props.fullText]);
  return (
    <div className="about-text">
      {props.fullText}
      {/* {collapsedText && !expanded ? (
        collapsedText + " "
      ) : (
        <>{props.fullText} </>
      )}
      {!!collapsedText &&
        (expanded ? (
          <button
            className="expand-shrink-button"
            onClick={() => setExpanded(false)}
          >
            <FormattedMessage defaultMessage=" less" />
          </button>
        ) : (
          <button
            className="expand-shrink-button"
            onClick={() => setExpanded(true)}
          >
            <FormattedMessage defaultMessage="more" />
          </button>
        ))} */}
    </div>
  );
};

export default AboutText;
