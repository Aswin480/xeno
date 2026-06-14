import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  simulatorUrl: process.env.SIMULATOR_URL || 'http://localhost:8001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  isDev: process.env.NODE_ENV !== 'production',
};
