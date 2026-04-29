import dotenv from 'dotenv';
// Load environment variables before importing app
dotenv.config();

import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
