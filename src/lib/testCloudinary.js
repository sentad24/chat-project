import 'dotenv/config'; // <-- Loads your .env variables
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function test() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
    });

    const publicIds = result.resources.map(file => file.public_id);
    console.log('Avatars:', publicIds);
  } catch (err) {
    console.error('Cloudinary error:', err);
  }
}

test();
