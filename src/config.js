import { ENV } from './env';

export const SERVER_HOST = (ENV === 'prod') ? '18.218.172.215' : 'localhost';
