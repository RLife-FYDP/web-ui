import { observer } from "mobx-react";
import React from "react";

import { MobileTopNavBar } from "../common/MobileTopNavBar";
import { NotificationBar } from "../common/NotificationBar";

@observer
export class Chat extends React.Component {
  render() {
    return (
      <>
        <MobileTopNavBar />
        <NotificationBar />
        <div>CHAT PAGE</div>
      </>
    );
  }
}
