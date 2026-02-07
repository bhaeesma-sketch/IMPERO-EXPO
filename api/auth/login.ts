import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { users } from '../../shared/schema';
import { comparePasswords, signToken } from '../_lib/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const [user] = await db.select().from(users).where(eq(users.username, username));

        if (!user || !(await comparePasswords(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user);

        // Set HTTP-only cookie
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
