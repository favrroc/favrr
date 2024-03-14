import React from "react";
import styled from "styled-components";
import { Button, Flex } from "../styleguide/styleguide";
import twitterIconSrc from "../../assets/images/twitter-icon.svg";
import instagramIconSrc from "../../assets/images/instagram-icon.svg";

const ComingSoon = () => {
  return (
    <>
      <StyledFlex>
        <Title><img src={twitterIconSrc} alt="Twitter" />Twitter</Title>
        <Message><Button disabled>Coming Soon</Button></Message>
      </StyledFlex>
      <StyledFlex>
        <Title><img src={instagramIconSrc} alt="Instagram" />Instagram</Title>
        <Message>
          <Button disabled>Coming Soon</Button>
        </Message>
      </StyledFlex>
    </>
  );
};

const StyledFlex = styled(Flex)`
    width: 100%;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.span`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    color: #808191;
    gap: 12px;
    img {
        height: 24px;
        width: 24px;
    }
`;

const Message = styled.span`
    button {
        padding: 0;
        &:disabled {
            font-family: 'DM Sans';
            font-style: normal;
            font-weight: 700;
            font-size: 14px;
            line-height: 16px;
            text-align: center;
            color: #808191;
            width: 122px;
        }
    }
`;

export default ComingSoon;