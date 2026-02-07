import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { users, insertUserSchema } from '../../shared/schema';
import { hashPassword, signToken } from '../_lib/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const parsed = insertUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const [existing] = await db.select().from(users).where(eq(users.username, parsed.data.username));

        if (existing) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await hashPassword(parsed.data.password);
        const [user] = await db.insert(users).values({
            username: parsed.data.username,
            password: hashedPassword,
        }).returning();

        const token = signToken(user);
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`);

        return res.status(200).json({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
