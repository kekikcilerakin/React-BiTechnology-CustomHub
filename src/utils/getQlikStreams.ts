import { url, xrfKey } from "../../qlikConfig";

type QlikStream = {
  id: string;
  name: string;
  description?: string;
  tags?: {
    name: string;
  }[];
  customProperties?: {
    definition: {
      name: string;
    };
    value: string | number;
  }[];
};

export type Stream = {
  id: string;
  name: string;
  description: string;
  tags: {
    name: string;
  }[];
  order: number;
};

export const getQlikStreams = async (): Promise<Stream[]> => {
  try {
    const response = await fetch(`${url}/qrs/stream/full?xrfKey=${xrfKey}`, {
      method: "GET",
      headers: {
        "X-Qlik-Xrfkey": xrfKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch streams: ${response.status} ${response.statusText}`,
      );
    }

    const streams: QlikStream[] = await response.json();

    return streams
      .filter(
        (stream) => !stream.tags?.some((tag) => tag.name === "hide-stream"),
      )
      .map((stream) => {
        const orderValue = stream.customProperties?.find(
          (prop) => prop.definition.name === "customHubStreamOrder",
        )?.value;
        const order = orderValue !== undefined ? Number(orderValue) : 999;

        return {
          id: stream.id,
          name: stream.name,
          description: stream.description || "",
          tags: stream.tags || [],
          order,
        };
      })
      .sort((a, b) => {
        if (a.order === b.order) {
          return a.name.localeCompare(b.name);
        }
        return a.order - b.order;
      });
  } catch (error) {
    console.error("Error fetching Qlik streams:", error);
    throw error;
  }
};

export const logQlikStreams = async (): Promise<void> => {
  try {
    const streams = await getQlikStreams();
    console.log("Streams:", streams);
  } catch (error) {
    console.error("Failed to log streams:", error);
  }
};
