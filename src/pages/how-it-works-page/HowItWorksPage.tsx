import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import Accordion2 from "../../components/accordion/Accordion2";
import EcoInfoGraphic from "../../components/eco/eco-info-graphic/EcoInfoGraphic";
import { Block, ButtonSmall, Caption1Bold, ContainerBox } from "../../components/styleguide/styleguide";
import { colors } from "../../core/constants/styleguide.const";
import { delay, getCSSOfStyledComponent } from "../../core/util/base.util";
import { fansPath } from "../../core/util/pathBuilder.util";
import BasePage from "../base-page/BasePage";
import BlogRelated from "../../components/blog/BlogRelated";

const HowItWorksPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const highlightLeftDistances = [0, 107, 173];
  const highlightWidths = [98, 58, 132];

  const faq01Ref = useRef(null as null | HTMLElement);
  const faq03Ref = useRef(null as null | HTMLElement);
  const faq05Ref = useRef(null as null | HTMLElement);
  const faq06Ref = useRef(null as null | HTMLElement);
  const faq07Ref = useRef(null as null | HTMLElement);
  const faq08Ref = useRef(null as null | HTMLElement);
  const faq10Ref = useRef(null as null | HTMLElement);
  // faq10 and faq11 will be used in the future. Don't delete these codes.
  // const faq10Ref = useRef(null as null | HTMLElement);
  const buyingAndSelling01Ref = useRef(null as null | HTMLElement);
  const buyingAndSelling02Ref = useRef(null as null | HTMLElement);
  const buyingAndSelling03Ref = useRef(null as null | HTMLElement);
  const buyingAndSelling04Ref = useRef(null as null | HTMLElement);

  const [searchParams] = useSearchParams();

  const scrollToTarget = async (targetTab: number, ref: React.MutableRefObject<HTMLElement | null> | null) => {
    setCurrentTab(targetTab);
    await delay(0.1);
    if (ref && ref.current) {
      if ((ref.current.parentElement?.lastChild as any).style.maxHeight === "0px") {
        ref.current?.click();
      }
      await delay(0.5);
      window.scrollTo({ left: 0, top: ref.current?.offsetTop, behavior: "smooth" });
    }
  };

  const onClickWeb3 = () => {
    scrollToTarget(1, faq08Ref);
  };
  const onClickWhatsWallet = () => {
    scrollToTarget(1, faq01Ref);
  };
  const onClickIPO = () => {
    scrollToTarget(2, buyingAndSelling01Ref);
  };
  const onClickTrading = () => {
    scrollToTarget(2, buyingAndSelling03Ref);
  };
  const onClickLimitOrder = () => {
    scrollToTarget(2, buyingAndSelling04Ref);
  };
  /* const onClickFanLeagues = () => {
    scrollToTarget(1, faq05Ref);
  }; */
  const onClickBeta = () => {
    scrollToTarget(1, faq07Ref);
  };
  const onClickOceanaUSDC = () => {
    scrollToTarget(1, faq06Ref);
  };
  const onClickFanLeaderboard = () => {
    scrollToTarget(1, faq03Ref);
  };
  const onClickGetVerified = () => {
    scrollToTarget(1, faq10Ref);
  };
  /* const onClickOceanicFeeling = () => {
    scrollToTarget(1, faq10Ref);
  }; */

  useEffect(() => {
    const targetTab = searchParams.get("targetTab");
    const targetIndex = searchParams.get("targetIndex");

    if (targetTab) {
      let targetRef: React.MutableRefObject<HTMLElement | null> | null;
      switch (targetIndex) {
      case "faq01":
        targetRef = faq01Ref; break;
      case "faq03":
        targetRef = faq03Ref; break;
      case "faq10":
        targetRef = faq10Ref; break;
      case "faq05":
        targetRef = faq05Ref; break;
      case "buyingAndSelling01":
        targetRef = buyingAndSelling01Ref; break;
      case "buyingAndSelling02":
        targetRef = buyingAndSelling02Ref; break;
      case "buyingAndSelling04":
        targetRef = buyingAndSelling04Ref; break;
      default:
        targetRef = null;
      }
      setTimeout(() => {
        scrollToTarget(+targetTab, targetRef);
      }, 1000);
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("leaguemodal", "false");
  }, []);

  const Oceana101Tab = (
    <Block style={{ display: currentTab === 0 ? "block" : "none" }}>
      <Accordion2 titleIndexLabel="01" title="What's Oceana?">
        <StyledText>
          {`Oceana Market is the world's first `}<StyledLink onClick={onClickWeb3}>Web3</StyledLink>{` platform that leverages collective fan power to directly better the world via our proprietary fan-to-earn engine. You might be thinking 'What?' and 'What?'. Ok again, Oceana is a Web3 platform that... never mind, here's what it really is:`}<br />
          <br />
          {`Oceana Market is a place where fans play investment games, just like Wall Street traders.`}<br />
          <br />
          <StyledBoldText>{`What can you invest in?`}</StyledBoldText><br />
          {`As a fan, you can invest in the people you love most! Invest in your favorite superstars, sports heroes, activists, artists, anyone at all. You get the picture.`}<br />
          <br />
          <StyledBoldText>{`Why?`}</StyledBoldText><br />
          {`First of all it's an investment game, so you'll need to be really smart about your investment strategy, portfolio selection and all sorts of other investment terms you've heard of before in order to become a savvy investor. If you invest correctly you can win big, gain super-fan status and earn the recognition of your heroes and other like-minded fans!`}<br />
          <br />
          {`And last but not not least, you participate in the social causes your heroes care about most. So yeah, you can help 'make the world a better place' right alongside your heroes!`}<br />
          <br />
          {`So instead of spending hours crushing candies or growing gardens, why not use your brainpower to learn new investment skills, gain perks and earn the recognition of your heroes while also helping great causes? Just saying...`}
        </StyledText>
      </Accordion2>
      <Accordion2 titleIndexLabel="02" title="How does it work?">
        <StyledText>
          <ol>
            <li><StyledBoldText>{`Fans `}</StyledBoldText>{`play fun investment games by investing in virtual stocks that represent the celebs they love.`}</li>
            <li><StyledBoldText>{`Fans `}</StyledBoldText>{`and Fandoms compete for 'ultimate fan / fandom' status and coveted in-game rewards.`}</li>
            <li><StyledBoldText>{`Fans `}</StyledBoldText>{`participate in supporting the charities chosen by the celebs they love.`}</li>
            <li><StyledBoldText>{`Celebs `}</StyledBoldText>{`give back to their fans and the charity of their choosing.`}</li>
            <li><StyledBoldText>{`Charitable Organizations `}</StyledBoldText>{`receive support from celebs and a new channel to help them spread awareness about their cause.`}</li>
          </ol>
        </StyledText>
      </Accordion2>
      <Accordion2 titleIndexLabel="03" title="Do I need to log in?">
        <StyledText>
          {`No, you don't need to log in. A digital wallet will work as your personal account. It lets you connect from different devices, and keeps all your digital assets and progress safe. We recommend using the `}
          <StyledLink href="https://metamask.io" target="_blank">{`MetaMask`}</StyledLink>
          {` or `}
          <StyledLink href="https://www.coinbase.com/wallet" target="_blank">{`Coinbase`}</StyledLink>
          {` wallet.`}
          <br />
          <StyledLink onClick={onClickWhatsWallet}>{`What's a wallet?`}</StyledLink>
        </StyledText>
      </Accordion2>
      <Accordion2 titleIndexLabel="04" title="What charities can I support through Oceana?">
        <StyledText>
          {`Luckily Oceana supports a huge variety of charities that are near and dear to the hearts of your fave celebs. From the biggest charities out there to smaller organizations making a big impact, there's something for everyone. And if you don't see your top pick on the list, no sweat! Just give us a shout and we'll rally the troops to make it happen. So go ahead, choose a cause that speaks to you and make a difference with Oceana!`}
        </StyledText>
      </Accordion2>
      <Accordion2 titleIndexLabel="05" title="Is Oceana a secure way to donate to charity?">
        <StyledText>
          {`The good news is that web3 platforms actually offer enhanced security measures compared to traditional donation methods. With blockchain technology, every transaction is recorded and verified, making it virtually impossible for fraud or manipulation to occur. Plus, web3 platforms utilize decentralized storage and encryption to protect your personal information, so you can feel confident that your donation is safe and secure. So give with peace of mind and know that you're making a difference in the world!`}
          <br /><br />
          {`Web3 platforms offer enhanced security measures to protect your personal information, so you can have peace of mind while supporting the charities that matter most to you. So go ahead, give back and make a difference without sacrificing your privacy!`}
        </StyledText>
      </Accordion2>
      <Accordion2 titleIndexLabel="06" title="Can I donate to charity anonymously?">
        <StyledText>
          {`One of the cool things about web3 is the ability to donate anonymously if you choose to. With blockchain tech, it's totally possible to hide your identity while still contributing to a good cause. `}
        </StyledText>
      </Accordion2>
      <Accordion2 titleIndexLabel="07" title="How can I trust the funds will reach the charity?">
        <StyledText>
          {`Fear not, the beauty of web3 is that it offers unprecedented transparency and accountability. Thanks to blockchain technology, every single transaction is recorded and can be easily traced, ensuring that all funds will go directly to the charity intended. So go ahead, give generously and know that your contribution is making a real difference in the world!`}
        </StyledText>
      </Accordion2>
    </Block>
  );

  const FAQTab = (
    <Block style={{ display: currentTab === 1 ? "block" : "none" }}>
      <Accordion2 titleIndexLabel="01" title="What's a wallet?" ref={faq01Ref}>
        <StyledText>
          {`In order to buy things on Oceana, you need a place to store them. This is called a wallet.`}<br />
          <br />
          {`Think of your crypto wallet like a purse. In the physical world, your purse holds money (cash and credit cards), carries things (sunglasses, keys, chapstick, etc), and is uniquely yours. Your crypto wallet also holds money and things. With your wallet, you can:`}<br />
          <br />
          {`• Store your cryptocurrency`}<br />
          {`• Use it to pay for things`}<br />
          {`• Store your purchases - including any items purchased on Oceana`}<br />
          <br />
          {`And just like a physical purse, you want to keep it safe. If anyone gets into your crypto wallet, they now have control of everything in it. We recommend using the `}
          <StyledLink href="https://metamask.io" target="_blank">MetaMask</StyledLink>
          {` or `}
          <StyledLink href="https://www.coinbase.com/wallet" target="_blank">{`Coinbase`}</StyledLink>
          {` wallet.`}
          <br />
          <br />
          {`Note: Since all wallet transactions in the Mumbai Polygon test network have a gas fee that needs to be paid in MATIC ETH, be sure to have at least some MATIC ETH in your wallet to perform any action on Oceana.`}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="02" title="How do I set up my wallet?">
        <StyledText>
          <ol>
            <li>{`First, go to the `}<StyledLink href="https://metamask.io" target="_blank">{`MetaMask website`}</StyledLink>{` and click on the "Get MetaMask" button.`}</li>
            <li>{`Next, you'll need to install the MetaMask extension for your web browser. Follow the prompts to install the extension.`}</li>
            <li>{`Once the extension is installed, you'll see a pop-up window that asks you to create a new wallet. Click on the "Create a Wallet" button.`}</li>
            <li>{`You'll then be asked to choose a password for your wallet. Make sure to choose a strong and unique password that you'll remember.`}</li>
            <li>{`Next, you'll need to save your recovery phrase. This is a special set of words that you can use to restore your wallet if you forget your password.     `}</li>
            <li>{`Make sure to write down your recovery phrase and keep it in a safe place.`}</li>
            <li>{`After you've saved your recovery phr+paccase, you'll see a screen that shows your wallet address. This is a unique code that you can use to send and receive money with your wallet.`}</li>
            <li>{`Congratulations, you've set up your MetaMask wallet! Now you can use it to send and receive USDC from Oceana Market.`}</li>
          </ol>
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="03" title="Why should I get verified?" ref={faq10Ref}>
        <StyledText>
          Verifying your account lets you compete in challenges and show up in the <StyledLink onClick={onClickFanLeaderboard}>fan leaderboard</StyledLink>. Without account verification, you {`won't`} be able to become the investment mogul you were meant to be so you {`won't`} get noticed by your heroes.
          <br />
          <br />
          {`Don't worry, your data is always safe with us. But if you ever want to disconnect your social account, it's as easy as clicking your connected account in the "Social Links" section of your profile. This will disconnect your social account and delete your user data from Oceana.`}
          <br /><br />
          {`It's`} all here in our <StyledALink to="/terms-of-service">Terms</StyledALink> and <StyledALink to="/privacy-policy">Privacy Policy</StyledALink>.
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="04" title="What's the fan leaderboard?" ref={faq03Ref}>
        <StyledText>
          The <StyledLink href={fansPath()}>fan leaderboard</StyledLink> ranks <StyledLink onClick={onClickGetVerified}>verified fans</StyledLink> based on their total portfolio value and achievements.
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="05" title="What are fan leagues?" ref={faq05Ref}>
        <Block>
          <StyledText>
            Oceana fan leagues are mini-leaderboards with <StyledLink onClick={onClickGetVerified}>verified fans</StyledLink> from across the platform. Fans are ranked by portfolio value (and other top secret criteria).
            <br />
            <br />
            Master each league to earn your place in <StyledLink href={fansPath()}>fan leaderboard</StyledLink> history. Build up your social capital by completing unique quests and challenges to achieve the ultimate Whale status.
          </StyledText>
          <EcoInfoGraphic />
        </Block>
      </Accordion2>

      <Accordion2 titleIndexLabel="06" title="Somebody is following me, do I have to follow them back?">
        <StyledText>
          {`Don't worry, they're not a creepy stalker. Take it as a compliment, they're probably following you because they think your investment strategy is awesome (or terrible) -- either way the bigger your following, the more influence you'll have on challenges, so the more the merrier!`}
          <br />
          <br />
          {`Sidenote: One of the best investment strategies is sometimes to mimick other successful investors' portfolios. So, it's a good idea to follow somebody if you find their portfolio is doing well! In the real world, it's hard to look into somebody else's portfolio in real time, but on Oceana, luckily you can.`}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="07" title="Can I use my Oceana USDC to buy milk at the grocery store?" ref={faq06Ref}>
        <StyledText>
          {`Oceana Market is currently in `}<StyledLink onClick={onClickBeta}>{`beta`}</StyledLink>{`. Cashing out your Oceana USDC to FIAT (e.g. USD, EUR, etc.) is simply not possible during the beta phase. That's why we're giving away the gift of limitlessly play -- but just for now. So enjoy irresponsibly, since there are no annoying time limits or access restrictions!`}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="08" title="I'm a beta member, what does that mean?" ref={faq07Ref}>
        <StyledText>
          {`You're a beta member? Lucky you! You've secured your place in history as one of Oceana's earliest users. As such, you'll get free in-game money (`}<StyledLink onClick={onClickOceanaUSDC}>{`Oceana USDC`}</StyledLink>{`) -- but just during the beta. Also, your in-game achievements will be carried over to the post-beta phase, so you'll start way ahead of everyone else. `}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="09" title="Why is Oceana using Web3 technology?" ref={faq08Ref}>
        <StyledText>
          {`Web3 refers to the third generation of the World Wide Web, also known as the "Internet of value". It's a term that is used to describe the use of the internet for exchanging value, rather than just information.`}
          <br />
          <br />
          {`In the first generation of the web, people could use the internet to access and share information with each other. In the second generation, people could use the internet to communicate with each other and conduct transactions.`}
          <br />
          <br />
          {`Web3 takes this a step further by enabling people to use the internet to exchange value in the form of money, assets, or other valuable things. This is made possible through the use of new technologies like blockchain and smart contracts, which allow for secure and transparent exchanges of value online.`}
          <br />
          <br />
          {`Web3 is still in its early stages, but it has the potential to revolutionize the way we use the internet and conduct transactions online, just like those done on Oceana.`}
        </StyledText>
      </Accordion2>
      {/* 
      <Accordion2 titleIndexLabel="10" title="What's the 'Oceanic Feeling'? I've see it a lot." ref={faq10Ref}>
        <StyledText>
          {`The "Oceanic feeling" is the term to describe a sense of unity or connectedness with the world. It's a feeling of being a small part of something much bigger, like the vast and infinite ocean, thereby Oceana!`}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="11" title="What's the significance of 1927? I've seen it a lot.">
        <StyledText>
          {`In a 1927 letter to Sigmund Freud, a French novelist coined the phrase "`}<StyledLink onClick={onClickOceanicFeeling}>{`oceanic feeling`}</StyledLink>{`" to refer to "a sensation of 'eternity'", a feeling of "being one with the external world as a whole". In homage to this great idea, Oceana decided to (over) use it!`}
        </StyledText>
      </Accordion2> */}
    </Block>
  );

  const BuyingAndSellingTab = (
    <Block style={{ display: currentTab === 2 ? "block" : "none" }}>
      <Accordion2 titleIndexLabel="01" title="What's an Oceana IPO?" ref={buyingAndSelling01Ref}>
        <StyledText>
          {`When a celeb on Oceana first sells shares of stock to the public, this process is known as an initial public offering (IPO). An IPO gives fans the chance to invest in a celeb that they believe in, collect dividends while they hold the stock and make money if the celeb's stock price goes up during `}<StyledLink onClick={onClickTrading}>{"trading"}</StyledLink>{"."}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="02" title="How's the celeb stock price determined?" ref={buyingAndSelling02Ref}>
        <StyledText>
          {`Oceana helps set the initial `}<StyledLink onClick={onClickIPO}>{`IPO`}</StyledLink>{` valuation for the celeb stock. During `}
          <StyledLink onClick={onClickTrading}>{`trading`}</StyledLink>
          {` the free market (based on supply and demand) determines the celeb stock price.`}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="03" title="How does trading work?" ref={buyingAndSelling03Ref}>
        <StyledText>
          {`When the `}<StyledLink onClick={onClickIPO}>{`IPO`}</StyledLink>{` period ends, celeb stocks are listed for trading on Oceana Market, an open stock exchange like the New York Stock Exchange or the NASDAQ.`}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="04" title="What are dividends?">
        <StyledText>
          {`A dividend is a payment that a celeb gives to its shareholders. It's a way for the celeb to share their profits with the fans who own their shares. The more celeb shares a fan owns, the higher the dividend payment they'll receive.`}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="05" title="What's a limit order and an order book?" ref={buyingAndSelling04Ref}>
        <StyledText>
          {`A limit order is like a reservation. You set your desired stock price and wait for the order to fill.`}
          <br />
          <br />
          {`The book that keeps the records of your price reservation is called an Order Book. When the market price reaches your desired price, (a.k.a. somebody is willing to buy / sell the stock at your reserved price) your order will be filled. People use limit orders as an investment strategy if they believe the current market price will change.`}
        </StyledText>
      </Accordion2>

      <Accordion2 titleIndexLabel="06" title="What's a market order and how's it different from a limit order?">
        <StyledText>
          {`A market order is a snobby way to call the buying and selling of stocks at the market price (a.k.a. the current stock price).`}
          <br />
          <br />
          {`When you go to a market and ask for the price of candy, if you think the price is fair, you'll pay the price and buy the candy. You just did a market buy of the candy. From the seller's perspective, they agreed to sell you this candy at the price suggested by the market. It's that simple. Instead, a `}<StyledLink onClick={onClickLimitOrder}>{`limit order`}</StyledLink>{` let's you buy / sell candy at a price that you pick yourself.`}
        </StyledText>
      </Accordion2>
    </Block>
  );

  return (
    <BasePage className="" contentStyle={{ boxSizing: "border-box", width: "100%", paddingLeft: "0", paddingRight: "0" }}>
      <StyledCaption>
        <Caption1Bold>LEARN MORE ABOUT OCEANA</Caption1Bold>
      </StyledCaption>
      <StyledHeadline>HOW IT WORKS</StyledHeadline>
      <FullDivider />
      <StyledTabContainer>
        <StyledTabs currentTab={currentTab} count={3} highlightLeftDistances={highlightLeftDistances} highlightWidths={highlightWidths}>
          <StyledTab className={currentTab === 0 ? "active" : ""} onClick={() => setCurrentTab(0)}>{`Oceana 101`}</StyledTab>
          <StyledTab className={currentTab === 1 ? "active" : ""} onClick={() => setCurrentTab(1)}>{`FAQ`}</StyledTab>
          <StyledTab className={currentTab === 2 ? "active" : ""} onClick={() => setCurrentTab(2)}>{`Buying & Selling`}</StyledTab>
        </StyledTabs>
        <Block className="flex justify-center">
          {Oceana101Tab}
          {FAQTab}
          {BuyingAndSellingTab}
        </Block>
      </StyledTabContainer>
      <StyledBlock className="flex justify-center">
        <BlogRelated dark={true} />
      </StyledBlock>
    </BasePage>
  );
};

const StyledBlock = styled(ContainerBox)`
  margin-top: 144px;
  @media screen and (max-width: 576px) {
    margin-top: 88px;
    position: relative;
    &:before {
      content: "";
      height: 1px;
      width: 100%;
      position: absolute;
      left: 0%;
      top: -44px;
      background: #353945;
    }
  }
`;

const StyledCaption = styled.div`
  margin-bottom: 8px;
  text-align: center;
  color: ${colors.neutrals4};
`;
const StyledHeadline = styled.div`
  font-family: 'Oswald';
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  text-align: center;
  letter-spacing: -0.02em;
  color: ${colors.neutrals8};
  margin-bottom: 72px;
  @media screen and (max-width: 576px) {
    margin-bottom: 56px;
  }
`;
const FullDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.neutrals3};
`;
const StyledTabContainer = styled.div`
  margin: auto;
  margin-top: 80px;
  @media screen and (max-width: 768px) {
    margin-top: 60px;
  }
  @media screen and (max-width: 576px) {
    margin-top: 64px;
    padding: 50px 32px;
  }
  @media screen and (max-width: 320px) {
    padding: 50px 4px;
  }
`;
const StyledTabs = styled.div`
  position: relative;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: auto;
  margin-bottom: 40px;
  &::before {
    transition: all 0.5s ease;
    left: ${(props: any) => props.highlightLeftDistances[props.currentTab]}px;
    content: "";
    background: ${colors.neutrals8};
    border-radius: 25px;
    width: ${(props: any) => props.highlightWidths[props.currentTab]}px;
    height: 28px;
    position: absolute;
  }
`;
const StyledTab = styled.button`
  ${getCSSOfStyledComponent(ButtonSmall)}
  position: relative;
  padding: 6px 12px;
  color: ${colors.neutrals4};
  transition: all 0.5s ease;
  &:hover {
    color: ${colors.neutrals8};
  }
  &.active {
    transition: all 0.8s ease;
    color: ${colors.neutrals1};
  }
`;
export const StyledText = styled.span`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.neutrals6};

  ol {
    padding: 0;
  }
  li::marker {
    color: ${colors.neutrals4};
  }
`;
export const StyledBoldText = styled(StyledText)`
  font-weight: 700 !important;
`;
export const StyledLink = styled.a`
  ${getCSSOfStyledComponent(StyledText)}
  color: ${colors.primaryBlue};
  font-weight: 500 !important;
  cursor: pointer;
`;

export const StyledALink = styled(Link)`
  ${getCSSOfStyledComponent(StyledText)}
  color: ${colors.primaryBlue};
  font-weight: 500 !important;
  cursor: pointer;
`;

export default HowItWorksPage;