const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'super-secret-key-for-lab4-do-not-use-in-prod';

// Middleware
app.use(express.json()); // Parses application/json
app.use(cookieParser()); // Parses cookies
app.use(cors());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '')));

// Rate Limiting to prevent brute-force attacks on auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: { error: 'Too many authentication attempts from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Mock Database
const users = [];

// Initialize a mock user for testing
async function initMockUser() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    users.push({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
    });
    console.log("Mock user created: test@example.com / password123");
}
initMockUser();

// --- API Routes ---

// Register
app.post('/api/register', authLimiter, async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword
    };
    
    users.push(newUser);

    // Auto-login after registration
    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 3600000 });

    res.status(201).json({ message: 'Registration successful!', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// Login
app.post('/api/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = users.find(u => u.email === email);
    const genericError = 'Invalid email or password.';

    if (!user) {
        return res.status(401).json({ error: genericError });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: genericError });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 3600000 });

    res.status(200).json({ message: 'Login successful!', user: { id: user.id, name: user.name, email: user.email } });
});

// Check Auth
app.get('/api/check-auth', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ user: decoded });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
