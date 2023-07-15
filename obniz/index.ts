import Obniz, { M5StickC } from "obniz";
import { getDeviceStatus, getDevices, getGomiToken } from "./client";

const displayState = async (obniz: M5StickC, deviceId: string) => {
  const deviceState = await getDeviceStatus(deviceId);
  const gomiToken = await getGomiToken(deviceId);
  obniz.display?.clear();
  obniz.display?.print(
    `\ncapacity: ${(deviceState.capacity * 100).toFixed(2)}%\ntrash: ${
      deviceState.trash
    }\n${gomiToken.symbol}: ${gomiToken.amount}`
  );
};

const main = async () => {
  const devices = await getDevices();
  devices.forEach((device) => {
    const obniz = new Obniz.M5StickC(device.obnizId);
    obniz.onconnect = () => {
      console.log("connected: " + obniz.id);
      displayState(obniz, device.deviceId);
      obniz.buttonA.onchange = async (state) => {
        if (state) {
          try {
            displayState(obniz, device.deviceId);
          } catch (error) {
            console.error(error);
            obniz.display.clear();
            obniz.display.print("error");
          }
        }
      };
    };
  });
};

main();
