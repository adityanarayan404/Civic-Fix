const express = require('express');
const db = require('./config/db');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const { storage } = require('./config/cloudinary');
const upload = multer({ storage });

const { verifyToken, requireRole } = require('./middleware/auth');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CivicFix backend is alive!');
});

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.post('/api/issues', verifyToken, async (req, res) => {
  try {
    const { type, description, latitude, longitude } = req.body;
    const userId = req.user.id;

    const [result] = await db.query(
      'INSERT INTO issues (user_id, type, description, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      [userId, type, description, latitude, longitude]
    );

    res.status(201).json({
      message: 'Issue reported successfully',
      issue_id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.get('/api/issues', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT issues.*, users.name AS reported_by 
       FROM issues 
       JOIN users ON issues.user_id = users.id
       ORDER BY issues.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.get('/api/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('SELECT * FROM issues WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.patch('/api/issues/:id/status', verifyToken, requireRole('EMPLOYEE', 'ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;
const updated_by = req.user.id;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      'UPDATE issues SET status = ? WHERE id = ?',
      [status, id]
    );

    await connection.query(
      'INSERT INTO issue_updates (issue_id, updated_by, status, comment) VALUES (?, ?, ?, ?)',
      [id, updated_by, status, comment]
    );

    await connection.commit();

    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    connection.release();
  }
});

app.get('/api/issues/:id/history', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT issue_updates.status, issue_updates.comment, issue_updates.created_at,
              users.name AS updated_by
       FROM issue_updates
       JOIN users ON issue_updates.updated_by = users.id
       WHERE issue_updates.issue_id = ?
       ORDER BY issue_updates.created_at ASC`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const bcrypt = require('bcrypt');

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'CITIZEN']
    );

    res.status(201).json({
      message: 'User registered successfully',
      user_id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/issues/:id/image', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageUrl = req.file.path;

    await db.query('UPDATE issues SET image_url = ? WHERE id = ?', [imageUrl, id]);

    res.json({
      message: 'Image uploaded successfully',
      image_url: imageUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/issues/:id/assign', verifyToken, requireRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { employee_id } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      'INSERT INTO assignments (issue_id, employee_id) VALUES (?, ?)',
      [id, employee_id]
    );

    await connection.query(
      'UPDATE issues SET status = ? WHERE id = ?',
      ['ASSIGNED', id]
    );

    await connection.commit();

    res.status(201).json({ message: 'Issue assigned successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    connection.release();
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});