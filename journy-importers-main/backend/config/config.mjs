import {
  DefaultAzureCredential,
  InteractiveBrowserCredential,
} from '@azure/identity';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Export configuration values
export const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

/* //? Not needed when using Admin and Admin Password */
// const isDev = process.env.NODE_ENV === 'development';
// export const credential = isDev
//   ? new InteractiveBrowserCredential({
//       tenantId: config.tenantId,
//     })
//   : new DefaultAzureCredential();
