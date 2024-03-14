import React from "react";

import ComingSoonPanel from "../../components/landing/ComingSoonPanel";
import Logo from "../../components/logo/Logo";
import TermsText from "../../components/text/terms-text/TermsText";
import androidScreenshotSrc from "../../assets/images/android-screenshot.png";
import oceanaAndroidScreenshotSrc from "../../assets/images/oceana-android-screenshot.png";
import "./coming-soon-page.scss";

const ComingSoonPage = () => {
  return (
    <div className="coming-soon-page">
      <Logo />
      <ComingSoonPanel />
      <div
        className={`screenshot-container oceana`}
      >
        <img
          src={oceanaAndroidScreenshotSrc}
        />
      </div>
      <div className="terms-of-use">
        <TermsText />
      </div>
    </div>
  );
};

export default ComingSoonPage;
