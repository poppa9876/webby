const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE projects (rollNo INTEGER PRIMARY KEY, name TEXT, projectName TEXT)");
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, rollNo, projectName } = req.body;

    const stmt = db.prepare("INSERT INTO projects (rollNo, name, projectName) VALUES (?, ?, ?)");
    stmt.run(rollNo, name, projectName, function(err) {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
    stmt.finalize();
});

// Route to fetch all projects
app.get('/projects', (req, res) => {
    db.all("SELECT * FROM projects", [], (err, rows) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        res.json({ success: true, data: rows });
    });
});

// Route to fetch a specific project by roll number
app.get('/project/:rollNo', (req, res) => {
    const rollNo = req.params.rollNo;
    db.get("SELECT * FROM projects WHERE rollNo = ?", [rollNo], (err, row) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        res.json({ success: true, data: row });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
