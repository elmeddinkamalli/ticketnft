import Compressor from "compressorjs";
import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

export async function compressImage(image) {
  return new Promise((resolve, reject) => {
    try {
      new Compressor(image, {
        quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
        maxHeight: 5000,
        maxWidth: 5000,
        success: (compressedResult) => {
          resolve(compressedResult);
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
        },
      });
    } catch (error) {
      reject(undefined);
    }
  });
}

export function convertUnixToDate(unix, format = "YYYY-MM-DD HH:mm:ss Z") {
  var timezoneName = dayjs.tz.guess();
  const dayjsLocal = dayjs.unix(unix);
  return dayjs(dayjsLocal).tz(timezoneName).format(format);
}
