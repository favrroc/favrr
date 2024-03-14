import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
interface Props {
  step: number;
  of: number;
}

const StepsOf = (props: Props) => {
  const stepPercentage = 100 / props.of;
  const stepWidth = stepPercentage * props.step;

  return (
    <Steps>
      <Info>
        Step {props.step} <Of>of {props.of}</Of>
      </Info>
      <StepIndicator>
        <CurrentStep
          initial={{ width: 0 }}
          animate={{ width: `${stepWidth}%` }}
          transition={{
            duration: 0.25,
          }}
        />
      </StepIndicator>
    </Steps>
  );
};
const Steps = styled.div`
  font-family: "DM Sans";
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: #e6e8ec;
  /* margin-bottom: 32px; */
`;
const Info = styled.div`
  margin-bottom: 8px;
  text-align: left;
`;
const Of = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #808191;
`;
const StepIndicator = styled.div`
  height: 6px;
  background: #353945;
  border-radius: 8px;
`;
const CurrentStep = styled(motion.div)`
  height: 6px;
  background: #3f8cff;
  border-radius: 8px;
  width: 0;
  transition: all 0.25s ease;
`;
export default StepsOf;
