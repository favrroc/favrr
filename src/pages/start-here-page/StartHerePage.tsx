import React, { useEffect, useRef, useState } from "react";
import { If, Then } from "react-if";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { Query as GraphqlQuery, UserEntity } from "../../../generated-graphql/graphql";
import { verifyEmailWithLogin, verifyEmailWithoutLogin } from "../../api/verify-email";
import { ApolloActionType, ClientType, apolloClient } from "../../core/clients/apolloClient";
import Accordion3 from "../../components/accordion/Accordion3";
import {
  GreenCheckFilledImage,
  StartHereDemo1MobileImage,
  StartHereDemo1TabletImage
} from "../../components/assets/app-images/AppImages";
import BlogRelated from "../../components/blog/BlogRelated";
import TextInput from "../../components/input/TextInput";
import Loader from "../../components/loader/Loader";
import SEO from "../../components/seo/SEO";
import {
  Block,
  Body1,
  ButtonPrimary,
  ButtonSecondary,
  Caption2,
  Caption2Bold
} from "../../components/styleguide/styleguide";
import { ErrorMessages } from "../../core/constants/messages.const";
import { colors } from "../../core/constants/styleguide.const";
import { generateHasDuplicatedEmailQuery, generateHasDuplicatedEmailWithoutLoginQuery } from "../../core/graphql-queries/backend-queries/duplication-check.query";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../core/hooks/useLowercasedAccount";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import { setShowConnectWalletModalAction } from "../../core/store/slices/modalSlice";
import { updateOneParticipant } from "../../core/store/slices/participantsSlice";
import { updateUserProfile } from "../../core/store/slices/userSlice";
import { delay } from "../../core/util/base.util";
import { howItWorksPath } from "../../core/util/pathBuilder.util";
import { Unit, formatNumber, validateEmail } from "../../core/util/string.util";
import BasePage from "../base-page/BasePage";
import MarqueeRow from "./resources/MarqueeRow";
import {
  accordionsData,
  howItWorksData,
  keyStatsData,
  marqueeRows
} from "./resources/start-here-page-data.const";
import {
  StartHereH2,
  StartHereH6,
  StyledCharitiesModule,
  StyledHeroModule,
  StyledHowItWorksModule,
  StyledJoinEarlyAdoptersMainModule,
  StyledJoinEarlyAdoptersModule,
  StyledKeyStatsBottomModule,
  StyledKeyStatsTopModule,
  StyledLetsGoButton,
  StyledModuleContainer1,
  StyledNeutrals1Container,
  StyledQuoteModule,
  StyledWhatToKnowModule
} from "./resources/styled-components";
import { handleOpacity } from "./resources/utils";

export default function StartHerePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { smallerThanTablet, windowHeight } = useWatchResize();
  const { isConnected } = useLowercasedAccount();

  const { profile } = useAppSelector(state => state.user);
  const { secondsOnApp } = useAppSelector(state => state.usage);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentHIWIndex, setCurrentHIWIndex] = useState(0);
  const [joiningBeta, setJoiningBeta] = useState(false);
  const [joinedBeta, setJoinedBeta] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>();
  const quoteModuleRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const hoursInMillion = formatNumber({ value: secondsOnApp * 434028, unit: Unit.SHARE, summarize: false });

  // sign up module
  // const { participantsData } = useAppSelector(state => state.participants);
  const [email, setEmail] = useState("");
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEmail(newValue);
  };

  const handleClickHoldMySeat = async () => {
    if (email.length === 0) {
      setSignUpErrorMessage(ErrorMessages.EmailRequiredError);
      return;
    }
    else {
      try {
        const graphqlResult: GraphqlQuery = await apolloClient(
          ClientType.GRAPHQL,
          ApolloActionType.QUERY,
          isConnected ? generateHasDuplicatedEmailQuery(email) : generateHasDuplicatedEmailWithoutLoginQuery(email)
        );
        if (isConnected ? graphqlResult.hasDuplicatedEmail : graphqlResult.hasDuplicatedEmailWithoutLogin) {
          setSignUpErrorMessage(ErrorMessages.EmailTakenError);
          return;
        }
        else {
          const errorMsg = await validateEmail(email);
          if (errorMsg) {
            setSignUpErrorMessage(errorMsg);
            return;
          }
        }
        setJoiningBeta(true);

        if (isConnected) {
          const newProfile: UserEntity = {
            ...profile,
            email: email,
          };

          await dispatch(updateUserProfile(newProfile));
          await dispatch(updateOneParticipant(newProfile));
        }

        const response = await (isConnected ? verifyEmailWithLogin(email) : verifyEmailWithoutLogin(email));
        if (response) {
          setJoiningBeta(true);
          setJoinedBeta(true);
          setSignUpErrorMessage("");
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  const handleScroll = () => {
    const bodyTop = document.body.getBoundingClientRect().top || 0;
    // quote module
    const currentPosition = window.scrollY;
    const quoteModulePosition = (quoteModuleRef.current?.getBoundingClientRect().top || 0) - bodyTop;
    setScrollPosition(windowHeight > quoteModulePosition ? currentPosition : Math.max(currentPosition - (quoteModulePosition - windowHeight) - windowHeight / 4, 0));

    // how it works module
    const step1Bottom = (step1Ref.current?.getBoundingClientRect().bottom || 0) - bodyTop;
    const step2Bottom = (step2Ref.current?.getBoundingClientRect().bottom || 0) - bodyTop;
    const threshold = currentPosition + 98;
    setCurrentHIWIndex(step1Bottom > threshold ? 0 : step2Bottom > threshold ? 1 : 2);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSignUpErrorMessage("");
  }, [email]);

  const handleClickSecureNow = async () => {
    document.querySelector("#join-module")?.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
    await delay(1);
    emailInputRef.current?.focus();
  };

  const handleClickLetsGo = () => {
    dispatch(setShowConnectWalletModalAction(true));
  };

  return (
    <BasePage contentStyle={{ boxSizing: "border-box", width: "100%", padding: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <SEO
        title={`Oceana Market - The Celebrity Investment Game that Gives Back`}
        description={`At Oceana Market the power of celebrity fandom to do good, fans can play games of buying and selling virtual stocks representing their favorite celebrities, with commissions going to charity. Join our beta test and be among the first to experience the future of celebrity investing! With our innovative platform, fans can now earn, enjoy, and do good.`}
        name={`Oceana Market`}
        type={`Start Here Page`}
      />

      {/* Join Early Adopters */}
      <If condition={!profile.email}>
        <Then>
          <StyledJoinEarlyAdoptersModule>
            <Caption2 className="description">Join the early adopters, secure your beta seat now.</Caption2>
            <Caption2Bold
              style={{ color: colors.primaryBlue, cursor: "pointer" }}
              onClick={handleClickSecureNow}
            >
              Secure Now
            </Caption2Bold>
          </StyledJoinEarlyAdoptersModule>
        </Then>
      </If>

      <StyledHeroModule>
        <div className="caption">FUEL YOUR FANDOM AND YOUR FAVORITE CAUSE</div>
        <div className="title">
          <p>PLAY, EARN, & DO GOOD</p>
          <p>ALL AT ONCE</p>
        </div>
        {!isConnected && <StyledLetsGoButton onClick={handleClickLetsGo}>{`Let's Go`}</StyledLetsGoButton>}
      </StyledHeroModule>

      <Block style={{ backgroundColor: colors.neutrals2, width: "100%" }}>
        {/* Charities Module */}
        <StyledCharitiesModule>
          {marqueeRows.map(({ direction, images }, index) => <MarqueeRow key={index} direction={direction} images={images.concat(images)} />)}
          <div className="demo1-container">
            <img src={smallerThanTablet ? StartHereDemo1MobileImage().props.src : StartHereDemo1TabletImage().props.src} alt="demo1" />
          </div>
        </StyledCharitiesModule>

        {/* Quote Module */}
        <StyledQuoteModule>
          <StartHereH6>Your Obsession Now Pays Off</StartHereH6>
          <div className="description" ref={quoteModuleRef}>
            {"Get Paid for Being a Fan? Yes, Please! Oceana Hacked Fandom TO Reward You for WHAT YOU ALREADY DO."
              .split("")
              .map((word, wordIndex) => (
                <span key={wordIndex} style={{ opacity: handleOpacity(wordIndex, wordIndex, scrollPosition) }}>
                  {word}
                </span>
              ))}
          </div>
        </StyledQuoteModule>

        {/* How It Works Module */}
        <StyledModuleContainer1>
          <StyledHowItWorksModule>
            <div className="left">
              {howItWorksData.map((data, index) => (
                <div key={index} ref={index === 0 ? step1Ref : index === 1 ? step2Ref : step3Ref}>
                  <StartHereH6>{`STEP ${index + 1}`}</StartHereH6>
                  <StartHereH2 className="title">{data.title}</StartHereH2>
                  <Body1 style={{ color: colors.neutrals5 }}>{data.description}</Body1>
                  <br />
                  {smallerThanTablet && (
                    <div style={{ marginTop: "87px", width: "100%", display: "flex", justifyContent: "center" }}>
                      <img src={howItWorksData[index].imageSrc} alt="hiw" style={{ transition: `opacity 0.5s ease-in-out` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!smallerThanTablet && (
              <>
                <div className="middle"></div>
                <div className="right">
                  <div className="sticky-image-container">
                    {howItWorksData.map((data, index) => (
                      <CSSTransition key={index} classNames="imagetransition" timeout={500} in={index === currentHIWIndex}>
                        <img src={data.imageSrc} alt="hiw" style={{ display: index === currentHIWIndex ? "block" : "none" }} />
                      </CSSTransition>
                    ))}
                  </div>
                </div>
              </>
            )}
          </StyledHowItWorksModule>
        </StyledModuleContainer1>

        {/* KEY STATS Module */}
        <StyledKeyStatsTopModule>
          <div className="title">
            <div className="left-title">KEY</div>
            <div className="right-title">STATS</div>
          </div>
          <div className="num-4100500">
            {hoursInMillion}
          </div>
          <div className="content">
            {`Fan hours worked since you loaded the page `}
            {formatNumber({ value: Math.floor(secondsOnApp), unit: Unit.SHARE, summarize: false })}
            {` seconds ago.`}
          </div>
        </StyledKeyStatsTopModule>

        <StyledModuleContainer1>
          <StyledKeyStatsBottomModule>
            {keyStatsData.map((data, index) => (
              <div className={`card card-${index + 1}`} key={index}>
                <div className="title">{data.title}</div>
                <div className="value">{data.value}</div>
                <div className="description">{data.description}</div>
              </div>
            ))}
          </StyledKeyStatsBottomModule>
        </StyledModuleContainer1>

        {(!profile.email || joiningBeta || joinedBeta) && (
          <StyledNeutrals1Container id="join-module">
            <StyledModuleContainer1>
              <StyledJoinEarlyAdoptersMainModule>
                {joinedBeta ? (
                  <>
                    <div className="title2">{`ALMOST THERE!`}</div>
                    <div className="caption caption2">Please check your email for next steps.</div>
                    <GreenCheckFilledImage />
                  </>
                ) : (
                  <>
                    <div className="title">Join the Early Adopters</div>
                    <div className="caption">Secure your limited beta seat now.</div>
                    <div className="email-input">
                      <TextInput
                        placeholder="Enter email"
                        ref={emailInputRef}
                        containerStyle={{ flex: 1 }}
                        value={email}
                        onChange={handleEmailChange}
                        errorMessage={signUpErrorMessage}
                      />
                      <ButtonPrimary onClick={handleClickHoldMySeat} disabled={signUpErrorMessage || joiningBeta}>
                        {joiningBeta ? <Loader /> : `Hold My Seat`}
                      </ButtonPrimary>
                    </div>
                  </>
                )}
              </StyledJoinEarlyAdoptersMainModule>
            </StyledModuleContainer1>
          </StyledNeutrals1Container>
        )}

        {/* WHAT TO KNOW */}
        <StyledNeutrals1Container>
          <StyledModuleContainer1>
            <StyledWhatToKnowModule>
              <div className="wtk-header">
                <div className="title">What To Know</div>
                <ButtonSecondary onClick={() => navigate(howItWorksPath())}>All FAQ</ButtonSecondary>
              </div>
              <div>
                {accordionsData.map((a, accordionIndex) => (
                  <React.Fragment key={accordionIndex}>
                    <Accordion3 title={a.title}>
                      {a.body}
                    </Accordion3>
                    {(accordionIndex !== accordionsData.length - 1) && <div className="divider" />}
                  </React.Fragment>
                ))}
              </div>
            </StyledWhatToKnowModule>
          </StyledModuleContainer1>
        </StyledNeutrals1Container>
        <StyledNeutrals1Container>
          <StyledModuleContainer1>
            <BlogRelated dark={true} />
          </StyledModuleContainer1>
        </StyledNeutrals1Container>
      </Block>
    </BasePage>
  );
};

