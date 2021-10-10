import React from "react";

import { MediaQueries } from "./commonUtils/mediaQuery";
import { MobileBottomNavBar } from "./components/common/MobileBottomNavBar";

const mediaQueries = new MediaQueries();

const App = () => {
  return mediaQueries.isMobile ? (
    <MobileBottomNavBar />
  ) : (
    <div>PLEASE OPEN ON MOBILE</div>
  );
};

export default App;
