import React from "react";
import { AccessTokenStorageKey, SignupPageUrl} from './consts';

export const withAuthentication = (ChildComponent: typeof React.Component) => {
  const WithAuthWrapped : React.FC = (props: any) => {
    if (!localStorage.getItem(AccessTokenStorageKey)) {
      window.location.href = SignupPageUrl
    }

    return localStorage.getItem(AccessTokenStorageKey) ? <ChildComponent {...props} /> : <></>;
  };
  return WithAuthWrapped
}