export const generateSimpleSignInQuery = (props: { username: string, password: string }) => `
  query simpleSignIn {
    simpleSignIn(simpleSignInInput: { username: "${props.username}", password: "${props.password}" })
  }
`;
