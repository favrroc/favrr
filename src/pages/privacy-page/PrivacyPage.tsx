import React from "react";
import { FormattedMessage } from "react-intl";

import BasePage from "../base-page/BasePage";
import ScrollTopFloat from "../../components/util/scroll-top-float/ScrollTopFloat";
import "../../assets/styles/text-page.scss";
import "../how-it-works-page/how-it-works-page.scss";

const PrivacyPage = () => {
  const websiteName = "Oceana Market";

  return (
    <BasePage
      className="privacy-page text-page"
      contentStyle={{ paddingTop: 0, paddingBottom: 0 }}
      logoOnlyHeader
    >
      <ScrollTopFloat />
      <h1 className="title-section" style={{ textAlign: "center" }}>
        <FormattedMessage defaultMessage="Privacy Policy" />
      </h1>
      <hr />
      <div className="content-section">
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="1. Information We Collect" />
          </h2>
          <hr className="title-underline" />
          <div>
            <b>
              <FormattedMessage defaultMessage="Log Data" />
            </b>
            <br />
            <span>
              <FormattedMessage defaultMessage="When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details." />
            </span>

            <br />
            <br />

            <b>
              <FormattedMessage defaultMessage="Device Data" />
            </b>
            <br />
            <span>
              <FormattedMessage defaultMessage="We may also collect data about the device you’re using to access our website. This data may include the device type, operating system, unique device identifiers, device settings, and geo-location data. What we collect can depend on the individual settings of your device and software. We recommend checking the policies of your device manufacturer or software provider to learn what information they make available to us." />
            </span>
            <br />
            <br />
            <b>
              <FormattedMessage defaultMessage="Personal Information" />
            </b>
            <br />
            <span>
              <FormattedMessage defaultMessage="We may ask for personal information, such as your:" />
            </span>

            <br />
            <br />

            <ul>
              <li>
                <FormattedMessage defaultMessage="Name" />
              </li>
              <li>
                <FormattedMessage defaultMessage="Email" />
              </li>
              <li>
                <FormattedMessage defaultMessage="Social media profiles" />
              </li>
              <li>
                <FormattedMessage defaultMessage="Date of birth" />
              </li>
              <li>
                <FormattedMessage defaultMessage="Phone/mobile number" />
              </li>
              <li>
                <FormattedMessage defaultMessage="Home/Mailing address" />
              </li>
              <li>
                <FormattedMessage defaultMessage="Work address" />
              </li>
              <li>
                <FormattedMessage defaultMessage="Payment information" />
              </li>
            </ul>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="2. Legal Bases for Processing" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              <FormattedMessage defaultMessage="We will process your personal information lawfully, fairly and in a transparent manner. We collect and process information about you only where we have legal bases for doing so." />
            </span>

            <br />
            <br />

            <span>
              <FormattedMessage defaultMessage="These legal bases depend on the services you use and how you use them, meaning we collect and use your information only where:" />
            </span>

            <ul>
              <li>
                <FormattedMessage defaultMessage="it’s necessary for the performance of a contract to which you are a party or to take steps at your request before entering into such a contract (for example, when we provide a service you request from us);" />
              </li>
              <li>
                <FormattedMessage defaultMessage="it satisfies a legitimate interest (which is not overridden by your data protection interests), such as for research and development, to market and promote our services, and to protect our legal rights and interests;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="you give us consent to do so for a specific purpose (for example, you might consent to us sending you our newsletter); or" />
              </li>
              <li>
                <FormattedMessage defaultMessage="we need to process your data to comply with a legal obligation." />
              </li>
            </ul>

            <br />
            <br />

            <span>
              <FormattedMessage defaultMessage="Where you consent to our use of information about you for a specific purpose, you have the right to change your mind at any time (but this will not affect any processing that has already taken place)." />
            </span>

            <br />
            <br />

            <span>
              <FormattedMessage defaultMessage="We don’t keep personal information for longer than is necessary. While we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification. That said, we advise that no method of electronic transmission or storage is 100% secure and cannot guarantee absolute data security. If necessary, we may retain your personal information for our compliance with a legal obligation or in order to protect your vital interests or the vital interests of another natural person." />
            </span>
          </div>
        </div>

        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="3. Collection and Use of Information" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              <FormattedMessage defaultMessage="We may collect, hold, use and disclose information for the following purposes and personal information will not be further processed in a manner that is incompatible with these purposes:" />
            </span>

            <br />
            <br />
            <ul>
              <li>
                <FormattedMessage defaultMessage="to enable you to customize or personalize your experience of our website;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="to enable you to access and use our website, associated applications and associated social media platforms;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="to contact and communicate with you;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="for internal record keeping and administrative purposes;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="for analytics, market research and business development, including to operate and improve our website, associated applications and associated social media platforms;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="to run competitions and/or offer additional benefits to you;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="for advertising and marketing, including to send you promotional information about our products and services and information about third parties that we consider may be of interest to you;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="to comply with our legal obligations and resolve any disputes that we may have; and" />
              </li>
              <li>
                <FormattedMessage defaultMessage="to consider your employment application." />
              </li>
            </ul>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="4. Disclosure of Personal Information to Third Parties" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              <FormattedMessage defaultMessage="We may disclose personal information to:" />
            </span>

            <br />
            <br />
            <ul>
              <li>
                <FormattedMessage defaultMessage="third party service providers for the purpose of enabling them to provide their services, including (without limitation) IT service providers, data storage, hosting and server providers, ad networks, analytics, error loggers, debt collectors, maintenance or problem-solving providers, marketing or advertising providers, professional advisors and payment systems operators;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="our employees, contractors and/or related entities;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="sponsors or promoters of any competition we run;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="credit reporting agencies, courts, tribunals and regulatory authorities, in the event you fail to pay for goods or services we have provided to you;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="courts, tribunals, regulatory authorities and law enforcement officers, as required by law, in connection with any actual or prospective legal proceedings, or in order to establish, exercise or defend our legal rights;" />
              </li>
              <li>
                <FormattedMessage defaultMessage="third parties, including agents or sub-contractors, who assist us in providing information, products, services or direct marketing to you; and" />
              </li>
              <li>
                <FormattedMessage defaultMessage="third parties to collect and process data." />
              </li>
            </ul>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="5. International Transfers of Personal Information" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              <FormattedMessage defaultMessage="The personal information we collect is stored and processed in the United States or where we or our partners, affiliates and third-party providers maintain facilities. By providing us with your personal information, you consent to the disclosure to these overseas third parties." />
            </span>

            <br />
            <br />

            <span>
              <FormattedMessage defaultMessage="We will ensure that any transfer of personal information from countries in the European Economic Area (EEA) to countries outside the EEA will be protected by appropriate safeguards, for example by using standard data protection clauses approved by the European Commission, or the use of binding corporate rules or other legally accepted means." />
            </span>

            <br />
            <br />

            <span>
              <FormattedMessage defaultMessage="Where we transfer personal information from a non-EEA country to another country, you acknowledge that third parties in other jurisdictions may not be subject to similar data protection laws to the ones in our jurisdiction. There are risks if any such third party engages in any act or practice that would contravene the data privacy laws in our jurisdiction and this might mean that you will not be able to seek redress under our jurisdiction’s privacy laws." />
            </span>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="6. Your Rights and Controlling Your Personal Information" />
          </h2>
          <hr className="title-underline" />
          <div>
            <b>
              <FormattedMessage defaultMessage="Choice and consent: " />
            </b>{" "}
            <span>
              <FormattedMessage defaultMessage="By providing personal information to us, you consent to us collecting, holding, using and disclosing your personal information in accordance with this privacy policy. If you are under 16 years of age, you must have, and warrant to the extent permitted by law to us, that you have your parent or legal guardian’s permission to access and use the website and they (your parents or guardian) have consented to you providing us with your personal information. You do not have to provide personal information to us, however, if you do not, it may affect your use of this website or the products and/or services offered on or through it." />
            </span>
            <br />
            <br />
            <b>
              <FormattedMessage defaultMessage="Information from third parties:" />
            </b>{" "}
            <span>
              <FormattedMessage defaultMessage="If we receive personal information about you from a third party, we will protect it as set out in this privacy policy. If you are a third party providing personal information about somebody else, you represent and warrant that you have such person’s consent to provide the personal information to us." />
            </span>
            <br />
            <br />
            <b>
              <FormattedMessage defaultMessage="Restrict:" />
            </b>{" "}
            <span>
              <FormattedMessage defaultMessage="You may choose to restrict the collection or use of your personal information. If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by contacting us using the details below. If you ask us to restrict or limit how we process your personal information, we will let you know how the restriction affects your use of our website or products and services." />
            </span>
            <br />
            <br />
            <b>
              <FormattedMessage defaultMessage="Access and data portability:" />
            </b>{" "}
            <span>
              <FormattedMessage defaultMessage="You may request details of the personal information that we hold about you. You may request a copy of the personal information we hold about you. Where possible, we will provide this information in CSV format or other easily readable machine format. You may request that we erase the personal information we hold about you at any time. You may also request that we transfer this personal information to another third party." />
            </span>
            <br />
            <br />
            <b>
              <FormattedMessage defaultMessage="Correction:" />
            </b>{" "}
            <span>
              <FormattedMessage defaultMessage="If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant or misleading, please contact us using the details below. We will take reasonable steps to correct any information found to be inaccurate, incomplete, misleading or out of date." />
            </span>
            <br />
            <br />
            <b>
              <FormattedMessage defaultMessage="Notification of data breaches:" />
            </b>{" "}
            <span>
              <FormattedMessage defaultMessage="We will comply laws applicable to us in respect of any data breach." />
            </span>
            <br />
            <br />
            <b>
              <FormattedMessage defaultMessage="Complaints:" />
            </b>{" "}
            <span>
              <FormattedMessage defaultMessage="If you believe that we have breached a relevant data protection law and wish to make a complaint, please contact us using the details below and provide us with full details of the alleged breach. We will promptly investigate your complaint and respond to you, in writing, setting out the outcome of our investigation and the steps we will take to deal with your complaint. You also have the right to contact a regulatory body or data protection authority in relation to your complaint." />
            </span>
            <br />
            <br />
            <b>
              <FormattedMessage defaultMessage="Unsubscribe:" />
            </b>{" "}
            <span>
              <FormattedMessage defaultMessage="To unsubscribe from our e-mail database or opt-out of communications (including marketing communications), please contact us using the details below or opt-out using the opt-out facilities provided in the communication." />
            </span>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="7. Cookies" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              <FormattedMessage defaultMessage="We use “cookies” to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site. This helps us serve you content based on preferences you have specified. Please refer to our Cookie Policy for more information." />
            </span>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="8. Business Transfers" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              <FormattedMessage defaultMessage="If we or our assets are acquired, or in the unlikely event that we go out of business or enter bankruptcy, we would include data among the assets transferred to any parties who acquire us. You acknowledge that such transfers may occur, and that any parties who acquire us may continue to use your personal information according to this policy." />
            </span>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="9. Limits of Our Policy" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              <FormattedMessage defaultMessage="Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices." />
            </span>
          </div>
        </div>
        <div className="section-parahraph">
          <h2 className="section-title">
            <FormattedMessage defaultMessage="10. Changes to This Policy" />
          </h2>
          <hr className="title-underline" />
          <div>
            <span>
              <FormattedMessage defaultMessage="At our discretion, we may change our privacy policy to reflect current acceptable practices. We will take reasonable steps to let users know about changes via our website. Your continued use of this site after any changes to this policy will be regarded as acceptance of our practices around privacy and personal information." />
            </span>

            <br />
            <br />

            <span>
              <FormattedMessage defaultMessage="If we make a significant change to this privacy policy, for example changing a lawful basis on which we process your personal information, we will ask you to re-consent to the amended privacy policy." />
            </span>

            <br />
            <br />

            <span>
              <FormattedMessage
                defaultMessage="{websiteName} Data Controller"
                values={{ websiteName }}
              />
            </span>
            <br />
            <span>
              <FormattedMessage defaultMessage="Data Controller" />
            </span>
            {/* <br />
            <span>{supportEmail}</span> */}

            <br />
            <br />
            <span>
              <FormattedMessage defaultMessage="This policy is effective as of September 1, 2021." />
            </span>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default PrivacyPage;
