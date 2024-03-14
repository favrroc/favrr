import * as blobUtil from "blob-util";
import { ImageVariant } from "../enums/image-variant.enum";

export const imageToString = async (data: File) => {
  const file = data;
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  return new Promise(function (resolve: (value: string) => void) {
    fileReader.onloadend = async function (e) {
      const arrayBuffer = e?.target?.result as ArrayBuffer;
      const fileType = file.type;
      const blob = blobUtil.arrayBufferToBlob(arrayBuffer, fileType);
      const baseString = await blobUtil.blobToBase64String(blob);
      return resolve(baseString);
    };
  });
};

export const isValidImageDimension = (fileUrl: string, imageVariant: ImageVariant) => {
  const minWidth = imageVariant === ImageVariant.Avatar ? 400 : 1440;
  const minHeight = imageVariant === ImageVariant.Avatar ? 400 : 260;

  return new Promise((resolve: (value: boolean) => void, reject) => {
    const image = new Image();
    image.src = fileUrl;
    image.onload = () => resolve(image.naturalWidth >= minWidth && image.naturalHeight >= minHeight);
    image.onerror = reject;
  });
};