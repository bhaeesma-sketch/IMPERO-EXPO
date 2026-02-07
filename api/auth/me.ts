import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { users } from '../../shared/schema';
import { verifyToken } from '../_lib/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const token = req.cookies?.token;

    if (!token) {
        return res.status(200).json({ user: null });
    }

    const payload = verifyToken(token);

    if (!payload) {
        return res.status(200).json({ user: null });
    }

    try {
        const [user] = await db.select().from(users).where(eq(users.id, payload.id));

        if (!user) {
            return res.status(200).json({ user: null });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
