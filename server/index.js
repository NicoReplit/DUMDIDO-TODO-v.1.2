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
    total_points INTEGER DEFAULT 0,
    super_points INTEGER DEFAULT 12,
    current_streak_days INTEGER DEFAULT 0,
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
    points_earned INTEGER DEFAULT 0,
    pause_used BOOLEAN DEFAULT FALSE,
    super_point_used BOOLEAN DEFAULT FALSE,
    actual_time_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
  )
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS daily_completions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    all_completed_on_time BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, completion_date)
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
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const validColorRegex = /^#[0-9A-F]{6}$/i;
    const userColor = color || '#3B82F6';
    if (!validColorRegex.test(userColor)) {
      return res.status(400).json({ error: 'Invalid color format' });
    }
    const result = await pool.query(
      'INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *',
      [name.trim(), userColor]
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
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const validColorRegex = /^#[0-9A-F]{6}$/i;
    if (!validColorRegex.test(color)) {
      return res.status(400).json({ error: 'Invalid color format' });
    }
    const result = await pool.query(
      'UPDATE users SET name = $1, color = $2 WHERE id = $3 RETURNING *',
      [name.trim(), color, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:id/use-super-point', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE users SET super_points = super_points - 1 WHERE id = $1 AND super_points > 0 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'No super points available' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/daily-completion', async (req, res) => {
  try {
    const { user_id, date } = req.query;
    const result = await pool.query(
      'SELECT * FROM daily_completions WHERE user_id = $1 AND completion_date = $2',
      [user_id, date]
    );
    if (result.rows.length === 0) {
      return res.json({ all_completed_on_time: false });
    }
    res.json(result.rows[0]);
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

async function checkDailyCompletion(userId, date) {
  const result = await pool.query(
    `SELECT * FROM todos WHERE user_id = $1 AND (specific_date = $2 OR recurrence_type IS NOT NULL)`,
    [userId, date]
  );
  
  const todosForDate = result.rows.filter(todo => {
    if (todo.specific_date) {
      const todoDate = todo.specific_date.toISOString().split('T')[0];
      return todoDate === date;
    }
    if (todo.recurrence_type === 'daily') {
      return true;
    }
    if (todo.recurrence_type === 'weekly' && todo.recurrence_days) {
      const dayOfWeek = new Date(date).getDay();
      const days = JSON.parse(todo.recurrence_days);
      return days.includes(dayOfWeek);
    }
    return false;
  });
  
  if (todosForDate.length === 0) {
    return;
  }
  
  const allCompletedOnTime = todosForDate.every(todo => {
    if (!todo.completed) return false;
    if (todo.super_point_used) return true;
    if (!todo.estimated_minutes) return false;
    if (todo.actual_time_seconds === null || todo.actual_time_seconds === undefined) return false;
    const estimatedSeconds = todo.estimated_minutes * 60;
    return todo.actual_time_seconds <= estimatedSeconds;
  });
  
  await pool.query(
    `INSERT INTO daily_completions (user_id, completion_date, all_completed_on_time) 
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, completion_date) 
     DO UPDATE SET all_completed_on_time = $3`,
    [userId, date, allCompletedOnTime]
  );
  
  if (allCompletedOnTime) {
    await checkAndAwardStreakBonuses(userId);
  }
}

async function checkAndAwardStreakBonuses(userId) {
  const result = await pool.query(
    `SELECT completion_date FROM daily_completions 
     WHERE user_id = $1 AND all_completed_on_time = true 
     ORDER BY completion_date DESC`,
    [userId]
  );
  
  if (result.rows.length === 0) return;
  
  let currentStreak = 1;
  let previousDate = new Date(result.rows[0].completion_date);
  
  for (let i = 1; i < result.rows.length; i++) {
    const currentDate = new Date(result.rows[i].completion_date);
    const dayDiff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      currentStreak++;
      previousDate = currentDate;
    } else {
      break;
    }
  }
  
  await pool.query(
    'UPDATE users SET current_streak_days = $1 WHERE id = $2',
    [currentStreak, userId]
  );
  
  if (currentStreak === 7 || currentStreak === 30 || currentStreak === 90 || currentStreak === 365) {
    let bonusPoints = 0;
    let bonusSuperPoints = 0;
    
    if (currentStreak === 7) bonusPoints = 10;
    else if (currentStreak === 30) bonusPoints = 30;
    else if (currentStreak === 90) bonusPoints = 50;
    else if (currentStreak === 365) bonusSuperPoints = 12;
    
    await pool.query(
      'UPDATE users SET total_points = total_points + $1, super_points = super_points + $2 WHERE id = $3',
      [bonusPoints, bonusSuperPoints, userId]
    );
  }
}

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, estimated_minutes, remaining_seconds, completed, specific_date, recurrence_type, recurrence_days, pause_used, super_point_used, points_earned, actual_time_seconds } = req.body;
    
    if (completed && points_earned !== undefined) {
      const todo = await pool.query('SELECT user_id, specific_date FROM todos WHERE id = $1', [id]);
      if (todo.rows.length > 0) {
        const userId = todo.rows[0].user_id;
        await pool.query(
          'UPDATE users SET total_points = total_points + $1 WHERE id = $2',
          [points_earned, userId]
        );
        
        const completionDate = todo.rows[0].specific_date 
          ? todo.rows[0].specific_date.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        await checkDailyCompletion(userId, completionDate);
      }
    }
    
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
       recurrence_days = COALESCE($8, recurrence_days),
       pause_used = COALESCE($9, pause_used),
       super_point_used = COALESCE($10, super_point_used),
       points_earned = COALESCE($11, points_earned),
       actual_time_seconds = COALESCE($12, actual_time_seconds)
       WHERE id = $13 RETURNING *`,
      [title, description, estimated_minutes, remaining_seconds, completed, specific_date, recurrence_type, recurrence_days, pause_used, super_point_used, points_earned, actual_time_seconds, id]
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
