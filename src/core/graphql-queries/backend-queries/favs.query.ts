import { MAX_TAKE } from "../../constants/base.const";

export const generateFindAllFavsQuery = (address: string | undefined) => `
  query findAllFavs {
    findAllFav(take: ${MAX_TAKE}${address ? (', wallet: "' + address + '"') : ""}) {
      id
      key
      displayName
      image
      title
      about
      category
      sparkline
      isLike
      midSizeImage
      mobileSizeImage
      iconImage
      coin
      createdAt
    }
  }
`;