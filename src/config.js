import { ENV } from './env';

export const SERVER_HOST = (ENV === 'prod') ? 'localhost' : 'localhost';
