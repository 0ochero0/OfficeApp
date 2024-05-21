const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Prisma Client with the DATABASE_URL from the environment variables
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

// Endpoint to report an issue
app.post('/report-issue', async (req, res) => {
    const { officeArea, facility, comments, email } = req.body;
    try {
        const newIssue = await prisma.issue.create({
            data: {
                officeArea,
                facility,
                comments,
                email
            }
        });
        res.status(200).json(newIssue);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to get reported issues
app.get('/get-reported-issues', async (req, res) => {
    try {
        const issues = await prisma.issue.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) // past week
                }
            }
        });
        res.status(200).json(issues);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
