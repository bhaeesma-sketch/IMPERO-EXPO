import type { VercelRequest, VercelResponse } from '@vercel/node';

// Constants
const USD_TO_AED = 3.6725;
const TROY_OZ_TO_GRAMS = 31.1035;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 1. Try GoldAPI
        let goldPerGram = null;
        let source = 'goldapi';

        if (process.env.GOLDAPI_KEY) {
            try {
                const response = await fetch('https://www.goldapi.io/api/XAU/AED', {
                    headers: { 'x-access-token': process.env.GOLDAPI_KEY, 'Content-Type': 'application/json' },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.price) goldPerGram = data.price / TROY_OZ_TO_GRAMS;
                }
            } catch (e) {
                console.error('GoldAPI failed:', e);
            }
        }

        // 2. Fallback to CoinGecko
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

        if (!goldPerGram) {
            // Final fallback: Mock data around 320 AED/g for 24K if everything fails
            // This ensures the site never looks broken
            goldPerGram = 315.50;
            source = 'fallback_mock';
        }

        // Add Dubai retail premium (approx +4-5 AED)
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

        // Cache header for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status(200).json(rates);
    } catch (error) {
        console.error('Gold rates error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
