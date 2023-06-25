import * as logger from "firebase-functions/logger";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = process.env.DB_SHEET_ID;

export const getDeviceState = async (
  deviceId: string
): Promise<
  | {
      deviceId: string;
      capacity: number;
      trash: "start" | "end" | "wait";
      timestamp: Date;
    }
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

export const getDeviceConfig = async (
  deviceId: string
): Promise<
  | {
      deviceId: string;
      initialDistance: number;
      initialPressure: number;
      schoomySheetId: string;
      schoomySheetName: string;
      walletAddress: string;
      lineUserId: string;
    }
  | undefined
> => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "device_master",
    });
    const data = res?.data?.values ?? [];
    const body = data.slice(1);
    const devices = body.map((row) => {
      return {
        deviceId: row[0],
        initialDistance: Number(row[1]),
        initialPressure: Number(row[2]),
        schoomySheetId: row[3],
        schoomySheetName: row[4],
        walletAddress: row[5],
        lineUserId: row[6],
      };
    });
    return devices.find((d) => d.deviceId === deviceId);
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};
