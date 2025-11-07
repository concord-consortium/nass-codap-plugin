declare module "*.scss";
declare module "*.svg";

declare const process: {
  env: {
    PLUGIN_VERSION?: string;
    REACT_APP_NASS_PROXY_URL?: string;
  };
};
