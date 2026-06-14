import axios from 'axios';

const cleanUrl = (url: string) => url ? url.replace(/^['"]|['"]$/g, '') : '';
const API_URL = cleanUrl(import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';
const SIMULATOR_URL = cleanUrl(import.meta.env.VITE_SIMULATOR_URL as string) || 'http://localhost:8001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const simulatorApi = axios.create({
  baseURL: SIMULATOR_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
