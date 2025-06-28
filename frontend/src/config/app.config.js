import 'dotenv/config';

export default {
  expo: {
    name: 'lexify-mobile',
    slug: 'lexify-mobile',
    version: '1.0.0',
    extra: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    },
  },
};