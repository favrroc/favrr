import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RESPONSIVE } from "../../../core/constants/responsive.const";

export default function Author({
  showDetail = true,
  detail
}: {
  showDetail?: boolean;
  detail?: any;
}) {
  return (
    <Tile>
      {!showDetail && <Img src={detail?.picture} />}
      <Text>
        {!showDetail && <Link to={"/"}>{detail?.author}</Link>}
        <Info>
          {`${dayjs(detail?.date).format("MMM d, YYYY")} • ${
            detail?.readlength
          } min read`}
        </Info>
      </Text>
    </Tile>
  );
}

const Tile = styled.div`
  display: flex;
  gap: 16px;
`;
const Img = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background: grey url(${(props: { src: string }) => props.src}) no-repeat;
  background-position: center;
  background-size: cover;
  flex: inherit;
`;
const Text = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  a {
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: #1f2128;
    @media (max-width: ${RESPONSIVE.small}) {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
    }
  }
`;
const Info = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #808191;
`;
