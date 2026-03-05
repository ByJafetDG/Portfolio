import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client.js';
import bcrypt from 'bcryptjs';

const router = Router();

const ADMIN_USER_HASH = process.env.ADMIN_USER_HASH || '';
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH || '';

// Bcrypt-based Admin Auth Middleware
const adminAuth = async (req: Request, res: Response, next: Function) => {
    const token = req.headers['x-admin-token'] as string;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const [user, pass] = Buffer.from(token, 'base64').toString().split(':');
        const [userOk, passOk] = await Promise.all([
            bcrypt.compare(user, ADMIN_USER_HASH),
            bcrypt.compare(pass, ADMIN_PASS_HASH),
        ]);
        if (userOk && passOk) return next();
        res.status(401).json({ error: 'Unauthorized' });
    } catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Login endpoint — fields named "email"/"password" deliberately misleading
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    try {
        const [userOk, passOk] = await Promise.all([
            bcrypt.compare(email, ADMIN_USER_HASH),
            bcrypt.compare(password, ADMIN_PASS_HASH),
        ]);
        if (userOk && passOk) {
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Helper for retrying DB queries
const withRetry = async <T>(fn: () => Promise<T>, retries = 2, delay = 500): Promise<T> => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries) throw err;
            await new Promise(r => setTimeout(r, delay));
        }
    }
    throw new Error('Unreachable');
};

// Generic GET for all portfolio data
router.get('/data', async (_req, res) => {
    try {
        const profile = await withRetry(() => prisma.profile.findFirst());
        const experiences = await withRetry(() => prisma.experience.findMany());
        const skills = await withRetry(() => prisma.skill.findMany());
        const education = await withRetry(() => prisma.education.findMany());
        const certifications = await withRetry(() => prisma.certification.findMany());
        const projects = await withRetry(() => prisma.project.findMany());
        const trivia = await withRetry(() => prisma.trivia.findMany());
        res.json({ profile, experiences, skills, education, certifications, projects, trivia });
    } catch (error) {
        console.error('Data fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// --- Experience ---
router.post('/experience', adminAuth, async (req, res) => {
    try {
        const exp = await prisma.experience.create({ data: req.body });
        res.json(exp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create experience' });
    }
});

router.put('/experience/:id', adminAuth, async (req, res) => {
    try {
        const exp = await prisma.experience.update({
            where: { id: parseInt(req.params.id as string) },
            data: req.body
        });
        res.json(exp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update experience' });
    }
});

router.delete('/experience/:id', adminAuth, async (req, res) => {
    try {
        await prisma.experience.delete({ where: { id: parseInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

// --- Education ---
router.post('/education', adminAuth, async (req, res) => {
    try {
        const edu = await prisma.education.create({ data: req.body });
        res.json(edu);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.delete('/education/:id', adminAuth, async (req, res) => {
    try {
        await prisma.education.delete({ where: { id: parseInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// --- Certifications ---
router.post('/certification', adminAuth, async (req, res) => {
    try {
        const cert = await prisma.certification.create({ data: req.body });
        res.json(cert);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.delete('/certification/:id', adminAuth, async (req, res) => {
    try {
        await prisma.certification.delete({ where: { id: parseInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// --- Skills ---
router.post('/skill', adminAuth, async (req, res) => {
    try {
        const skill = await prisma.skill.create({ data: req.body });
        res.json(skill);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.delete('/skill/:id', adminAuth, async (req, res) => {
    try {
        await prisma.skill.delete({ where: { id: parseInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// --- Projects ---
router.post('/project', adminAuth, async (req, res) => {
    try {
        const project = await prisma.project.create({ data: req.body });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.delete('/project/:id', adminAuth, async (req, res) => {
    try {
        await prisma.project.delete({ where: { id: parseInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// --- Trivia / Personal Facts ---
router.post('/trivia', adminAuth, async (req, res) => {
    try {
        const fact = await prisma.trivia.create({ data: req.body });
        res.json(fact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create trivia' });
    }
});

router.put('/trivia/:id', adminAuth, async (req, res) => {
    try {
        const fact = await prisma.trivia.update({
            where: { id: parseInt(req.params.id as string) },
            data: req.body
        });
        res.json(fact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update trivia' });
    }
});

router.delete('/trivia/:id', adminAuth, async (req, res) => {
    try {
        await prisma.trivia.delete({ where: { id: parseInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete trivia' });
    }
});

// --- Testimonials (public read/write, admin delete) ---
router.get('/testimonials', async (_req, res) => {
    try {
        const testimonials = await withRetry(() => prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' },
        }));
        res.json(testimonials);
    } catch (error) {
        console.error('Testimonials fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

router.post('/testimonial', async (req, res) => {
    try {
        const { name, company, rating, message } = req.body;
        if (!name || !company || !rating || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be 1-5' });
        }
        if (message.length > 500) {
            return res.status(400).json({ error: 'Message too long (max 500 chars)' });
        }
        const testimonial = await prisma.testimonial.create({
            data: { name, company, rating: parseInt(rating), message },
        });
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create testimonial' });
    }
});

router.delete('/testimonial/:id', adminAuth, async (req, res) => {
    try {
        await prisma.testimonial.delete({ where: { id: parseInt(req.params.id as string) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete testimonial' });
    }
});

export default router;
