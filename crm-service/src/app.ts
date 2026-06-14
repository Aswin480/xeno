import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import copilotRoutes from './routes/copilot.routes';
import campaignsRoutes from './routes/campaigns.routes';
import customersRoutes from './routes/customers.routes';
import insightsRoutes from './routes/insights.routes';
import receiptsRoutes from './routes/receipts.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Trust reverse proxy for accurate IP logging and rate limiting
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// Dynamic CORS configuration supporting previews, custom domains, and local environments
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ''),
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isNetlifyPreview = /^https:\/\/.*--xeno\.netlify\.app$/.test(normalizedOrigin) || normalizedOrigin === 'https://xeno-production.netlify.app';
    const isAllowed = allowedOrigins.includes(normalizedOrigin) || isNetlifyPreview;

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Request Correlation ID tracking middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  next();
});

// Rate Limiting to prevent API abuse (Window: 15 mins, Max: 100 requests)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/copilot', limiter); // Apply rate limiter specifically to costly AI endpoints

app.use(express.json());

// Morgan HTTP request logging with Correlation ID injection
morgan.token('id', (req: any) => req.headers['x-request-id'] || '-');
app.use(morgan(':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

// Health Check Endpoint for Service Monitors (Railway, Render, Kubernetes)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/copilot', copilotRoutes);
app.use('/campaigns', campaignsRoutes);
app.use('/customers', customersRoutes);
app.use('/insights', insightsRoutes);
app.use('/receipts', receiptsRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
