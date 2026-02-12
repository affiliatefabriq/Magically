import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const S3_URL = process.env.NEXT_PUBLIC_S3_ENDPOINT;
export const S3 = process.env.NEXT_PUBLIC_S3;
export const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
  timeout: 900000,
});

export default api;
