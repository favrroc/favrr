import React from "react";
import styled from "styled-components";

const FavBadge = (props: { styles?: React.CSSProperties; }) => {
  return <Badge style={{ ...props.styles }}>
    Top
    <div>10</div>
  </Badge>;
};

const Badge = styled.div`
    z-index: 1;
    padding: 8px;
    position: absolute;
    left: 0;
    top: 0;
    background: #6C5DD3;
    box-shadow: 0px 8px 16px -8px rgba(15, 15, 15, 0.1);
    border-radius: 16px 0px;

    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;

    text-align: center;
    text-transform: uppercase;

    color: #FCFCFD;
    div {
        margin-top: 4px;
        font-family: 'DM Sans';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 16px;
        text-align: center;
        color: #FCFCFD;
    }
`;

export default FavBadge;