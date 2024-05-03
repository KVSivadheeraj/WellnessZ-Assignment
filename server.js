const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Create MySQL connection pool
const pool = mysql.createPool({
   host: 'localhost',
    user: 'root',
    password: '',
    database: 'rest_api_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the REST API for Posts');
});

// Route to get all posts with options for sorting, pagination, keyword filtering, and tag filtering
app.get('/posts', (req, res) => {
    let { sort, page, keyword, tag } = req.query;
    let query = 'SELECT * FROM posts WHERE 1=1';
    let params = [];

    if (keyword) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (tag) {
        query += ' AND tag = ?';
        params.push(tag);
    }

    if (sort) {
        const [field, order] = sort.split(':');
        query += ` ORDER BY ${field} ${order}`;
    }

    const limit = 10;
    const offset = (page - 1) * limit || 0;
    query += ' LIMIT ?, ?';
    params.push(offset, limit);

    pool.query(query, params, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        res.json(results);
    });
});

// Route to insert a new post
app.post('/posts', (req, res) => {
    const { title, description, tag, image_url } = req.body;
    pool.query('INSERT INTO posts (title, description, tag, image_url) VALUES (?, ?, ?, ?)', [title, description, tag, image_url], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        res.status(201).json({ message: 'Post created successfully', postId: results.insertId });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
