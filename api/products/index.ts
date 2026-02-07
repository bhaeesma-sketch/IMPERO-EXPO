import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { products, insertProductSchema } from '../../shared/schema';
import { verifyToken, getUser } from '../_lib/auth';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const allProducts = await db.select().from(products).orderBy(desc(products.id));
            return res.status(200).json(allProducts);
        } catch (error) {
            console.error('Fetch products error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const token = req.cookies?.token;
            if (!token) return res.status(401).json({ message: 'Unauthorized' });

            const payload = verifyToken(token);
            if (!payload) return res.status(401).json({ message: 'Invalid token' });

            const user = await getUser(payload.id);
            if (!user || !user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

            const parsed = insertProductSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
            }

            const existingCode = await db.select().from(products).where(eq(products.productCode, parsed.data.productCode));
            if (existingCode.length > 0) {
                return res.status(400).json({ message: 'Product code already exists' });
            }

            const [newProduct] = await db.insert(products).values(parsed.data).returning();
            return res.status(201).json(newProduct);
        } catch (error) {
            console.error('Create product error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
