import Compressor from "compressorjs";

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
      console.log(error);
      reject(undefined);
    }
  });
}
