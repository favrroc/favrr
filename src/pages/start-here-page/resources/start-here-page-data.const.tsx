import React from "react";

import { CelebsGiveImage, CharitiesReceiveImage, CharityIconImage, FansPlayImage } from "../../../components/assets/app-images/AppImages";

export const howItWorksData = [
  {
    title: "Fans Play",
    description: "Fans play fun investment games, where they invest in virtual stocks that mirror their favorite stars, taking fandom to a whole new level.",
    imageSrc: FansPlayImage().props.src
  },
  {
    title: "Celebs Give",
    description: "Celebs give back to fans and their favorite charities alike - Generosity with a touch of star power.",
    imageSrc: CelebsGiveImage().props.src
  },
  {
    title: "Charities Receive",
    description: "Charities team up with celebs to receive their support, and to gain a powerful new channel to spread awareness about the cause.",
    imageSrc: CharitiesReceiveImage().props.src
  },
  /* {
    title: "Oceana Delivers",
    description: "Oceana makes all of the above happen and shares its profits by giving back 100% of the platform fees to fans and charities.",
    imageSrc: StartHereDemo2MobileImage().props.src
  } */
];
export const keyStatsData = [
  {
    title: "FACT ONE:",
    value: "1/5",
    description: "1 in 5 fans spend money on their fandom vs the basics"
  },
  {
    title: "FACT TWO:",
    value: <>30<sup>%</sup></>,
    description: "30% of fans neglect work or school for their favorite celebs"
  },
  {
    title: "FACT THREE:",
    value: <>0.01<sup>%</sup></>,
    description: "0.01% of fan works come back to the original fan creator"
  }
];

export const charityIconImages = [...Array(39)].map((_it, index) => CharityIconImage(Math.floor(index / 13), index % 13).props.src);

export const marqueeRows: Array<{
  direction: "left" | "right",
  images: string[];
}> = [
  { direction: "left", images: charityIconImages.slice(0, 13) },
  { direction: "right", images: charityIconImages.slice(13, 26) },
  { direction: "left", images: charityIconImages.slice(26, 39) },
];
export const accordionsData = [
  {
    title: "What charities can I support through Oceana?",
    body:
      <span>
        {`Luckily Oceana supports a huge variety of charities that are near and dear to the hearts of your fave celebs. From the biggest charities out there to smaller organizations making a big impact, there's something for everyone. And if you don't see your top pick on the list, no sweat! Just give us a shout and we'll rally the troops to make it happen. So go ahead, choose a cause that speaks to you and make a difference with Oceana!`}
      </span>
  },
  {
    title: "Is Oceana a secure way to donate to charity?",
    body:
      <span>
        {`The good news is that web3 platforms actually offer enhanced security measures compared to traditional donation methods. With blockchain technology, every transaction is recorded and verified, making it virtually impossible for fraud or manipulation to occur. Plus, web3 platforms utilize decentralized storage and encryption to protect your personal information, so you can feel confident that your donation is safe and secure. So give with peace of mind and know that you're making a difference in the world!`}
        <br /><br />
        {`Web3 platforms offer enhanced security measures to protect your personal information, so you can have peace of mind while supporting the charities that matter most to you. So go ahead, give back and make a difference without sacrificing your privacy!`}
      </span>
  },
  {
    title: "Can I donate to charity anonymously?",
    body:
      <span>
        {`One of the cool things about web3 is the ability to donate anonymously if you choose to. With blockchain tech, it's totally possible to hide your identity while still contributing to a good cause. `}
      </span>
  },
  {
    title: "How can I trust the funds will reach the charity?",
    body:
      <span>
        {`Fear not, the beauty of web3 is that it offers unprecedented transparency and accountability. Thanks to blockchain technology, every single transaction is recorded and can be easily traced, ensuring that all funds will go directly to the charity intended. So go ahead, give generously and know that your contribution is making a real difference in the world!`}
      </span>
  },
];