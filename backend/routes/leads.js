const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// POST /api/leads - Create a new lead (public)
router.post('/', (req, res) => {
  const { name, email, phone, company, message, source } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO leads (name, email, phone, company, message, source)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, email, phone, company, message, source || 'website');
    
    res.status(201).json({ id: info.lastInsertRowid, message: 'Lead created successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'A lead with this email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leads/stats/summary - Get summary stats (auth required)
router.get('/stats/summary', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted
      FROM leads
    `);
    const stats = stmt.get();
    
    res.json({
      total: stats.total || 0,
      new: stats.new || 0,
      contacted: stats.contacted || 0,
      converted: stats.converted || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leads - List all leads (auth required, with pagination & filters)
router.get('/', authenticateToken, (req, res) => {
  const { status, source, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (source && source !== 'All') {
      query += ' AND source = ?';
      params.push(source);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Count total for pagination
    const countStmt = db.prepare(`SELECT COUNT(*) as count FROM (${query})`);
    const totalCount = countStmt.get(...params).count;

    // Get paginated results
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const stmt = db.prepare(query);
    const leads = stmt.all(...params);

    res.json({
      data: leads,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leads/:id - Get single lead
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM leads WHERE id = ?');
    const lead = stmt.get(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/leads/:id - Update status or notes
router.patch('/:id', authenticateToken, (req, res) => {
  const { status, notes } = req.body;
  const id = req.params.id;

  try {
    const leadStmt = db.prepare('SELECT * FROM leads WHERE id = ?');
    if (!leadStmt.get(id)) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const setClause = updates.join(', ');
    
    const stmt = db.prepare(`UPDATE leads SET ${setClause} WHERE id = ?`);
    stmt.run(...params);

    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    res.json(updatedLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/leads/:id/notes - Add a note to a lead
router.patch('/:id/notes', authenticateToken, (req, res) => {
  const { text } = req.body;
  const id = req.params.id;

  if (!text) {
    return res.status(400).json({ error: 'Note text is required' });
  }

  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    let existingNotes = [];
    if (lead.notes) {
      try {
        existingNotes = JSON.parse(lead.notes);
        if (!Array.isArray(existingNotes)) existingNotes = [];
      } catch (e) {
        // If it was just a plain text note previously, convert it
        existingNotes = [{ text: lead.notes, createdAt: lead.created_at }];
      }
    }

    existingNotes.push({ text, createdAt: new Date().toISOString() });
    const stringifiedNotes = JSON.stringify(existingNotes);

    const stmt = db.prepare('UPDATE leads SET notes = ? WHERE id = ?');
    stmt.run(stringifiedNotes, id);

    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    res.json(updatedLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/leads/:id - Delete a lead
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM leads WHERE id = ?');
    const info = stmt.run(req.params.id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
