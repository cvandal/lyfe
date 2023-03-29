import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="cvd.au.auth0.com"
      clientId="7sauZ5oevh5GRU0AfHGbK6TaTSTMwpaE"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://cvd.au.auth0.com/api/v2/",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
