type QlikConfig = {
  host: string;
  prefix: string;
  port: string;
  isSecure: boolean;
};

const getQlikConfig = (): QlikConfig => {
  const prefix = window.location.pathname.substr(
    0,
    window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1,
  );
  return {
    host: window.location.hostname,
    prefix: prefix,
    port: window.location.port,
    isSecure: window.location.protocol === "https:",
  };
};

const configureQlik = (): void => {
  const config = getQlikConfig();
  
  const prefixPath = config.prefix ? `${config.prefix.replace(/\/$/, '')}/` : '';
  const baseUrl = `${config.isSecure ? "https://" : "http://"}${config.host}${config.port ? ":" + config.port : ""}${prefixPath}resources`;

  (window as any).require?.config({
    baseUrl: baseUrl,
  });
};

export { configureQlik, getQlikConfig };
