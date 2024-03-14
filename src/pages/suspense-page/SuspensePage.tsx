import React from "react";

import Loader from "../../components/loader/Loader";
import BasePage from "../base-page/BasePage";

export default function SuspensePage() {
  return (
    <BasePage contentStyle={{ boxSizing: "border-box", width: "100%", height: "100%", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Loader />
    </BasePage>
  );
};

