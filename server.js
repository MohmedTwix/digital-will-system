const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dws';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Mongo connect error', err));

// Schemas
const UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String });
const ContactSchema = new mongoose.Schema({ userEmail: String, name: String, phone: String });
const EmailSchema = new mongoose.Schema({ userEmail: String, to: String, subject: String, body: String, date: Date });
const RecordingSchema = new mongoose.Schema({ userEmail: String, dataUrl: String, date: Date });

const User = mongoose.model('User', UserSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Email = mongoose.model('Email', EmailSchema);
const Recording = mongoose.model('Recording', RecordingSchema);

// Auth (very simple demo)
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing fields' });
    try {
        const user = await User.create({ name, email, password });
        return res.json({ ok: true, user: { name: user.name, email: user.email } });
    } catch (err) {
        return res.status(400).json({ ok: false, message: 'Email exists' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing fields' });
    const user = await User.findOne({ email });
    // demo: accept if user exists or accept any credentials
    if (user) return res.json({ ok: true, user: { name: user.name || email.split('@')[0], email } });
    // create guest-like session
    return res.json({ ok: true, user: { name: email.split('@')[0], email } });
});

// Contacts
app.get('/api/contacts', async (req, res) => {
    const { userEmail } = req.query;
    const items = await Contact.find({ userEmail });
    res.json(items);
});

app.post('/api/contacts', async (req, res) => {
    const { userEmail, name, phone } = req.body;
    if (!userEmail) return res.status(400).json({ ok: false, message: 'Missing userEmail' });
    const c = await Contact.create({ userEmail, name, phone });
    res.json(c);
});

app.delete('/api/contacts/:id', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});

// Emails
app.get('/api/emails', async (req, res) => {
    const { userEmail } = req.query;
    const items = await Email.find({ userEmail }).sort({ date: -1 });
    res.json(items);
});

app.post('/api/emails', async (req, res) => {
    const { userEmail, to, subject, body } = req.body;
    const e = await Email.create({ userEmail, to, subject, body, date: new Date() });
    res.json(e);
});

app.delete('/api/emails/:id', async (req, res) => {
    await Email.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});

// Recordings
app.get('/api/recordings', async (req, res) => {
    const { userEmail } = req.query;
    const items = await Recording.find({ userEmail }).sort({ date: -1 });
    res.json(items);
});

app.post('/api/recordings', async (req, res) => {
    const { userEmail, dataUrl } = req.body;
    const r = await Recording.create({ userEmail, dataUrl, date: new Date() });
    res.json(r);
});

app.delete('/api/recordings/:id', async (req, res) => {
    await Recording.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});

// Serve static frontend optionally
app.use(express.static(path.join(__dirname, '/')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on', PORT));
