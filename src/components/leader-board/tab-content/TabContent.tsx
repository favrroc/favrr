import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const TabContent = (props: PropsWithChildren<{ className?: string; }>) => {
  return <Content>{props.children}</Content>;
};

const Content = styled.div``;

export default TabContent;
