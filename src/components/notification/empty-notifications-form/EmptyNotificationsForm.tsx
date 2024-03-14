import React, { useMemo, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import checkSrc from "../../../assets/images/check-green-circle.svg";
import emailSrc from "../../../assets/images/email.svg";
import arrowSrc from "../../../assets/images/left-arrow.svg";
import noNotificationSrc from "../../../assets/images/no-notification.svg";
import "./empty-notifications-form.scss";

enum NotificationStep {
  NOTIFICATIONS,
  SUBSCRIPTION,
  SUBSCRIPTION_COMPLETE,
}

const intlMessages = defineMessages({
  emailPlaceholder: {
    defaultMessage: "Enter Email",
  },
  emptyEmail: {
    defaultMessage: "Email cannot be blank",
  },
  invalidEmail: {
    defaultMessage: "Invalid email",
  },
});

const EmptyNotificationsForm = (props: {
  skipEmptyNotifications?: boolean;
  onFinish?: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(
    props.skipEmptyNotifications
      ? NotificationStep.SUBSCRIPTION
      : NotificationStep.NOTIFICATIONS
  );

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<null | string>(null);

  /* const [subscribeEmail] = useMutation<
    SubscribeEmailMutation,
    SubscribeEmailMutationVariables
  >(SUBSCRIBE_EMAIL_MUTATION); */

  const intl = useIntl();

  const stepImgSrc = useMemo(() => {
    if (currentStep == NotificationStep.NOTIFICATIONS) {
      return noNotificationSrc;
    }
    if (currentStep == NotificationStep.SUBSCRIPTION) {
      return emailSrc;
    }
    if (currentStep == NotificationStep.SUBSCRIPTION_COMPLETE) {
      return checkSrc;
    }
  }, [currentStep]);

  const stepTitle = useMemo(() => {
    if (currentStep == NotificationStep.NOTIFICATIONS) {
      return <FormattedMessage defaultMessage="No Notifications" />;
    }
    if (currentStep == NotificationStep.SUBSCRIPTION) {
      return <FormattedMessage defaultMessage="Subscribe" />;
    }
    if (currentStep == NotificationStep.SUBSCRIPTION_COMPLETE) {
      return <FormattedMessage defaultMessage="Subscribed" />;
    }
  }, [currentStep]);

  const stepClassName = useMemo(() => {
    if (currentStep == NotificationStep.NOTIFICATIONS) {
      return "notifications";
    }
    if (currentStep == NotificationStep.SUBSCRIPTION) {
      return "subscription";
    }
    if (currentStep == NotificationStep.SUBSCRIPTION_COMPLETE) {
      return "subscription-complete";
    }
  }, [currentStep]);

  const displayActionContainer =
    currentStep == NotificationStep.NOTIFICATIONS ||
    currentStep == NotificationStep.SUBSCRIPTION;

  return (
    <div className={`empty-notifications-form ${stepClassName}`}>
      <button
        className="back-button"
        onClick={() => {
          setEmailError(null);
          if (props.skipEmptyNotifications) {
            if (props.onFinish) {
              props.onFinish();
            }
          } else {
            setCurrentStep(NotificationStep.NOTIFICATIONS);
          }
        }}
      >
        <img src={arrowSrc} />
        <FormattedMessage defaultMessage="Back" />
      </button>
      <img className="notification-email-icon" src={stepImgSrc} />
      <span className="title">{stepTitle}</span>

      {currentStep == NotificationStep.SUBSCRIPTION && (
        <span className="subscription-description">
          <FormattedMessage defaultMessage="Stay ahead of future IPOs and catch the latest news." />
        </span>
      )}
      {displayActionContainer && (
        <div className={`action-container ${emailError ? "error" : ""}`}>
          {currentStep == NotificationStep.NOTIFICATIONS && (
            <button
              className="subscription-button"
              onClick={() => setCurrentStep(NotificationStep.SUBSCRIPTION)}
            >
              <FormattedMessage defaultMessage="Subscribe for Updates" />
            </button>
          )}
          {currentStep == NotificationStep.SUBSCRIPTION && (
            <form
              className="email-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (email.length == 0) {
                  setEmailError(intl.formatMessage(intlMessages.emptyEmail));
                  return;
                }
                if (
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                    email
                  ) == false
                ) {
                  setEmailError(intl.formatMessage(intlMessages.invalidEmail));
                  return;
                }

                setEmailError(null);

                /* if (address) {
                  subscribeEmail({
                    variables: { email, address },
                  }).then((result) => {
                    if (result.data?.subscribe) {
                      setCurrentStep(NotificationStep.SUBSCRIPTION_COMPLETE);
                      setTimeout(() => {
                        if (props.onFinish) {
                          props.onFinish();
                        }
                      }, 3000);
                    }
                  });
                } */
              }}
            >
              <input
                className="email-input"
                autoFocus
                placeholder={intl.formatMessage(intlMessages.emailPlaceholder)}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                autoComplete="off"
                formNoValidate
              />
              <button>
                <img src={arrowSrc} style={{ transform: "rotate(180deg)" }} />
              </button>
            </form>
          )}
          {emailError && (
            <span className="input-error-label">{emailError}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyNotificationsForm;
