import React from "react";
import styled from "styled-components";

const IpoBadge = (props: { styles?: React.CSSProperties }) => {
  return (
    <Badge style={{ ...props.styles }}>
      <span>
        IPO
      </span>
    </Badge>
  );
};

const Badge = styled.div`
    z-index: 1;
    padding: 0;
    position: absolute;
    left: 0;
    top: 0;
    height: 48px;
    width: 40px;
    background: #FCFCFD;
    box-shadow: 0px 8px 16px -8px rgba(15, 15, 15, 0.1);
    border-radius: 16px 0px;

    font-family: 'Inter', 'DM Sans';
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    color: #1F2128;
    justify-content: center;
    text-transform: uppercase;
    align-items: center;
    display: flex;
`;

export default IpoBadge;