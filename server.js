// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files from the 'public' folder
app.use(express.static('public'));

// MongoDB Connection (Replace with your MongoDB URI if using MongoDB Atlas)
mongoose.connect('mongodb://127.0.0.1:27017/crm_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Lead Schema & Model
const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    source: { type: String, default: 'Website Form' },
    status: { type: String, enum: ['new', 'contacted', 'converted'], default: 'new' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);

// --- API Routes ---

// Get all leads
app.get('/api/leads', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new lead
app.post('/api/leads', async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update lead status and notes
app.put('/api/leads/:id', async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status, notes: req.body.notes },
            { new: true }
        );
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`CRM Server running on http://localhost:${PORT}`);
});