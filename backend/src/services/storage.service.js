import ImageKit, { toFile } from '@imagekit/nodejs';
import { Config } from '../config/config.js';

const client = new ImageKit({
  privateKey: Config.IMAGEKIT_PRIVATE_KEY,
  publicKey: Config.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: Config.IMAGEKIT_URL_ENDPOINT,
});

export async function UploadFile({ buffer, fileName, folder = 'Snitch' }) {
  const result = await client.files.upload({
    file: await toFile(buffer, fileName),
    fileName,
    folder,
  });
  return result;
}