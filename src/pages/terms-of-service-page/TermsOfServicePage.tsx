import React from "react";
import { FormattedMessage } from "react-intl";

import BasePage from "../base-page/BasePage";
import ScrollTopFloat from "../../components/util/scroll-top-float/ScrollTopFloat";
import "../../assets/styles/text-page.scss";
import "../how-it-works-page/how-it-works-page.scss";
import { Link } from "react-router-dom";

const TermsOfServicePage = () => {
  const websiteName = "Oceana, Ltd.";
  const domain = "oceana.market";
  return (
    <BasePage
      className="terms-of-service-page text-page"
      contentStyle={{ paddingTop: 0, paddingBottom: 0 }}
      logoOnlyHeader
    >
      <ScrollTopFloat />
      <h1 className="title-section" style={{ textAlign: "center" }}>
        <FormattedMessage defaultMessage="Terms of Service" />
      </h1>
      <hr />
      <div className="content-section">
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="1. Terms" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              By accessing the website at <Link target="_blank" to={`https://${domain}`}>https://{domain}</Link>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
            </span>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="2. Use License" />
          </h2>
          <hr className="title-underline" />
          <ol>
            <li>
              <FormattedMessage
                defaultMessage="Permission is granted to temporarily download one copy of the materials (information or software) on {websiteName}'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:"
                values={{
                  websiteName,
                }}
              />
              <ul style={{ listStyle: "outside" }}>
                <li>
                  <FormattedMessage defaultMessage="modify or copy the materials;" />
                </li>
                <li>
                  <FormattedMessage defaultMessage="use the materials for any commercial purpose, or for any public display (commercial or non-commercial);" />
                </li>
                <li>
                  <FormattedMessage
                    defaultMessage="attempt to decompile or reverse engineer any software contained on {websiteName}'s website;"
                    values={{ websiteName }}
                  />
                </li>
                <li>
                  <FormattedMessage defaultMessage="remove any copyright or other proprietary notations from the materials; or" />
                </li>
                <li>
                  <FormattedMessage defaultMessage='transfer the materials to another person or "mirror" the materials on any other server' />
                </li>
              </ul>
            </li>
            <li>
              <FormattedMessage
                defaultMessage="This license shall automatically terminate if you violate any of these restrictions and may be terminated by {websiteName} at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format."
                values={{
                  websiteName,
                }}
              />
            </li>
          </ol>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="3. Disclaimer" />
          </h2>
          <hr className="title-underline" />
          <ol>
            <li>
              <FormattedMessage
                defaultMessage="The materials on {websiteName}'s website are provided on an 'as is' basis. {websiteName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
                values={{
                  websiteName,
                }}
              />
            </li>
            <li>
              <FormattedMessage
                defaultMessage="Further, {websiteName} does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site."
                values={{
                  websiteName,
                }}
              />
            </li>
          </ol>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="4. Limitations" />
          </h2>
          <hr className="title-underline" />
          <FormattedMessage
            defaultMessage="In no event shall {websiteName} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {websiteName}'s website, even if {websiteName} or a {websiteName} authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you."
            values={{
              websiteName,
            }}
          />
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="5. Accuracy of Materials" />
          </h2>
          <hr className="title-underline" />
          <FormattedMessage
            defaultMessage="The materials appearing on {websiteName}'s website could include technical, typographical, or photographic errors. {websiteName} does not warrant that any of the materials on its website are accurate, complete or current. {websiteName} may make changes to the materials contained on its website at any time without notice. However, {websiteName} does not make any commitment to update the materials."
            values={{
              websiteName,
            }}
          />
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="6. Links" />
          </h2>
          <hr className="title-underline" />
          <FormattedMessage
            defaultMessage="{websiteName} has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by {websiteName} of the site. Use of any such linked website is at the user's own risk."
            values={{
              websiteName,
            }}
          />
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="7. Modifications" />
          </h2>
          <hr className="title-underline" />
          <FormattedMessage
            defaultMessage="{websiteName} may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service."
            values={{
              websiteName,
            }}
          />
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="8. Governing Law" />
          </h2>
          <hr className="title-underline" />
          <FormattedMessage
            defaultMessage="These terms and conditions are governed by and construed in accordance with the laws of Gibraltar and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location."
            values={{
              websiteName,
            }}
          />
        </div>
      </div>
    </BasePage>
  );
};

export default TermsOfServicePage;
