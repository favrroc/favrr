import React from "react";
import emptySrc from "../../../assets/images/news.svg";
import styled from "styled-components";

const NothingYet = () => {
  return (
    <Nothing>
      <div style={{ opacity: 0.26 }}>
        <img style={{height: "64px"}} src={emptySrc} />
      </div>
      <Text>
        Nothing Yet
      </Text>
    </Nothing>
  );
};

const Nothing = styled.div`
    margin: auto;
    margin-top: 84px;
    margin-bottom: 84px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
`;

const Text = styled.div`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #808191;
`;

export default NothingYet;