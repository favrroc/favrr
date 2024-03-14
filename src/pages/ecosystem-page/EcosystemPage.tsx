import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import BasePage from "../base-page/BasePage";
import EcoInfoGraphic from "../../components/eco/eco-info-graphic/EcoInfoGraphic";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import screengrabSrc from "../../assets/images/screengrab.png";
import { H1 } from "../../components/styleguide/styleguide";

const EcosystemPage = () => {
  const howItWorksRef = useRef(null);
  const walletRef = useRef(null);
  const scrollToSection = (toRef: any) => {
    toRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };
  useEffect(() => {
    setTimeout(() => {
      const hashtag = window.location.hash;
      if (hashtag) {
        if (hashtag == "#whats-a-wallet") {
          scrollToSection(walletRef);
        }
        if (hashtag == "#how-does-it-work") {
          scrollToSection(howItWorksRef);
        }
      }
    }, 1000);
  }, []);
  return (
    <BasePage
      className="ecosystem-page"
      contentStyle={{ padding: "0", width: "100%" }}
    >
      <Header>
        <Content>
          <Top>HOW IT WORKS</Top>
          <H1 className="font-neutrals8">Buy, sell & collect rare celebrity stocks</H1>
        </Content>
      </Header>
      <Body>
        <BodyInner>
          <H2>{`What's Oceana Market?`}</H2>
          <H2Sep />
          <P>
            Oceana Market is the go-to place to trade and manage celebrity stocks — just like a stock exchange (e.g. NASDAQ, NYSE), but instead with people.
          </P>
          <P>
            Access the Market at <Link to={`/`}>oceana.market</Link>
          </P>
          <P>The Market allows you to:</P>
          <Ul>
            <li>
              Buy shares of unique celebrities that are for sale.
            </li>
            <li>
              Explore the diverse collection of unique celebrity stocks to see who owns what, what celebrity stocks exist and what celebrity stocks are claimed.
            </li>
            <li>
              Sell celebrity shares at appreciation to earn coveted rewards.
            </li>
          </Ul>
        </BodyInner>
        <BodyInner
          ref={howItWorksRef}
          id="how-does-it-work"
          style={{ scrollMargin: "82px" }}
        >
          <H2>{`How does the Oceana Ecosystem work?`}</H2>
          <H2Sep />
          <P>
            Master each league to earn your place in{" "}
            <Link to={`/fans`}>fan leaderboard</Link> history. Build up
            your social capital by completing unique quests and challenges to
            achieve the ultimate Whale status.
          </P>
          <EcoInfoGraphic />
        </BodyInner>
        <BodyInner>
          <H2>{`Do I need to log in?`}</H2>
          <H2Sep />
          <P>
            No, you {`don't`} need to log in. A digital wallet will work as your
            personal account, allowing you to connect from different devices,
            keeping all your digital assets and progress safe.{" "}
            <Link
              to="#whats-a-wallet"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollToSection(walletRef);
              }}
            >
              {`What's`} a wallet?
            </Link>
          </P>
        </BodyInner>
        <BodyInner
          id="whats-a-wallet"
          ref={walletRef}
          style={{ scrollMargin: "82px" }}
        >
          <H2>{`What's a wallet?`}</H2>
          <H2Sep />
          <P>
            Wallets manage all your digital assets. They can be added as either a browser extension or an app on your phone.
          </P>
          <P>
            Before using <b>Oceana</b> Market, connect and log into a digital wallet. We recommend using the{" "}
            <a
              href="https://metamask.io/"
              referrerPolicy="no-referrer"
              target="_blank"
              rel="noreferrer"
            >
              MetaMask
            </a>{" "}
            or{" "}
            <a
              href="https://wallet.coinbase.com/ "
              referrerPolicy="no-referrer"
              target="_blank"
              rel="noreferrer"
            >
              Coinbase
            </a>{" "}
            wallet.
          </P>
        </BodyInner>
        <BodyInner>
          <H2>{`How do I buy shares?`}</H2>
          <H2Sep />
          <P>To buy celebrity stocks in the Market:</P>
          <Ul>
            <li>
              Browse to find the celebrity that {`you'd`} like to buy and click them to open their details.
            </li>
            <li>On the details page, click {`'Buy'`}.</li>
            <li>
              Confirm this transaction in your digital wallet and wait for the network to provide verification.
            </li>
          </Ul>
        </BodyInner>
        <BodyInner>
          <H2>{`How do I see my activity history?`}</H2>
          <H2Sep />
          <P>
            Open the notifications panel by clicking the bell icon at the top of
            the screen.
          </P>
        </BodyInner>
      </Body>
      <div style={{ display: "flex" }}>
        <Screengrab src={screengrabSrc} width="100%" alt="Activity history" />
      </div>
    </BasePage>
  );
};

const Screengrab = styled.img`
  margin: 80px auto 128px;
  width: 100%;
  max-width: 880px;
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    margin: 48px auto 64px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin: 48px auto 64px;
  }
`;

const P = styled.p`
  padding: 0;
  margin: 0;
`;

const Ul = styled.ul`
  margin: 0;
  padding: 0 0 0 30px;
`;

const BodyInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #b1b5c4;
  a {
    color: #3f8cff;
    &:hover {
      color: #fcfcfd !important;
    }
  }
`;
const H2 = styled.h2`
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: -0.01em;
  color: #fcfcfd;
  margin: 0;
`;

const H2Sep = styled.div`
  background: #353945;
  width: 166px;
  height: 2px;
`;

const Body = styled.div`
  max-width: 728px;
  width: 100%;
  margin: 128px auto 0;
  display: flex;
  flex-direction: column;
  gap: 80px;
  box-sizing: border-box;
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    margin-top: 96px;
    padding: 0 64px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin-top: 64px;
    padding: 0 32px;
  }
  @media screen and (max-width: ${RESPONSIVE.xSmall}) {
    padding: 0 4px;
  }
`;

const Content = styled.div`
  max-width: 728px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 12px;
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    padding: 56px 0;
    gap: 20px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    padding: 48px 0;
  }
`;

const Header = styled.div`
  padding: 129px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: solid 1px #353945;
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    padding: 56px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    padding: 48px 32px;
  }
`;

const Top = styled.sub`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  text-transform: uppercase;
  color: #808191;
`;

export default EcosystemPage;
