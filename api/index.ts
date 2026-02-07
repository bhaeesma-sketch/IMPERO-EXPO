import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './_lib/db';
import { products, users, activityLogs } from '../shared/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 12;

app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && !process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required in production');
}

app.use(session({
    secret: process.env.SESSION_SECRET || 'impero-dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
    }
}));

const allowedOrigins = [
    'http://localhost:5000',
    `https://${process.env.REPLIT_DEV_DOMAIN}`,
    'https://impero-golds.replit.app',
].filter(Boolean);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.some(o => origin.startsWith(o!))) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.get('/download/aab', (req, res) => {
    const filePath = path.join(__dirname, '..', 'android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename="impero-di-golds-release.aab"');
        res.setHeader('Cache-Control', 'no-cache');
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } else {
        res.status(404).send('AAB file not found');
    }
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.username, username));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await db.insert(users).values({
            username,
            password: hashedPassword,
            isAdmin: false
        }).returning();

        // Set session
        (req.session as any).userId = newUser[0].id;

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser[0];
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user
        const user = await db.select().from(users).where(eq(users.username, username));
        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set session
        (req.session as any).userId = user[0].id;

        // Return user without password
        const { password: _, ...userWithoutPassword } = user[0];
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('/api/auth/me', async (req, res) => {
    try {
        const userId = (req.session as any).userId;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await db.select().from(users).where(eq(users.id, userId));
        if (user.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user[0];
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Gold Rates API
app.get('/api/gold-rates', async (req, res) => {
    try {
        // Constants
        const USD_TO_AED = 3.6725;
        const TROY_OZ_TO_GRAMS = 31.1035;

        let goldPerGram = null;
        let source = 'goldapi';

        // Try GoldAPI if key is available
        if (process.env.GOLDAPI_KEY) {
            try {
                const response = await fetch('https://www.goldapi.io/api/XAU/AED', {
                    headers: {
                        'x-access-token': process.env.GOLDAPI_KEY,
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.price) goldPerGram = data.price / TROY_OZ_TO_GRAMS;
                }
            } catch (e) {
                console.error('GoldAPI failed:', e);
            }
        }

        // Fallback to CoinGecko
        if (!goldPerGram) {
            source = 'coingecko';
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd');
                if (response.ok) {
                    const data = await response.json();
                    const priceUSD = data['pax-gold']?.usd;
                    if (priceUSD) {
                        goldPerGram = (priceUSD * USD_TO_AED) / TROY_OZ_TO_GRAMS;
                    }
                }
            } catch (e) {
                console.error('CoinGecko failed:', e);
            }
        }

        // Final fallback: Mock data
        if (!goldPerGram) {
            goldPerGram = 315.50;
            source = 'fallback_mock';
        }

        // Add Dubai retail premium
        const dubaiPrice = goldPerGram + 4.50;

        const rates = {
            "24K": +(dubaiPrice).toFixed(2),
            "22K": +(dubaiPrice * (22 / 24)).toFixed(2),
            "21K": +(dubaiPrice * (21 / 24)).toFixed(2),
            "18K": +(dubaiPrice * (18 / 24)).toFixed(2),
            "Silver": 3.80,
            timestamp: new Date().toISOString(),
            source,
        };

        res.json(rates);
    } catch (error) {
        console.error('Gold rates error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Products API
app.get('/api/products', async (req, res) => {
    try {
        if (!db) {
            return res.json([]); // Return empty array if database is not configured
        }
        const allProducts = await db.select().from(products);
        res.json(allProducts);
    } catch (error) {
        console.error('Products fetch error:', error);
        res.json([]); // Return empty array on error
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        if (!db) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Fix: products.id is varchar (string), not integer
        const product = await db.select().from(products).where(eq(products.id, req.params.id));
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product[0]);
    } catch (error) {
        console.error('Product fetch error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Analytics Endpoints
app.post('/api/analytics/log', async (req, res) => {
    try {
        const { eventType, details } = req.body;
        const userId = (req.session as any).userId;
        const ipAddress = req.ip || req.socket.remoteAddress;

        await db.insert(activityLogs).values({
            eventType,
            details,
            userId: userId ? String(userId) : null,
            ipAddress: String(ipAddress),
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Analytics log error:', error);
        // Don't block the client if logging fails
        res.sendStatus(200);
    }
});

app.get('/api/analytics/logs', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await db.select().from(users).where(eq(users.id, userId));
        if (!user[0]?.isAdmin) return res.status(403).json({ message: 'Forbidden' });

        const logs = await db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp)).limit(100);
        res.json(logs);
    } catch (error) {
        console.error('Fetch logs error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/analytics/stats', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await db.select().from(users).where(eq(users.id, userId));
        if (!user[0]?.isAdmin) return res.status(403).json({ message: 'Forbidden' });

        const totalViews = await db.select({ count: count() }).from(activityLogs).where(eq(activityLogs.eventType, 'PAGE_VIEW'));
        const uniqueVisitors = await db.execute(sql`SELECT COUNT(DISTINCT ip_address) FROM activity_logs`);

        res.json({
            totalViews: totalViews[0]?.count || 0,
            uniqueVisitors: (uniqueVisitors as any)[0]?.count || 0
        });
    } catch (error) {
        console.error('Fetch stats error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (isProduction) {
    const distPath = path.resolve(__dirname, '..', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
}

const LISTEN_PORT = parseInt(process.env.PORT || '0') || (isProduction ? 5000 : PORT);

app.listen(LISTEN_PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${LISTEN_PORT}`);
    console.log(`📊 Gold Rates: /api/gold-rates`);
    console.log(`🛍️  Products: /api/products`);
    console.log(`🔐 Auth: /api/auth/*`);
});
