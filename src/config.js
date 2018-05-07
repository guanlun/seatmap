import { ENV } from './env';

export const SERVER_HOST = (ENV === 'prod') ? '18.220.167.147' : 'localhost';
