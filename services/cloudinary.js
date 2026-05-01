import axios from 'axios';

export const uploadToCloudinary = async (imageUri) => {
  const data = new FormData();

  data.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'car.jpg',
  });

  data.append('upload_preset', 'car_uploads'); // your preset

  try {
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dopp18bxl/image/upload',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return res.data.secure_url;
  } catch (error) {
    console.log('Cloudinary Error:', error.response?.data || error.message);
    return null;
  }
};