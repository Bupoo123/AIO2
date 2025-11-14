const DEFAULT_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

const normalizeOrigin = (origin) => {
  if (!origin) {
    return '';
  }

  const trimmed = origin.trim();

  try {
    // 兼容带有路径或查询参数的地址
    return new URL(trimmed).origin;
  } catch (error) {
    return trimmed;
  }
};

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

const buildAllowedOrigins = () => {
  const origins = new Set();

  parseOrigins(process.env.CORS_ALLOWED_ORIGINS).forEach((origin) => {
    origins.add(origin);
  });

  if (process.env.FRONTEND_URL) {
    origins.add(normalizeOrigin(process.env.FRONTEND_URL));
  }

  // 兼容 Vercel 生产和预览环境自动生成的域名
  if (process.env.VERCEL_URL) {
    origins.add(normalizeOrigin(`https://${process.env.VERCEL_URL}`));
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    origins.add(
      normalizeOrigin(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    );
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
