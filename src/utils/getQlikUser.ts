import { url } from "../../qlikConfig";

type QlikUserResponse = {
  userName: string;
  userDirectory: string;
  [key: string]: any;
};

export const getQlikUser = async (): Promise<string> => {
  try {
    const response = await fetch(`${url}/qps/user`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get user: ${response.status} ${response.statusText}`,
      );
    }

    const data: QlikUserResponse = await response.json();
    
    return data.userName || "Unknown user";
  } catch (error) {
    console.error("Error fetching Qlik user:", error);
    throw error;
  }
};

export const getFullQlikUser = async (): Promise<QlikUserResponse> => {
  try {
    const response = await fetch(`${url}/qps/user`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get user: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching full Qlik user:", error);
    throw error;
  }
};

export const logQlikUser = async (): Promise<void> => {
  try {
    const userName = await getQlikUser();
    console.log("User:", userName);
  } catch (error) {
    console.error("Failed to log user:", error);
  }
};
