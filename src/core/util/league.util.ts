import { UserEntity } from "../../../generated-graphql/graphql";
import { BlowfishImage, CrabGreyImage, CrabImage, DolphineImage, LobsterImage, MicrobeImage, OctopusImage, SharkImage, ShrimpGreyImage, ShrimpImage, TurtleImage, WhaleImage } from "../../components/assets/app-images/AppImages";
import { League } from "../enums/league.enum";

type LeagueLibType = {
  [league: number]: {
    title: string,
    image: JSX.Element,
    greyImage: JSX.Element,
    reportTitle: string | string[],
    reportDescription: string | string[],
    userMenuDescription?: string,
    yAxisPercentage: number // used on InfoGraphic
  }
};
export const LeagueLib: LeagueLibType = {
  [League.Microbe]: {
    title: "Plankton",
    image: MicrobeImage(),
    greyImage: MicrobeImage(),
    reportTitle: ["Congrats! You're in the Plankton League.", "Hey, It's Me Plankton."],
    reportDescription: ["That was easy! Now take the next step to build on your momentum!", "Add an avatar and username to earn a spot in the [Shrimp league](/fans?target=1&league=Shrimp)."],
    userMenuDescription: "Add an avatar and username to earn a spot in the Shrimp league.",
    yAxisPercentage: 0.01
  },
  [League.Shrimp]: {
    title: "Shrimp",
    image: ShrimpImage(),
    greyImage: ShrimpGreyImage(),
    reportTitle: ["You're Promoted!","Ready to Level Up?","Good Answer!"],
    reportDescription: ["Welcome to the [Shrimp league](/fans?target=1&league=Shrimp), where ten tiny appendages are waiting to help you succeed.","","Confirm your email and social links to get [Crab status](/fans?target=1&league=Crab) and wield the power of those commandeering claws."],
    userMenuDescription: "Confirm your email to get Crab status.",
    yAxisPercentage: 14
  },
  [League.Crab]: {
    title: "Crab",
    image: CrabImage(),
    greyImage: CrabGreyImage(),
    reportTitle: ["You Made It!","Get Ready to Prove Your Claw-some Skills!", "Make Us Proud!"],
    reportDescription: ["You've scored some kick-ass claws, [Crab Leaguer](/fans?target=1&league=Crab). Now get ready to claw your way up to the top!","Coming Soon","Dominate exciting weekly challenges and climb the food chain to reach coveted Whale status! Coming Soon"],
    userMenuDescription: "Win 3 challenges to reach coveted Blowfish status. (Coming soon)",
    yAxisPercentage: 17
  },
  [League.Blowfish]: {
    title: "Blowfish",
    image: BlowfishImage(),
    greyImage: BlowfishImage(),
    reportTitle: "",
    reportDescription: "",
    userMenuDescription: "",
    yAxisPercentage: 33
  },
  [League.Lobster]: {
    title: "Lobster",
    image: LobsterImage(),
    greyImage: LobsterImage(),
    reportTitle: "",
    reportDescription: "",
    userMenuDescription: "",
    yAxisPercentage: 48
  },
  [League.Octopus]: {
    title: "Octopus",
    image: OctopusImage(),
    greyImage: OctopusImage(),
    reportTitle: "",
    reportDescription: "",
    userMenuDescription: "",
    yAxisPercentage: 51
  },
  [League.Turtle]: {
    title: "Turtle",
    image: TurtleImage(),
    greyImage: TurtleImage(),
    reportTitle: "",
    reportDescription: "",
    userMenuDescription: "",
    yAxisPercentage: 66
  },
  [League.Dolphine]: {
    title: "Dolphine",
    image: DolphineImage(),
    greyImage: DolphineImage(),
    reportTitle: "",
    reportDescription: "",
    userMenuDescription: "",
    yAxisPercentage: 84
  },
  [League.Shark]: {
    title: "Shark",
    image: SharkImage(),
    greyImage: SharkImage(),
    reportTitle: "",
    reportDescription: "",
    userMenuDescription: "",
    yAxisPercentage: 86
  },
  [League.Whale]: {
    title: "Whale",
    image: WhaleImage(),
    greyImage: WhaleImage(),
    reportTitle: "",
    reportDescription: "",
    userMenuDescription: "",
    yAxisPercentage: 100
  }
};

export const findLeagueFromProfile = (profile: UserEntity) => {
  let league: League = League.Microbe;
  
  if (profile.fullName) {
    league = League.Microbe;
    if (profile.profileImageUrl) {
      league = League.Shrimp;
      if (profile.isVerified) {
        league = League.Crab;
      }
    }
  }

  return league;
};

export const Leagues = Object.values(League).filter(data => Number.isInteger(data)) as Array<League>;