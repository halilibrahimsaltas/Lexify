export const TRANSLATION_CONSTANTS = {
    CACHE: {
        TTL: 86400, // 24 saat
        KEY_PREFIX: 'translation:'
    },
    API: {
        DEFAULT_URL: process.env.LIBRETRANSLATE_URL,
        ENDPOINTS: {
            TRANSLATE: '/translate',
            DETECT: '/detect',
            LANGUAGES: '/languages'
        }
    },
    DEFAULT_LANGUAGES: {
        SOURCE: 'en',
        TARGET: 'tr'
    }
} as const; 