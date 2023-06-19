import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { google } from "googleapis";
import dayjs = require("dayjs");

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = process.env.SHEET_ID;

const getDeviceState = async (
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

export const gomiMonitor = onRequest(async (req, response) => {
  const deviceId = req.query.deviceId as string;
  if (!deviceId) {
    response.status(400).send("Bad Request");
    return;
  }
  const data = await getDeviceState(deviceId);
  if (!data) {
    response.status(404).send("Not Found");
    return;
  }
  response.send({
    ...data,
    timestamp: dayjs(data.timestamp).toISOString(),
  });
});
