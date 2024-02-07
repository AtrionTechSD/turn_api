import dotenv from "dotenv";
import path from "path";

dotenv.config();
const env = process.env.NODE_ENV || "prod";
let config: any = {
  app: {
    port: env != "test" ? process.env.PORT : process.env.PORT_TEST,
    name: process.env.APP_NAME || "Turn",
    url: process.env.APP_URL || "http://localhost",
    public: path.join(__dirname, "./public"),
    views: path.join(__dirname, "./views"),
    env,
    allowedUrl: env == "dev" ? process.env.ALLOWED_URL : "*",
  },

  db: {
    dev: process.env.DATABASE_NAME || "forge",
    test: process.env.DATABASE_TEST_NAME,
    prod: process.env.DATABASE_NAME || "forge",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    host: process.env.DATABASE_HOST || "localhost",
    dialect: process.env.DATABASE_DIALECT || "mysql",
    logging: process.env.DATABASE_LOGGING == "TRUE",
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === "TRUE",
    from: process.env.MAIL_FROM,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASSWORD,
    },
    tls: {
      rejectUnauthorized: process.env.MAIL_TLS_REJECT === "TRUE",
    },
  },

  auth: {
    secret: process.env.PRIVATE_KEY || "<PRIVATE_KEY>",
    expiresIn: Number(process.env.EXPIRES_IN) || 84600,
  },

  test: {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD,
    name: process.env.TEST_NAME,
    lastname: process.env.TEST_LASTNAME,
  },

  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  },
};

export default config;
