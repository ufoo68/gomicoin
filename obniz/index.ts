import Obniz from "obniz";
import { getDeviceStatus, getDevices, getGomiToken } from "./client";

const main = async () => {
  const devices = await getDevices();
  devices.forEach((device) => {
    const obniz = new Obniz.M5StickC(device.obnizId);
    obniz.onconnect = () => {
      console.log("connected: " + obniz.id);
      setInterval(async () => {
        try {
          const deviceState = await getDeviceStatus(device.deviceId);
          const gomiToken = await getGomiToken(device.deviceId);
          obniz.display.clear();
          obniz.display.print(
            `\ncapacity: ${(deviceState.capacity * 100).toFixed(2)}%\ntrash: ${
              deviceState.trash
            }\n${gomiToken.symbol}: ${gomiToken.amount}`
          );
        } catch (error) {
          console.error(error);
          obniz.display.clear();
          obniz.display.print("error");
        }
      }, 10000);
    };
  });
};

main();
