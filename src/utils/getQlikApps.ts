import { configureQlik, getQlikConfig, isQlikEnvironment } from "../../qlikConfig";

export const getQlikApps = async (): Promise<any[]> => {
  configureQlik();

  if (!isQlikEnvironment()) {
    throw new Error("Qlik environment not detected");
  }

  return new Promise((resolve, reject) => {
    (window as any).require(
      ["js/qlik"],
      (qlik: any) => {
        const config = getQlikConfig();
        const global = qlik.getGlobal(config);

        global.getAppList((list: any[]) => {
          resolve(list);
        });
      },
      (error: any) => {
        console.error("Error loading Qlik module:", error);
        reject(error);
      },
    );
  });
};

export const logQlikApps = async (): Promise<void> => {
  try {
    const apps = await getQlikApps();
    console.log("Apps:", apps);
  } catch (error) {
    console.error("Failed to log apps:", error);
  }
};
