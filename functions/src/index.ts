import { onRequest } from "firebase-functions/v2/https";

import {
  getDeviceConfig,
  getDeviceConfigs,
  getDeviceState,
} from "./gomibakodb";

import dayjs = require("dayjs");
import { getGomiToken, requestGomiToken } from "./gomitoken";

export const getGomibakoState = onRequest(async (req, response) => {
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

export const getGomicoin = onRequest(async (req, response) => {
  const deviceId = req.query.deviceId as string;
  if (!deviceId) {
    response.status(400).send("Bad Request");
    return;
  }
  const config = await getDeviceConfig(deviceId);
  if (!config) {
    response.status(404).send("Not Found");
    return;
  }
  const gomitoken = await getGomiToken(config.lineUserId);
  response.send(gomitoken);
});

export const publishGomiToken = onRequest(async (req, response) => {
  const body = req.body;
  const deviceId = body.deviceId as string;
  const amount = body.amount as number;
  if (!deviceId || !amount) {
    response.status(400).send("Bad Request");
    return;
  }
  const config = await getDeviceConfig(deviceId);
  if (!config) {
    response.status(404).send("Not Found");
    return;
  }
  const txHash = await requestGomiToken(config.walletAddress, amount);
  response.send({
    txHash,
  });
});

export const getDevices = onRequest(async (req, response) => {
  const configs = await getDeviceConfigs();
  response.send(configs);
});
