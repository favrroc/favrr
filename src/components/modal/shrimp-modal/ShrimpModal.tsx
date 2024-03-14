import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

import { Query as GraphqlQuery, UserEntity } from "../../../../generated-graphql/graphql";
import { verifyEmailWithLogin } from "../../../api/verify-email";
import { ApolloActionType, ClientType, apolloClient } from "../../../core/clients/apolloClient";
import greenCheckSrc from "../../../assets/images/green-check.svg";
import { ErrorMessages } from "../../../core/constants/messages.const";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { League } from "../../../core/enums/league.enum";
import { generateHasDuplicatedEmailQuery } from "../../../core/graphql-queries/backend-queries/duplication-check.query";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { setShowShareProfileModal, setShowShrimpModalAction } from "../../../core/store/slices/modalSlice";
import * as participantsActions from "../../../core/store/slices/participantsSlice";
import * as userActions from "../../../core/store/slices/userSlice";
import { preventEnterKey } from "../../../core/util/base.util";
import { LeagueLib } from "../../../core/util/league.util";
import { getLocalStorageWithExpiry, setLocalStorageWithExpiry } from "../../../core/util/localstorage.util";
import { pixelToNumber, validateEmail } from "../../../core/util/string.util";
import { OceanaCoinImage } from "../../assets/app-images/AppImages";
import BackButton from "../../button/back-button/BackButton";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import { Block, ButtonPrimary, ButtonSecondary } from "../../styleguide/styleguide";
import Modal from "../Modal";
import ModalContent from "../children/modal-content/ModalContent";
import "./plankton-modal.scss";

type ModalForm = {
  email: string;
};

const ShrimpModal = () => {
  const dispatch = useAppDispatch();
  const { windowWidth } = useWatchResize();

  const { profile, league } = useAppSelector(state => state.user);
  // const { participantsData } = useAppSelector(state => state.participants);

  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [showConnectedStatus, setShowConnectedStatus] = useState(false);
  const [connectedStatusName, setConnectedStatusName] = useState("");
  const [connectedStatusMessage, setConnectedStatusMessage] = useState("");
  const [socialInit, setSocialInit] = useState(false);
  const [hasNextStep, setHasNextStep] = useState(getLocalStorageWithExpiry("hasNextStep"));
  const [hideLevelUp, setHideLevelUp] = useState(sessionStorage.getItem("hideLevelUp"));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
  } = useForm<ModalForm>({
    criteriaMode: "all",
    defaultValues: {},
  });

  useEffect(() => {
    setValue("email", profile.email as string);
  }, [profile.email]);

  // Email
  const email = watch("email");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const onClose = () => {
    dispatch(setShowShrimpModalAction(false));
    localStorage.setItem("leaguemodal", "false");
    sessionStorage.setItem("hideLevelUp", "true");
    setLocalStorageWithExpiry("hasNextStep", "true", 43200000);
  };

  const postNextStep = async (data: boolean) => {
    sessionStorage.setItem("hideLevelUp", "true");
    setLocalStorageWithExpiry("hasNextStep", "true", 43200000);
    setHasNextStep("true");
    setHideLevelUp("true");
  };

  const postApi = async (data: ModalForm) => {
    localStorage.setItem("leaguemodal", "true");
    try {
      const newProfile: UserEntity = {
        ...profile,
        email: data.email,
        hasNextStep: false,
      };
      localStorage.removeItem("hasNextStep");
      // sessionStorage.removeItem("hasNextStep");
      sessionStorage.removeItem("hideLevelUp");
      await dispatch(userActions.updateUserProfile(newProfile));
      await dispatch(participantsActions.updateOneParticipant(newProfile));
      setUpdated(true);
      setTimeout(() => {
        setUpdated(false);
      }, 5000);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const onSubmit = async (data: ModalForm) => {
    try {
      trigger();
      setUpdating(true);

      // START validate email
      const { hasDuplicatedEmail }: GraphqlQuery = await apolloClient(
        ClientType.GRAPHQL,
        ApolloActionType.QUERY,
        generateHasDuplicatedEmailQuery(email)
      );
      if (hasDuplicatedEmail) {
        setEmailErrorMessage(ErrorMessages.EmailTakenError);
        setUpdating(false);
        return;
      }
      else {
        const errorMsg = await validateEmail(email);
        if (errorMsg) {
          setEmailErrorMessage(errorMsg);
          setUpdating(false);
          return;
        }
      }
      // END validate email

      await postApi(data);
      setTimeout(() => {
        setUpdating(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  // seconds count down
  const [secondsCountdown, setSecondsCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (secondsCountdown === 0) {
      setSecondsCountdown(null);
      setSendingEmail(false);
    }

    if (!secondsCountdown) return;

    const intervalId = setInterval(() => {
      setSecondsCountdown(secondsCountdown - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsCountdown]);

  useEffect(() => {
    setEmailErrorMessage("");
  }, [email]);

  const sendEmailConfirm = async () => {
    // validate email
    if (email) {
      setIsValidatingEmail(true);
      const { hasDuplicatedEmail }: GraphqlQuery = await apolloClient(
        ClientType.GRAPHQL,
        ApolloActionType.QUERY,
        generateHasDuplicatedEmailQuery(email)
      );
      if (hasDuplicatedEmail) {
        setEmailErrorMessage(ErrorMessages.EmailTakenError);
        setIsValidatingEmail(false);
        return;
      }
      else {
        const errorMsg = await validateEmail(email);
        if (errorMsg) {
          setEmailErrorMessage(errorMsg);
          setIsValidatingEmail(false);
          return;
        }
      }

      setIsValidatingEmail(false);

      localStorage.setItem("leaguemodal", "true");
      if (secondsCountdown == null) {
        setSendingEmail(true);
        setSecondsCountdown(60);
      }
      await verifyEmailWithLogin(email);
    }
  };

  const socialConnectionStatus = (provider: string, message: string) => {
    setShowConnectedStatus(true);
    setConnectedStatusName(provider);
    setConnectedStatusMessage(message);
    setTimeout(() => {
      setShowConnectedStatus(false);
    }, 5000);
  };

  // useEffect(() => {
  //   if (league === League.Microbe) {
  //     dispatch(setShowPlanktonModalAction(true));
  //     dispatch(setShowShrimpModalAction(false));
  //   }
  //   if (league === League.Crab) {
  //     dispatch(setShowCrabModalAction(true));
  //     dispatch(setShowShrimpModalAction(false));
  //   }
  // }, [league]);

  useEffect(() => {
    setSocialInit(true);
    localStorage.setItem("leaguemodal", "true");
    setHasNextStep(getLocalStorageWithExpiry("hasNextStep"));
    setHideLevelUp(sessionStorage.getItem("hideLevelUp"));
  }, []);

  const titleDescription = useMemo(() => {
    setHasNextStep(null);
    // Set TITLE and then DESCRIPTION using one useMemo
    // sessionStorage.removeItem("hideLevelUp");
    setHideLevelUp(sessionStorage.getItem("hideLevelUp"));
    if (league !== League.Shrimp) {
      return [LeagueLib[league].reportTitle[0], LeagueLib[league].reportDescription[0]];
    }
    if (hasNextStep) {
      return [LeagueLib[league].reportTitle[2], LeagueLib[league].reportDescription[2]];
    } else {
      return [LeagueLib[league].reportTitle[1], LeagueLib[league].reportDescription[1]];
    }
  }, [league]);

  return (
    <Modal>
      <StyledModalContent className="plankton-modal">
        <>
          {/* Modal Close Button */}
          {windowWidth <= pixelToNumber(RESPONSIVE.mobile) && (
            <>
              <BackButton onClose={onClose} />
              <Block className="h-32" />
            </>
          )}
          {windowWidth > pixelToNumber(RESPONSIVE.mobile) && (
            <Flex className="justify-between align-center">
              <ModalCloseButton onClose={onClose} />
            </Flex>
          )}

          {/* League Thumbnail */}
          <Thumbnail>
            {LeagueLib[league].image}
          </Thumbnail>

          {/* Modal Title */}
          <h2 style={{ display: "flex" }}>
            <span className="report-title">
              {titleDescription[0]}
            </span>
          </h2>

          {/* Modal Description */}
          <div className="report-desc text-center">
            <ReactMarkdown linkTarget="_blank">{titleDescription[1]}</ReactMarkdown>
          </div>

          {league === League.Crab ? (
            <div className="content">
              <ButtonPrimary onClick={() => {
                dispatch(setShowShareProfileModal({
                  showModal: true,
                  props: {
                    url: window.location.href,
                    img: profile?.profileImageUrl || OceanaCoinImage().props.src
                  }
                }));
                onClose();
              }}>
                Share Your Progress
              </ButtonPrimary>
            </div>
          ) : (
            <>
              {hideLevelUp == null ? (
                <div className="content">
                  <FormInput style={{ marginBottom: "40px" }}>
                    <Flex className="flex-col gap-12">
                      <ButtonPrimary className="w-full" onClick={() => postNextStep(true)}>
                        {"Let's Go!"}
                      </ButtonPrimary>
                      <ButtonSecondary className="w-full" onClick={onClose}>
                        Not Now
                      </ButtonSecondary>
                    </Flex>
                  </FormInput>
                </div>
              ) : (
                <Form onKeyDown={preventEnterKey} onSubmit={handleSubmit(onSubmit)}>
                  <FormInput>
                    <Label>Email</Label>
                    <div className="relative">
                      {/* Email */}
                      <input
                        {...register("email")}
                        placeholder="Enter email"
                        onChange={(e) => {
                          setValue("email", e.target.value);
                        }}
                        autoComplete={"off"}
                        className={`${emailErrorMessage ? "error" : ""}`}
                        style={{ paddingRight: profile?.emailVerified && email === profile?.email ? "16px" : "86px" }}
                      />

                      {/* Show Confirm */}
                      {(!emailErrorMessage && email?.length > 0 && (
                        !profile.emailVerified ||
                        (profile.emailVerified && profile.email !== email)
                      )) && (
                        <ConfirmEmail
                          type="button"
                          onClick={sendEmailConfirm}
                          disabled={(secondsCountdown != null || isValidatingEmail) ? true : false}
                          className={(secondsCountdown != null || isValidatingEmail) ? "pending" : ""}
                        >
                          {isValidatingEmail ? "Sending" : "Confirm"}
                        </ConfirmEmail>
                      )}
                    </div>

                    {/* Sending Email Status */}
                    {sendingEmail && (!profile.emailVerified || profile.email !== email) && <SendEmailInfo>
                      <p>Please check <strong>{email}</strong> to confirm your email address.</p>
                      <p>Resend email in {secondsCountdown} {(secondsCountdown && (secondsCountdown > 1)) ? "seconds" : "second"}.</p>
                    </SendEmailInfo>}

                    {/* Email Confirmed Status */}
                    {profile?.emailVerified && profile?.email === email &&
                      <EmailVerifiedInfo>
                        <img src={greenCheckSrc} width="20" height="20" alt="Confirmed Email" /> Email Confirmed.
                      </EmailVerifiedInfo>
                    }
                    {/* Email Not-Confirmed Status */}
                    {!profile?.emailVerified && (profile?.email && profile?.email?.length > 0) &&
                      <EmailVerifiedInfo className="not-confirmed">
                        Email Not Confirmed.
                      </EmailVerifiedInfo>
                    }

                    {/* Email Error Message */}
                    {emailErrorMessage && (
                      <div className="error-message">
                        {emailErrorMessage}
                      </div>
                    )}
                  </FormInput>

                  {/* Social Links */}
                  {/* Commenting out until wallet connect is implemented */}
                  {/* <FormInput>
                  <Label style={{ display: "flex" }}>
                    Social Links
                    <span
                      data-for="social-tooltip"
                      data-tip
                      className="tooltip-icon"
                    >
                      <img src={grayInfo} alt="Social Tooltip" />
                    </span>
                    <ReactTooltip
                      place="top"
                      effect="solid"
                      className="react-tooltip react-tooltip-clickable-link"
                      id="social-tooltip"
                      delayHide={200}
                    >
                      Adding social links helps get your account verified. <Link target={"_blank"} onClick={() => localStorage.setItem("leaguemodal", "false")} to="/how-it-works?targetTab=1&targetIndex=faq10">Learn More</Link>
                    </ReactTooltip>
                  </Label>
                  <LabelP>Add your existing social links to build a stronger reputation.</LabelP>
                  {showConnectedStatus && <ConnectedStatus>
                    <img height="24" src={greenCheckSrc} alt="Check" />
                    <span>Your {connectedStatusName} account is {connectedStatusMessage}.</span>
                  </ConnectedStatus>}
                  <Flex style={{ gap: "24px", flexDirection: "column", marginTop: "12px" }}>
                    <Flex style={{ width: "100%", gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
                      {socialInit && <><Flex style={{ gap: "12px", fontWeight: "500", color: "#FCFCFD" }}><img src={facebookIconSrc} alt="Facebook connect" />Facebook</Flex>
                        <Social socialConnectionStatus={socialConnectionStatus} /></>}
                    </Flex>
                    <ComingSoon />
                  </Flex>
                </FormInput> */}

                  {/* Action Button Group */}
                  {updated && <ConnectedStatus>
                    <img height="24" src={greenCheckSrc} alt="Check" />
                    <span>Your profile was updated.</span>
                  </ConnectedStatus>}
                  <FormInput>
                    <Flex className="flex-col gap-8">
                      <ButtonPrimary className="w-full" disabled={updating ? true : !!emailErrorMessage}>
                        {updating ? "Saving ..." : "Save"}
                      </ButtonPrimary>
                      <ButtonSecondary className="w-full" onClick={onClose}>
                        Cancel
                      </ButtonSecondary>
                    </Flex>
                  </FormInput>
                </Form>
              )}
            </>
          )}
        </>
        {league !== League.Crab && <CaptionFooter>Oceana will never share your personal information with anyone, ever.</CaptionFooter>}
      </StyledModalContent>
    </Modal>
  );
};

const CaptionFooter = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #808191;
`;

const ConnectedStatus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  gap: 16px;
  background: rgba(63, 140, 255, 0.08);
  border-radius: 10px;
  margin-bottom: 0;
  margin-top: 0;
  
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  color: #7FBA7A;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const Thumbnail = styled.div`
  display: flex;
  border-radius: 100%;
  background: rgba(63, 140, 255, 0.08);
  justify-content: center;
  align-items: center;
  width: 128px;
  height: 128px;
  margin: auto;
  margin-bottom: 32px;
  img {
    width: 116px;
  }
`;

const EmailVerifiedInfo = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #7FBA7A;
  gap: 8px;
  &.not-confirmed {
    color: #FFA2C0;
  }
`;

const SendEmailInfo = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: left;
  color: #B1B5C4;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  strong {
    font-weight: 600;
  }
`;

const ConfirmEmail = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #3F8CFF !important;
  &.pending {
    color: #808191 !important;
  }
`;

const Label = styled.label`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #FCFCFD;
`;

const FormInput = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  .react-tooltip-clickable-link {
    a {
      color: #3F8CFF !important;
    }
    pointer-events: auto !important;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const StyledModalContent = styled(ModalContent)`
  input {
    transition: all 0.2s ease;
    border: 2px solid #353945;
    border-radius: 12px;
    padding: 12px 16px;
    display: block;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    color: #fcfcfd;
    line-height: 24px;
    font-family: poppins;

    font-size: 16px;
    font-weight: 500;
    height: 48px;
    &::placeholder {
      color: #808191;
      font-weight: 400 !important;
    }
    &:hover {
      border-color: #808191;
    }
    &:focus {
      border-color: #3f8cff;
    }
  }

  input::placeholder {
    color: #808191;
    font-weight: 400;
  }

  input {
    font-weight: 400;
  }

  input.error {
    border-color: #ffa2c0;
  }
  .content {
    margin-top: 32px;
  }
  .report-desc {
    margin-top: 6px;
    a {
      color: #3F8CFF;
      &:hover {
        color: #FCFCFD !important;
      }
    }
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    max-width: 100% !important;
    border-radius: 0 !important;
    padding: 32px 24px !important;
    height: 100vh;
  }
`;

export default ShrimpModal;
