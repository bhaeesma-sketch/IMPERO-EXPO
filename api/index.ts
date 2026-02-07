import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './_lib/db';
import { products, users, activityLogs, wishlists, notifications, goldRateAlerts } from '../shared/schema';
import { eq, desc, count, sql, and, inArray } from 'drizzle-orm';
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
    const aabPath = path.resolve('android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
    res.download(aabPath, 'impero-di-golds-release.aab', (err) => {
        if (err) res.status(404).send('AAB file not found');
    });
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

// ============ WISHLIST API ============

app.get('/api/wishlist', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const items = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).orderBy(desc(wishlists.createdAt));
        res.json(items);
    } catch (error) {
        console.error('Wishlist fetch error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/wishlist', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'Product ID is required' });

        const existing = await db.select().from(wishlists).where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)));
        if (existing.length > 0) {
            return res.json({ message: 'Already in wishlist', item: existing[0] });
        }

        const item = await db.insert(wishlists).values({ userId, productId }).returning();
        res.json(item[0]);
    } catch (error) {
        console.error('Wishlist add error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/api/wishlist/:productId', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        await db.delete(wishlists).where(and(eq(wishlists.userId, userId), eq(wishlists.productId, req.params.productId)));
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Wishlist remove error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ============ NOTIFICATIONS API ============

app.get('/api/notifications', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const items = await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(50);
        res.json(items);
    } catch (error) {
        console.error('Notifications fetch error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/notifications/unread-count', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.json({ count: 0 });

        const result = await db.select({ count: count() }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
        res.json({ count: result[0]?.count || 0 });
    } catch (error) {
        console.error('Notifications count error:', error);
        res.json({ count: 0 });
    }
});

app.post('/api/notifications/mark-read', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const { ids } = req.body;
        if (ids && Array.isArray(ids) && ids.length > 0) {
            await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.userId, userId), inArray(notifications.id, ids)));
        } else {
            await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
        }
        res.json({ message: 'Marked as read' });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ============ GOLD RATE ALERTS API ============

app.get('/api/gold-alerts', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const alerts = await db.select().from(goldRateAlerts).where(eq(goldRateAlerts.userId, userId)).orderBy(desc(goldRateAlerts.createdAt));
        res.json(alerts);
    } catch (error) {
        console.error('Gold alerts fetch error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/gold-alerts', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const { purity, targetPrice, condition } = req.body;
        if (!purity || !targetPrice || !condition) {
            return res.status(400).json({ message: 'Purity, target price, and condition are required' });
        }

        const alert = await db.insert(goldRateAlerts).values({
            userId,
            purity,
            targetPrice: parseFloat(targetPrice),
            condition,
        }).returning();

        res.json(alert[0]);
    } catch (error) {
        console.error('Gold alert create error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/api/gold-alerts/:id', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        await db.delete(goldRateAlerts).where(and(eq(goldRateAlerts.id, parseInt(req.params.id)), eq(goldRateAlerts.userId, userId)));
        res.json({ message: 'Alert deleted' });
    } catch (error) {
        console.error('Gold alert delete error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.patch('/api/gold-alerts/:id/toggle', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const existing = await db.select().from(goldRateAlerts).where(and(eq(goldRateAlerts.id, parseInt(req.params.id)), eq(goldRateAlerts.userId, userId)));
        if (existing.length === 0) return res.status(404).json({ message: 'Alert not found' });

        const updated = await db.update(goldRateAlerts).set({ isActive: !existing[0].isActive }).where(eq(goldRateAlerts.id, parseInt(req.params.id))).returning();
        res.json(updated[0]);
    } catch (error) {
        console.error('Gold alert toggle error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ============ LANGUAGE PREFERENCE ============

app.put('/api/auth/language', async (req, res) => {
    try {
        const userId = (req.session as any).userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const { language } = req.body;
        if (!['en', 'ar', 'hi', 'ur'].includes(language)) {
            return res.status(400).json({ message: 'Invalid language' });
        }

        await db.update(users).set({ preferredLanguage: language }).where(eq(users.id, userId));
        res.json({ message: 'Language updated' });
    } catch (error) {
        console.error('Language update error:', error);
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
