import 'dotenv/config';

export default {
  expo: {
    name: 'lexify-mobile',
    slug: 'lexify-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/icon/Lexify_icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './src/assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    plugins: [
      "expo-font",
      "expo-mail-composer"
    ],
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.halil354.lexify",
      adaptiveIcon: {
        foregroundImage: './src/assets/adaptive-icon.png',
        backgroundColor: '#ffffff',

      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './src/assets/favicon.png',
      bundler: 'metro',
    },
    owner: "halil354",
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
      eas: {
        projectId: "8de92b65-e9b2-414d-9b62-23928fe5d658",
      },
    },
    scheme: 'lexify-mobile',
  },
};
