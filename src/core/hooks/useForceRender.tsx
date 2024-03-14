import { useState } from "react";

export const useForceRender = () => {
  const [, setMockState] = useState({});
  return () => setMockState({});
};
