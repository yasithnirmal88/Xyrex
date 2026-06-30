import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const STORAGE_KEY = 'xyrex_reviews';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            const data = await redis.get(STORAGE_KEY);
            return res.status(200).json(data || []);
        }

        if (req.method === 'POST') {
            const { name, rating, message } = req.body;
            if (!name || !rating || !message) {
                return res.status(400).json({ error: 'Missing fields' });
            }
            const reviews = (await redis.get(STORAGE_KEY)) || [];
            reviews.unshift({
                id: Date.now(),
                name,
                rating,
                message,
                date: new Date().toISOString(),
            });
            await redis.set(STORAGE_KEY, reviews);
            return res.status(201).json(reviews);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
