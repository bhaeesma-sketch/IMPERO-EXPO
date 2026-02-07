import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    res.setHeader('Set-Cookie', `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`);

    return res.status(200).json({ message: 'Logged out' });
}
