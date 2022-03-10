import React from "react";

import { MediaQueries } from "./commonUtils/mediaQuery";
import { MobileBottomNavBar } from "./components/common/MobileBottomNavBar";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const mediaQueries = new MediaQueries();

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {mediaQueries.isTabletOrBelow ? (
        <MobileBottomNavBar />
      ) : (
        <div>PLEASE OPEN ON MOBILE</div>
      )}
    </LocalizationProvider>
  );
};

export default App;
