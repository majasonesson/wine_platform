import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.mjs';
import wineRoutes from './routes/wineRoutes.mjs';
import userRouter from './routes/userRoutes.mjs';
import webhookHandler from './stripeWebhook.mjs';
import stripeRouter from './routes/stripe.mjs';
import choosePlanStripeRouter from './routes/choosePlanStripe.mjs';
import connectionRouter from './routes/connectionRoutes.mjs';
import importerChangeStripeRouter from './routes/importerChangeStripe.mjs';

// Sätt upp korrekt sökväg till .env filen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, `.env`);

dotenv.config({ path: envPath });

// Debug för att se sökvägen
console.log('Looking for .env at:', path.join(__dirname, envPath));
console.log('PORT from env:', process.env.PORT);

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.journy.se',
  'https://journy.se',
  'https://journy-frontend-b7abasgegmfyd6a4.swedencentral-01.azurewebsites.net',
  'https://journy-frontend-staging-bzcagkece3hxeten.swedencentral-01.azurewebsites.net',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// Important: Add this before any other middleware
// Stripe webhook needs raw body
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => webhookHandler(req, res));

app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(xss());

app.use(hpp());

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    env: process.env.NODE_ENV
  });
});

app.use('/api/wines', wineRoutes);
app.use('/api/users', userRouter);
app.use('/api/connections', connectionRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/importerChangeStripe', importerChangeStripeRouter);
app.use('/api/publicStripe', choosePlanStripeRouter);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error message: ${err.message}`);
  server.close(() => process.exit(1));
});
