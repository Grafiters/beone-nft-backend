import pino from 'pino';
import pinoPretty from 'pino-pretty';

const logger = pino(
  pinoPretty({
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    ignore: 'pid,hostname',
    singleLine: true,
  }),
);

export default logger;
