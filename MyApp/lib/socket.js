import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getApiBaseUrl } from "./api";

let socketInstance = null;
let socketBaseUrl = "";
let socketAuthToken = "";

export async function getSocket() {
  const baseUrl = await getApiBaseUrl();
  const token = await AsyncStorage.getItem("token");

  if (!socketInstance || socketBaseUrl !== baseUrl) {
    if (socketInstance) {
      socketInstance.disconnect();
    }

    socketBaseUrl = baseUrl;
    socketAuthToken = token || "";
    socketInstance = io(baseUrl, {
      auth: token ? { token } : {},
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 5000,
    });
  } else {
    const nextToken = token || "";
    const tokenChanged = socketAuthToken !== nextToken;
    socketAuthToken = nextToken;
    socketInstance.auth = token ? { token } : {};
    if (tokenChanged && socketInstance.connected) {
      socketInstance.disconnect();
    }
  }

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
}

export function getActiveSocket() {
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
  }
}
