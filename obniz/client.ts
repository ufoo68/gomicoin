import { load } from "ts-dotenv";
import axios from "axios";

const env = load({
  GET_DEVICES_URL: String,
  GET_DEVICE_STATUS_URL: String,
  GET_GOMICOIN_URL: String,
});

type DeviceConfig = {
  deviceId: string;
  initialDistance: number;
  initialPressure: number;
  schoomySheetId: string;
  schoomySheetName: string;
  walletAddress: string;
  lineUserId: string;
  obnizId: string;
};

type DeviceState = {
  deviceId: string;
  capacity: number;
  trash: "start" | "end" | "wait" | "open";
  timestamp: Date;
};

type GomiToken = {
  symbol: string;
  imgUri: string;
  amount: number;
};

export const getDevices = async (): Promise<DeviceConfig[]> => {
  const response = await axios.get(env.GET_DEVICES_URL);
  const json = await response.data;
  return json;
};

export const getDeviceStatus = async (
  deviceId: string
): Promise<DeviceState> => {
  const response = await axios.get(
    `${env.GET_DEVICE_STATUS_URL}?deviceId=${deviceId}`
  );
  const json = await response.data;
  return json;
};

export const getGomiToken = async (deviceId: string): Promise<GomiToken> => {
  const response = await axios.get(
    `${env.GET_GOMICOIN_URL}?deviceId=${deviceId}`
  );
  const json = await response.data;
  return json;
};
