const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');

const app = express();

// Security Headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow images to be loaded from other origins if needed, or adjust as per requirement

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Debug Middleware: Log all requests
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[RESPONSE] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
});

const authRoutes = require('./routes/auth.routes');
const chaletRoutes = require('./routes/chalet.routes');
const userRoutes = require('./routes/user.routes');
const allowedUserRoutes = require('./routes/allowedUser.routes');

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Add production domains here
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' })); // Body limit

app.use('/api/auth', authRoutes);
app.use('/api/chalets', chaletRoutes);
app.use('/api/users', userRoutes);
app.use('/api/allowed-users', allowedUserRoutes);

// Serve static files from uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



// Basic route for testing
app.get('/', (req, res) => {
    res.send('Ski Weekend API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        // Do not leak error details in production
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});


// Sync database
sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
        return sequelize.query('PRAGMA journal_mode;');
    })
    .then(([results]) => {
        console.log(`[DB] Current Journal Mode: ${results[0].journal_mode}`);
        if (results[0].journal_mode !== 'wal') {
            return sequelize.query('PRAGMA journal_mode = WAL;')
                .then(([res]) => {
                    console.log(`[DB] Set Journal Mode to: ${res[0].journal_mode}`);
                });
        }
    })
    .then(() => {
        return sequelize.sync({ alter: false });
    })
    .then(() => {
        console.log('Database synced');
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });

module.exports = app;
