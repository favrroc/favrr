import React, { useState } from "react";
import styled from "styled-components";

import { ApolloActionType, apolloClient, ClientType } from "../../core/clients/apolloClient";
import { Flex } from "../../components/styleguide/styleguide";

import { generateSimpleSignInQuery } from "../../core/graphql-queries/backend-queries/signin.query";

interface Props {
  setAllowed: React.Dispatch<React.SetStateAction<boolean>>;
}
const SignInPage = (props: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const handleUsername = (e: any) => {
    setShowError(false);
    setUsername(e.target.value);
  };

  const handlePassword = (e: any) => {
    setShowError(false);
    setPassword(e.target.value);
  };

  const onSubmit = async () => {
    const { simpleSignIn } = await apolloClient(ClientType.GRAPHQL, ApolloActionType.QUERY, generateSimpleSignInQuery({ username, password }));
    if (simpleSignIn === "true") {
      setShowError(false);
      localStorage.setItem("PROD_ALLOWED", "true");
      props.setAllowed(true);
    }
    else {
      setShowError(true);
    }
  };

  return (
    <StyledFlex>
      <StyledInput type="text" placeholder="Username" value={username} onChange={handleUsername} />
      <StyledInput type="password" placeholder="Password" value={password} onChange={handlePassword} />
      {showError && (
        <StyledError>Invalid username and password.</StyledError>
      )}
      <StyledSignInButton onClick={onSubmit}>
        Sign In
      </StyledSignInButton>
    </StyledFlex>
  );
};

const StyledFlex = styled(Flex)`
  width: 250px;
  margin: auto;
  margin-top: 40px;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  border-radius: 4px;
  border-width: 1px;
`;

const StyledError = styled.p`
  font-size: 12px;
  color: red;
`;

const StyledSignInButton = styled.button`
  width: 80%;
  background-color: #3f8cff;
  color: white;
  padding: 8px;
  border-radius: 18px;
`;

export default SignInPage;