import { configureQlik, getQlikConfig } from "../../qlikConfig";

const isQlikEnvironment = () => {
  return typeof window !== "undefined" && typeof window.require === "function";
};

export const logQlikApps = async (): Promise<void> => {
  configureQlik();

  if (!isQlikEnvironment()) {
    console.error("Qlik environment not detected");
    return;
  }

  return new Promise((resolve, reject) => {
    (window as any).require(
      ["js/qlik"],
      (qlik: any) => {
        const config = getQlikConfig();
        const global = qlik.getGlobal(config);

        global.getAuthenticatedUser((user: any) => {
          console.log("Authenticated user:", user);
        });

        global.getAppList((list: any[]) => {
          console.log("Available Qlik apps:", list);
          resolve();
        });
      },
      (error: any) => {
        console.error("Error loading Qlik module:", error);
        reject(error);
      },
    );
  });
};
