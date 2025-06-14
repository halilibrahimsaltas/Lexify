export const TRANSLATION_CONSTANTS = {
    CACHE: {
        TTL: 86400, // 24 saat
        KEY_PREFIX: 'translation:'
    },
    API: {
        DEFAULT_URL: 'http://localhost:5000',
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