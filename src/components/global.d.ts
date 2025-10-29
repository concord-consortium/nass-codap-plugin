declare module "*.scss";
declare module "*.svg";

declare const process: {
  env: {
    REACT_APP_NASS_PROXY_URL?: string;
  };
};
