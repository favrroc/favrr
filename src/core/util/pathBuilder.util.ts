// Nav Links
export const homePath = () => {
  return "/";
};
export const stocksPath = () => {
  return "/stocks";
};
export const fansPath = () => {
  return "/fans";
};
export const fanMatchPath = () => {
  return "/fan-matches";
};
export const startHerePath = () => {
  return "/start-here";
};

//
export const portfolioPath = () => {
  return "/portfolio";
};

export const portfolioEditPath = () => {
  return "/profile/edit";
};

//
export const privacyPath = () => {
  return "/privacy-policy";
};

export const termsPath = () => {
  return "/terms-of-service";
};

export const favPath = (title: string) => {
  return `/${title}`;
};

export const nftMintPath = () => {
  return `/nft/create`;
};

export const howItWorksPath = (targetTab?: number, targetIndex?: string) => {
  return `/how-it-works?targetTab=${targetTab}&targetIndex=${targetIndex}`;
};

export const blogPath = () => {
  return "/blog";
};

export const notFoundPath = () => {
  return "*";
};