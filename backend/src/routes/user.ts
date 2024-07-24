import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt = require('jsonwebtoken');

const router = Router();
const prisma = new PrismaClient();

router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/users/current', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        const decodedToken: any = jwt.verify(token!, process.env.JWT_SECRET!);

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: `Failed to get current user info ${err}` });
    }
});

export default router;