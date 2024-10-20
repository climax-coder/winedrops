import  express from 'express';
import  sqlite3, { verbose } from 'sqlite3';
import  bodyParser from 'body-parser';
import  path from 'path';

const app = express();
const PORT = 3000;

// Middleware to parse incoming request bodies (JSON data)
app.use(bodyParser.json());

// Connect to the SQLite database (using windrops.db)
const dbPath = path.resolve(__dirname, 'windrops.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// GET request to retrieve all data from a specific table (e.g., "wines")
app.get('/wines', (req, res) => {
  const sql = 'SELECT * FROM wines'; // Replace "wines" with your actual table name
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ data: rows });
  });
});

// POST request to insert data into a specific table (e.g., "wines")
app.post('/wines', (req, res) => {
  const { name, year, country, price } = req.body;

  // Replace with your actual table columns
  const sql = 'INSERT INTO wines (name, year, country, price) VALUES (?, ?, ?, ?)';
  const params = [name, year, country, price];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: 'New wine entry created',
      data: { id: this.lastID, name, year, country, price }
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
