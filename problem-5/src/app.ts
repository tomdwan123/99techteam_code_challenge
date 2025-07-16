import express, { Application } from 'express';
import { json } from 'body-parser';
import resourceRoutes from './routes/resourceRoutes';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

interface CustomApp extends Application {
  closeServer?: () => void;
}

const app: CustomApp = express();
app.use(express.json());
app.use(json());

// Load OpenAPI specification
try {
    const openApiPath = path.join(__dirname, '..', 'openapi.yml');
    const openApiDocument = yaml.load(fs.readFileSync(openApiPath, 'utf8')) as swaggerUi.JsonObject;
    
    // Serve API documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
} catch (error) {
    console.warn('Failed to load OpenAPI documentation:', error);
}

// Root endpoint with API information
app.get('/', (req, res) => {
    res.json({
        name: 'Resource Management API',
        version: '1.0.0',
        description: 'A comprehensive resource management system API built with Express.js and TypeScript',
        endpoints: {
            documentation: '/api-docs',
            resources: '/resources',
            statistics: '/resources/stats'
        },
        status: 'running'
    });
});

app.use(resourceRoutes);

// Middleware to log requests (only in development)
if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
        console.log(`${req.method} request for '${req.url}'`);
        next();
    });
}

// Error-handling middleware
app.use(errorHandler);

// Only start the server if this file is run directly (not during tests)
if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () => {
        console.log(`Resource Management app is running on http://localhost:${PORT}`);
    });

    app.closeServer = () => {
        server.close();
    };
}

export default app;