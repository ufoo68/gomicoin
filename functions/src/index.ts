import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { google } from "googleapis";
import dayjs = require("dayjs");

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = process.env.SHEET_ID;
const sheetName = process.env.SHEET_NAME;

const getSensorData = async (): Promise<string[][]> => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`,
    });
    return res?.data?.values ?? [];
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const gomiMonitor = onRequest(async (_req, response) => {
  const data = await getSensorData();
  if (data.length === 0) {
    response.send(data);
    return;
  }
  const body = data.slice(1);
  let newestData = body[0];
  for (let i = 1; i < data.length; i++) {
    const currentDate = new Date(`${newestData[0]} ${newestData[1]}`);
    const loopDate = new Date(data[i][0] + " " + data[i][1]);

    if (loopDate > currentDate) {
      newestData = data[i];
    }
  }
  response.send({
    timestamp: dayjs(
      new Date(`${newestData[0]} ${newestData[1]}`)
    ).toISOString(),
    distance: newestData[2],
    pressure: newestData[3],
  });
});
