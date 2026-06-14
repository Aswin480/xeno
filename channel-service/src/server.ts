import express from 'express';
import channelRoutes from './routes/channel.routes';

const app = express();
app.use(express.json());
app.use('/api/channel', channelRoutes);

const port = process.env.PORT || 4002;
app.listen(port, () => console.log(`Channel service running on ${port}`));
