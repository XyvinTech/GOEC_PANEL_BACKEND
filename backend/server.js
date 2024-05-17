import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import connectDB from './configs/db.js';
import admin from 'firebase-admin';
import { serviceAccount } from './configs/goec-firebasekey.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Load env
dotenv.config();
const HTTP = process.env.HTTP;
const PORT = process.env.PORT;

// Initialize Firebase
const firebaseapp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET_URL,
});

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API doc for GoEC Panel',
    version: '1.0.0',
    description: 'This is the API documentation for GoEC Panel',
  },
  servers: [
    {
      url: `${HTTP}://localhost:${PORT}`,
      description: 'Development server',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js', './swagger.js'], // Adjust this to point to your API routes
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

const customOptions = {
  swaggerOptions: {
    supportedSubmitMethods: [],
  },
};

// DB connection
connectDB();

// Express Initialization
const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Logger
app.use(logger('dev'));

// Mount routes
routes(app);

// Serve Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, customOptions)
);

// HTTP Server
const httpServer = http.createServer(app);
const server = httpServer.listen(
  PORT,
  console.info(`Server running on port ${PORT}`)
);

function exitHandler(options, exitCode) {
  if (options.cleanup) if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// Catches ctrl+c events
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// Handle unhandled promise rejections.
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
});
