const LOG_LEVELS = { ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG' };

function formatLog(level, message, data) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level}] ${message}`;
  if (data) {
    return `${base} ${JSON.stringify(data)}`;
  }
  return base;
}

const logger = {
  info: (message, data) => console.log(formatLog(LOG_LEVELS.INFO, message, data)),
  warn: (message, data) => console.warn(formatLog(LOG_LEVELS.WARN, message, data)),
  error: (message, data) => console.error(formatLog(LOG_LEVELS.ERROR, message, data)),
  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, data));
    }
  },
};

export default logger;
