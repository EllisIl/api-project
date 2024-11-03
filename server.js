const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongodb = require('./db/connect');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // Route for OAuth
const itemRoutes = require('./routes/items'); // Your main API routes
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Initialize passport configuration
require('./config/passport'); // Assuming you created this in /config as shown previously

app
  .use(bodyParser.json())
  .use(passport.initialize()) // Initialize Passport middleware
  .use((req, res, next) => {
    // Allow CORS for all domains (or restrict to specific domains if needed)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  })
  .use('/auth', authRoutes) // OAuth routes
  .use('/api/items', itemRoutes) // Protected API routes
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)) // Swagger documentation
  .use('/', (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

// Initialize the database and start the server
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});
