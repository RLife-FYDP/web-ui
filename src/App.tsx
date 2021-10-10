import React from "react";

import { MediaQueries } from "./commonUtils/mediaQuery";
import { Chat } from "./components/chat/Chat";

const mediaQueries = new MediaQueries();

const App = () => {
  return (
    mediaQueries.isMobile ? (
      <Chat />
    ) : (
      <div>
        PLEASE OPEN ON MOBILE
      </div>
    )
  )
}

export default App;
