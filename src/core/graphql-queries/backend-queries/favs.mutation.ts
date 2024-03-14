export const generateToggleLikeMutation = (favId: number) => `
  mutation toggleLikeFav {
    toggleLikeFav(favId: ${favId}) {
      success
      message
    }
  }
`;
