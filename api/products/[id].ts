import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { products, updateProductSchema } from '../../shared/schema';
import { verifyToken, getUser } from '../_lib/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;
    const productId = Array.isArray(id) ? id[0] : id;

    if (!productId) {
        return res.status(400).json({ message: 'Missing product ID' });
    }

    if (req.method === 'GET') {
        try {
            const [product] = await db.select().from(products).where(eq(products.id, productId));
            if (!product) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Auth check for PATCH/DELETE
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ message: 'Invalid token' });

    const user = await getUser(payload.id);
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

    if (req.method === 'PATCH') {
        try {
            const parsed = updateProductSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
            }

            const [updated] = await db.update(products)
                .set(parsed.data)
                .where(eq(products.id, productId))
                .returning();

            if (!updated) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const [deleted] = await db.delete(products)
                .where(eq(products.id, productId))
                .returning();

            if (!deleted) return res.status(404).json({ message: 'Product not found' });
            return res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
