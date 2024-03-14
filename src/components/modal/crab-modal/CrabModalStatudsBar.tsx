import React from "react";
import styled from "styled-components";
import { colors } from "../../../core/constants/styleguide.const";
import { Caption2Bold } from "../../styleguide/styleguide";

interface Props {
  progress: number
}

const CrabModalStatudsBar = (props: Props) => {
  const {progress} = props;
  return(
    <>
      <StatusBar>
        <Bar>
          {(progress === 1 || progress === 2 || progress === 3) && <StyledGreenBar />}
          {(progress === 2 || progress === 3) && <StyledGreenBar />}
          {progress === 3 && <StyledGreenBar />}
        </Bar>
        <StyledCaption2Bold>
          {progress === 2 && `🔥`}&nbsp;
          <span style={{color: `${colors.neutrals8}`}}>{progress}</span>
          &nbsp;{`of 3 Wins`}
        </StyledCaption2Bold>
      </StatusBar>
    </>
  );
};

const StatusBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 256px;
`;

const Bar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${colors.neutrals3};
  border-radius: 100px;
  display: flex;
  flex-direction: row;
  gap: 2px;
`;

const StyledCaption2Bold = styled(Caption2Bold)`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: ${colors.neutrals4};
`;

const StyledGreenBar = styled.div`
  width: 33%;
  background-color: ${colors.primaryGreen};
  border-radius: 100px 0px 0px 100px;
`;

export default CrabModalStatudsBar;