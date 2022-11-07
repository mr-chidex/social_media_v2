import cloudinary from 'cloudinary';
import config from '../config';

cloudinary.v2.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_API_KEY,
  api_secret: config.CLOUD_API_SECRET,
});

export default cloudinary;
