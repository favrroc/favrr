import React, { ReactNode, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

interface Props {
  isLoading: boolean;
  children?: any;
}

export default function withSkeleton({ isLoading, children }: Props) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) {
    return <Skeleton width={"100%"} />;
  }

  return children;
}