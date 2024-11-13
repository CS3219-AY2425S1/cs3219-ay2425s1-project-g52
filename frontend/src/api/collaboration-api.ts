import { collaborationApi } from "./constants";
import { Room } from "./interfaces";

const checkActiveSession = async (userId: string): Promise<boolean> => {
  try {
    const response = await collaborationApi.get(`active-user/${userId}`).json<boolean>();
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getActiveSession = async (userId: string): Promise<Room> => {
  try {
    const response = await collaborationApi.get(`session/${userId}`).json<Room>();
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { checkActiveSession, getActiveSession };