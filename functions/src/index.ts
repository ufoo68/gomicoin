import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = process.env.SHEET_ID;
const sheetName = process.env.SHEET_NAME;

const getSensorData = async () => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`,
    });
    return res.data.values;
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const gomiMonitor = onRequest(async (_, response) => {
  const data = await getSensorData();
  response.send(data);
});
