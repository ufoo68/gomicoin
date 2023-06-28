import axios from "axios";
import Obniz from "obniz";

const obniz = new Obniz.M5StickC("8913-2309", {

});
obniz.onconnect = () => {
  obniz.buttonA.onchange = (state) => {
    if (state) {
      axios.get("https://getgomibakostate-acxb6r4szq-uc.a.run.app?deviceId=test_1")
        .then((response) => {
          obniz.display.clear();
          // eslint-disable-next-line max-len
          obniz.display.print(`capacity: ${(response.data.capacity * 100).toFixed(2)}%`);
        }).catch((error) => {
          console.error(error);
          obniz.display.clear();
          obniz.display.print("error");
        });
    }
  };
};
