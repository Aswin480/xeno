import { Request, Response } from 'express';
import { simulateSend } from '../services/simulator.service';

export async function sendHandler(req: Request, res: Response) {
  const payload = req.body;
  // simulate async sending and callbacks
  simulateSend(payload);
  res.json({ status: 'accepted' });
}
