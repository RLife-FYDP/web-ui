import { observer } from "mobx-react";
import React from "react";

import { MobileTopNavBar } from "../common/MobileTopNavBar";

@observer
export class Chat extends React.Component {
  render() {
    return (
      <>
        <MobileTopNavBar />
        <div>CHAT PAGE</div>
      </>
    );
  }
}
