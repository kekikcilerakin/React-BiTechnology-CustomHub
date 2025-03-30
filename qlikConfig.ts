const { protocol, hostname, port, pathname } = window.location;
const url = hostname === "localhost" 
  ? `https://demo.bitechnology.com` 
  : `${protocol}//${hostname}:${port}`;
const xrfKey = "1234567890abcdef";

type QlikConfig = {
  host: string;
  prefix: string;
  port: string;
  isSecure: boolean;
};

const isQlikEnvironment = (): boolean => {
  return typeof window !== "undefined" && typeof window.require === "function";
};

const getQlikConfig = (): QlikConfig => {
  const prefix = pathname.substring(
    0,
    pathname.toLowerCase().lastIndexOf("/extensions") + 1,
  );

  return {
    host: hostname === "localhost" ? "demo.bitechnology.com" : hostname,
    prefix: prefix,
    port: port,
    isSecure: protocol === "https:",
  };
};

const configureQlik = (): void => {
  const config = getQlikConfig();

  const prefixPath = config.prefix
    ? `${config.prefix.replace(/\/$/, "")}/`
    : "";
  const baseUrl = `${config.isSecure ? "https://" : "http://"}${config.host}${config.port ? ":" + config.port : ""}${prefixPath}resources`;
  
  (window as any).require?.config({
    baseUrl: baseUrl,
  });
};

export { url, xrfKey, isQlikEnvironment, getQlikConfig, configureQlik };
