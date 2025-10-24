import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    estimated_minutes INTEGER,
    remaining_seconds INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    specific_date DATE,
    recurrence_type VARCHAR(20),
    recurrence_days TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
  )
`);

const defaultUsers = await pool.query('SELECT COUNT(*) FROM users');
if (parseInt(defaultUsers.rows[0].count) === 0) {
  await pool.query(`
    INSERT INTO users (name, color) VALUES 
    ('Mom', '#EC4899'),
    ('Dad', '#3B82F6'),
    ('Kids', '#10B981')
  `);
}

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, color } = req.body;
    const result = await pool.query(
      'INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *',
      [name, color || '#3B82F6']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const result = await pool.query(
      'UPDATE users SET name = $1, color = $2 WHERE id = $3 RETURNING *',
      [name, color, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/todos', async (req, res) => {
  try {
    const { user_id, date } = req.query;
    let query = 'SELECT * FROM todos WHERE 1=1';
    const params = [];
    
    if (user_id) {
      params.push(user_id);
      query += ` AND user_id = $${params.length}`;
    }
    
    if (date) {
      params.push(date);
      query += ` AND (specific_date = $${params.length} OR recurrence_type IS NOT NULL)`;
    }
    
    query += ' ORDER BY completed, created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { user_id, title, description, estimated_minutes, specific_date, recurrence_type, recurrence_days } = req.body;
    const remaining_seconds = estimated_minutes ? estimated_minutes * 60 : null;
    
    const result = await pool.query(
      `INSERT INTO todos (user_id, title, description, estimated_minutes, remaining_seconds, 
       specific_date, recurrence_type, recurrence_days) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [user_id, title, description, estimated_minutes, remaining_seconds, 
       specific_date, recurrence_type, recurrence_days]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, estimated_minutes, remaining_seconds, completed, specific_date, recurrence_type, recurrence_days } = req.body;
    
    const result = await pool.query(
      `UPDATE todos SET 
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       estimated_minutes = COALESCE($3, estimated_minutes),
       remaining_seconds = COALESCE($4, remaining_seconds),
       completed = COALESCE($5, completed),
       completed_at = CASE WHEN $5 = true THEN CURRENT_TIMESTAMP ELSE completed_at END,
       specific_date = COALESCE($6, specific_date),
       recurrence_type = COALESCE($7, recurrence_type),
       recurrence_days = COALESCE($8, recurrence_days)
       WHERE id = $9 RETURNING *`,
      [title, description, estimated_minutes, remaining_seconds, completed, specific_date, recurrence_type, recurrence_days, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
