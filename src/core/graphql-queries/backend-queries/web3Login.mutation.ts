import { StorageKeys } from "../../constants/base.const";

export const generateWeb3UserMutation = (address: string) => {
  const email = localStorage.getItem(StorageKeys.EmailForVerification);
  const emailInput = email ? `, email: "${email}"` : "";
  localStorage.setItem(StorageKeys.EmailForVerification, "");

  return `
    mutation web3Login {
      login(loginInput: { address: "${address}"${emailInput} }) {
        id
        address
        fullName
        profileImageUrl
        bannerImageUrl
        bio
        email
        emailVerified
        discordInfo
        facebookInfo
        twitterInfo
        isVerified
        createdAt
        hasNextStep
      }
    }
  `;
};
