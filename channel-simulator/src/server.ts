import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import channelRoutes from './routes/channel.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

// Log requests
app.use((req, _res, next) => {
  console.log(`[SIMULATOR] ${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/', channelRoutes);

app.listen(port, () => {
  console.log(`[SIMULATOR] Channel Simulator is running on http://localhost:${port}`);
});
