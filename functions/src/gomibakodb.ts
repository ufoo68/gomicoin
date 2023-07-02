import * as logger from "firebase-functions/logger";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = process.env.DB_SHEET_ID;

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
  trash: "start" | "end" | "wait";
  timestamp: Date;
};

export const getDeviceState = async (
  deviceId: string
): Promise<
  | DeviceState
  | undefined
> => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "device_state",
    });
    const data = res?.data?.values ?? [];
    const body = data.slice(1);
    const devices = body.map((row) => {
      return {
        deviceId: row[0],
        capacity: Number(row[1]),
        trash: row[2] as "start" | "end" | "wait",
        timestamp: new Date(row[3]),
      };
    });
    return devices.find((d) => d.deviceId === deviceId);
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};

export const getDeviceConfigs = async (): Promise<
  DeviceConfig[]
> => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "device_master",
    });
    const data = res?.data?.values ?? [];
    const body = data.slice(1);
    return body.map((row) => {
      return {
        deviceId: row[0],
        initialDistance: Number(row[1]),
        initialPressure: Number(row[2]),
        schoomySheetId: row[3],
        schoomySheetName: row[4],
        walletAddress: row[5],
        lineUserId: row[6],
        obnizId: row[7],
      };
    });
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const getDeviceConfig = async (
  deviceId: string
): Promise<DeviceConfig | undefined> => {
  try {
    const devices = await getDeviceConfigs();
    return devices.find((d) => d.deviceId === deviceId);
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};
