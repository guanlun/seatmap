import { ENV } from './env';

export const SERVER_HOST = (ENV === 'prod') ? '0.0.0.0' : 'localhost';
