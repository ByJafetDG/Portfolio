import { Router, Request, Response } from 'express';
import { getPortfolioContext } from '../services/context.service.js';
import { getChatResponse } from '../services/groq.service.js';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        // 1. Fetch portfolio context from Supabase via Prisma
        const context = await getPortfolioContext();

        // 2. Send to Groq with system prompt + context
        const reply = await getChatResponse(message, context);

        // 3. Return response
        res.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Internal server error',
            reply: "I'm having trouble right now. Please try again later or contact Jafet at jafetduarte01@gmail.com.",
        });
    }
});

export default router;
