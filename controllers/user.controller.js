const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./resume_data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

const getuser = (req, res, next) => {
    if(!req.body.name) return res.status(400).json({ message: 'Name Field is required' });
    
    const sql = 'SELECT * FROM resumes WHERE name = ?';
    db.get(sql, [req.body.name], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (row) {
            req.user = row;
            next();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
}

const getallusers = (req, res) => {
    const sql = 'SELECT name FROM resumes ORDER BY name';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Database error' });
        }
        
        const userNames = rows.map(row => row.name);
        res.json(userNames);
    });
}

module.exports = {
    getuser,
    getallusers
};