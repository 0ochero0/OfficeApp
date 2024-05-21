const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Database connection setup
const pool = new Pool({
    user: 'postgres', // replace with your PostgreSQL username
    host: 'localhost',
    database: 'office_issues', // ensure this matches the database name you created
    password: '123456', // replace with your PostgreSQL password
    port: 5432,
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
        const result = await pool.query(
            'INSERT INTO issues (office_area, facility, comments, email) VALUES ($1, $2, $3, $4) RETURNING *',
            [officeArea, facility, comments, email]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to get reported issues
app.get('/get-reported-issues', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM issues WHERE created_at >= NOW() - INTERVAL '1 week'"
        );
        res.status(200).json(result.rows);
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
