const DEFAULT_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const buildAllowedOrigins = () => {
  const origins = new Set();

  parseOrigins(process.env.CORS_ALLOWED_ORIGINS).forEach((origin) => {
    origins.add(origin);
  });

  if (process.env.FRONTEND_URL) {
    origins.add(process.env.FRONTEND_URL.trim());
  }

  return origins;
};

const buildCorsOptions = () => {
  const explicitOrigins = buildAllowedOrigins();
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const allowDevFallback = isDevelopment && explicitOrigins.size === 0;

  return {
    origin: (origin, callback) => {
      // 允许同源请求（没有 Origin header）
      if (!origin) {
        return callback(null, true);
      }

      if (explicitOrigins.has(origin)) {
        return callback(null, true);
      }

      if (allowDevFallback) {
        if (
          origin.startsWith('http://localhost') ||
          origin.startsWith('http://127.0.0.1') ||
          DEFAULT_DEV_ORIGINS.includes(origin)
        ) {
          return callback(null, true);
        }
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
};

module.exports = buildCorsOptions;
