import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { existsSync, mkdirSync } from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

if (!existsSync('data')) {
  mkdirSync('data', { recursive: true });
}

const db = new Database('data/familytodo.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    total_points INTEGER DEFAULT 0,
    super_points INTEGER DEFAULT 12,
    current_streak_days INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    estimated_minutes INTEGER,
    remaining_seconds INTEGER,
    completed INTEGER DEFAULT 0,
    specific_date TEXT,
    recurrence_type TEXT,
    recurrence_days TEXT,
    points_earned INTEGER DEFAULT 0,
    pause_used INTEGER DEFAULT 0,
    super_point_used INTEGER DEFAULT 0,
    actual_time_seconds INTEGER,
    last_activity_date TEXT,
    is_open_list INTEGER DEFAULT 0,
    claimed_by_user_id INTEGER REFERENCES users(id),
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS daily_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    completion_date TEXT NOT NULL,
    all_completed_on_time INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, completion_date)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS recurring_todo_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
    completion_date TEXT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    pause_used INTEGER DEFAULT 0,
    super_point_used INTEGER DEFAULT 0,
    actual_time_seconds INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(todo_id, completion_date)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS recurring_todo_exceptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
    exception_date TEXT NOT NULL,
    exception_type TEXT DEFAULT 'deleted',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(todo_id, exception_date)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    global_pin_hash TEXT,
    max_points INTEGER DEFAULT 1000,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
if (settingsCount.count === 0) {
  db.prepare('INSERT INTO settings (id) VALUES (1)').run();
}

const defaultUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (defaultUsers.count === 0) {
  db.exec(`
    INSERT INTO users (name, color) VALUES 
    ('Mom', '#EC4899'),
    ('Dad', '#3B82F6'),
    ('Kids', '#10B981')
  `);
}

function boolToInt(val) {
  return val ? 1 : 0;
}

function intToBool(val) {
  return val === 1;
}

function formatRow(row) {
  if (!row) return row;
  return {
    ...row,
    completed: intToBool(row.completed),
    pause_used: intToBool(row.pause_used),
    super_point_used: intToBool(row.super_point_used),
    is_open_list: intToBool(row.is_open_list),
    all_completed_on_time: intToBool(row.all_completed_on_time),
    recurring_pause_used: row.recurring_pause_used !== undefined ? intToBool(row.recurring_pause_used) : undefined,
    recurring_super_point_used: row.recurring_super_point_used !== undefined ? intToBool(row.recurring_super_point_used) : undefined
  };
}

function formatRows(rows) {
  return rows.map(formatRow);
}

app.get('/api/users', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, name, color, total_points, super_points, current_streak_days, created_at FROM users ORDER BY name').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT id, name, color, total_points, super_points, current_streak_days, created_at FROM users WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', (req, res) => {
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
    const result = db.prepare('INSERT INTO users (name, color) VALUES (?, ?)').run(name.trim(), userColor);
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', (req, res) => {
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

    const result = db.prepare('UPDATE users SET name = ?, color = ? WHERE id = ?').run(name.trim(), color, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = db.prepare('SELECT id, name, color, total_points, super_points, current_streak_days, created_at FROM users WHERE id = ?').get(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id/todos', (req, res) => {
  try {
    const { id } = req.params;
    const userCheck = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!userCheck) {
      return res.status(404).json({ error: 'User not found' });
    }
    db.prepare('DELETE FROM todos WHERE user_id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id/reset-points', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('UPDATE users SET total_points = 0, super_points = 12, current_streak_days = 0 WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/settings/has-pin', (req, res) => {
  try {
    const settings = db.prepare('SELECT global_pin_hash FROM settings WHERE id = 1').get();
    res.json({ hasPin: !!(settings && settings.global_pin_hash) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings/verify-pin', async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'Invalid PIN format' });
    }

    const settings = db.prepare('SELECT global_pin_hash FROM settings WHERE id = 1').get();
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    const globalPinHash = settings.global_pin_hash;
    if (!globalPinHash) {
      return res.json({ valid: true });
    }

    const isValid = await bcrypt.compare(pin, globalPinHash);
    res.json({ valid: isValid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:id/use-super-point', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('UPDATE users SET super_points = super_points - 1 WHERE id = ? AND super_points > 0').run(id);
    if (result.changes === 0) {
      return res.status(400).json({ error: 'No super points available' });
    }
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/daily-completion', (req, res) => {
  try {
    const { user_id, date } = req.query;
    const row = db.prepare('SELECT * FROM daily_completions WHERE user_id = ? AND completion_date = ?').get(user_id, date);
    if (!row) {
      return res.json({ all_completed_on_time: false });
    }
    res.json(formatRow(row));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/todos', (req, res) => {
  try {
    const { user_id, date } = req.query;
    let query = `
      SELECT 
        t.*,
        rtc.points_earned as recurring_points_earned,
        rtc.pause_used as recurring_pause_used,
        rtc.super_point_used as recurring_super_point_used,
        rtc.actual_time_seconds as recurring_actual_time_seconds,
        rtc.completion_date as recurring_completion_date
      FROM todos t
      LEFT JOIN recurring_todo_completions rtc 
        ON t.id = rtc.todo_id AND rtc.completion_date = ?
      LEFT JOIN recurring_todo_exceptions rte
        ON t.id = rte.todo_id AND rte.exception_date = ?
      WHERE rte.id IS NULL
    `;
    const params = [date, date];
    
    if (user_id) {
      query += ` AND t.user_id = ?`;
      params.push(user_id);
    }
    
    if (date) {
      query += ` AND (t.specific_date = ? OR t.recurrence_type IS NOT NULL)`;
      params.push(date);
    }
    
    query += ' ORDER BY t.completed, t.created_at DESC';
    
    const rows = db.prepare(query).all(...params);
    
    const filteredRows = rows.filter(row => {
      if (!date) {
        return true;
      }
      if (row.specific_date) {
        return true;
      }
      if (row.recurrence_type === 'daily') {
        if (row.recurrence_days) {
          const dayOfWeek = new Date(date).getDay();
          const days = JSON.parse(row.recurrence_days);
          return days.length === 0 || days.includes(dayOfWeek);
        }
        return true;
      }
      if (row.recurrence_type === 'weekly' && row.recurrence_days) {
        const dayOfWeek = new Date(date).getDay();
        const days = JSON.parse(row.recurrence_days);
        return days.includes(dayOfWeek);
      }
      return true;
    });
    
    const todos = filteredRows.map(row => {
      const formattedRow = formatRow(row);
      if (formattedRow.recurrence_type) {
        if (formattedRow.recurring_completion_date) {
          return {
            ...formattedRow,
            completed: true,
            points_earned: formattedRow.recurring_points_earned || 0,
            pause_used: formattedRow.recurring_pause_used || false,
            super_point_used: formattedRow.recurring_super_point_used || false,
            actual_time_seconds: formattedRow.recurring_actual_time_seconds || null
          };
        } else {
          const lastActivityDate = formattedRow.last_activity_date || null;
          const isNewDay = !lastActivityDate || lastActivityDate !== date;
          
          if (isNewDay) {
            return {
              ...formattedRow,
              completed: false,
              remaining_seconds: formattedRow.estimated_minutes ? formattedRow.estimated_minutes * 60 : null,
              points_earned: 0,
              pause_used: false,
              super_point_used: false,
              actual_time_seconds: null
            };
          } else {
            return {
              ...formattedRow,
              completed: false
            };
          }
        }
      }
      return formattedRow;
    });
    
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/open-list', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT * FROM todos 
       WHERE is_open_list = 1 
         AND completed = 0 
         AND claimed_by_user_id IS NULL
       ORDER BY created_at DESC`
    ).all();
    res.json(formatRows(rows));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const { user_id, title, description, estimated_minutes, specific_date, recurrence_type, recurrence_days, is_open_list } = req.body;
    const remaining_seconds = estimated_minutes ? estimated_minutes * 60 : null;
    
    const result = db.prepare(
      `INSERT INTO todos (user_id, title, description, estimated_minutes, remaining_seconds, 
       specific_date, recurrence_type, recurrence_days, is_open_list) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(user_id, title, description, estimated_minutes, remaining_seconds, 
       specific_date, recurrence_type, recurrence_days, boolToInt(is_open_list || false));
    
    const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
    res.json(formatRow(newTodo));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos/:id/claim', (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const result = db.prepare(
      `UPDATE todos 
       SET claimed_by_user_id = ?, user_id = ?, is_open_list = 0, specific_date = ?
       WHERE id = ? AND is_open_list = 1 AND claimed_by_user_id IS NULL`
    ).run(user_id, user_id, currentDate, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Open list task not found or already claimed' });
    }
    
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json(formatRow(todo));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function checkDailyCompletion(userId, date) {
  const rows = db.prepare(
    `SELECT t.*, rtc.completion_date as recurring_completion_date, rtc.super_point_used as recurring_super_point_used, rtc.actual_time_seconds as recurring_actual_time_seconds
     FROM todos t
     LEFT JOIN recurring_todo_completions rtc ON t.id = rtc.todo_id AND rtc.completion_date = ?
     WHERE t.user_id = ? AND (t.specific_date = ? OR t.recurrence_type IS NOT NULL)`
  ).all(date, userId, date);
  
  const todosForDate = rows.filter(todo => {
    if (todo.specific_date) {
      return todo.specific_date === date;
    }
    if (todo.recurrence_type === 'daily') {
      if (todo.recurrence_days) {
        const dayOfWeek = new Date(date).getDay();
        const days = JSON.parse(todo.recurrence_days);
        return days.length === 0 || days.includes(dayOfWeek);
      }
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
    return { perfectDay: false };
  }
  
  const allCompletedOnTime = todosForDate.every(todo => {
    const isRecurring = !!todo.recurrence_type;
    const isCompleted = isRecurring ? !!todo.recurring_completion_date : intToBool(todo.completed);
    const superPointUsed = isRecurring ? intToBool(todo.recurring_super_point_used) : intToBool(todo.super_point_used);
    const actualTimeSeconds = isRecurring ? todo.recurring_actual_time_seconds : todo.actual_time_seconds;
    
    if (!isCompleted) return false;
    if (superPointUsed) return true;
    if (!todo.estimated_minutes) return false;
    if (actualTimeSeconds === null || actualTimeSeconds === undefined) return false;
    const estimatedSeconds = todo.estimated_minutes * 60;
    return actualTimeSeconds <= estimatedSeconds;
  });
  
  const existingRow = db.prepare('SELECT all_completed_on_time FROM daily_completions WHERE user_id = ? AND completion_date = ?').get(userId, date);
  const wasAlreadyPerfect = existingRow && intToBool(existingRow.all_completed_on_time);
  const isNewPerfectDay = allCompletedOnTime && !wasAlreadyPerfect;
  
  db.prepare(
    `INSERT INTO daily_completions (user_id, completion_date, all_completed_on_time) 
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, completion_date) 
     DO UPDATE SET all_completed_on_time = excluded.all_completed_on_time`
  ).run(userId, date, boolToInt(allCompletedOnTime));
  
  if (allCompletedOnTime) {
    checkAndAwardStreakBonuses(userId);
    
    if (isNewPerfectDay) {
      db.prepare('UPDATE users SET total_points = total_points + 10 WHERE id = ?').run(userId);
    }
  }
  
  return { perfectDay: isNewPerfectDay };
}

function checkAndAwardStreakBonuses(userId) {
  const rows = db.prepare(
    `SELECT completion_date FROM daily_completions 
     WHERE user_id = ? AND all_completed_on_time = 1 
     ORDER BY completion_date DESC`
  ).all(userId);
  
  if (rows.length === 0) return;
  
  let currentStreak = 1;
  let previousDate = new Date(rows[0].completion_date);
  
  for (let i = 1; i < rows.length; i++) {
    const currentDate = new Date(rows[i].completion_date);
    const dayDiff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      currentStreak++;
      previousDate = currentDate;
    } else {
      break;
    }
  }
  
  db.prepare('UPDATE users SET current_streak_days = ? WHERE id = ?').run(currentStreak, userId);
  
  if (currentStreak === 7 || currentStreak === 30 || currentStreak === 90 || currentStreak === 365) {
    let bonusPoints = 0;
    let bonusSuperPoints = 0;
    
    if (currentStreak === 7) bonusPoints = 10;
    else if (currentStreak === 30) bonusPoints = 30;
    else if (currentStreak === 90) bonusPoints = 50;
    else if (currentStreak === 365) bonusSuperPoints = 12;
    
    db.prepare('UPDATE users SET total_points = total_points + ?, super_points = super_points + ? WHERE id = ?').run(bonusPoints, bonusSuperPoints, userId);
  }
}

app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, estimated_minutes, remaining_seconds, completed, specific_date, recurrence_type, recurrence_days, pause_used, super_point_used, points_earned, actual_time_seconds, completion_date } = req.body;
    
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    let perfectDay = false;
    
    if (completed && points_earned !== undefined) {
      const userId = todo.claimed_by_user_id || todo.user_id;
      const openListBonus = intToBool(todo.is_open_list) ? 10 : 0;
      const totalPoints = points_earned + openListBonus;
      
      db.prepare('UPDATE users SET total_points = total_points + ? WHERE id = ?').run(totalPoints, userId);
      
      const dateToUse = completion_date || todo.specific_date || new Date().toISOString().split('T')[0];
      
      if (todo.recurrence_type) {
        db.prepare(
          `INSERT INTO recurring_todo_completions 
           (todo_id, completion_date, points_earned, pause_used, super_point_used, actual_time_seconds) 
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(todo_id, completion_date) 
           DO UPDATE SET points_earned = excluded.points_earned, pause_used = excluded.pause_used, super_point_used = excluded.super_point_used, actual_time_seconds = excluded.actual_time_seconds`
        ).run(id, dateToUse, points_earned, boolToInt(pause_used || false), boolToInt(super_point_used || false), actual_time_seconds);
      }
      
      const dailyResult = checkDailyCompletion(userId, dateToUse);
      perfectDay = dailyResult?.perfectDay || false;
    }
    
    if (todo.recurrence_type) {
      const dateToUse = completion_date || new Date().toISOString().split('T')[0];
      
      const currentTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
      db.prepare(
        `UPDATE todos SET 
         title = ?,
         description = ?,
         estimated_minutes = ?,
         remaining_seconds = ?,
         specific_date = ?,
         recurrence_type = ?,
         recurrence_days = ?,
         pause_used = ?,
         super_point_used = ?,
         points_earned = ?,
         actual_time_seconds = ?,
         last_activity_date = ?
         WHERE id = ?`
      ).run(
        title !== undefined ? title : currentTodo.title,
        description !== undefined ? description : currentTodo.description,
        estimated_minutes !== undefined ? estimated_minutes : currentTodo.estimated_minutes,
        remaining_seconds !== undefined ? remaining_seconds : currentTodo.remaining_seconds,
        specific_date !== undefined ? specific_date : currentTodo.specific_date,
        recurrence_type !== undefined ? recurrence_type : currentTodo.recurrence_type,
        recurrence_days !== undefined ? recurrence_days : currentTodo.recurrence_days,
        pause_used !== undefined ? boolToInt(pause_used) : currentTodo.pause_used,
        super_point_used !== undefined ? boolToInt(super_point_used) : currentTodo.super_point_used,
        points_earned !== undefined ? points_earned : currentTodo.points_earned,
        actual_time_seconds !== undefined ? actual_time_seconds : currentTodo.actual_time_seconds,
        dateToUse,
        id
      );
      
      const joinedResult = db.prepare(
        `SELECT 
          t.*,
          rtc.points_earned as recurring_points_earned,
          rtc.pause_used as recurring_pause_used,
          rtc.super_point_used as recurring_super_point_used,
          rtc.actual_time_seconds as recurring_actual_time_seconds,
          rtc.completion_date as recurring_completion_date
        FROM todos t
        LEFT JOIN recurring_todo_completions rtc 
          ON t.id = rtc.todo_id AND rtc.completion_date = ?
        WHERE t.id = ?`
      ).get(dateToUse, id);
      
      const formatted = formatRow(joinedResult);
      res.json({
        ...formatted,
        completed: !!formatted.recurring_completion_date,
        points_earned: formatted.recurring_points_earned ?? formatted.points_earned,
        pause_used: formatted.recurring_pause_used ?? formatted.pause_used,
        super_point_used: formatted.recurring_super_point_used ?? formatted.super_point_used,
        actual_time_seconds: formatted.recurring_actual_time_seconds ?? formatted.actual_time_seconds,
        perfectDay
      });
    } else {
      const currentTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
      const completedAt = completed === true ? new Date().toISOString() : currentTodo.completed_at;
      
      db.prepare(
        `UPDATE todos SET 
         title = ?,
         description = ?,
         estimated_minutes = ?,
         remaining_seconds = ?,
         completed = ?,
         completed_at = ?,
         specific_date = ?,
         recurrence_type = ?,
         recurrence_days = ?,
         pause_used = ?,
         super_point_used = ?,
         points_earned = ?,
         actual_time_seconds = ?
         WHERE id = ?`
      ).run(
        title !== undefined ? title : currentTodo.title,
        description !== undefined ? description : currentTodo.description,
        estimated_minutes !== undefined ? estimated_minutes : currentTodo.estimated_minutes,
        remaining_seconds !== undefined ? remaining_seconds : currentTodo.remaining_seconds,
        completed !== undefined ? boolToInt(completed) : currentTodo.completed,
        completedAt,
        specific_date !== undefined ? specific_date : currentTodo.specific_date,
        recurrence_type !== undefined ? recurrence_type : currentTodo.recurrence_type,
        recurrence_days !== undefined ? recurrence_days : currentTodo.recurrence_days,
        pause_used !== undefined ? boolToInt(pause_used) : currentTodo.pause_used,
        super_point_used !== undefined ? boolToInt(super_point_used) : currentTodo.super_point_used,
        points_earned !== undefined ? points_earned : currentTodo.points_earned,
        actual_time_seconds !== undefined ? actual_time_seconds : currentTodo.actual_time_seconds,
        id
      );
      
      const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
      res.json({
        ...formatRow(updatedTodo),
        perfectDay
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { scope, date } = req.query;
    
    if (scope === 'single') {
      const exceptionDate = date || new Date().toISOString().split('T')[0];
      db.prepare(
        'INSERT OR IGNORE INTO recurring_todo_exceptions (todo_id, exception_date, exception_type) VALUES (?, ?, ?)'
      ).run(id, exceptionDate, 'deleted');
    } else {
      db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT global_pin_hash, max_points FROM settings WHERE id = 1').get();
    res.json({
      global_pin: settings && settings.global_pin_hash ? true : null,
      max_points: settings?.max_points || 1000
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const { global_pin, current_pin, max_points } = req.body;
    
    const currentSettings = db.prepare('SELECT global_pin_hash FROM settings WHERE id = 1').get();
    const currentPinHash = currentSettings?.global_pin_hash;
    
    if (currentPinHash && current_pin) {
      const isValid = await bcrypt.compare(current_pin, currentPinHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid current PIN' });
      }
    } else if (currentPinHash && !current_pin) {
      return res.status(400).json({ error: 'Current PIN required to change settings' });
    }
    
    const updates = [];
    const values = [];
    
    if (global_pin !== undefined) {
      let newPinHash = null;
      if (global_pin) {
        newPinHash = await bcrypt.hash(global_pin, 10);
      }
      updates.push('global_pin_hash = ?');
      values.push(newPinHash);
    }
    
    if (max_points !== undefined) {
      updates.push('max_points = ?');
      values.push(max_points);
    }
    
    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      db.prepare(`UPDATE settings SET ${updates.join(', ')} WHERE id = 1`).run(...values);
    }
    
    const settings = db.prepare('SELECT global_pin_hash, max_points FROM settings WHERE id = 1').get();
    
    res.json({
      global_pin: settings && settings.global_pin_hash ? true : null,
      max_points: settings?.max_points || 1000
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
