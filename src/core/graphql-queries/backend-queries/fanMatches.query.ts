export const generateFindAllFanMatchesQuery = (address?: string) => `
  query findAllFanMatches {
    findAllFanMatch ( 
        take: 5
        ${address ? 'wallet: "' + address + '"' : ""}
        ) {
      data {
        id
        title
        isLike
        leftFav {
          id
          displayName
        }
        rightFav{
          id
          displayName
        }
        expiredAt
      }
    }
  }
`;

export const generateFindAllSubScribedEmailQuery = () => `
  query findAllEmailSubscribe{
    findAllEmailSubscribe(take: 5) {
      data {
        id
        email
        createdAt
        updatedAt
        deletedAt
      }
      count
    }
  }
`;
